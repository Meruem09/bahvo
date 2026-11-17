import { EmptyState } from "./empty-state";

const button =
  "inline-flex h-9 items-center justify-center rounded-gm px-4 font-gm-display text-sm font-semibold transition-[background-color,translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary active:translate-y-1 active:shadow-none";

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
          strokeWidth="2"
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
            className={`${button} bg-gm-primary text-gm-on-primary shadow-gm-primary hover:bg-gm-primary-hover`}
          >
            Deploy now
          </button>
          <a
            href="#docs"
            className={`${button} border-2 border-gm-line bg-gm-surface text-gm-fg shadow-gm hover:bg-gm-subtle`}
          >
            Read the docs
          </a>
        </>
      }
    />
  );
}
