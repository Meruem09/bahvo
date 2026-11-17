import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
}

/** A frosted pane: rim, inner highlight, blur and one soft shadow. */
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
        "relative flex flex-col rounded-gl-lg border border-gl-edge bg-gl-glass font-gl text-gl-fg shadow-gl backdrop-blur-gl backdrop-saturate-150",
        interactive &&
          "transition-colors hover:bg-gl-glass-hover has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gl-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {header && (
        <div className={`flex flex-col gap-1 px-6 pt-6 ${children ? "" : "pb-6"}`}>
          {title && <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-gl-muted">{description}</p>}
        </div>
      )}
      {children && <div className={header ? "px-6 pt-4 pb-6" : "p-6"}>{children}</div>}
      {footer && (
        <div className="mt-auto flex items-center gap-2 border-t border-gl-line px-6 py-3.5 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}
