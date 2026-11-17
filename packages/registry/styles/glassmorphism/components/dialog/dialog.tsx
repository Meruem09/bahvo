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
    // An overlay holds text over whatever is behind it, so it takes the strong glass and the large shadow.
    <div className="w-[420px] max-w-full rounded-gl-lg border border-gl-edge bg-gl-glass-strong font-gl text-gl-fg shadow-gl-lg backdrop-blur-gl backdrop-saturate-150">
      <div className="flex items-start gap-4 px-6 pt-6">
        <div className="flex flex-1 flex-col gap-1.5">
          <h2 id={titleId} className="text-[17px] font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-sm text-gl-muted">
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mt-1.5 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-gl-sm text-gl-muted transition-colors hover:bg-gl-glass-hover hover:text-gl-fg focus-visible:outline-2 focus-visible:outline-gl-accent"
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
      {children && <div className="px-6 pt-4 text-sm">{children}</div>}
      {actions && (
        <div className="mt-6 flex justify-end gap-2 border-t border-gl-line px-6 py-3.5">
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
      className="m-auto max-w-[calc(100%-2rem)] overflow-visible bg-transparent p-0 backdrop:bg-gl-overlay backdrop:backdrop-blur-gl"
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
