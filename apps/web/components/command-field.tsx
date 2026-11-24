"use client";

import { cn } from "@bahvo/ui/cn";
import {
  packageManagers,
  setPackageManager,
  usePackageManager,
  withRunner,
} from "@/lib/package-manager";
import { CopyButton } from "./copy-button";
import { Segmented } from "./segmented";

/**
 * A shell command and its copy button: the one look for every command on the
 * site. Written for npx; shown and copied with the reader's package manager.
 */
export function CommandField({ command, className }: { command: string; className?: string }) {
  const shown = withRunner(command, usePackageManager());
  return (
    <div
      className={cn(
        "flex h-9 min-w-0 items-center gap-2 rounded-[10px] border border-line bg-subtle py-1 pr-1 pl-3",
        className,
      )}
    >
      <code title={shown} className="min-w-0 flex-1 truncate font-mono text-[13px]">
        {shown}
      </code>
      <CopyButton value={shown} label="Copy command" iconOnly />
    </div>
  );
}

/** Picks the runner every CommandField on the site uses (npx, pnpm dlx, yarn dlx, bunx). */
export function PackageManagerSwitch({ className }: { className?: string }) {
  return (
    <Segmented
      legend="Package manager"
      options={packageManagers}
      value={usePackageManager()}
      onChange={setPackageManager}
      size="sm"
      className={className}
    />
  );
}
