"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "./dialog";

const button =
  "inline-flex h-8 items-center justify-center rounded-gl px-3 font-gl text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent active:translate-y-px";

// Glass secondary for the trigger on the page; inside the frosted panel it stays plain (no second blur).
const glass =
  "border border-gl-edge bg-gl-glass text-gl-fg shadow-gl backdrop-blur-gl backdrop-saturate-150 hover:bg-gl-glass-hover";
const plain = "border border-gl-line-strong text-gl-fg hover:bg-gl-glass-hover";

const content = {
  title: "Delete project?",
  description:
    "This removes Acme Web, its 214 deployments and all preview URLs. You can't undo it.",
};

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  const actions = (
    <>
      <button type="button" onClick={() => setOpen(false)} className={`${button} ${plain}`}>
        Cancel
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`${button} bg-gl-danger text-gl-inverse shadow-gl hover:bg-gl-danger/90`}
      >
        Delete project
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-5 font-gl">
      {/* How the open dialog looks over a page; the button below opens the real modal. */}
      <div
        className="relative grid w-[520px] max-w-full place-items-center overflow-hidden rounded-gl-lg border border-gl-edge px-6 py-10"
        style={{ background: "var(--gl-stage)" }}
      >
        {/* The page behind, as text-free rows, so nothing reads as clipped around the dialog. */}
        <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-3 p-6">
          <div className="h-3 w-24 rounded-full bg-gl-line" />
          {["web", "docs", "api"].map((name) => (
            <div
              key={name}
              className="flex h-12 items-center gap-3 rounded-gl border border-gl-edge bg-gl-glass-hover px-3.5"
            >
              <div className="h-2.5 w-28 rounded-full bg-gl-line" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gl-overlay" />
        <div inert className="relative">
          <DialogPanel {...content} actions={actions} onClose={() => setOpen(false)} />
        </div>
      </div>
      <button type="button" onClick={() => setOpen(true)} className={`${button} ${glass}`}>
        Open the live dialog
      </button>
      <Dialog open={open} onOpenChange={setOpen} {...content} actions={actions} />
    </div>
  );
}
