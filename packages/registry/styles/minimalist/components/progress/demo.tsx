import { Progress } from "./progress";

export default function ProgressDemo() {
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-6">
      <Progress label="Uploading assets" value={64} />
      <Progress label="Storage used" value={92} />
      <Progress label="Preparing build" />
    </div>
  );
}
