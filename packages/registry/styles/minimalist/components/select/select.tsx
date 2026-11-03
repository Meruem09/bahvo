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

const field =
  "h-9 w-full cursor-pointer appearance-none rounded-mn border border-mn-line bg-mn-surface pr-9 pl-3 font-mn text-sm text-mn-fg shadow-mn-sm outline-none " +
  "transition-[border-color,box-shadow] duration-150 " +
  "hover:border-mn-line-strong focus-visible:border-mn-accent focus-visible:ring-3 focus-visible:ring-mn-accent/20 " +
  "disabled:cursor-not-allowed disabled:bg-mn-subtle disabled:text-mn-muted disabled:shadow-none disabled:hover:border-mn-line " +
  "aria-invalid:border-mn-danger aria-invalid:focus-visible:ring-mn-danger/20";

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
    <div className={["flex flex-col gap-1.5 font-mn", className].filter(Boolean).join(" ")}>
      <label htmlFor={selectId} className="text-[13px] font-medium text-mn-fg">
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
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-mn-muted"
        >
          <path
            d="m4.5 6.5 3.5 3.5 3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {message && (
        <p id={messageId} className={`text-[13px] ${error ? "text-mn-danger" : "text-mn-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
