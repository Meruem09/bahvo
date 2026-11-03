import { Button } from "./button";

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
    </svg>
  );
}

export default function ButtonDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Deploy</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="secondary">
          Small
        </Button>
        <Button size="md" icon={<PlusIcon />}>
          New project
        </Button>
        <Button size="lg" variant="secondary">
          Large
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button loading>Saving</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
