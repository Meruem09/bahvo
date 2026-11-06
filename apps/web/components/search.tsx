"use client";

import type { SearchEntry } from "@bahvo/registry";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

type Searcher = (term: string) => Promise<SearchEntry[]>;

const LABELS: Record<SearchEntry["type"], string> = {
  style: "Style",
  component: "Component",
  illustration: "Illustration",
  item: "",
};

/** Orama and the index load on first open, so pages never pay for search up front. */
async function loadSearcher(url: string): Promise<Searcher> {
  const [{ create, insertMultiple, search }, entries] = await Promise.all([
    import("@orama/orama"),
    fetch(url).then((res) => res.json() as Promise<SearchEntry[]>),
  ]);
  const db = create({
    schema: {
      id: "string",
      type: "string",
      title: "string",
      subtitle: "string",
      keywords: "string",
      href: "string",
    } as const,
  });
  await insertMultiple(db, entries);
  const styles = entries.filter((entry) => entry.type === "style");
  return async (term) => {
    if (!term.trim()) return styles;
    const results = await search(db, {
      term,
      properties: ["title", "keywords", "subtitle"],
      boost: { title: 3, keywords: 1.5 },
      tolerance: term.length > 3 ? 1 : 0,
      limit: 12,
    });
    return results.hits.map((hit) => hit.document as SearchEntry);
  };
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function Search({ url }: { url: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const searcher = useRef<Promise<Searcher> | null>(null);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [active, setActive] = useState(0);
  const [mac, setMac] = useState(true);
  const router = useRouter();
  const id = useId();

  function show() {
    searcher.current ??= loadSearcher(url);
    dialog.current?.showModal();
    setOpen(true);
  }

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    dialog.current?.close();
    router.push(entry.href as Parameters<typeof router.push>[0]);
  }

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    function onKey(event: globalThis.KeyboardEvent) {
      const shortcut = event.key === "k" && (event.metaKey || event.ctrlKey);
      if (shortcut || (event.key === "/" && !isTyping(event.target))) {
        event.preventDefault();
        searcher.current ??= loadSearcher(url);
        dialog.current?.showModal();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [url]);

  useEffect(() => {
    if (!open || !searcher.current) return;
    let current = true;
    searcher.current
      .then((find) => find(term))
      .then((found) => {
        if (!current) return;
        setResults(found);
        setActive(0);
      });
    return () => {
      current = false;
    };
  }, [open, term]);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (results.length ? (i + step + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="ml-auto inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-line bg-card px-2.5 text-muted transition-colors hover:border-fg/25 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <circle cx="7" cy="7" r="4.25" />
          <path d="m10.25 10.25 3 3" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-line px-1 font-sans text-[11px] sm:inline">
          {mac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape already closes a native modal dialog; the click only adds backdrop dismissal. */}
      <dialog
        ref={dialog}
        aria-label="Search"
        onClose={() => {
          setOpen(false);
          setTerm("");
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="mx-auto mt-[12vh] w-[min(560px,calc(100%-2rem))] overflow-hidden rounded-xl border border-line bg-card p-0 text-fg shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-2 border-b border-line px-3">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-4 shrink-0 text-muted"
          >
            <circle cx="7" cy="7" r="4.25" />
            <path d="m10.25 10.25 3 3" />
          </svg>
          <input
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={`${id}-results`}
            aria-activedescendant={results[active] ? `${id}-${active}` : undefined}
            aria-label="Search styles, components and illustrations"
            placeholder="Search styles, components and illustrations"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={onKeyDown}
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div
          id={`${id}-results`}
          role="listbox"
          aria-label="Results"
          className="max-h-[50vh] overflow-y-auto p-1.5"
        >
          {results.map((entry, i) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: the combobox input handles the keyboard (arrows and Enter).
            <div
              key={entry.id}
              id={`${id}-${i}`}
              role="option"
              tabIndex={-1}
              aria-selected={i === active}
              onClick={() => go(entry)}
              onMouseMove={() => setActive(i)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-subtle"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{entry.title}</span>
                <span className="block truncate text-xs text-muted">{entry.subtitle}</span>
              </span>
              {LABELS[entry.type] && (
                <span className="shrink-0 text-xs text-muted">{LABELS[entry.type]}</span>
              )}
            </div>
          ))}
        </div>
        {open && term.trim() && results.length === 0 && (
          <p className="px-3 pb-6 text-center text-sm text-muted">
            No results for “{term.trim()}”.
          </p>
        )}
      </dialog>
    </>
  );
}
