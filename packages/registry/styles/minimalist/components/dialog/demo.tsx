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
    <div className="flex flex-col items-center gap-6">
      {/* How the panel looks; the button below opens the real modal. */}
      <DialogPanel {...content} actions={actions} onClose={() => setOpen(false)} />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${button} bg-mn-fg text-mn-inverse hover:bg-mn-fg/85`}
      >
        Open the dialog
      </button>
      <Dialog open={open} onOpenChange={setOpen} {...content} actions={actions} />
    </div>
  );
}
