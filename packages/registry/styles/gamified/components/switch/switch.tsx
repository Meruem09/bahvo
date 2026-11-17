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

// A chunky pill: a soft track with a control edge when off, violet on its darker edge when on.
const track =
  "relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-gm-control bg-gm-subtle " +
  "transition-colors enabled:hover:border-gm-primary aria-checked:border-gm-primary-depth aria-checked:bg-gm-primary " +
  "aria-checked:enabled:hover:border-gm-primary-depth aria-checked:enabled:hover:bg-gm-primary-hover " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary " +
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
      className={["flex items-start justify-between gap-6 font-gm", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-0.5">
        <label htmlFor={switchId} className="text-sm font-semibold text-gm-fg">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-[13px] text-gm-muted">
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
        {/* The knob is a small white key on a 2px ledge, lifted 1px so the ledge clears the track. */}
        <span
          aria-hidden="true"
          className={`mb-0.5 size-5 rounded-full border-2 border-gm-line bg-gm-surface shadow-gm-sm transition-[translate] duration-150 ${
            on ? "translate-x-[22px]" : "translate-x-[2px]"
          }`}
        />
      </button>
    </div>
  );
}
