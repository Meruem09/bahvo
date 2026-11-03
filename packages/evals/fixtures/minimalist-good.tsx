// Fixture: an on-style Minimalist answer for the "switch" task.
import { type InputHTMLAttributes, useId } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Switch({ label, id, className, ...props }: SwitchProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label
      htmlFor={inputId}
      className={["inline-flex items-center gap-2.5 font-mn text-sm text-mn-fg", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input id={inputId} type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="relative h-5 w-9 rounded-full border border-mn-line-strong bg-mn-subtle transition-colors peer-checked:border-mn-fg peer-checked:bg-mn-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mn-accent peer-disabled:opacity-45 after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:rounded-full after:bg-mn-surface after:shadow-mn-sm after:transition-[left] peer-checked:after:left-[18px]"
      />
      {label}
    </label>
  );
}

export default function SwitchDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch label="Email notifications" defaultChecked />
      <Switch label="Weekly digest" />
      <Switch label="Beta features" disabled />
    </div>
  );
}
