"use client";

import type { SearchEntry } from "@bahvo/registry";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { SearchIcon } from "./icons";

type Searcher = (term: string) => Promise<SearchEntry[]>;

/** The title with the first match of the term underlined in orange. */
function Highlight({ text, term }: { text: string; term: string }) {
  const at = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent text-inherit underline decoration-accent decoration-[1.5px] underline-offset-[3px]">
        {text.slice(at, at + term.length)}
      </mark>
      {text.slice(at + term.length)}
    </>
  );
}

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

const key = "rounded border border-line px-1 font-sans text-[11px]";

/** One glyph per kind, in the same 16px slot as the input's search icon so text lines up. */
const kindIcons: Record<string, ReactNode> = {
  Style: (
    <>
      <path d="M8 2.75 13.25 5.5 8 8.25 2.75 5.5Z" />
      <path d="m2.75 8.25 5.25 2.75 5.25-2.75M2.75 11 8 13.75 13.25 11" />
    </>
  ),
  Component: (
    <>
      <rect x="2.25" y="3.25" width="11.5" height="9.5" rx="1.75" />
      <path d="M2.25 6.25h11.5" />
    </>
  ),
  Illustration: (
    <>
      <rect x="2.25" y="2.75" width="11.5" height="10.5" rx="1.75" />
      <circle cx="6" cy="6.5" r="1.1" />
      <path d="m2.75 12.25 3.5-3.5 2.5 2.5 1.5-1.5 3 3" />
    </>
  ),
  Compare: (
    <>
      <rect x="1.75" y="3.75" width="5.5" height="8.5" rx="1.25" />
      <rect x="8.75" y="3.75" width="5.5" height="8.5" rx="1.25" />
    </>
  ),
};

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
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const id = useId();

  // The index starts loading on first open; later opens reuse it.
  const show = useCallback(() => {
    searcher.current ??= loadSearcher(url);
    dialog.current?.showModal();
    setOpen(true);
  }, [url]);

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
        show();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  useEffect(() => {
    if (!open || !searcher.current) return;
    let current = true;
    searcher.current
      .then((find) => find(term))
      .then((found) => {
        if (!current) return;
        setReady(true);
        setResults(found);
        setActive(0);
      });
    return () => {
      current = false;
    };
  }, [open, term]);

  // A kind label only helps when the results mix kinds.
  const mixed = new Set(results.map((entry) => entry.kind)).size > 1;

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
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className={`hidden sm:inline ${key}`}>{mac ? "⌘K" : "Ctrl K"}</kbd>
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
        <div className="flex items-center gap-2 border-b border-line px-4">
          <SearchIcon className="size-4 shrink-0 text-muted" />
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
              className="flex cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-sm aria-selected:bg-fg/[0.07]"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-fg/60"
              >
                {kindIcons[entry.kind] ?? kindIcons.Component}
              </svg>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-baseline gap-3">
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {entry.scope && (
                      <span className="font-normal text-muted">
                        {entry.scope}
                        <span aria-hidden="true" className="px-1.5 opacity-50">
                          /
                        </span>
                      </span>
                    )}
                    <Highlight text={entry.title} term={term.trim()} />
                  </span>
                  {mixed && <span className="shrink-0 text-xs text-muted">{entry.kind}</span>}
                </span>
                <span className="truncate text-[13px] text-muted">{entry.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
        {open && !ready && <p className="px-4 pb-4 text-sm text-muted">Loading…</p>}
        {open && ready && term.trim() && results.length === 0 && (
          <p className="px-4 pb-6 text-center text-sm text-muted">
            No results for “{term.trim()}”.
          </p>
        )}
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-muted">
          <span>
            <kbd className={key}>↑↓</kbd> to move
          </span>
          <span>
            <kbd className={key}>↵</kbd> to open
          </span>
          <span>
            <kbd className={key}>esc</kbd> to close
          </span>
        </div>
      </dialog>
    </>
  );
}
