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

/** The thumb is 16px: its center travels from 8px to (width - 8px). */
const THUMB = 16;

// The native track is transparent and as tall as the input; the visible track
// and fill are drawn behind it so the fill can end exactly under the thumb.
// The thumb is a cream paper knob with a control edge and one soft shadow; moss on hover and drag, orchid on focus.
const range =
  "relative h-5 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed " +
  "[&::-webkit-slider-runnable-track]:h-5 [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:mt-0.5 [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-fl-control [&::-webkit-slider-thumb]:bg-fl-surface [&::-webkit-slider-thumb]:shadow-fl [&::-webkit-slider-thumb]:transition-[border-color,box-shadow] " +
  "hover:[&::-webkit-slider-thumb]:border-fl-primary active:[&::-webkit-slider-thumb]:border-fl-primary " +
  "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:border-fl-accent focus-visible:[&::-webkit-slider-thumb]:ring-3 focus-visible:[&::-webkit-slider-thumb]:ring-fl-accent/25 " +
  "[&::-moz-range-track]:h-5 [&::-moz-range-track]:bg-transparent " +
  "[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-fl-control [&::-moz-range-thumb]:bg-fl-surface [&::-moz-range-thumb]:shadow-fl " +
  "hover:[&::-moz-range-thumb]:border-fl-primary active:[&::-moz-range-thumb]:border-fl-primary " +
  "focus-visible:[&::-moz-range-thumb]:border-fl-accent focus-visible:[&::-moz-range-thumb]:ring-3 focus-visible:[&::-moz-range-thumb]:ring-fl-accent/25";

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
      className={["group/slider flex flex-col gap-2 font-fl", className].filter(Boolean).join(" ")}
    >
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold text-fl-fg group-has-disabled/slider:text-fl-muted"
        >
          {label}
        </label>
        <output htmlFor={inputId} className="text-[13px] text-fl-muted tabular-nums">
          {shown}
        </output>
      </div>
      <div className="relative flex h-5 items-center group-has-disabled/slider:opacity-50">
        <span aria-hidden="true" className="absolute inset-x-0 h-1 rounded-full bg-fl-line" />
        <span
          aria-hidden="true"
          className="absolute left-0 h-1 rounded-full bg-fl-primary"
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
        <p id={hintId} className="text-[13px] text-fl-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
