import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "live" | "outline" | "danger";
  dot?: boolean;
}

const variants = {
  neutral: "bg-fl-subtle text-fl-fg",
  live: "bg-fl-accent-soft text-fl-fg",
  outline: "border border-fl-line-strong text-fl-muted",
  danger: "bg-fl-danger/10 text-fl-danger",
};

// Live carries the orchid petal; the other dots stay round.
const dots = {
  neutral: "rounded-full bg-fl-muted",
  live: "rounded-[0_100%] bg-fl-accent motion-safe:animate-pulse",
  outline: "rounded-full bg-fl-line-strong",
  danger: "rounded-full bg-fl-danger",
};

/** A small pill label; the text carries the meaning, the dot and fill reinforce it. */
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
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 font-fl text-[11px] font-semibold whitespace-nowrap",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {dot && <span aria-hidden="true" className={`size-1.5 ${dots[variant]}`} />}
      {children}
    </span>
  );
}
