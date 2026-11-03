import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
}

const box =
  "peer size-4 cursor-pointer appearance-none rounded-[4px] border border-mn-line-strong bg-mn-surface shadow-mn-sm " +
  "transition-colors hover:border-mn-muted checked:border-mn-fg checked:bg-mn-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent " +
  "disabled:cursor-not-allowed";

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const descriptionId = `${inputId}-description`;

  return (
    <div
      className={["flex items-start gap-2.5 font-mn has-disabled:opacity-50", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative mt-0.5 inline-flex size-4 shrink-0">
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
          className="pointer-events-none absolute inset-0 size-4 text-mn-inverse opacity-0 peer-checked:opacity-100"
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
        <label htmlFor={inputId} className="cursor-pointer text-sm font-medium text-mn-fg">
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="text-[13px] text-mn-muted">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
