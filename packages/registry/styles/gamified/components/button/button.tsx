import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-gm font-gm-display font-semibold " +
  "transition-[background-color,border-color,color,translate,box-shadow] duration-100 ease-out " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary " +
  "disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress";

const variants = {
  // Raised keys carry a ledge and sink onto the page when pressed.
  primary:
    "bg-gm-primary text-gm-on-primary shadow-gm-primary hover:bg-gm-primary-hover active:translate-y-1 active:shadow-none",
  secondary:
    "border-2 border-gm-line bg-gm-surface text-gm-fg shadow-gm hover:bg-gm-subtle active:translate-y-1 active:shadow-none",
  ghost: "text-gm-fg hover:bg-gm-subtle active:translate-y-px",
};

const sizes = {
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-5 text-[15px]",
  lg: "h-12 px-6 text-[17px]",
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
          className="size-4 rounded-full border-[2.5px] border-current border-r-transparent motion-safe:animate-spin"
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
