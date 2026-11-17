import { useId } from "react";

export interface ProgressProps {
  label: string;
  /** 0–100. Leave it out for an indeterminate bar. */
  value?: number;
  showValue?: boolean;
  className?: string;
}

/** A thick pill track with a shiny green fill, like an XP bar. */
export function Progress({ label, value, showValue = true, className }: ProgressProps) {
  const labelId = useId();
  const clamped = value === undefined ? undefined : Math.min(100, Math.max(0, value));

  return (
    <div className={["flex flex-col gap-2 font-gm", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <span id={labelId} className="font-bold text-gm-fg">
          {label}
        </span>
        {showValue && clamped !== undefined && (
          <span className="font-bold text-gm-muted tabular-nums">{Math.round(clamped)}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className="h-3 overflow-hidden rounded-full bg-gm-line shadow-gm-inset"
      >
        {clamped === undefined ? (
          <div className="h-full w-full rounded-full bg-gm-success/60 motion-safe:animate-pulse" />
        ) : (
          <div
            className="h-full rounded-full bg-gm-success shadow-gm-xp transition-[width] duration-300 ease-out"
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
}
