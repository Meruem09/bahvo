import { cn } from "@bahvo/ui/cn";
import type { ReactNode } from "react";
import { CommandField, PackageManagerSwitch } from "./command-field";

export interface InstallStep {
  title: string;
  description: ReactNode;
  command: string;
}

/** Install commands side by side, under a header that picks the package manager. */
export function InstallPanel({
  id,
  title,
  steps,
}: {
  id: string;
  title: string;
  steps: InstallStep[];
}) {
  if (steps.length === 0) return null;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rounded-xl border border-line bg-card"
    >
      <div className="flex h-10 items-center justify-between gap-3 border-b border-line pr-[5px] pl-4">
        <h2 id={`${id}-title`} className="text-[13px] font-medium">
          {title}
        </h2>
        <PackageManagerSwitch />
      </div>
      <div
        className={cn(
          "grid divide-line",
          steps.length > 1 && "sm:grid-cols-2 sm:divide-x max-sm:divide-y",
        )}
      >
        {steps.map((step) => (
          <div key={step.command} className="flex min-w-0 flex-col gap-3 p-4">
            <div className="flex-1 space-y-0.5">
              <h3 className="text-sm font-medium">{step.title}</h3>
              <p className="text-[13px] text-muted text-pretty">{step.description}</p>
            </div>
            <CommandField command={step.command} />
          </div>
        ))}
      </div>
    </section>
  );
}
