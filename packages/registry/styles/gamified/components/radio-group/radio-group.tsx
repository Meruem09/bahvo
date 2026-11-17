import { type ReactNode, useId } from "react";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// A chunky round radio: a 2px control edge that turns violet on hover, a violet fill around a bold dot when picked.
const circle =
  "peer size-5 cursor-pointer appearance-none rounded-full border-2 border-gm-control bg-gm-surface " +
  "transition-colors enabled:hover:border-gm-primary " +
  "checked:border-gm-primary-depth checked:bg-gm-primary checked:enabled:hover:border-gm-primary-depth checked:enabled:hover:bg-gm-primary-hover " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary " +
  "disabled:cursor-not-allowed";

export function RadioGroup({
  legend,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  className,
}: RadioGroupProps) {
  const generated = useId();
  const groupName = name ?? generated;

  return (
    <fieldset
      disabled={disabled}
      className={["flex flex-col gap-4 font-gm", className].filter(Boolean).join(" ")}
    >
      <legend className="mb-3 text-[13px] font-bold text-gm-muted">{legend}</legend>
      {options.map((option) => {
        const inputId = `${groupName}-${option.value}`;
        const descriptionId = `${inputId}-description`;
        return (
          <div key={option.value} className="group/radio flex items-start gap-3">
            <span className="relative inline-flex size-5 shrink-0 group-has-disabled/radio:opacity-50">
              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={option.value}
                required={required}
                disabled={option.disabled}
                aria-describedby={option.description ? descriptionId : undefined}
                {...(value === undefined
                  ? { defaultChecked: option.value === defaultValue }
                  : { checked: option.value === value })}
                onChange={onValueChange && ((event) => onValueChange(event.target.value))}
                className={circle}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[6px] scale-50 rounded-full bg-gm-on-primary opacity-0 peer-checked:scale-100 peer-checked:opacity-100 motion-safe:transition-[opacity,scale]"
              />
            </span>
            <span className="flex flex-col gap-0.5">
              <label
                htmlFor={inputId}
                className="cursor-pointer text-sm font-semibold text-gm-fg group-has-disabled/radio:cursor-not-allowed group-has-disabled/radio:text-gm-muted"
              >
                {option.label}
              </label>
              {option.description && (
                <span id={descriptionId} className="text-[13px] text-gm-muted">
                  {option.description}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </fieldset>
  );
}
