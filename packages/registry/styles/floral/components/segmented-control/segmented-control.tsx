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

// A pill track (1px hairline + 2px padding), so the segments are pills too and stay concentric.
// The selected segment is a raised cream pill: a hairline, paper fill and one soft shadow. Every segment keeps one weight.
const segment =
  "relative inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent font-semibold whitespace-nowrap text-fl-muted select-none " +
  "transition-[color,background-color,border-color,box-shadow] duration-150 hover:text-fl-fg " +
  "has-checked:border-fl-line has-checked:bg-fl-surface has-checked:text-fl-fg has-checked:shadow-fl " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-fl-accent " +
  "has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:hover:text-fl-muted";

const sizes = {
  sm: { track: "h-8", segment: "px-3 text-[13px]" },
  md: { track: "h-10", segment: "px-4 text-sm" },
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
        "inline-flex items-stretch gap-0.5 rounded-full border border-fl-line bg-fl-subtle p-0.5 font-fl",
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
