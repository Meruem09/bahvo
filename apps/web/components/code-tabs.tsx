"use client";

import { cn } from "@bahvo/ui/cn";
import { type ReactNode, useState } from "react";
import { CopyButton } from "./copy-button";

export interface CodeTab {
  id: string;
  label: string;
  /** Raw text for the copy button. */
  copy: string;
  /** Pre-rendered panel (highlighted on the server at build time). */
  panel: ReactNode;
}

export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex items-center gap-1 border-b border-line px-2">
        <div
          role="tablist"
          aria-label="Code"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto overflow-y-hidden"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={tab.id === current?.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm whitespace-nowrap transition-colors",
                tab.id === current?.id
                  ? "border-accent text-fg"
                  : "border-transparent text-muted hover:text-fg",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {current && <CopyButton value={current.copy} />}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== current?.id}
          className="max-h-[560px] overflow-auto p-4"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
