"use client";

import { useState } from "react";
import { Sheet, SheetPanel } from "./sheet";

const button =
  "inline-flex h-8 items-center justify-center rounded-gm px-3.5 font-gm-display text-sm font-semibold transition-[background-color,translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-1 active:shadow-none";

const key = "border-2 border-gm-line bg-gm-surface text-gm-fg shadow-gm hover:bg-gm-subtle";
const primary = "bg-gm-primary text-gm-on-primary shadow-gm-primary hover:bg-gm-primary-hover";

const details = [
  ["Status", "Ready"],
  ["Branch", "main"],
  ["Commit", "a29887f · Fix invoice totals"],
];

function Details() {
  return (
    <dl className="divide-y-2 divide-gm-line">
      {details.map(([term, value]) => (
        <div key={term} className="flex items-center justify-between gap-4 py-1.5">
          <dt className="text-gm-muted">{term}</dt>
          <dd className="truncate text-right font-semibold">
            {term === "Status" ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2 rounded-full bg-gm-success" />
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
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${key}`}>
        Close
      </button>
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${primary}`}>
        Redeploy
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-2.5 font-gm">
      {/* How the sheet looks over a page; the button below opens the real modal. */}
      <div className="relative h-[284px] w-[520px] max-w-full overflow-hidden rounded-gm-lg border-2 border-gm-line bg-gm-bg">
        <div aria-hidden="true" className="flex flex-col gap-3 p-5">
          <div className="font-gm-display text-[17px] leading-6 font-semibold text-gm-fg">
            Deployments
          </div>
          {["acme-web", "acme-docs", "acme-api", "acme-admin"].map((name) => (
            <div
              key={name}
              className="flex h-11 items-center rounded-gm border-2 border-gm-line bg-gm-surface px-3.5 text-sm font-semibold text-gm-fg"
            >
              {name}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gm-overlay" />
        <div className="absolute inset-y-0 right-0 w-[400px] max-w-[85%]">
          <SheetPanel {...content} actions={actions} onClose={() => setOpen(false)}>
            <Details />
          </SheetPanel>
        </div>
      </div>
      <button type="button" onClick={() => setOpen(true)} className={`${button} ${primary}`}>
        Open the sheet
      </button>
      <Sheet open={open} onOpenChange={setOpen} {...content} actions={actions}>
        <Details />
      </Sheet>
    </div>
  );
}
