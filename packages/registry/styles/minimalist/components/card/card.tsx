import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
}

export function Card({
  title,
  description,
  footer,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  const header = title || description;
  return (
    <div
      className={[
        "relative flex flex-col rounded-mn-lg border border-mn-line bg-mn-surface font-mn text-mn-fg shadow-mn-sm",
        interactive &&
          "transition-colors hover:border-mn-line-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-mn-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {header && (
        <div className={`flex flex-col gap-1 px-5 pt-5 ${children ? "" : "pb-5"}`}>
          {title && <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-mn-muted">{description}</p>}
        </div>
      )}
      {children && <div className={header ? "px-5 pt-4 pb-5" : "p-5"}>{children}</div>}
      {footer && (
        <div className="mt-auto flex items-center gap-2 border-t border-mn-line px-5 py-3 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}
