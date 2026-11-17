import type { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavbarProps {
  /** Logo and name, at the start. */
  brand: ReactNode;
  links: NavLink[];
  /** Buttons, search or the account menu, at the end. */
  actions?: ReactNode;
  /** Accessible name for the navigation landmark. */
  label?: string;
  className?: string;
}

// Links are game-menu tabs standing on the bar's edge; the label is lifted by the bottom padding
// so it lines up with the brand. The current one takes the violet tint over a chunky violet bar.
const link =
  "inline-flex h-12 items-center rounded-t-gm px-3 pb-2.5 font-gm-display text-[15px] font-semibold whitespace-nowrap text-gm-muted transition-colors " +
  "hover:bg-gm-subtle hover:text-gm-fg " +
  "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-gm-primary " +
  "aria-[current=page]:bg-gm-primary-soft aria-[current=page]:text-gm-fg aria-[current=page]:hover:bg-gm-primary-soft";

export function Navbar({ brand, links, actions, label = "Main", className }: NavbarProps) {
  return (
    // The nav reaches 2px down over the bottom edge (-mb-0.5), so the current link's
    // violet bar covers the edge instead of sitting above it, like the tabs.
    <header
      className={[
        "flex h-14 items-center gap-6 border-b-2 border-gm-line bg-gm-surface px-4 font-gm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex shrink-0 items-center">{brand}</div>
      <nav
        aria-label={label}
        className="-mb-0.5 min-w-0 self-stretch overflow-x-auto [scrollbar-width:none]"
      >
        <ul className="flex h-full items-stretch gap-1">
          {links.map((entry) => (
            <li key={entry.href} className="relative flex items-end">
              <a
                href={entry.href}
                aria-current={entry.current ? "page" : undefined}
                className={link}
              >
                {entry.label}
              </a>
              {entry.current && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-1 rounded-full bg-gm-primary"
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
