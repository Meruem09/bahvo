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

// A small frosted disc on the strong glass; selected, it fills near-black with an inverse dot and keeps the inner highlight.
const circle =
  "peer size-4 cursor-pointer appearance-none rounded-full border border-gl-edge bg-gl-glass-strong shadow-gl backdrop-blur-gl backdrop-saturate-150 " +
  "transition-colors hover:border-gl-line-strong checked:border-gl-fg checked:bg-gl-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent " +
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
      className={["flex flex-col gap-4 font-gl", className].filter(Boolean).join(" ")}
    >
      <legend className="mb-3 text-[13px] font-medium text-gl-muted">{legend}</legend>
      {options.map((option) => {
        const inputId = `${groupName}-${option.value}`;
        const descriptionId = `${inputId}-description`;
        return (
          <div key={option.value} className="group/radio flex items-start gap-2.5">
            <span className="relative mt-0.5 inline-flex size-4 shrink-0 group-has-disabled/radio:opacity-45">
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
              {/* Keep the dot after the input: the frosted disc is its own layer and would paint over an earlier sibling. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[5px] rounded-full bg-gl-inverse opacity-0 peer-checked:opacity-100"
              />
            </span>
            <span className="flex flex-col gap-0.5">
              <label
                htmlFor={inputId}
                className="cursor-pointer text-sm font-medium text-gl-fg group-has-disabled/radio:cursor-not-allowed group-has-disabled/radio:text-gl-muted"
              >
                {option.label}
              </label>
              {option.description && (
                <span id={descriptionId} className="text-[13px] text-gl-muted">
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
