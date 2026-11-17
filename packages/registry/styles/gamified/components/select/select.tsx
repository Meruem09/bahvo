import { type SelectHTMLAttributes, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
}

// Fields are sunk slots: a 2px edge and an inner top shade instead of a ledge.
const field =
  "h-10 w-full cursor-pointer appearance-none rounded-gm border-2 border-gm-line bg-gm-surface pr-10 pl-3.5 font-gm text-sm font-semibold text-gm-fg shadow-gm-inset outline-none " +
  "transition-[border-color,box-shadow] duration-150 " +
  "hover:border-gm-control focus-visible:border-gm-primary focus-visible:ring-4 focus-visible:ring-gm-primary/20 " +
  "disabled:cursor-not-allowed disabled:bg-gm-subtle disabled:text-gm-muted disabled:hover:border-gm-line " +
  "aria-invalid:border-gm-danger aria-invalid:focus-visible:ring-gm-danger/20";

export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  id,
  className,
  value,
  defaultValue,
  ...props
}: SelectProps) {
  const generated = useId();
  const selectId = id ?? generated;
  const messageId = `${selectId}-message`;
  const message = error ?? hint;

  return (
    <div className={["flex flex-col gap-1.5 font-gm", className].filter(Boolean).join(" ")}>
      <label htmlFor={selectId} className="text-[13px] font-bold text-gm-fg">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          defaultValue={
            value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={field}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-gm-muted"
        >
          <path
            d="m4.5 6.5 3.5 3.5 3.5-3.5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {message && (
        <p
          id={messageId}
          className={`flex items-center gap-1.5 text-[13px] ${error ? "font-semibold text-gm-danger" : "text-gm-muted"}`}
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
      )}
    </div>
  );
}
