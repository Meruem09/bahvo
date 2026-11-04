import type { ReactNode } from "react";
import { Tooltip } from "./tooltip";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const tool =
  "inline-flex size-8 items-center justify-center rounded-mn-sm text-mn-muted transition-colors " +
  "hover:bg-mn-subtle hover:text-mn-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" {...stroke}>
      {children}
    </svg>
  );
}

export default function TooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-10 pt-10 font-mn">
      <div className="flex items-center gap-1 rounded-mn-lg border border-mn-line bg-mn-surface p-1 shadow-mn-sm">
        <Tooltip content="Copy link" shortcut="⌘C" asLabel defaultOpen>
          <button type="button" className={tool}>
            <Icon>
              <path d="M6.75 9.25a2.5 2.5 0 0 0 3.54 0l2-2a2.5 2.5 0 0 0-3.54-3.54l-.5.5" />
              <path d="M9.25 6.75a2.5 2.5 0 0 0-3.54 0l-2 2a2.5 2.5 0 0 0 3.54 3.54l.5-.5" />
            </Icon>
          </button>
        </Tooltip>
        <Tooltip content="Open in new tab" asLabel>
          <button type="button" className={tool}>
            <Icon>
              <path d="M9.5 2.75h3.75V6.5M13.25 2.75 8 8M6.5 3.75H3.75v8.5h8.5V9.5" />
            </Icon>
          </button>
        </Tooltip>
        <Tooltip content="Redeploy" shortcut="⌘R" asLabel>
          <button type="button" className={tool}>
            <Icon>
              <path d="M12.75 8a4.75 4.75 0 1 1-1.4-3.36M12.75 2.75v2.5h-2.5" />
            </Icon>
          </button>
        </Tooltip>
      </div>
      <Tooltip content="Builds run on 4 vCPUs" side="bottom">
        <button
          type="button"
          className="rounded-mn-sm text-[13px] text-mn-muted underline decoration-mn-line-strong decoration-dotted underline-offset-4 transition-colors hover:text-mn-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent"
        >
          Performance plan
        </button>
      </Tooltip>
    </div>
  );
}
