"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  /** Accessible name for the tab list. */
  label?: string;
  className?: string;
}

// The selected tab is a small frosted pane on the hairline (rim, highlight, blur), underlined in orange.
const tab =
  "relative -mb-px h-10 rounded-t-gl border border-b-0 border-transparent px-3.5 text-sm text-gl-muted transition-colors " +
  "hover:bg-gl-glass-hover hover:text-gl-fg " +
  "aria-selected:border-gl-edge aria-selected:bg-gl-glass-strong aria-selected:font-medium aria-selected:text-gl-fg " +
  "aria-selected:shadow-gl aria-selected:backdrop-blur-gl aria-selected:backdrop-saturate-150 " +
  "after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-gl-accent after:opacity-0 aria-selected:after:opacity-100 " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gl-accent " +
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-gl-muted";

export function Tabs({ tabs, defaultValue, label, className }: TabsProps) {
  const [selected, setSelected] = useState(defaultValue ?? tabs.find((item) => !item.disabled)?.id);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const item = tabs[index];
    if (!item) return;
    setSelected(item.id);
    refs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabled = tabs.flatMap((item, i) => (item.disabled ? [] : [i]));
    const current = enabled.indexOf(tabs.findIndex((item) => item.id === selected));
    const last = enabled.length - 1;
    const next = {
      ArrowRight: enabled[current === last ? 0 : current + 1],
      ArrowLeft: enabled[current <= 0 ? last : current - 1],
      Home: enabled[0],
      End: enabled[last],
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    focusTab(next);
  }

  return (
    <div className={["font-gl", className].filter(Boolean).join(" ")}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b border-gl-line"
      >
        {tabs.map((item, i) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${base}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => setSelected(item.id)}
              className={tab}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {tabs.map((item) => (
        <div
          key={item.id}
          id={`${base}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== selected}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tabs pattern: a focusable panel lets keyboard users reach content without its own focusable elements.
          tabIndex={0}
          className="rounded-gl-sm pt-4 text-sm text-gl-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
