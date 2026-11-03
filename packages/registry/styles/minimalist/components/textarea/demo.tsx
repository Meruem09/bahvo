import { Textarea } from "./textarea";

export default function TextareaDemo() {
  return (
    <div className="grid w-[560px] max-w-full grid-cols-1 gap-5 sm:grid-cols-2">
      <Textarea
        id="demo-bio"
        label="Bio"
        placeholder="A sentence or two about you"
        hint="Shown on your public profile."
        maxLength={160}
        defaultValue="Designer working on developer tools."
      />
      <Textarea
        id="demo-notes"
        label="Release notes"
        defaultValue="Fixed"
        error="Describe at least one change."
      />
    </div>
  );
}
