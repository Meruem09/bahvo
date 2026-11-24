"use client";

import { Button } from "@bahvo/ui/button";
import { cn } from "@bahvo/ui/cn";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type Status = "idle" | "copied" | "failed";

const words: Record<Exclude<Status, "idle">, string> = { copied: "Copied", failed: "Failed" };

/**
 * Copies `value` and confirms in place for a moment. The label never changes
 * the button's width (every word it can show is stacked in one grid cell), and
 * the result is announced, since a focused button's new name often is not.
 */
export function CopyButton({
  value,
  label = "Copy",
  iconOnly = false,
  className,
}: {
  value: string;
  label?: string;
  /** A square icon button; `label` becomes its accessible name and tooltip. */
  iconOnly?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: Status = "copied";
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // No clipboard access (insecure context, denied permission).
      next = "failed";
    }
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1600);
  }

  const Icon = status === "copied" ? CheckIcon : CopyIcon;
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        onClick={copy}
        className={cn(
          "h-7 shrink-0 text-[13px]",
          iconOnly ? "w-7 px-0" : "px-2.5",
          status === "failed" && "text-accent-text",
          className,
        )}
      >
        <Icon className={cn("size-3.5", status === "idle" && "text-muted")} />
        {!iconOnly && (
          <span className="grid">
            {[label, words.copied, words.failed].map((word) => (
              <span key={word} aria-hidden="true" className="invisible col-start-1 row-start-1">
                {word}
              </span>
            ))}
            <span className="col-start-1 row-start-1">
              {status === "idle" ? label : words[status]}
            </span>
          </span>
        )}
      </Button>
      <span role="status" className="sr-only">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Could not copy" : ""}
      </span>
    </>
  );
}
