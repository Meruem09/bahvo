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

const link =
  "inline-flex h-8 items-center rounded-mn-sm px-2.5 text-sm whitespace-nowrap text-mn-muted transition-colors " +
  "hover:bg-mn-subtle hover:text-mn-fg " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mn-accent " +
  "aria-[current=page]:font-medium aria-[current=page]:text-mn-fg";

export function Navbar({ brand, links, actions, label = "Main", className }: NavbarProps) {
  return (
    // The bottom hairline is an inset shadow, not a border, so the current
    // link's orange underline can sit on top of it instead of beside it.
    <header
      className={[
        "flex h-14 items-center gap-6 bg-mn-bg px-4 font-mn shadow-[inset_0_-1px_0_var(--mn-line)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex shrink-0 items-center">{brand}</div>
      <nav aria-label={label} className="h-full min-w-0 overflow-x-auto [scrollbar-width:none]">
        <ul className="flex h-full items-stretch gap-1">
          {links.map((entry) => (
            <li key={entry.href} className="relative flex items-center">
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
                  className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-mn-accent"
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
