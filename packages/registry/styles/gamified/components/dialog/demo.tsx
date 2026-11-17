"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "./dialog";

const button =
  "inline-flex h-9 items-center justify-center rounded-gm px-4 font-gm-display text-sm font-semibold transition-[background-color,translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-1 active:shadow-none";

const key = "border-2 border-gm-line bg-gm-surface text-gm-fg shadow-gm hover:bg-gm-subtle";

const content = {
  title: "Delete project?",
  description:
    "This removes Acme Web, its 214 deployments and all preview URLs. You can't undo it.",
};

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  const actions = (
    <>
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${key}`}>
        Cancel
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`${button} bg-gm-danger text-gm-on-color shadow-gm-danger hover:bg-gm-danger/90`}
      >
        Delete project
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-5 font-gm">
      {/* How the open dialog looks over a page; the button below opens the real modal. */}
      <div className="relative grid w-[520px] max-w-full place-items-center overflow-hidden rounded-gm-lg border-2 border-gm-line bg-gm-bg px-6 py-6">
        {/* The page behind, as text-free rows, so nothing reads as clipped around the dialog. */}
        <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-3 p-5">
          <div className="h-3 w-24 rounded-full bg-gm-line" />
          {["web", "docs", "api"].map((name) => (
            <div
              key={name}
              className="flex h-11 items-center gap-3 rounded-gm border-2 border-gm-line bg-gm-surface px-3"
            >
              <div className="h-2.5 w-28 rounded-full bg-gm-subtle" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gm-overlay" />
        <div inert className="relative">
          <DialogPanel {...content} actions={actions} onClose={() => setOpen(false)} />
        </div>
      </div>
      <button type="button" onClick={() => setOpen(true)} className={`${button} ${key}`}>
        Open the live dialog
      </button>
      <Dialog open={open} onOpenChange={setOpen} {...content} actions={actions} />
    </div>
  );
}
