import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
}

// A tiny leaf (two round corners, two tight) on paper; checked fills moss with a cream check.
const box =
  "peer size-4 cursor-pointer appearance-none rounded-[6px_2px] border border-fl-control bg-fl-surface shadow-fl " +
  "transition-colors enabled:hover:border-fl-muted enabled:hover:bg-fl-subtle " +
  "checked:border-fl-primary checked:bg-fl-primary checked:enabled:hover:border-fl-primary-hover checked:enabled:hover:bg-fl-primary-hover " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent " +
  "disabled:cursor-not-allowed";

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const descriptionId = `${inputId}-description`;

  return (
    <div
      className={["group/checkbox flex items-start gap-2.5 font-fl", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative mt-0.5 inline-flex size-4 shrink-0 group-has-disabled/checkbox:opacity-50">
        <input
          id={inputId}
          type="checkbox"
          aria-describedby={description ? descriptionId : undefined}
          className={box}
          {...props}
        />
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-4 text-fl-on-primary opacity-0 peer-checked:opacity-100"
        >
          <path
            d="m4.5 8.25 2.25 2.25 4.75-5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <label
          htmlFor={inputId}
          className="cursor-pointer text-sm font-semibold text-fl-fg group-has-disabled/checkbox:cursor-not-allowed group-has-disabled/checkbox:text-fl-muted"
        >
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="text-[13px] text-fl-muted">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
