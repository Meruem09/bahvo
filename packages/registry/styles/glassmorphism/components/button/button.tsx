import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-gl font-gl font-medium " +
  "transition-[background-color,border-color,color,translate] duration-150 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-busy:cursor-progress";

const variants = {
  // Smoked glass: the near-black face keeps the inner highlight, so it still reads as a pane.
  primary: "bg-gl-fg text-gl-inverse shadow-gl hover:bg-gl-fg/85",
  secondary:
    "border border-gl-edge bg-gl-glass text-gl-fg shadow-gl backdrop-blur-gl backdrop-saturate-150 hover:bg-gl-glass-hover",
  ghost: "text-gl-fg hover:bg-gl-glass-hover",
};

const sizes = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

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
        <span
          aria-hidden="true"
          className="size-3.5 rounded-full motion-safe:animate-spin border-[1.5px] border-current border-r-transparent"
        />
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
