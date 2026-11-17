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

// Links sit inside the frosted bar, so they stay plain: a tint on hover, the strong glass when current.
const link =
  "inline-flex h-8 items-center rounded-gl-sm px-2.5 text-sm whitespace-nowrap text-gl-muted transition-colors " +
  "hover:bg-gl-glass-hover hover:text-gl-fg " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gl-accent " +
  "aria-[current=page]:bg-gl-glass-strong aria-[current=page]:font-medium aria-[current=page]:text-gl-fg";

/** The app's top bar on a frosted pane, with a bright rim along its bottom edge. */
export function Navbar({ brand, links, actions, label = "Main", className }: NavbarProps) {
  return (
    // The current link's orange underline sits at the bottom of the bar, right on its rim.
    <header
      className={[
        "flex h-14 items-center gap-6 border-b border-gl-edge bg-gl-glass px-5 font-gl shadow-gl backdrop-blur-gl backdrop-saturate-150",
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
                  className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-gl-accent"
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
