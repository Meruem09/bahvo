"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "./dialog";

const button =
  "inline-flex h-8 items-center justify-center rounded-mn px-3 font-mn text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent";

const content = {
  title: "Delete project?",
  description:
    "This removes Acme Web, its 214 deployments and all preview URLs. You can't undo it.",
};

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  const actions = (
    <>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`${button} border border-mn-line bg-mn-surface text-mn-fg hover:bg-mn-subtle`}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`${button} bg-mn-danger text-mn-inverse hover:bg-mn-danger/90`}
      >
        Delete project
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-5 font-mn">
      {/* How the open dialog looks over a page; the button below opens the real modal. */}
      <div className="relative grid w-[520px] max-w-full place-items-center overflow-hidden rounded-mn-lg border border-mn-line bg-mn-bg px-6 py-10">
        {/* The page behind, as text-free rows, so nothing reads as clipped around the dialog. */}
        <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-3 p-5">
          <div className="h-3 w-24 rounded-full bg-mn-line" />
          {["web", "docs", "api"].map((name) => (
            <div
              key={name}
              className="flex h-11 items-center gap-3 rounded-mn border border-mn-line bg-mn-surface px-3"
            >
              <div className="h-2.5 w-28 rounded-full bg-mn-subtle" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-mn-fg/10" />
        <div inert className="relative">
          <DialogPanel {...content} actions={actions} onClose={() => setOpen(false)} />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${button} border border-mn-line bg-mn-surface text-mn-fg hover:bg-mn-subtle`}
      >
        Open the live dialog
      </button>
      <Dialog open={open} onOpenChange={setOpen} {...content} actions={actions} />
    </div>
  );
}
