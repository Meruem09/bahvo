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

// The current link sits on a sage leaf and carries the orchid underline, like a selected tab.
const link =
  "inline-flex h-10 items-center rounded-fl px-3.5 text-sm whitespace-nowrap text-fl-muted transition-colors " +
  "hover:bg-fl-subtle hover:text-fl-fg " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fl-accent " +
  "aria-[current=page]:bg-fl-leaf aria-[current=page]:font-semibold aria-[current=page]:text-fl-fg";

/** The app's top bar: a cream paper strip over a warm hairline. */
export function Navbar({ brand, links, actions, label = "Main", className }: NavbarProps) {
  return (
    // Each list item hugs its link, so the orchid underline runs along the leaf's bottom edge.
    <header
      className={[
        "flex h-14 items-center gap-6 border-b border-fl-line bg-fl-surface px-5 font-fl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex shrink-0 items-center">{brand}</div>
      <nav aria-label={label} className="h-full min-w-0 overflow-x-auto [scrollbar-width:none]">
        <ul className="flex h-full items-center gap-1">
          {links.map((entry) => (
            <li key={entry.href} className="relative flex">
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
                  className="pointer-events-none absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-fl-accent"
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
