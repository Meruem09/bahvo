"use client";

import { Toast, ToastViewport, useToasts } from "./toast";

export default function ToastDemo() {
  const { toasts, toast, dismiss } = useToasts();

  return (
    <div className="flex flex-col items-center gap-3 font-mn">
      {/* How toasts look; the button below sends real ones to the corner. */}
      <Toast
        loading
        title="Deploying acme-web"
        description="Building on 4 vCPUs. About 40 seconds left."
      />
      <Toast
        title="Project archived"
        description="acme-legacy is read-only now."
        action={{ label: "Undo", onClick: () => {} }}
        onDismiss={() => {}}
      />
      <Toast
        variant="danger"
        title="Build failed"
        description="Type error in app/billing/page.tsx on line 42."
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
        className="mt-3 inline-flex h-8 items-center rounded-mn bg-mn-fg px-3 text-[13px] font-medium text-mn-inverse transition-colors hover:bg-mn-fg/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent"
      >
        Show a toast
      </button>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
