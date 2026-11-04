import { EmptyState } from "./empty-state";

const button =
  "inline-flex h-8 items-center justify-center rounded-mn px-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent";

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
          <button type="button" className={`${button} bg-mn-fg text-mn-inverse hover:bg-mn-fg/85`}>
            Deploy now
          </button>
          <a
            href="#docs"
            className={`${button} border border-mn-line bg-mn-surface text-mn-fg shadow-mn-sm hover:border-mn-line-strong hover:bg-mn-subtle`}
          >
            Read the docs
          </a>
        </>
      }
    />
  );
}
