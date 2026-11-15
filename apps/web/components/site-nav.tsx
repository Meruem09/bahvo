"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/styles", label: "Styles" },
  { href: "/illustrations", label: "Illustrations" },
  { href: "/components", label: "Components" },
] as const;

/**
 * The main sections, with the current one marked by weight and an orange
 * underline that sits on the header's bottom hairline, not beside it.
 */
export function SiteNav({ kinds }: { kinds: Record<string, string> }) {
  const pathname = usePathname();
  // An item page (/styles/<style>/<item>) belongs to its kind's section, not to Styles.
  const [, root, style, item] = pathname.split("/");
  const section = root === "styles" && style && item ? `/${kinds[style] ?? "styles"}` : `/${root}`;
  return (
    <div className="flex h-full min-w-0 items-stretch gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
      {links.map((link) => {
        const current = section === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className="relative flex items-center px-2.5 text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent aria-[current=page]:text-fg"
          >
            {link.label}
            {current && (
              <span
                aria-hidden="true"
                className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-accent"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
