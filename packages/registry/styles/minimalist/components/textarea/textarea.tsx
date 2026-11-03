"use client";

import { type ChangeEvent, type TextareaHTMLAttributes, useId, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

const field =
  "min-h-24 w-full resize-y rounded-mn border border-mn-line bg-mn-surface px-3 py-2 font-mn text-sm leading-relaxed text-mn-fg shadow-mn-sm outline-none " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-mn-muted " +
  "hover:border-mn-line-strong focus-visible:border-mn-accent focus-visible:ring-3 focus-visible:ring-mn-accent/20 " +
  "disabled:cursor-not-allowed disabled:bg-mn-subtle disabled:text-mn-muted disabled:shadow-none disabled:hover:border-mn-line " +
  "aria-invalid:border-mn-danger aria-invalid:focus-visible:ring-mn-danger/20";

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
    <div className={["flex flex-col gap-1.5 font-mn", className].filter(Boolean).join(" ")}>
      <label htmlFor={fieldId} className="text-[13px] font-medium text-mn-fg">
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
            <p id={messageId} className={error ? "text-mn-danger" : "text-mn-muted"}>
              {message}
            </p>
          ) : (
            <span />
          )}
          {maxLength && (
            <p id={countId} className="shrink-0 text-mn-muted tabular-nums">
              {count}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
