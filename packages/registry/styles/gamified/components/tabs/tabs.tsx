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

// Game-menu tabs: the selected one sits on a violet tint over a chunky violet bar; one weight for all, so nothing shifts.
const tab =
  "relative -mb-0.5 h-10 rounded-t-gm px-4 font-gm-display text-[15px] font-semibold text-gm-muted transition-colors hover:bg-gm-subtle hover:text-gm-fg " +
  "aria-selected:bg-gm-primary-soft aria-selected:text-gm-fg " +
  "after:absolute after:inset-x-2 after:bottom-0 after:h-1 after:rounded-full after:bg-gm-primary after:opacity-0 aria-selected:after:opacity-100 " +
  "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-gm-primary " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gm-muted";

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
    <div className={["font-gm", className].filter(Boolean).join(" ")}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b-2 border-gm-line"
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
          className="rounded-gm-sm pt-4 text-sm text-gm-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
