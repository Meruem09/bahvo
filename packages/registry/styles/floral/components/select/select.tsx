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

// The same cream paper field as the input, with room on the right for the chevron.
const field =
  "h-10 w-full cursor-pointer appearance-none rounded-fl border border-fl-line-strong bg-fl-surface pr-10 pl-3.5 font-fl text-sm text-fl-fg shadow-fl outline-none " +
  "transition-[border-color,box-shadow] duration-150 " +
  "hover:border-fl-control focus-visible:border-fl-accent focus-visible:ring-3 focus-visible:ring-fl-accent/20 " +
  "disabled:cursor-not-allowed disabled:bg-fl-subtle disabled:text-fl-muted disabled:shadow-none disabled:hover:border-fl-line-strong " +
  "aria-invalid:border-fl-danger aria-invalid:focus-visible:ring-fl-danger/20";

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
    <div className={["flex flex-col gap-1.5 font-fl", className].filter(Boolean).join(" ")}>
      <label htmlFor={selectId} className="text-[13px] font-semibold text-fl-fg">
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
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-fl-muted"
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
        <p id={messageId} className={`text-[13px] ${error ? "text-fl-danger" : "text-fl-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
