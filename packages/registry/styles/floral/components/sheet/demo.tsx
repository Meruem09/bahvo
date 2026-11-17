"use client";

import { useState } from "react";
import { Sheet, SheetPanel } from "./sheet";

const button =
  "inline-flex h-8 items-center justify-center rounded-full px-3.5 font-fl text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent active:translate-y-px";

const paper = "border border-fl-line-strong bg-fl-surface text-fl-fg hover:bg-fl-subtle";
const moss = "bg-fl-primary text-fl-on-primary shadow-fl hover:bg-fl-primary-hover";

const details = [
  ["Status", "Ready"],
  ["Branch", "main"],
  ["Commit", "a29887f · Fix invoice totals"],
];

// Rows are a touch tighter than Minimalist's so the taller Fraunces header still fits the 280px preview.
function Details() {
  return (
    <dl className="divide-y divide-fl-line">
      {details.map(([term, value]) => (
        <div key={term} className="flex items-center justify-between gap-4 py-1.5">
          <dt className="text-fl-muted">{term}</dt>
          <dd className="truncate text-right">
            {term === "Status" ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-fl-fg" />
                {value}
              </span>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const content = {
  title: "acme-web",
  description: "Deployment dpl_8sK2 on acme.dev",
};

export default function SheetDemo() {
  const [open, setOpen] = useState(false);
  const actions = (
    <>
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${paper}`}>
        Close
      </button>
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${moss}`}>
        Redeploy
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-4 font-fl">
      {/* How the sheet looks over a page; the button below opens the real modal. */}
      <div className="relative h-[280px] w-[520px] max-w-full overflow-hidden rounded-fl-lg border border-fl-line bg-fl-bg">
        <div aria-hidden="true" className="flex flex-col gap-3 p-5">
          <div className="font-fl-display text-[15px] leading-snug font-semibold text-fl-fg">
            Deployments
          </div>
          {["acme-web", "acme-docs", "acme-api", "acme-admin"].map((name) => (
            <div
              key={name}
              className="flex h-11 items-center rounded-fl border border-fl-line bg-fl-surface px-3.5 text-sm text-fl-fg"
            >
              {name}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-fl-overlay" />
        <div className="absolute inset-y-0 right-0 w-[400px] max-w-[85%]">
          <SheetPanel {...content} actions={actions} onClose={() => setOpen(false)}>
            <Details />
          </SheetPanel>
        </div>
      </div>
      <button type="button" onClick={() => setOpen(true)} className={`${button} ${moss}`}>
        Open the sheet
      </button>
      <Sheet open={open} onOpenChange={setOpen} {...content} actions={actions}>
        <Details />
      </Sheet>
    </div>
  );
}
