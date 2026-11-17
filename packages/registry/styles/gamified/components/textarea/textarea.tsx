"use client";

import { type ChangeEvent, type TextareaHTMLAttributes, useId, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

// Fields are sunk slots: a 2px edge and an inner top shade instead of a ledge.
const field =
  "min-h-24 w-full resize-y rounded-gm border-2 border-gm-line bg-gm-surface px-3.5 py-2 font-gm text-sm leading-relaxed font-semibold text-gm-fg shadow-gm-inset outline-none " +
  "transition-[border-color,box-shadow] duration-150 placeholder:font-normal placeholder:text-gm-muted " +
  "hover:border-gm-control focus-visible:border-gm-primary focus-visible:ring-4 focus-visible:ring-gm-primary/20 " +
  "disabled:cursor-not-allowed disabled:bg-gm-subtle disabled:text-gm-muted disabled:hover:border-gm-line " +
  "aria-invalid:border-gm-danger aria-invalid:focus-visible:ring-gm-danger/20";

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
    <div className={["flex flex-col gap-1.5 font-gm", className].filter(Boolean).join(" ")}>
      <label htmlFor={fieldId} className="text-[13px] font-bold text-gm-fg">
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
            <p
              id={messageId}
              className={`flex items-center gap-1.5 ${error ? "font-semibold text-gm-danger" : "text-gm-muted"}`}
            >
              {error && (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
                  <circle cx="8" cy="8" r="7" fill="currentColor" />
                  <path
                    d="M8 4.5v4"
                    className="stroke-gm-surface"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="11.25" r="1.1" className="fill-gm-surface" />
                </svg>
              )}
              {message}
            </p>
          ) : (
            <span />
          )}
          {maxLength && (
            <p id={countId} className="shrink-0 text-gm-muted tabular-nums">
              {count}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
