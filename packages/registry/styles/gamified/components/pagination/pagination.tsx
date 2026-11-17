import type { ReactNode } from "react";

export interface PaginationProps {
  /** The current page, from 1. */
  page: number;
  pageCount: number;
  /** Builds a link for each page (links mode). */
  href?: (page: number) => string;
  /** Called with the page instead (buttons mode). */
  onPageChange?: (page: number) => void;
  /** Accessible name for the navigation landmark. */
  label?: string;
  className?: string;
}

type Entry = number | "gap-start" | "gap-end";

/** First, last, the current page and its neighbours; a gap of one page shows the page instead. */
function entries(page: number, count: number): Entry[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - 1, count - 4));
  const end = Math.min(count - 1, Math.max(page + 1, 5));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [
    1,
    ...(start === 3 ? [2] : start > 3 ? (["gap-start"] as const) : []),
    ...middle,
    ...(end === count - 2 ? [count - 1] : end < count - 2 ? (["gap-end"] as const) : []),
    count,
  ];
}

// Pages are small white keys that press down; the current page is a raised violet key.
const control =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-gm border-2 border-gm-line bg-gm-surface px-2 font-gm-display text-sm font-semibold text-gm-fg tabular-nums shadow-gm-sm " +
  "transition-[background-color,color,translate,box-shadow] duration-100 " +
  "hover:bg-gm-subtle active:translate-y-0.5 active:shadow-none " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary " +
  "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none " +
  "aria-[current=page]:border-transparent aria-[current=page]:bg-gm-primary aria-[current=page]:text-gm-on-primary aria-[current=page]:shadow-gm-primary " +
  "aria-[current=page]:hover:bg-gm-primary-hover aria-[current=page]:active:translate-y-1 aria-[current=page]:active:shadow-none";

interface TargetProps extends Pick<PaginationProps, "href" | "onPageChange"> {
  to: number;
  label: string;
  disabled?: boolean;
  current?: boolean;
  className?: string;
  children: ReactNode;
}

/** A link in links mode, a button in buttons mode. */
function Target({
  to,
  label,
  disabled,
  current,
  href,
  onPageChange,
  className,
  children,
}: TargetProps) {
  const classes = [control, className].filter(Boolean).join(" ");
  const shared = {
    "aria-label": label,
    "aria-current": current ? ("page" as const) : undefined,
    className: classes,
  };
  if (href) {
    // An <a> without href isn't focusable, which is what a disabled link should be.
    return disabled ? (
      <span aria-disabled="true" className={classes}>
        {children}
      </span>
    ) : (
      <a href={href(to)} {...shared}>
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPageChange && (() => onPageChange(to))}
      {...shared}
    >
      {children}
    </button>
  );
}

function Chevron({ back }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <path
        d={back ? "M9.5 4.5 6 8l3.5 3.5" : "M6.5 4.5 10 8l-3.5 3.5"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pagination({
  page,
  pageCount,
  href,
  onPageChange,
  label = "Pagination",
  className,
}: PaginationProps) {
  const mode = { href, onPageChange };

  return (
    <nav aria-label={label} className={["font-gm", className].filter(Boolean).join(" ")}>
      <ul className="flex items-center gap-1.5">
        <li>
          <Target
            {...mode}
            to={page - 1}
            disabled={page <= 1}
            label="Previous page"
            className="pr-3"
          >
            <Chevron back />
            Previous
          </Target>
        </li>
        {entries(page, pageCount).map((entry) =>
          typeof entry === "number" ? (
            <li key={entry}>
              <Target {...mode} to={entry} current={entry === page} label={`Page ${entry}`}>
                {entry}
              </Target>
            </li>
          ) : (
            <li
              key={entry}
              aria-hidden="true"
              className="inline-flex size-8 items-center justify-center font-gm-display text-sm font-semibold text-gm-muted"
            >
              …
            </li>
          ),
        )}
        <li>
          <Target
            {...mode}
            to={page + 1}
            disabled={page >= pageCount}
            label="Next page"
            className="pl-3"
          >
            Next
            <Chevron />
          </Target>
        </li>
      </ul>
    </nav>
  );
}
