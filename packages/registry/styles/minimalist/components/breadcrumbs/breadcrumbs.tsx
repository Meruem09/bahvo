import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  /** From the root to the current page, which is last. */
  items: Crumb[];
  /** Accessible name for the navigation landmark. */
  label?: string;
  className?: string;
}

const crumb = "inline-flex h-7 min-w-0 items-center gap-1.5 rounded-mn-sm px-1.5";

const link =
  `${crumb} text-mn-muted transition-colors hover:text-mn-fg ` +
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-mn-accent";

function Content({ item }: { item: Crumb }) {
  return (
    <>
      {item.icon && (
        <span aria-hidden="true" className="inline-flex size-4 shrink-0">
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.label}</span>
    </>
  );
}

export function Breadcrumbs({ items, label = "Breadcrumb", className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={["font-mn", className].filter(Boolean).join(" ")}>
      {/* -mx-1.5 lines the first label up with the content edge, despite the padding. */}
      <ol className="-mx-1.5 flex flex-wrap items-center gap-0.5 text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href ?? item.label} className="flex min-w-0 items-center gap-0.5">
              {last || !item.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={`${crumb} ${last ? "font-medium text-mn-fg" : "text-mn-muted"}`}
                >
                  <Content item={item} />
                </span>
              ) : (
                <a href={item.href} className={link}>
                  <Content item={item} />
                </a>
              )}
              {!last && (
                <span aria-hidden="true" className="text-mn-line-strong select-none">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
