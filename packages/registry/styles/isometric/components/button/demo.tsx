import { Button } from "./button";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

export default function ButtonDemo() {
  return (
    <div className="flex flex-col items-start gap-8">
      <div className="flex flex-wrap items-center gap-6">
        <Button>Deploy</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Button size="sm">Small</Button>
        <Button size="md" icon={<ArrowIcon />}>
          Continue
        </Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Button loading>Saving</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
