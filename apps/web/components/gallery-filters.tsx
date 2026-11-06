"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export interface Facet {
  key: string;
  label: string;
  options: { value: string; count: number }[];
}

export interface FilterRow {
  facets: Record<string, string>;
  /** Lowercased name, description and tags: what the filter box matches. */
  text: string;
}

interface FilterBarProps {
  label: string;
  facets: Facet[];
  total: number;
  shown?: number;
  values?: Record<string, string>;
  onChange?: (key: string, value: string) => void;
}

const title = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).replaceAll("-", " ");
/** The query lands inside a quoted CSS attribute selector. */
const cssString = (text: string) => text.replace(/[\\"]/g, "\\$&").replace(/[\n\r\f]/g, " ");

const pill =
  "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs whitespace-nowrap transition-colors " +
  "border-line text-muted hover:border-fg/25 hover:text-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none";

/** The bar itself: text filter, facet pills and the count. Inert until the URL is read. */
export function FilterBar({
  label,
  facets,
  total,
  shown = total,
  values = {},
  onChange,
}: FilterBarProps) {
  const inert = !onChange;
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full lg:w-64">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        >
          <circle cx="7" cy="7" r="4.25" />
          <path d="m10.25 10.25 3 3" />
        </svg>
        <input
          type="search"
          aria-label={`Filter ${label}`}
          placeholder={`Filter ${label}`}
          value={values.q ?? ""}
          disabled={inert}
          onChange={(event) => onChange?.("q", event.target.value)}
          className="h-9 w-full rounded-lg border border-line bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20"
        />
      </div>
      {facets
        .filter((facet) => facet.options.length > 1)
        .map((facet) => (
          <fieldset key={facet.key} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5">
            <legend className="sr-only">{facet.label}</legend>
            <button
              type="button"
              aria-pressed={!values[facet.key]}
              disabled={inert}
              onClick={() => onChange?.(facet.key, "")}
              className={pill}
            >
              All
            </button>
            {facet.options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={values[facet.key] === option.value}
                disabled={inert}
                onClick={() =>
                  onChange?.(facet.key, values[facet.key] === option.value ? "" : option.value)
                }
                className={pill}
              >
                {title(option.value)}
                <span className="tabular-nums opacity-60">{option.count}</span>
              </button>
            ))}
          </fieldset>
        ))}
      <p aria-live="polite" className="shrink-0 text-xs text-muted tabular-nums lg:ml-auto">
        {shown === total ? `${total} ${label}` : `${shown} of ${total} ${label}`}
      </p>
    </div>
  );
}

const parser = parseAsString.withDefault("");

function Filters({
  gallery,
  label,
  facets,
  rows,
}: {
  gallery: string;
  label: string;
  facets: Facet[];
  rows: FilterRow[];
}) {
  const [values, setValues] = useQueryStates(
    Object.fromEntries([...facets.map((f) => f.key), "q"].map((key) => [key, parser])),
    { history: "replace" },
  );
  const query = (values.q ?? "").trim().toLowerCase();
  const active = facets.filter((f) => values[f.key]);
  const shown = rows.filter(
    (row) =>
      active.every((f) => row.facets[f.key] === values[f.key]) &&
      (!query || row.text.includes(query)),
  ).length;

  // One rule per active filter hides the cards that don't match; the grid never re-renders.
  const scope = `[data-gallery="${gallery}"]>`;
  const rules = [
    ...active.map(
      (f) => `${scope}:not([data-${f.key}="${cssString(values[f.key] ?? "")}"]){display:none}`,
    ),
    ...(query ? [`${scope}:not([data-text*="${cssString(query)}"]){display:none}`] : []),
  ].join("");

  return (
    <>
      {rules && <style>{rules}</style>}
      <FilterBar
        label={label}
        facets={facets}
        total={rows.length}
        shown={shown}
        values={values}
        onChange={(key, value) => setValues({ [key]: value || null })}
      />
      {shown === 0 && (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          Nothing matches.{" "}
          <button
            type="button"
            onClick={() =>
              setValues(Object.fromEntries(Object.keys(values).map((key) => [key, null])))
            }
            className="font-medium text-fg underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

/** Filters kept in the URL (shareable, back-button friendly), applied with CSS. */
export function GalleryFilters(props: {
  gallery: string;
  label: string;
  facets: Facet[];
  rows: FilterRow[];
}) {
  return (
    <NuqsAdapter>
      <Filters {...props} />
    </NuqsAdapter>
  );
}
