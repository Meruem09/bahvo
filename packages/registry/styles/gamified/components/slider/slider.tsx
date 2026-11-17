"use client";

import { type InputHTMLAttributes, useId, useState } from "react";

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
  > {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats the value shown next to the label and its aria-valuetext. */
  format?: (value: number) => string;
  hint?: string;
}

/** The thumb is 24px: its center travels from 12px to (width - 12px). */
const THUMB = 24;

// The native track is transparent and as tall as the input; the visible track
// and fill are drawn behind it so the fill can end exactly under the thumb.
// The thumb is a chunky white key: 24px in a 28px input, so its 2px ledge fits underneath. It presses down while dragged.
const range =
  "relative h-7 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed " +
  "[&::-webkit-slider-runnable-track]:h-7 [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:mt-0.5 [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gm-control [&::-webkit-slider-thumb]:bg-gm-surface [&::-webkit-slider-thumb]:shadow-gm-sm [&::-webkit-slider-thumb]:transition-[border-color,box-shadow,translate] [&::-webkit-slider-thumb]:duration-100 " +
  "enabled:hover:[&::-webkit-slider-thumb]:border-gm-primary enabled:active:[&::-webkit-slider-thumb]:translate-y-0.5 enabled:active:[&::-webkit-slider-thumb]:border-gm-primary enabled:active:[&::-webkit-slider-thumb]:shadow-none disabled:[&::-webkit-slider-thumb]:shadow-none " +
  "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:border-gm-primary focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-gm-primary/25 " +
  "[&::-moz-range-track]:h-7 [&::-moz-range-track]:bg-transparent " +
  "[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gm-control [&::-moz-range-thumb]:bg-gm-surface [&::-moz-range-thumb]:shadow-gm-sm [&::-moz-range-thumb]:transition-[border-color,box-shadow,translate] [&::-moz-range-thumb]:duration-100 " +
  "enabled:hover:[&::-moz-range-thumb]:border-gm-primary enabled:active:[&::-moz-range-thumb]:translate-y-0.5 enabled:active:[&::-moz-range-thumb]:border-gm-primary enabled:active:[&::-moz-range-thumb]:shadow-none disabled:[&::-moz-range-thumb]:shadow-none " +
  "focus-visible:[&::-moz-range-thumb]:border-gm-primary focus-visible:[&::-moz-range-thumb]:ring-4 focus-visible:[&::-moz-range-thumb]:ring-gm-primary/25";

export function Slider({
  label,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  format,
  hint,
  id,
  className,
  disabled,
  ...props
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue ?? min);
  const current = value ?? internal;
  const generated = useId();
  const inputId = id ?? generated;
  const hintId = `${inputId}-hint`;
  const percent = max > min ? ((current - min) / (max - min)) * 100 : 0;
  const shown = format ? format(current) : String(current);

  return (
    <div
      className={["group/slider flex flex-col gap-2 font-gm", className].filter(Boolean).join(" ")}
    >
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={inputId}
          className="text-[13px] font-bold text-gm-fg group-has-disabled/slider:text-gm-muted"
        >
          {label}
        </label>
        <output htmlFor={inputId} className="text-[13px] font-bold text-gm-muted tabular-nums">
          {shown}
        </output>
      </div>
      <div className="relative flex h-7 items-center group-has-disabled/slider:opacity-50">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 h-3 rounded-full bg-gm-line shadow-gm-inset"
        />
        <span
          aria-hidden="true"
          className="absolute left-0 h-3 rounded-full bg-gm-success shadow-gm-xp"
          style={{ width: `calc(${percent}% + ${THUMB / 2 - (percent / 100) * THUMB}px)` }}
        />
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          aria-valuetext={format ? shown : undefined}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (value === undefined) setInternal(next);
            onValueChange?.(next);
          }}
          className={range}
          {...props}
        />
      </div>
      {hint && (
        <p id={hintId} className="text-[13px] text-gm-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
