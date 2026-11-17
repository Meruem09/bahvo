"use client";

import { type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  variant?: "neutral" | "danger";
  /** Shows a spinner for work in progress. */
  loading?: boolean;
  icon?: ReactNode;
  /** Auto-dismiss delay in ms, paused while hovered or focused. Infinity keeps it. */
  duration?: number;
}

export interface ToastProps
  extends Omit<ToastData, "id" | "duration">,
    Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Shows the dismiss button. */
  onDismiss?: () => void;
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent";

/** The bloom: six petals, fading round the flower so the turn reads as motion. Orchid marks the live state. */
function Bloom() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0 text-fl-accent motion-safe:animate-spin"
    >
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="8"
          cy="3.75"
          rx="1.6"
          ry="2.75"
          opacity={0.3 + angle / 430}
          transform={`rotate(${angle} 8 8)`}
        />
      ))}
    </svg>
  );
}

/** One toast, on a leaf-cut paper pane. Render it in a ToastViewport so it is announced. */
export function Toast({
  title,
  description,
  action,
  variant = "neutral",
  loading = false,
  icon,
  onDismiss,
  className,
  ...props
}: ToastProps) {
  const lead = loading ? (
    <Bloom />
  ) : variant === "danger" ? (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0 text-fl-danger"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.9" fill="currentColor" />
    </svg>
  ) : (
    icon && (
      <span aria-hidden="true" className="mt-0.5 inline-flex size-4 shrink-0 text-fl-muted">
        {icon}
      </span>
    )
  );

  return (
    <div
      className={[
        "flex w-[360px] max-w-full items-start gap-3 rounded-fl-leaf border border-fl-line bg-fl-surface px-5 py-4 font-fl shadow-fl-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {lead}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={`font-fl-display text-[15px] leading-snug font-semibold ${variant === "danger" ? "text-fl-danger" : "text-fl-fg"}`}
        >
          {title}
        </p>
        {description && <p className="text-[13px] text-fl-muted">{description}</p>}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`mt-2 inline-flex h-8 items-center self-start rounded-full border border-fl-line-strong bg-fl-surface px-3.5 text-[13px] font-semibold text-fl-fg shadow-fl transition-colors hover:border-fl-control hover:bg-fl-subtle active:translate-y-px ${focusRing}`}
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
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
      )}
    </div>
  );
}

let counter = 0;

/** Toast state for a ToastViewport. Keeps the three most recent. */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  function dismiss(id: string) {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }

  function toast(data: Omit<ToastData, "id"> & { id?: string }) {
    counter += 1;
    const id = data.id ?? `toast-${counter}`;
    setToasts((list) => [...list.filter((t) => t.id !== id), { ...data, id }].slice(-3));
    return id;
  }

  return { toasts, toast, dismiss };
}

function TimedToast({
  duration = 5000,
  onDismiss,
  ...toast
}: Omit<ToastData, "id"> & { onDismiss: () => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);

  useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return;
    const started = Date.now();
    const timer = setTimeout(onDismiss, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, onDismiss]);

  return (
    <Toast
      {...toast}
      onDismiss={onDismiss}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="transition-[opacity,translate] duration-200 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
    />
  );
}

export interface ToastViewportProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  label?: string;
}

/** The live region in the bottom-right corner. Render it once, even while empty. */
export function ToastViewport({ toasts, onDismiss, label = "Notifications" }: ToastViewportProps) {
  return (
    <section
      aria-label={label}
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-50 w-[360px] max-w-[calc(100%-2rem)]"
    >
      <ol className="flex flex-col gap-2">
        {toasts.map(({ id, ...toast }) => (
          <li key={id} className="pointer-events-auto">
            <TimedToast {...toast} onDismiss={() => onDismiss(id)} />
          </li>
        ))}
      </ol>
    </section>
  );
}
