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

// The track is 1px border + 2px padding inside an 8px radius, so segments get 5px.
const segment =
  "relative inline-flex cursor-pointer items-center justify-center rounded-[5px] border border-transparent font-medium whitespace-nowrap text-mn-muted select-none " +
  "transition-[color,background-color,border-color,box-shadow] duration-150 hover:text-mn-fg " +
  "has-checked:border-mn-line has-checked:bg-mn-surface has-checked:text-mn-fg has-checked:shadow-mn-sm " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-mn-accent " +
  "has-disabled:cursor-not-allowed has-disabled:opacity-45 has-disabled:hover:text-mn-muted";

const sizes = {
  sm: { track: "h-8", segment: "px-2.5 text-[13px]" },
  md: { track: "h-9", segment: "px-3 text-sm" },
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
        "inline-flex items-stretch gap-0.5 rounded-mn border border-mn-line bg-mn-subtle p-0.5 font-mn",
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
