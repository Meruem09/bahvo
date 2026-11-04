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
const range =
  "relative h-5 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed " +
  "[&::-webkit-slider-runnable-track]:h-5 [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:mt-0.5 [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-mn-line-strong [&::-webkit-slider-thumb]:bg-mn-surface [&::-webkit-slider-thumb]:shadow-mn-sm [&::-webkit-slider-thumb]:transition-[border-color,box-shadow] " +
  "hover:[&::-webkit-slider-thumb]:border-mn-muted active:[&::-webkit-slider-thumb]:border-mn-fg " +
  "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:border-mn-accent focus-visible:[&::-webkit-slider-thumb]:ring-3 focus-visible:[&::-webkit-slider-thumb]:ring-mn-accent/25 " +
  "[&::-moz-range-track]:h-5 [&::-moz-range-track]:bg-transparent " +
  "[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-mn-line-strong [&::-moz-range-thumb]:bg-mn-surface [&::-moz-range-thumb]:shadow-mn-sm " +
  "hover:[&::-moz-range-thumb]:border-mn-muted active:[&::-moz-range-thumb]:border-mn-fg " +
  "focus-visible:[&::-moz-range-thumb]:border-mn-accent focus-visible:[&::-moz-range-thumb]:ring-3 focus-visible:[&::-moz-range-thumb]:ring-mn-accent/25";

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
      className={["flex flex-col gap-2 font-mn has-disabled:opacity-50", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={inputId} className="text-[13px] font-medium text-mn-fg">
          {label}
        </label>
        <output htmlFor={inputId} className="text-[13px] text-mn-muted tabular-nums">
          {shown}
        </output>
      </div>
      <div className="relative flex h-5 items-center">
        <span aria-hidden="true" className="absolute inset-x-0 h-1 rounded-full bg-mn-line" />
        <span
          aria-hidden="true"
          className="absolute left-0 h-1 rounded-full bg-mn-fg"
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
        <p id={hintId} className="text-[13px] text-mn-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
