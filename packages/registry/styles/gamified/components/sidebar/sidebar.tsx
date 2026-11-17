import type { ReactNode } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  current?: boolean;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  header?: ReactNode;
  footer?: ReactNode;
  /** Accessible name for the navigation landmark. */
  label?: string;
  className?: string;
}

// Fredoka menu rows; the current one sits on a violet tint with a chunky violet bar on its left edge.
const item =
  "group relative flex h-8 items-center gap-2.5 rounded-gm-sm px-3 font-gm-display text-[15px] font-semibold text-gm-muted " +
  "transition-[background-color,color,translate] duration-100 hover:bg-gm-subtle hover:text-gm-fg active:translate-y-px " +
  "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-gm-primary " +
  "aria-[current=page]:bg-gm-primary-soft aria-[current=page]:text-gm-fg aria-[current=page]:hover:bg-gm-primary-soft";

export function Sidebar({ sections, header, footer, label = "Main", className }: SidebarProps) {
  return (
    <nav
      aria-label={label}
      className={[
        "flex h-full w-60 shrink-0 flex-col gap-5 border-r-2 border-gm-line bg-gm-surface p-3 font-gm text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {header && <div className="px-3 pt-1">{header}</div>}
      <div className="flex flex-1 flex-col gap-5">
        {sections.map((section) => {
          const key = section.label ?? section.items[0]?.href ?? "section";
          return (
            <div key={key} className="flex flex-col gap-1">
              {section.label && (
                <h2 className="px-3 text-[11px] font-extrabold tracking-wider text-gm-muted uppercase">
                  {section.label}
                </h2>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((entry) => (
                  <li key={entry.href}>
                    <a
                      href={entry.href}
                      aria-current={entry.current ? "page" : undefined}
                      className={item}
                    >
                      {entry.current && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-2 left-0 w-1 rounded-full bg-gm-primary"
                        />
                      )}
                      {entry.icon && (
                        <span aria-hidden="true" className="inline-flex size-4 shrink-0">
                          {entry.icon}
                        </span>
                      )}
                      <span className="truncate">{entry.label}</span>
                      {entry.badge !== undefined && (
                        <span className="ml-auto rounded-full bg-gm-subtle px-2 text-xs leading-5 font-semibold text-gm-muted tabular-nums transition-colors group-hover:bg-gm-surface group-aria-[current=page]:bg-gm-surface">
                          {entry.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {footer && <div className="border-t-2 border-gm-line px-3 pt-3">{footer}</div>}
    </nav>
  );
}
