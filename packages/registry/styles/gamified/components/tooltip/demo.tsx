import type { ReactNode } from "react";
import { Tooltip } from "./tooltip";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Tools sit inside a chunky toolbar pane: 18px corners, a 2px edge and 4px padding, so 12px tools stay concentric.
const tool =
  "inline-flex size-9 items-center justify-center rounded-gm text-gm-muted transition-[background-color,color,translate] duration-100 " +
  "hover:bg-gm-subtle hover:text-gm-fg active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" {...stroke}>
      {children}
    </svg>
  );
}

export default function TooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-10 pt-10 font-gm">
      <div className="flex items-center gap-1 rounded-gm-lg border-2 border-gm-line bg-gm-surface p-1 shadow-gm">
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
          className="rounded-gm-sm text-[13px] font-semibold text-gm-muted underline decoration-gm-control decoration-dotted decoration-2 underline-offset-4 transition-colors hover:text-gm-fg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary"
        >
          Performance plan
        </button>
      </Tooltip>
    </div>
  );
}
