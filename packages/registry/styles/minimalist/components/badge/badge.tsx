import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "live" | "outline" | "danger";
  dot?: boolean;
}

const variants = {
  neutral: "bg-mn-subtle text-mn-fg",
  live: "bg-mn-accent-soft text-mn-fg",
  outline: "border border-mn-line text-mn-muted",
  danger: "bg-mn-danger/10 text-mn-danger",
};

const dots = {
  neutral: "bg-mn-muted",
  live: "bg-mn-accent motion-safe:animate-pulse",
  outline: "bg-mn-line-strong",
  danger: "bg-mn-danger",
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
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 font-mn text-[11px] font-medium whitespace-nowrap",
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
