import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "live" | "outline" | "danger";
  dot?: boolean;
}

// Flat translucent tints, not frosted panes: a badge sits on a pane or the backdrop and takes its color.
const variants = {
  neutral: "bg-gl-line text-gl-fg",
  live: "bg-gl-accent-soft text-gl-fg",
  outline: "border border-gl-line text-gl-muted",
  danger: "bg-gl-danger/10 text-gl-danger",
};

const dots = {
  neutral: "bg-gl-muted",
  live: "bg-gl-accent motion-safe:animate-pulse",
  outline: "bg-gl-line-strong",
  danger: "bg-gl-danger",
};

export function Badge({
  variant = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 font-gl text-[11px] font-medium whitespace-nowrap",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {dot && <span aria-hidden="true" className={`size-1.5 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
}
