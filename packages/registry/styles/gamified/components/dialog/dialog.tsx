"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

export interface DialogPanelProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  /** Shows the close button. */
  onClose?: () => void;
  titleId?: string;
  descriptionId?: string;
}

/** The dialog's visible panel, usable on its own for static previews. */
export function DialogPanel({
  title,
  description,
  actions,
  children,
  onClose,
  titleId,
  descriptionId,
}: DialogPanelProps) {
  return (
    <div className="w-[420px] max-w-full rounded-gm-lg border-2 border-gm-line bg-gm-surface font-gm text-gm-fg shadow-gm-lg">
      <div className="flex items-start gap-4 px-6 pt-6">
        <div className="flex flex-1 flex-col gap-1.5">
          <h2 id={titleId} className="font-gm-display text-[22px] leading-tight font-semibold">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-sm text-gm-muted">
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mt-1 -mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-gm-sm border-2 border-gm-line bg-gm-surface text-gm-muted shadow-gm-sm transition-[background-color,color,translate,box-shadow] duration-100 hover:bg-gm-subtle hover:text-gm-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-0.5 active:shadow-none"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              aria-hidden="true"
            >
              <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {children && <div className="px-6 pt-4 text-sm">{children}</div>}
      {actions && (
        <div className="mt-6 flex justify-end gap-3 rounded-b-[16px] border-t-2 border-gm-line bg-gm-subtle px-6 py-4">
          {actions}
        </div>
      )}
    </div>
  );
}

export interface DialogProps
  extends Omit<DialogPanelProps, "onClose" | "titleId" | "descriptionId"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * A modal dialog on the native <dialog> element: showModal() traps focus,
 * makes the page inert, closes on Escape and returns focus when it closes.
 */
export function Dialog({ open, onOpenChange, ...panel }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape already closes a native modal dialog; the click only adds backdrop dismissal.
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={panel.description ? `${id}-description` : undefined}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        // A click on the dialog element itself (not the panel) is a click on the backdrop.
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
      className="m-auto max-w-[calc(100%-2rem)] overflow-visible bg-transparent p-0 backdrop:bg-gm-overlay"
    >
      <DialogPanel
        {...panel}
        onClose={() => onOpenChange(false)}
        titleId={`${id}-title`}
        descriptionId={`${id}-description`}
      />
    </dialog>
  );
}
