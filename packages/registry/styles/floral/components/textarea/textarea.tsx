"use client";

import { type ChangeEvent, type TextareaHTMLAttributes, useId, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

// The input's cream paper field, grown to several lines.
const field =
  "min-h-24 w-full resize-y rounded-fl border border-fl-line-strong bg-fl-surface px-3.5 py-2.5 font-fl text-sm leading-relaxed text-fl-fg shadow-fl outline-none " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-fl-muted " +
  "hover:border-fl-control focus-visible:border-fl-accent focus-visible:ring-3 focus-visible:ring-fl-accent/20 " +
  "disabled:cursor-not-allowed disabled:bg-fl-subtle disabled:text-fl-muted disabled:shadow-none disabled:hover:border-fl-line-strong " +
  "aria-invalid:border-fl-danger aria-invalid:focus-visible:ring-fl-danger/20";

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
    <div className={["flex flex-col gap-1.5 font-fl", className].filter(Boolean).join(" ")}>
      <label htmlFor={fieldId} className="text-[13px] font-semibold text-fl-fg">
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
            <p id={messageId} className={error ? "text-fl-danger" : "text-fl-muted"}>
              {message}
            </p>
          ) : (
            <span />
          )}
          {maxLength && (
            <p id={countId} className="shrink-0 text-fl-muted tabular-nums">
              {count}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
