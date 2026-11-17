import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
}

// A small frosted tile on the strong glass; checked, it fills near-black and keeps the inner highlight.
const box =
  "peer size-4 cursor-pointer appearance-none rounded-[5px] border border-gl-edge bg-gl-glass-strong shadow-gl backdrop-blur-gl backdrop-saturate-150 " +
  "transition-colors hover:border-gl-line-strong checked:border-gl-fg checked:bg-gl-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent " +
  "disabled:cursor-not-allowed";

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const descriptionId = `${inputId}-description`;

  return (
    <div
      className={["group/checkbox flex items-start gap-2.5 font-gl", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative mt-0.5 inline-flex size-4 shrink-0 group-has-disabled/checkbox:opacity-45">
        <input
          id={inputId}
          type="checkbox"
          aria-describedby={description ? descriptionId : undefined}
          className={box}
          {...props}
        />
        {/* Keep the mark after the input: the frosted box is its own layer (backdrop-filter) and would paint over an earlier sibling. */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-4 text-gl-inverse opacity-0 peer-checked:opacity-100"
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
          className="cursor-pointer text-sm font-medium text-gl-fg group-has-disabled/checkbox:cursor-not-allowed group-has-disabled/checkbox:text-gl-muted"
        >
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="text-[13px] text-gl-muted">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
