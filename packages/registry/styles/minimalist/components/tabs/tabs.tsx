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

const tab =
  "relative -mb-px h-9 rounded-t-mn-sm px-3 text-sm text-mn-muted transition-colors hover:text-mn-fg " +
  "aria-selected:font-medium aria-selected:text-mn-fg " +
  "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-mn-accent after:opacity-0 aria-selected:after:opacity-100 " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mn-accent " +
  "disabled:cursor-not-allowed disabled:opacity-45";

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
    <div className={["font-mn", className].filter(Boolean).join(" ")}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b border-mn-line"
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
          className="rounded-mn-sm pt-4 text-sm text-mn-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
