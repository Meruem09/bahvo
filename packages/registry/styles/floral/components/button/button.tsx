import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-fl font-semibold " +
  "transition-[background-color,border-color,color,translate] duration-150 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress";

const variants = {
  // Moss does the work; paper and plain text step back.
  primary: "bg-fl-primary text-fl-on-primary shadow-fl hover:bg-fl-primary-hover",
  secondary:
    "border border-fl-line-strong bg-fl-surface text-fl-fg shadow-fl hover:border-fl-control hover:bg-fl-subtle",
  ghost: "text-fl-fg hover:bg-fl-subtle",
};

const sizes = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

/** The bloom: six petals, fading round the flower so the turn reads as motion. */
function Bloom() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="size-4 shrink-0 motion-safe:animate-spin"
    >
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="8"
          cy="3.75"
          rx="1.6"
          ry="2.75"
          opacity={0.3 + angle / 430}
          transform={`rotate(${angle} 8 8)`}
        />
      ))}
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[base, variants[variant], sizes[size], className].filter(Boolean).join(" ")}
      {...props}
    >
      {loading ? (
        <Bloom />
      ) : (
        icon && (
          <span aria-hidden="true" className="inline-flex size-4 shrink-0">
            {icon}
          </span>
        )
      )}
      {children}
    </button>
  );
}
