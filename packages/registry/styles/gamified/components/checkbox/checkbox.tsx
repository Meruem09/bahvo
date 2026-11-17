import { type InputHTMLAttributes, type ReactNode, useId } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
}

// A chunky box: a 2px control edge that turns violet on hover, a violet fill with a bold check when ticked.
const box =
  "peer size-5 cursor-pointer appearance-none rounded-[6px] border-2 border-gm-control bg-gm-surface " +
  "transition-colors enabled:hover:border-gm-primary " +
  "checked:border-gm-primary-depth checked:bg-gm-primary checked:enabled:hover:border-gm-primary-depth checked:enabled:hover:bg-gm-primary-hover " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary " +
  "disabled:cursor-not-allowed";

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const descriptionId = `${inputId}-description`;

  return (
    <div
      className={["group/checkbox flex items-start gap-3 font-gm", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative inline-flex size-5 shrink-0 group-has-disabled/checkbox:opacity-50">
        <input
          id={inputId}
          type="checkbox"
          aria-describedby={description ? descriptionId : undefined}
          className={box}
          {...props}
        />
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-5 scale-50 text-gm-on-primary opacity-0 peer-checked:scale-100 peer-checked:opacity-100 motion-safe:transition-[opacity,scale]"
        >
          <path
            d="m5.75 10.25 2.75 2.75 5.75-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <label
          htmlFor={inputId}
          className="cursor-pointer text-sm font-semibold text-gm-fg group-has-disabled/checkbox:cursor-not-allowed group-has-disabled/checkbox:text-gm-muted"
        >
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="text-[13px] text-gm-muted">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
