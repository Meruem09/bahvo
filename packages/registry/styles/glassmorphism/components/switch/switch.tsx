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

// Off, the track is a frosted pill on the strong glass; on, it fills near-black and keeps the inner highlight.
const track =
  "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-gl-edge bg-gl-glass-strong shadow-gl backdrop-blur-gl backdrop-saturate-150 " +
  "transition-colors hover:border-gl-line-strong aria-checked:border-gl-fg aria-checked:bg-gl-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent " +
  "disabled:cursor-not-allowed disabled:opacity-45";

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
      className={["flex items-start justify-between gap-6 font-gl", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-0.5">
        <label htmlFor={switchId} className="text-sm font-medium text-gl-fg">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-[13px] text-gl-muted">
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
        <span
          aria-hidden="true"
          className={`size-3.5 rounded-full transition-[translate,background-color] duration-150 ${
            on ? "translate-x-[17px] bg-gl-inverse" : "translate-x-[2px] bg-gl-muted"
          }`}
        />
      </button>
    </div>
  );
}
