"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

export interface SheetPanelProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  /** Shows the close button. */
  onClose?: () => void;
  titleId?: string;
  descriptionId?: string;
  className?: string;
}

/** The sheet's visible panel, usable on its own for static previews. */
export function SheetPanel({
  title,
  description,
  actions,
  children,
  onClose,
  titleId,
  descriptionId,
  className,
}: SheetPanelProps) {
  return (
    <div
      className={[
        // Docked flush to the right edge, so it is a full-height sheet of paper with a hairline on its
        // leading edge rather than a leaf-cut pane (the leaf only works on a whole, free-standing box).
        "flex h-full w-[400px] max-w-full flex-col border-l border-fl-line bg-fl-surface font-fl text-fl-fg shadow-fl-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-4 border-b border-fl-line px-6 py-4">
        <div className="flex flex-1 flex-col gap-1">
          <h2 id={titleId} className="font-fl-display text-xl leading-snug font-semibold">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-sm text-fl-muted">
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mt-0.5 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-fl-muted transition-colors hover:bg-fl-subtle hover:text-fl-fg focus-visible:outline-2 focus-visible:outline-fl-accent"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <div
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling body must be reachable by keyboard to scroll it when its content has nothing focusable.
        tabIndex={0}
        className="flex-1 overflow-y-auto px-6 py-4 text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fl-accent"
      >
        {children}
      </div>
      {actions && (
        <div className="flex justify-end gap-2 border-t border-fl-line px-6 py-3">{actions}</div>
      )}
    </div>
  );
}

export interface SheetProps
  extends Omit<SheetPanelProps, "onClose" | "titleId" | "descriptionId" | "className"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * A modal sheet on the native <dialog> element, docked to the right edge:
 * showModal() traps focus, makes the page inert, closes on Escape and
 * returns focus when it closes. It slides in where @starting-style exists.
 */
export function Sheet({ open, onOpenChange, ...panel }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape already closes a native modal dialog; the click only adds overlay dismissal.
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={panel.description ? `${id}-description` : undefined}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        // The panel fills the dialog, so a click on the dialog itself is on the overlay.
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
      className={
        "my-0 mr-0 ml-auto h-full max-h-none w-[400px] max-w-[calc(100%-3rem)] overflow-visible bg-transparent p-0 " +
        "transition-[translate] duration-200 ease-out starting:open:translate-x-full motion-reduce:transition-none " +
        "backdrop:bg-fl-overlay backdrop:transition-opacity backdrop:duration-200 starting:open:backdrop:opacity-0"
      }
    >
      <SheetPanel
        {...panel}
        onClose={() => onOpenChange(false)}
        titleId={`${id}-title`}
        descriptionId={`${id}-description`}
      />
    </dialog>
  );
}
