"use client";

import { cn } from "@bahvo/ui/cn";
import { type KeyboardEvent, type ReactNode, useId, useState } from "react";
import { CopyButton } from "./copy-button";

export interface CodeTab {
  id: string;
  label: string;
  /** Raw text for the copy button. */
  copy: string;
  /** Pre-rendered panel (highlighted on the server at build time). */
  panel: ReactNode;
}

const moves: Record<string, (at: number, count: number) => number> = {
  ArrowRight: (at, count) => (at + 1) % count,
  ArrowLeft: (at, count) => (at - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

/**
 * Code files as tabs, following the WAI-ARIA tabs pattern: one tab stop,
 * arrow keys (and Home/End) move between tabs and show them.
 */
export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];
  const base = useId();
  const tabId = (tab: CodeTab) => `${base}-tab-${tab.id}`;
  const panelId = (tab: CodeTab) => `${base}-panel-${tab.id}`;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const move = moves[event.key];
    if (!move || !current) return;
    event.preventDefault();
    const next = tabs[move(tabs.indexOf(current), tabs.length)];
    if (!next) return;
    setActive(next.id);
    document.getElementById(tabId(next))?.focus();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex h-11 items-center gap-1 border-b border-line pr-2 pl-1">
        <div
          role="tablist"
          aria-label="Code"
          onKeyDown={onKeyDown}
          className="flex min-w-0 flex-1 gap-1 self-stretch overflow-x-auto overflow-y-hidden"
        >
          {tabs.map((tab) => {
            const selected = tab.id === current?.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={tabId(tab)}
                aria-selected={selected}
                aria-controls={panelId(tab)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex h-11 shrink-0 items-center border-b-2 px-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent",
                  selected
                    ? "border-accent text-fg"
                    : "border-transparent text-muted hover:text-fg",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {current && <CopyButton value={current.copy} />}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab)}
          aria-labelledby={tabId(tab)}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the WAI-ARIA tabs pattern makes a panel focusable when its content isn't; this one also scrolls, so keyboard users need it to read long files.
          tabIndex={0}
          hidden={tab.id !== current?.id}
          className="max-h-[560px] overflow-auto p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
