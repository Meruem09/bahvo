import { EmptyState } from "./empty-state";

const button =
  "inline-flex h-8 items-center justify-center rounded-gl px-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent active:translate-y-px";

export default function EmptyStateDemo() {
  return (
    <EmptyState
      className="w-[480px] max-w-full"
      title="No deployments yet"
      description="Push a commit to your main branch, and every deployment of acme-web shows up here."
      icon={
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2.75 16.25 6.25v7.5L10 17.25l-6.25-3.5v-7.5Z" />
          <path d="M3.75 6.25 10 9.75l6.25-3.5M10 9.75v7.5" />
        </svg>
      }
      actions={
        <>
          <button
            type="button"
            className={`${button} bg-gl-fg text-gl-inverse shadow-gl hover:bg-gl-fg/85`}
          >
            Deploy now
          </button>
          {/* Inside the frosted slot the secondary stays flat: a hairline outline, no second blur. */}
          <a
            href="#docs"
            className={`${button} border border-gl-line-strong text-gl-fg hover:bg-gl-glass-hover`}
          >
            Read the docs
          </a>
        </>
      }
    />
  );
}
