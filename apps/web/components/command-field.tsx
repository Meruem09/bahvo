import { cn } from "@bahvo/ui/cn";
import { CopyButton } from "./copy-button";

/** A shell command and its copy button: the one look for every command on the site. */
export function CommandField({ command, className }: { command: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 min-w-0 items-center gap-2 rounded-[10px] border border-line bg-subtle py-1 pr-1 pl-3",
        className,
      )}
    >
      <code className="min-w-0 flex-1 truncate font-mono text-[13px]">{command}</code>
      <CopyButton value={command} />
    </div>
  );
}
