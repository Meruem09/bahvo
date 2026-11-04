"use client";

import { useState } from "react";
import { Sheet, SheetPanel } from "./sheet";

const button =
  "inline-flex h-8 items-center justify-center rounded-mn px-3 font-mn text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent";

const details = [
  ["Status", "Ready"],
  ["Branch", "main"],
  ["Commit", "a29887f · Fix invoice totals"],
  ["Duration", "48s"],
  ["Created", "Today at 09:42"],
];

function Details() {
  return (
    <dl className="divide-y divide-mn-line">
      {details.map(([term, value]) => (
        <div key={term} className="flex items-center justify-between gap-4 py-2">
          <dt className="text-mn-muted">{term}</dt>
          <dd className="truncate text-right">
            {term === "Status" ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-mn-fg" />
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
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`${button} border border-mn-line bg-mn-surface text-mn-fg hover:bg-mn-subtle`}
      >
        Close
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`${button} bg-mn-fg text-mn-inverse hover:bg-mn-fg/85`}
      >
        Redeploy
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-5 font-mn">
      {/* How the sheet looks over a page; the button below opens the real modal. */}
      <div className="relative h-[360px] w-[640px] max-w-full overflow-hidden rounded-mn-lg border border-mn-line bg-mn-bg">
        <div aria-hidden="true" className="flex flex-col gap-3 p-5">
          <div className="text-[15px] font-semibold tracking-tight text-mn-fg">Deployments</div>
          {["acme-web", "acme-docs", "acme-api", "acme-admin"].map((name) => (
            <div
              key={name}
              className="flex h-11 items-center rounded-mn border border-mn-line bg-mn-surface px-3 text-sm text-mn-fg"
            >
              {name}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-mn-overlay" />
        <div className="absolute inset-y-0 right-0 w-[400px] max-w-[85%]">
          <SheetPanel {...content} actions={actions} onClose={() => setOpen(false)}>
            <Details />
          </SheetPanel>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${button} bg-mn-fg text-mn-inverse hover:bg-mn-fg/85`}
      >
        Open the sheet
      </button>
      <Sheet open={open} onOpenChange={setOpen} {...content} actions={actions}>
        <Details />
      </Sheet>
    </div>
  );
}
