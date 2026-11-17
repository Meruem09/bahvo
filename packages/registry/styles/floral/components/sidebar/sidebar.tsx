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

// The current page sits on a sage leaf; a short orchid bar marks it at the sidebar's edge.
const item =
  "relative flex h-8 items-center gap-2.5 rounded-fl-sm px-2 text-fl-muted transition-colors " +
  "hover:bg-fl-subtle hover:text-fl-fg " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fl-accent " +
  "aria-[current=page]:bg-fl-leaf aria-[current=page]:font-semibold aria-[current=page]:text-fl-fg";

/** App navigation on cream paper, with Fraunces small-caps group headings. */
export function Sidebar({ sections, header, footer, label = "Main", className }: SidebarProps) {
  return (
    <nav
      aria-label={label}
      className={[
        "flex h-full w-60 shrink-0 flex-col gap-5 border-r border-fl-line bg-fl-bg p-3 font-fl text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {header && <div className="px-2 pt-1">{header}</div>}
      <div className="flex flex-1 flex-col gap-5">
        {sections.map((section) => {
          const key = section.label ?? section.items[0]?.href ?? "section";
          return (
            <div key={key} className="flex flex-col gap-1">
              {section.label && (
                <h2 className="px-2 font-fl-display text-[11px] font-semibold tracking-wider text-fl-muted uppercase">
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
                          className="absolute top-1/2 -left-3 h-4 w-[3px] -translate-y-1/2 rounded-full bg-fl-accent"
                        />
                      )}
                      {entry.icon && (
                        <span aria-hidden="true" className="inline-flex size-4 shrink-0">
                          {entry.icon}
                        </span>
                      )}
                      <span className="truncate">{entry.label}</span>
                      {entry.badge !== undefined && (
                        <span className="ml-auto rounded-full bg-fl-subtle px-1.5 text-[11px] leading-[18px] font-semibold text-fl-muted tabular-nums">
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
      {footer && <div className="border-t border-fl-line px-2 pt-3">{footer}</div>}
    </nav>
  );
}
