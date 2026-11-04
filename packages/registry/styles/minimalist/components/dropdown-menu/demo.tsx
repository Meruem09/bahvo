import type { ReactNode } from "react";
import { DropdownMenu } from "./dropdown-menu";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" {...stroke}>
      {children}
    </svg>
  );
}

export default function DropdownMenuDemo() {
  return (
    <div className="flex h-[340px] w-[440px] max-w-full items-start justify-between pt-2">
      <DropdownMenu
        label="Project"
        defaultOpen
        groups={[
          {
            items: [
              {
                label: "Open project",
                icon: (
                  <Icon>
                    <path d="M9.5 2.75h3.75V6.5M13.25 2.75 8 8M6.5 3.75H3.75v8.5h8.5V9.5" />
                  </Icon>
                ),
              },
              {
                label: "Rename",
                shortcut: "⌘R",
                icon: (
                  <Icon>
                    <path d="M9.75 3.5 12.5 6.25M3.25 12.75l.5-2.75 6.5-6.5 2.25 2.25-6.5 6.5Z" />
                  </Icon>
                ),
              },
              {
                label: "Duplicate",
                shortcut: "⌘D",
                icon: (
                  <Icon>
                    <rect x="5.75" y="5.75" width="7.5" height="7.5" rx="1.5" />
                    <path d="M10.25 5.75v-1.5a1.5 1.5 0 0 0-1.5-1.5h-4.5a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h1.5" />
                  </Icon>
                ),
              },
            ],
          },
          {
            label: "Move",
            items: [{ label: "Transfer to team" }, { label: "Archive", disabled: true }],
          },
          {
            items: [
              {
                label: "Delete project",
                danger: true,
                icon: (
                  <Icon>
                    <path d="M3 4.5h10M6.25 4.5V3h3.5v1.5M4.5 4.5l.6 8.25h5.8l.6-8.25" />
                  </Icon>
                ),
              },
            ],
          },
        ]}
      />
      <DropdownMenu
        label="More actions"
        align="end"
        icon={
          <Icon>
            <path d="M4 8h.01M8 8h.01M12 8h.01" strokeWidth="2.25" />
          </Icon>
        }
        groups={[
          {
            items: [{ label: "View logs" }, { label: "Copy deployment URL" }, { label: "Inspect" }],
          },
        ]}
      />
    </div>
  );
}
