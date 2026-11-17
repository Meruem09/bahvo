import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
}

/** A leaf-cut paper pane: a warm hairline and one soft shadow. */
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
        "relative flex flex-col rounded-fl-leaf border border-fl-line bg-fl-surface font-fl text-fl-fg shadow-fl",
        interactive &&
          "transition-colors hover:border-fl-line-strong hover:bg-fl-bg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-fl-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {header && (
        <div className={`flex flex-col gap-1 px-6 pt-6 ${children ? "" : "pb-6"}`}>
          {title && (
            <h3 className="font-fl-display text-[17px] leading-snug font-semibold">{title}</h3>
          )}
          {description && <p className="text-sm text-fl-muted">{description}</p>}
        </div>
      )}
      {children && <div className={header ? "px-6 pt-4 pb-6" : "p-6"}>{children}</div>}
      {footer && (
        <div className="mt-auto flex items-center gap-2 border-t border-fl-line px-6 py-3.5 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}
