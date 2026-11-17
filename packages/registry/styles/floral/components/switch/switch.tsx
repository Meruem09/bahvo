"use client";

import { useId, useState } from "react";

export interface SwitchProps {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

// A pill track: warm paper when off, moss when on.
const track =
  "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-fl-control bg-fl-subtle " +
  "transition-colors enabled:hover:border-fl-muted aria-checked:border-fl-primary aria-checked:bg-fl-primary " +
  "aria-checked:enabled:hover:border-fl-primary-hover aria-checked:enabled:hover:bg-fl-primary-hover " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id,
  className,
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;
  const generated = useId();
  const switchId = id ?? generated;
  const descriptionId = `${switchId}-description`;

  return (
    <div
      className={["flex items-start justify-between gap-6 font-fl", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-0.5">
        <label htmlFor={switchId} className="text-sm font-semibold text-fl-fg">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-[13px] text-fl-muted">
            {description}
          </p>
        )}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => {
          const next = !on;
          if (checked === undefined) setInternal(next);
          onCheckedChange?.(next);
        }}
        className={track}
      >
        {/* The knob is cream paper; off, a control-colored edge keeps it visible on the pale track. */}
        <span
          aria-hidden="true"
          className={`size-3.5 rounded-full border bg-fl-surface shadow-fl transition-[translate,border-color] duration-150 ${
            on ? "translate-x-[17px] border-transparent" : "translate-x-[2px] border-fl-control"
          }`}
        />
      </button>
    </div>
  );
}
