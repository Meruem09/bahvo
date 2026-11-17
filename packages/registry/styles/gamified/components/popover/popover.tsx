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
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary";

// A white key that presses down, and stays pressed while its panel is open.
const trigger =
  "inline-flex h-8 items-center gap-2 rounded-gm border-2 border-gm-line bg-gm-surface px-3.5 font-gm-display text-sm font-semibold text-gm-fg shadow-gm " +
  "transition-[background-color,translate,box-shadow] duration-100 hover:bg-gm-subtle active:translate-y-1 active:shadow-none " +
  `aria-expanded:translate-y-1 aria-expanded:bg-gm-subtle aria-expanded:shadow-none ${focusRing}`;

const FOCUSABLE = "a[href], button:not(:disabled), input:not(:disabled), select, textarea";

/** A non-modal dialog anchored under its trigger. */
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
      className={["relative inline-flex font-gm", className].filter(Boolean).join(" ")}
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
          <span aria-hidden="true" className="inline-flex size-4 text-gm-muted">
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
        className={`absolute top-full z-10 mt-2.5 w-80 max-w-[calc(100vw-2rem)] rounded-gm-lg border-2 border-gm-line bg-gm-surface text-gm-fg shadow-gm-lg outline-none ${
          align === "end" ? "right-0" : "left-0"
        }`}
      >
        <div className="flex items-start gap-3 px-5 pt-5">
          <div className="flex flex-1 flex-col gap-1">
            <h2 id={`${id}-title`} className="font-gm-display text-lg leading-snug font-semibold">
              {title}
            </h2>
            {description && (
              <p id={`${id}-description`} className="text-sm text-gm-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={`-mt-1 -mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-gm-sm border-2 border-gm-line bg-gm-surface text-gm-muted shadow-gm-sm transition-[background-color,color,translate,box-shadow] duration-100 hover:bg-gm-subtle hover:text-gm-fg active:translate-y-0.5 active:shadow-none ${focusRing}`}
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
        </div>
        <div className="px-5 pt-3 pb-5 text-sm">{children}</div>
      </div>
    </div>
  );
}
