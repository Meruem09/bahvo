import type { Route } from "next";
import Link from "next/link";
import { Fragment } from "react";

/** Where a page sits: links up the tree, then the current page as plain text. */
export function Breadcrumbs<T extends string>({
  trail,
  current,
}: {
  trail: { href: Route<T>; label: string }[];
  current: string;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {trail.map((crumb) => (
          <Fragment key={crumb.href}>
            <li>
              <Link href={crumb.href} className="hover:text-fg">
                {crumb.label}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
          </Fragment>
        ))}
        <li aria-current="page" className="text-fg">
          {current}
        </li>
      </ol>
    </nav>
  );
}
