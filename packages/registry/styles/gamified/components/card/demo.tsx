import { Card } from "./card";

export default function CardDemo() {
  return (
    <div className="grid w-[520px] max-w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <Card
        title="Monthly usage"
        description="Resets on November 30."
        footer={
          <a
            href="#usage"
            className="rounded-gm-sm font-bold text-gm-primary hover:text-gm-primary-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary"
          >
            View details
          </a>
        }
      >
        <p className="font-gm-display text-[28px] leading-none font-semibold tabular-nums">
          18,240
        </p>
        <p className="mt-1.5 text-[13px] text-gm-muted">of 25,000 requests</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gm-subtle">
          <div className="h-full w-[73%] rounded-full bg-gm-success shadow-gm-xp" />
        </div>
      </Card>
      <Card
        interactive
        title={
          <a href="#previews" className="outline-none after:absolute after:inset-0">
            Deploy previews
          </a>
        }
        description="Every pull request gets its own URL, torn down on merge."
        footer={
          <span className="flex items-center gap-2 font-semibold text-gm-muted">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
              <path
                d="M8 1.75 9.9 5.6l4.25.62-3.08 3 .73 4.23L8 11.45l-3.8 2 .73-4.23-3.08-3L6.1 5.6Z"
                className="fill-gm-gold stroke-gm-gold-depth"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
            </svg>
            Enabled on 4 projects
          </span>
        }
      />
    </div>
  );
}
