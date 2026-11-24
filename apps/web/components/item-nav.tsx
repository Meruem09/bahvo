import type { ManifestItem } from "@bahvo/registry";
import { cn } from "@bahvo/ui/cn";
import Link from "next/link";
import { getItemsForStyle, getItemsForSubject, getStyle } from "@/lib/registry";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

const href = (item: ManifestItem) => `/styles/${item.style}/${item.slug}` as const;

/** The style's items in the order its page lists them, and this item's neighbours. */
function neighbours(item: ManifestItem) {
  const items = [...getItemsForStyle(item.style)].sort((a, b) => a.name.localeCompare(b.name));
  const at = items.findIndex((other) => other.id === item.id);
  return { previous: items[at - 1], next: items[at + 1] };
}

/**
 * The same component or illustration in every style that has one, so styles
 * can be compared without leaving the page. The current style is underlined
 * on the hairline, like the site nav.
 */
export function StyleSwitcher({ item }: { item: ManifestItem }) {
  const versions = getItemsForSubject(item.kind, item.slug);
  if (versions.length < 2) return null;
  return (
    <nav
      aria-label={`${item.name} in each style`}
      className="flex overflow-x-auto shadow-[inset_0_-1px_0_var(--line)] [scrollbar-width:none]"
    >
      {versions.map((version) => (
        <Link
          key={version.id}
          href={href(version)}
          aria-current={version.id === item.id ? "page" : undefined}
          className="flex h-10 shrink-0 items-center border-b-2 border-transparent px-3 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent aria-[current=page]:border-accent aria-[current=page]:text-fg"
        >
          {getStyle(version.style)?.name ?? version.style}
        </Link>
      ))}
    </nav>
  );
}

const arrow =
  "inline-flex size-8 items-center justify-center rounded-md border border-line bg-card text-muted";

/** Compact previous and next links for the page header. */
export function PagerArrows({ item }: { item: ManifestItem }) {
  const { previous, next } = neighbours(item);
  return (
    <>
      {(
        [
          ["Previous", previous, ArrowLeftIcon],
          ["Next", next, ArrowRightIcon],
        ] as const
      ).map(([label, target, Icon]) =>
        target ? (
          <Link
            key={label}
            href={href(target)}
            aria-label={`${label}: ${target.name}`}
            title={`${label}: ${target.name}`}
            className={cn(
              arrow,
              "transition-colors hover:bg-subtle hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            <Icon className="size-4" />
          </Link>
        ) : (
          // Kept in place, faded, so the other arrow never jumps.
          <span key={label} aria-hidden="true" className={cn(arrow, "opacity-40")}>
            <Icon className="size-4" />
          </span>
        ),
      )}
    </>
  );
}

const card =
  "flex min-w-0 flex-col gap-1 rounded-xl border border-line bg-card px-4 py-3 transition-colors hover:border-fg/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Named previous and next links at the foot of the page. */
export function Pager({ item, label }: { item: ManifestItem; label: string }) {
  const { previous, next } = neighbours(item);
  if (!previous && !next) return null;
  return (
    <nav aria-label={label} className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {previous && (
        <Link href={href(previous)} className={card}>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <ArrowLeftIcon className="size-3.5" />
            Previous
          </span>
          <span className="truncate font-medium">{previous.name}</span>
        </Link>
      )}
      {next && (
        <Link href={href(next)} className={cn(card, "items-end text-right sm:col-start-2")}>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            Next
            <ArrowRightIcon className="size-3.5" />
          </span>
          <span className="max-w-full truncate font-medium">{next.name}</span>
        </Link>
      )}
    </nav>
  );
}
