import type { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Draws the dashed outline of an empty slot. */
  bordered?: boolean;
}

/** An empty slot: a dashed chunky outline, a raised icon key, a Fredoka title and the next step. */
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
        "flex flex-col items-center px-6 py-10 text-center font-gm",
        bordered && "rounded-gm-lg border-2 border-dashed border-gm-control",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="mb-5 inline-flex size-12 items-center justify-center rounded-gm border-2 border-gm-line bg-gm-surface text-gm-muted shadow-gm [&>svg]:size-6"
        >
          {icon}
        </span>
      )}
      <h3 className="font-gm-display text-lg leading-snug font-semibold text-gm-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-gm-muted">{description}</p>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
