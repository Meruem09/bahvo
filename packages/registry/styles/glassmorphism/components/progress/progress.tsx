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
    <div className={["flex flex-col gap-2 font-gl", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <span id={labelId} className="font-medium text-gl-fg">
          {label}
        </span>
        {showValue && clamped !== undefined && (
          <span className="text-gl-muted tabular-nums">{Math.round(clamped)}%</span>
        )}
      </div>
      {/* A hairline-tinted track that takes the color of the glass or backdrop behind it. */}
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className="h-1.5 overflow-hidden rounded-full bg-gl-line"
      >
        {clamped === undefined ? (
          <div className="h-full w-full rounded-full bg-gl-accent/60 motion-safe:animate-pulse" />
        ) : (
          <div
            className="h-full rounded-full bg-gl-accent transition-[width] duration-300 ease-out"
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
}
