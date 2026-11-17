"use client";

import { Toast, ToastViewport, useToasts } from "./toast";

export default function ToastDemo() {
  const { toasts, toast, dismiss } = useToasts();

  return (
    // Wider gaps than a flat style: each toast's ledge needs room below it.
    <div className="flex flex-col items-center gap-3 font-gm">
      {/* How toasts look; the button below sends real ones to the corner. */}
      <Toast loading title="Deploying acme-web" />
      <Toast
        title="Project archived"
        description="acme-legacy is read-only now."
        action={{ label: "Undo", onClick: () => {} }}
        onDismiss={() => {}}
      />
      <Toast
        variant="danger"
        title="Build failed"
        description="Type error in billing/page.tsx."
        onDismiss={() => {}}
      />
      <button
        type="button"
        onClick={() =>
          toast({
            title: "Domain added",
            description: "acme.dev will be live in a few minutes.",
            action: { label: "View", onClick: () => {} },
          })
        }
        className="mt-1 inline-flex h-8 items-center rounded-gm bg-gm-primary px-3.5 font-gm-display text-sm font-semibold text-gm-on-primary shadow-gm-primary transition-[background-color,translate,box-shadow] duration-100 hover:bg-gm-primary-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-1 active:shadow-none"
      >
        Show a toast
      </button>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
