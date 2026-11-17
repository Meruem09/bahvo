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

// Fields use the strong glass so the chosen value always sits on a calm, readable fill.
const field =
  "h-10 w-full cursor-pointer appearance-none rounded-gl border border-gl-edge bg-gl-glass-strong pr-10 pl-3.5 font-gl text-sm text-gl-fg shadow-gl outline-none backdrop-blur-gl backdrop-saturate-150 " +
  "transition-[border-color,box-shadow] duration-150 " +
  "hover:border-gl-line-strong focus-visible:border-gl-accent focus-visible:ring-3 focus-visible:ring-gl-accent/25 " +
  "disabled:cursor-not-allowed disabled:bg-gl-glass disabled:text-gl-muted disabled:shadow-none disabled:hover:border-gl-edge " +
  "aria-invalid:border-gl-danger aria-invalid:focus-visible:ring-gl-danger/25";

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
    <div className={["flex flex-col gap-1.5 font-gl", className].filter(Boolean).join(" ")}>
      <label htmlFor={selectId} className="text-[13px] font-medium text-gl-fg">
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
        {/* After the field and z-10: the frosted select is its own layer (backdrop-filter) and would paint over the chevron. */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 z-10 size-4 -translate-y-1/2 text-gl-muted"
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
        <p id={messageId} className={`text-[13px] ${error ? "text-gl-danger" : "text-gl-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
