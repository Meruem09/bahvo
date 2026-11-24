"use client";

import { cn } from "@bahvo/ui/cn";

/**
 * A row of toggle buttons where exactly one is pressed: the preview's theme,
 * the package manager. The pressed one is lifted onto a card.
 */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  label = (option) => option,
  size = "md",
  className,
}: {
  /** Screen-reader name for the group. */
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Visible text for an option; defaults to the value itself. */
  label?: (option: T) => string;
  /** md: 28px buttons for toolbars; sm: 24px for panel headers. */
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <fieldset className={cn("flex rounded-[7px] border border-line bg-subtle p-0.5", className)}>
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-[4px] border border-transparent text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent aria-pressed:border-line aria-pressed:bg-card aria-pressed:text-fg aria-pressed:shadow-[0_1px_2px_rgb(0_0_0/0.06)]",
            size === "md" ? "h-7 px-2.5 text-[13px]" : "h-6 px-2 text-xs",
          )}
        >
          {label(option)}
        </button>
      ))}
    </fieldset>
  );
}
