import { type ReactNode, Suspense } from "react";
import { type Facet, FilterBar, GalleryFilters } from "./gallery-filters";

export interface GalleryEntry {
  key: string;
  /** Facet values, e.g. { category: "forms" }. */
  facets: Record<string, string>;
  /** What the filter box matches: name, description, tags. */
  text: string;
  card: ReactNode;
}

/**
 * A server-rendered grid with filters kept in the URL. Cards render once,
 * here, tagged with data attributes; the client only reads the URL and writes
 * one CSS rule that hides what doesn't match. Filtering never re-renders the
 * grid or ships the cards as JavaScript, so it scales to thousands of items.
 */
export function Gallery({
  id,
  label,
  facets,
  entries,
}: {
  id: string;
  /** Plural noun for the count and the filter box, e.g. "components". */
  label: string;
  facets: { key: string; label: string }[];
  entries: GalleryEntry[];
}) {
  const options: Facet[] = facets.map((facet) => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const value = entry.facets[facet.key];
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return {
      ...facet,
      options: [...counts]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([value, count]) => ({ value, count })),
    };
  });
  const rows = entries.map((entry) => ({ facets: entry.facets, text: entry.text.toLowerCase() }));

  return (
    <div className="space-y-5">
      {/* Reading the URL is client-only: the static page shows the bar inert, then it wakes up. */}
      <Suspense fallback={<FilterBar label={label} facets={options} total={entries.length} />}>
        <GalleryFilters gallery={id} label={label} facets={options} rows={rows} />
      </Suspense>
      <div data-gallery={id} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <div
            key={entry.key}
            {...Object.fromEntries(Object.entries(entry.facets).map(([k, v]) => [`data-${k}`, v]))}
            data-text={rows[i]?.text}
          >
            {entry.card}
          </div>
        ))}
      </div>
    </div>
  );
}
