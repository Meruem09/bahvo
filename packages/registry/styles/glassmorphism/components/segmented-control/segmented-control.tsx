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

// The track is a hairline-tinted well with a bright rim: 1px rim + 2px padding inside a 12px radius, so segments get 9px.
// The selected segment lifts out of it as a rimmed glass key with the inner highlight. It takes the hover glass, which is
// lighter than the well in both themes (the strong glass is darker than the well in dark), and no blur of its own.
const segment =
  "relative inline-flex cursor-pointer items-center justify-center rounded-[9px] border border-transparent font-medium whitespace-nowrap text-gl-muted select-none " +
  "transition-[color,background-color,border-color,box-shadow] duration-150 hover:text-gl-fg " +
  "has-checked:border-gl-edge has-checked:bg-gl-glass-hover has-checked:text-gl-fg has-checked:shadow-gl " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-gl-accent " +
  "has-disabled:cursor-not-allowed has-disabled:opacity-45 has-disabled:hover:text-gl-muted";

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
        "inline-flex items-stretch gap-0.5 rounded-gl border border-gl-edge bg-gl-line p-0.5 font-gl",
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
