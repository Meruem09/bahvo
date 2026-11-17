"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

export interface PopoverProps {
  /** Trigger button text. */
  label: string;
  /** Icon shown before the trigger text. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  align?: "start" | "end";
  className?: string;
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent";

// A paper pill, like the secondary button.
const trigger =
  "inline-flex h-8 items-center gap-2 rounded-full border border-fl-line-strong bg-fl-surface px-3.5 text-[13px] font-semibold text-fl-fg shadow-fl " +
  `transition-colors hover:border-fl-control hover:bg-fl-subtle aria-expanded:bg-fl-subtle ${focusRing}`;

const FOCUSABLE = "a[href], button:not(:disabled), input:not(:disabled), select, textarea";

/** A non-modal dialog anchored under its trigger, on a leaf-cut paper pane. */
export function Popover({
  label,
  icon,
  title,
  description,
  children,
  open: controlled,
  onOpenChange,
  defaultOpen = false,
  align = "start",
  className,
}: PopoverProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  /** Focus moves into the panel only when the user opened it, not on first render. */
  const moveFocus = useRef(false);

  function setOpen(next: boolean) {
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  }

  function close() {
    setOpen(false);
    button.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    if (moveFocus.current) {
      const target = panel.current?.querySelector<HTMLElement>(`[data-autofocus], ${FOCUSABLE}`);
      (target ?? panel.current)?.focus();
      moveFocus.current = false;
    }
    function dismiss() {
      if (controlled === undefined) setInternal(false);
      onOpenChange?.(false);
    }
    const outside = (target: EventTarget | null) => !root.current?.contains(target as Node);
    function onPointerDown(event: PointerEvent) {
      if (outside(event.target)) dismiss();
    }
    // Tabbing out of the trigger and panel closes it.
    function onFocusIn(event: FocusEvent) {
      if (outside(event.target)) dismiss();
    }
    function onKeyDown(event: KeyboardEvent) {
      const active = document.activeElement;
      if (event.key !== "Escape" || (active !== document.body && outside(active))) return;
      dismiss();
      button.current?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, controlled, onOpenChange]);

  return (
    <div
      ref={root}
      className={["relative inline-flex font-fl", className].filter(Boolean).join(" ")}
    >
      <button
        ref={button}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => {
          moveFocus.current = !open;
          setOpen(!open);
        }}
        className={trigger}
      >
        {icon && (
          <span aria-hidden="true" className="inline-flex size-4 text-fl-muted">
            {icon}
          </span>
        )}
        {label}
      </button>
      <div
        ref={panel}
        id={`${id}-panel`}
        role="dialog"
        tabIndex={-1}
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        hidden={!open}
        className={`absolute top-full z-10 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-fl-leaf border border-fl-line bg-fl-surface text-fl-fg shadow-fl-lg outline-none ${
          align === "end" ? "right-0" : "left-0"
        }`}
      >
        <div className="flex items-start gap-3 px-5 pt-5">
          <div className="flex flex-1 flex-col gap-1">
            <h2
              id={`${id}-title`}
              className="font-fl-display text-[15px] leading-snug font-semibold"
            >
              {title}
            </h2>
            {description && (
              <p id={`${id}-description`} className="text-[13px] text-fl-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={`-mt-1.5 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-fl-muted transition-colors hover:bg-fl-subtle hover:text-fl-fg ${focusRing}`}
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
        </div>
        <div className="px-5 pt-3 pb-5 text-sm">{children}</div>
      </div>
    </div>
  );
}
