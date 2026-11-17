import { Alert } from "./alert";

const action =
  "inline-flex h-8 items-center rounded-gl border border-gl-edge bg-gl-glass px-3 text-[13px] font-medium text-gl-fg shadow-gl backdrop-blur-gl backdrop-saturate-150 transition-colors hover:bg-gl-glass-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent";

export default function AlertDemo() {
  return (
    <div className="flex w-[440px] max-w-full flex-col gap-3">
      <Alert title="Your trial ends in 5 days">
        Add a payment method to keep your projects running.
      </Alert>
      <Alert
        tone="accent"
        title="A new version is ready"
        action={
          <button type="button" className={action}>
            Update
          </button>
        }
      >
        Restart to apply 3 updates.
      </Alert>
      <Alert tone="danger" title="Deploy failed">
        Build exited with code 1 on step 4 of 6.
      </Alert>
    </div>
  );
}
