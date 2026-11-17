import { Alert } from "./alert";

const action =
  "inline-flex h-8 items-center rounded-gm border-2 border-gm-line bg-gm-surface px-3.5 font-gm-display text-sm font-semibold text-gm-fg shadow-gm transition-[background-color,translate,box-shadow] duration-100 hover:bg-gm-subtle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-1 active:shadow-none";

export default function AlertDemo() {
  return (
    <div className="flex w-[440px] max-w-full flex-col gap-4">
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
