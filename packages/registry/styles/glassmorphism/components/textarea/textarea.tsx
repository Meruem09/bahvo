"use client";

import { type ChangeEvent, type TextareaHTMLAttributes, useId, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

// Fields use the strong glass so typed text always sits on a calm, readable fill.
const field =
  "min-h-24 w-full resize-y rounded-gl border border-gl-edge bg-gl-glass-strong px-3.5 py-2.5 font-gl text-sm leading-relaxed text-gl-fg shadow-gl outline-none backdrop-blur-gl backdrop-saturate-150 " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-gl-muted " +
  "hover:border-gl-line-strong focus-visible:border-gl-accent focus-visible:ring-3 focus-visible:ring-gl-accent/25 " +
  "disabled:cursor-not-allowed disabled:bg-gl-glass disabled:text-gl-muted disabled:shadow-none disabled:hover:border-gl-edge " +
  "aria-invalid:border-gl-danger aria-invalid:focus-visible:ring-gl-danger/25";

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const messageId = `${fieldId}-message`;
  const countId = `${fieldId}-count`;
  const message = error ?? hint;
  const [length, setLength] = useState(String(value ?? defaultValue ?? "").length);
  const count = value === undefined ? length : String(value).length;

  return (
    <div className={["flex flex-col gap-1.5 font-gl", className].filter(Boolean).join(" ")}>
      <label htmlFor={fieldId} className="text-[13px] font-medium text-gl-fg">
        {label}
      </label>
      <textarea
        id={fieldId}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [message && messageId, maxLength && countId].filter(Boolean).join(" ") || undefined
        }
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setLength(event.target.value.length);
          onChange?.(event);
        }}
        className={field}
        {...props}
      />
      {(message || maxLength) && (
        <div className="flex items-start justify-between gap-4 text-[13px]">
          {message ? (
            <p id={messageId} className={error ? "text-gl-danger" : "text-gl-muted"}>
              {message}
            </p>
          ) : (
            <span />
          )}
          {maxLength && (
            <p id={countId} className="shrink-0 text-gl-muted tabular-nums">
              {count}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
