import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "live" | "outline" | "danger";
  dot?: boolean;
}

// Fredoka pills; gold marks the one thing that is live right now.
const variants = {
  neutral: "bg-gm-subtle text-gm-fg",
  live: "bg-gm-gold text-gm-on-gold",
  outline: "border-2 border-gm-line text-gm-muted",
  danger: "bg-gm-danger-soft text-gm-danger",
};

const dots = {
  neutral: "bg-gm-muted",
  live: "bg-gm-on-gold motion-safe:animate-pulse",
  outline: "bg-gm-control",
  danger: "bg-gm-danger",
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
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-gm-display text-xs font-semibold whitespace-nowrap",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {dot && <span aria-hidden="true" className={`size-2 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
}
