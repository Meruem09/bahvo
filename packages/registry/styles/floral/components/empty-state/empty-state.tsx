import type { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Draws the dashed outline of an empty slot. */
  bordered?: boolean;
}

/** An empty slot: a dashed leaf-cut outline, an icon on a sage tile, a Fraunces title and the next step. */
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
    <div
      className={[
        "flex flex-col items-center px-6 py-12 text-center font-fl",
        bordered && "rounded-fl-leaf border border-dashed border-fl-line-strong",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="mb-4 inline-flex size-10 items-center justify-center rounded-fl bg-fl-leaf text-fl-fg [&>svg]:size-5"
        >
          {icon}
        </span>
      )}
      <h3 className="font-fl-display text-[17px] leading-snug font-semibold text-fl-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-fl-muted">{description}</p>}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}
