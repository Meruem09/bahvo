"use client";

import { useState } from "react";
import { Sheet, SheetPanel } from "./sheet";

const button =
  "inline-flex h-8 items-center justify-center rounded-gl px-3 font-gl text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent active:translate-y-px";

// Primary is smoked near-black; inside the frosted panel the secondary stays plain (no second blur).
const primary = "bg-gl-fg text-gl-inverse shadow-gl hover:bg-gl-fg/85";
const plain = "border border-gl-line-strong text-gl-fg hover:bg-gl-glass-hover";

const details = [
  ["Status", "Ready"],
  ["Branch", "main"],
  ["Commit", "a29887f · Fix invoice totals"],
];

function Details() {
  return (
    <dl className="divide-y divide-gl-line">
      {details.map(([term, value]) => (
        <div key={term} className="flex items-center justify-between gap-4 py-1.5">
          <dt className="text-gl-muted">{term}</dt>
          <dd className="truncate text-right">
            {term === "Status" ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-gl-fg" />
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
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${plain}`}>
        Close
      </button>
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${primary}`}>
        Redeploy
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-4 font-gl">
      {/* How the sheet looks over a page; the button below opens the real modal. */}
      <div
        className="relative h-[280px] w-[520px] max-w-full overflow-hidden rounded-gl-lg border border-gl-edge"
        style={{ background: "var(--gl-stage)" }}
      >
        <div aria-hidden="true" className="flex flex-col gap-3 p-5">
          <div className="text-[15px] font-semibold tracking-tight text-gl-fg">Deployments</div>
          {["acme-web", "acme-docs", "acme-api", "acme-admin"].map((name) => (
            <div
              key={name}
              className="flex h-11 items-center rounded-gl border border-gl-edge bg-gl-glass-hover px-3.5 text-sm text-gl-fg"
            >
              {name}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gl-overlay" />
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
