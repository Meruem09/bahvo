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

const circle =
  "peer size-4 cursor-pointer appearance-none rounded-full border border-mn-line-strong bg-mn-surface shadow-mn-sm " +
  "transition-colors hover:border-mn-muted checked:border-mn-fg checked:bg-mn-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent " +
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
      className={["flex flex-col gap-4 font-mn", className].filter(Boolean).join(" ")}
    >
      <legend className="mb-3 text-[13px] font-medium text-mn-muted">{legend}</legend>
      {options.map((option) => {
        const inputId = `${groupName}-${option.value}`;
        const descriptionId = `${inputId}-description`;
        return (
          <div key={option.value} className="group/radio flex items-start gap-2.5">
            <span className="relative mt-0.5 inline-flex size-4 shrink-0 group-has-disabled/radio:opacity-50">
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
                className="pointer-events-none absolute inset-[5px] rounded-full bg-mn-inverse opacity-0 peer-checked:opacity-100"
              />
            </span>
            <span className="flex flex-col gap-0.5">
              <label
                htmlFor={inputId}
                className="cursor-pointer text-sm font-medium text-mn-fg group-has-disabled/radio:cursor-not-allowed group-has-disabled/radio:text-mn-muted"
              >
                {option.label}
              </label>
              {option.description && (
                <span id={descriptionId} className="text-[13px] text-mn-muted">
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
