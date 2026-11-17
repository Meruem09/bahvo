"use client";

import { Toast, ToastViewport, useToasts } from "./toast";

export default function ToastDemo() {
  const { toasts, toast, dismiss } = useToasts();

  return (
    <div className="flex flex-col items-center gap-2 font-fl">
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
        className="mt-2 inline-flex h-8 items-center rounded-full bg-fl-primary px-3.5 text-[13px] font-semibold text-fl-on-primary shadow-fl transition-colors hover:bg-fl-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent active:translate-y-px"
      >
        Show a toast
      </button>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
