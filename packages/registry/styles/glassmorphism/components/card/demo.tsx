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
            className="rounded-gl-sm text-gl-muted hover:text-gl-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent"
          >
            View details
          </a>
        }
      >
        <p className="text-2xl font-semibold tracking-tight tabular-nums">18,240</p>
        <p className="mt-0.5 text-[13px] text-gl-muted">of 25,000 requests</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gl-line">
          <div className="h-full w-[73%] rounded-full bg-gl-accent" />
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
          <span className="flex items-center gap-2 text-gl-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gl-accent" />
            Enabled on 4 projects
          </span>
        }
      />
    </div>
  );
}
