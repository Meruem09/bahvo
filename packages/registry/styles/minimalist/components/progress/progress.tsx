import { useId } from "react";

export interface ProgressProps {
  label: string;
  /** 0–100. Leave it out for an indeterminate bar. */
  value?: number;
  showValue?: boolean;
  className?: string;
}

export function Progress({ label, value, showValue = true, className }: ProgressProps) {
  const labelId = useId();
  const clamped = value === undefined ? undefined : Math.min(100, Math.max(0, value));

  return (
    <div className={["flex flex-col gap-2 font-mn", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <span id={labelId} className="font-medium text-mn-fg">
          {label}
        </span>
        {showValue && clamped !== undefined && (
          <span className="text-mn-muted tabular-nums">{Math.round(clamped)}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className="h-1.5 overflow-hidden rounded-full bg-mn-subtle"
      >
        {clamped === undefined ? (
          <div className="h-full w-full rounded-full bg-mn-accent/60 motion-safe:animate-pulse" />
        ) : (
          <div
            className="h-full rounded-full bg-mn-accent transition-[width] duration-300 ease-out"
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
}
