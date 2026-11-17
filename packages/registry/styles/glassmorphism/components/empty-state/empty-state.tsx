import type { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Draws the dashed outline of an empty slot. */
  bordered?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  bordered = true,
  className,
  ...props
}: EmptyStateProps) {
  return (
    // One frost per state: the dashed slot frosts when bordered, otherwise the icon tile does.
    <div
      className={[
        "flex flex-col items-center px-6 py-12 text-center font-gl",
        bordered &&
          "rounded-gl-lg border border-dashed border-gl-line-strong bg-gl-glass backdrop-blur-gl backdrop-saturate-150",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={`mb-4 inline-flex size-10 items-center justify-center rounded-gl border border-gl-edge bg-gl-glass-strong text-gl-muted shadow-gl [&>svg]:size-5 ${
            bordered ? "" : "backdrop-blur-gl backdrop-saturate-150"
          }`}
        >
          {icon}
        </span>
      )}
      <h3 className="text-[15px] font-semibold tracking-tight text-gl-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-gl-muted">{description}</p>}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}
