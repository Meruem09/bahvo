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
    <div
      className={[
        "flex flex-col items-center px-6 py-12 text-center font-mn",
        bordered && "rounded-mn-lg border border-dashed border-mn-line-strong",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="mb-4 inline-flex size-10 items-center justify-center rounded-mn border border-mn-line bg-mn-surface text-mn-muted shadow-mn-sm [&>svg]:size-5"
        >
          {icon}
        </span>
      )}
      <h3 className="text-[15px] font-semibold tracking-tight text-mn-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-mn-muted">{description}</p>}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}
