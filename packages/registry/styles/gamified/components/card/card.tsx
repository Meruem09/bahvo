import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
}

/** A chunky pane: a 2px edge on a hard ledge. Interactive cards press down like keys. */
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
        "relative flex flex-col rounded-gm-lg border-2 border-gm-line bg-gm-surface font-gm text-gm-fg shadow-gm",
        interactive &&
          "transition-[translate,box-shadow,border-color] duration-100 hover:border-gm-control active:translate-y-1 active:shadow-none has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-gm-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {header && (
        <div className={`flex flex-col gap-1 px-5 pt-5 ${children ? "" : "pb-5"}`}>
          {title && <h3 className="font-gm-display text-lg leading-snug font-semibold">{title}</h3>}
          {description && <p className="text-sm text-gm-muted">{description}</p>}
        </div>
      )}
      {children && <div className={header ? "px-5 pt-4 pb-5" : "p-5"}>{children}</div>}
      {footer && (
        <div className="mt-auto flex items-center gap-2 border-t-2 border-gm-line px-5 py-3 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}
