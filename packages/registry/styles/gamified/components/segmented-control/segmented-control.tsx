import { useId } from "react";

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Accessible name for the group. */
  label: string;
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  name?: string;
  className?: string;
}

// The well is a 2px edge + 4px padding inside a 12px radius, so segments get 6px.
// The selected segment pops up as a raised violet key; its 4px ledge rests in the well's bottom padding.
// One weight for every segment, so nothing shifts when the selection moves.
const segment =
  "relative inline-flex cursor-pointer items-center justify-center rounded-[6px] font-gm-display font-semibold whitespace-nowrap text-gm-muted select-none " +
  "transition-[color,background-color,box-shadow,translate] duration-100 hover:bg-gm-surface hover:text-gm-fg " +
  "has-checked:bg-gm-primary has-checked:text-gm-on-primary has-checked:shadow-gm-primary " +
  "has-checked:hover:bg-gm-primary-hover has-checked:hover:text-gm-on-primary has-checked:active:translate-y-1 has-checked:active:shadow-none " +
  "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-gm-primary " +
  "has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:hover:bg-transparent has-disabled:hover:text-gm-muted";

const sizes = {
  sm: { track: "h-8", segment: "px-2.5 text-[13px]" },
  md: { track: "h-10", segment: "px-3.5 text-sm" },
};

export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  name,
  className,
}: SegmentedControlProps) {
  const generated = useId();
  const groupName = name ?? generated;
  const initial = defaultValue ?? options.find((option) => !option.disabled)?.value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={[
        "inline-flex items-stretch gap-1 rounded-gm border-2 border-gm-line bg-gm-subtle p-1 font-gm shadow-gm-inset",
        sizes[size].track,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((option) => (
        <label key={option.value} className={`${segment} ${sizes[size].segment}`}>
          <input
            type="radio"
            name={groupName}
            value={option.value}
            disabled={option.disabled}
            {...(value === undefined
              ? { defaultChecked: option.value === initial }
              : { checked: option.value === value })}
            onChange={onValueChange && ((event) => onValueChange(event.target.value))}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
