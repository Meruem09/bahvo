import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-iso border-2 font-iso font-semibold tracking-tight " +
  "bg-(--iso-face) text-(--iso-label) transition-[translate,box-shadow,background-color] duration-100 ease-out " +
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-iso-focus " +
  "active:translate-x-iso-dx active:translate-y-iso-dy active:shadow-none " +
  "disabled:pointer-events-none disabled:translate-x-iso-dx disabled:translate-y-iso-dy disabled:shadow-none disabled:opacity-60 " +
  "aria-busy:cursor-progress";

const raised =
  "border-iso-ink shadow-iso hover:-translate-x-[0.87px] hover:-translate-y-[0.5px] hover:shadow-iso-raised";

const variants = {
  primary: `${raised} [--iso-face:var(--color-iso-primary)] [--iso-side:var(--color-iso-primary-side)] [--iso-label:var(--color-iso-primary-label)]`,
  secondary: `${raised} [--iso-face:var(--color-iso-paper)] [--iso-side:var(--color-iso-paper-side)] [--iso-label:var(--color-iso-paper-label)]`,
  ghost:
    "border-transparent [--iso-face:transparent] [--iso-label:var(--color-iso-ghost-label)] hover:[--iso-face:var(--color-iso-muted)]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-13 px-7 text-lg",
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
          className="size-4 animate-spin rounded-[2px] border-2 border-current border-r-transparent"
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
