import { Sidebar } from "./sidebar";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const icons = {
  home: <path d="M2.75 7 8 2.75 13.25 7v6.25h-3.5V9.5h-3.5v3.75h-3.5Z" />,
  inbox: <path d="M2.75 9.5h3l1 1.75h2.5l1-1.75h3M2.75 9.5 4.25 3.5h7.5l1.5 6v3.75H2.75Z" />,
  projects: <path d="M2.75 4.25h4l1 1.25h5.5v7.75H2.75Z" />,
  chart: <path d="M3 13V8.5M8 13V3M13 13V6" />,
  people: (
    <>
      <circle cx="6" cy="6" r="2.25" />
      <path d="M2.25 13c.5-2 1.9-3 3.75-3s3.25 1 3.75 3M10.5 4a2 2 0 0 1 0 4M12 10c1 .4 1.6 1.4 1.75 3" />
    </>
  ),
  settings: (
    <>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 2.75v1.5M8 11.75v1.5M2.75 8h1.5M11.75 8h1.5M4.3 4.3l1.05 1.05M10.65 10.65l1.05 1.05M4.3 11.7l1.05-1.05M10.65 5.35l1.05-1.05" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export default function SidebarDemo() {
  return (
    <div className="flex h-[440px] w-[560px] max-w-full overflow-hidden rounded-mn-lg border border-mn-line bg-mn-surface">
      <Sidebar
        header={
          <div className="flex items-center gap-2.5 text-sm font-medium text-mn-fg">
            <span className="grid size-6 place-items-center rounded-mn-sm bg-mn-fg text-[11px] font-semibold text-mn-inverse">
              A
            </span>
            Acme Inc.
          </div>
        }
        sections={[
          {
            items: [
              { label: "Home", href: "#home", icon: <Icon name="home" /> },
              { label: "Inbox", href: "#inbox", icon: <Icon name="inbox" />, badge: 3 },
              {
                label: "Projects",
                href: "#projects",
                icon: <Icon name="projects" />,
                current: true,
              },
              { label: "Analytics", href: "#analytics", icon: <Icon name="chart" /> },
            ],
          },
          {
            label: "Workspace",
            items: [
              { label: "Members", href: "#members", icon: <Icon name="people" />, badge: 12 },
              { label: "Settings", href: "#settings", icon: <Icon name="settings" /> },
            ],
          },
        ]}
        footer={
          <div className="flex items-center gap-2.5">
            <span className="size-7 rounded-full bg-mn-subtle" aria-hidden="true" />
            <div className="min-w-0 text-[13px] leading-tight">
              <p className="truncate font-medium text-mn-fg">Alex Chen</p>
              <p className="truncate text-mn-muted">alex@acme.dev</p>
            </div>
          </div>
        }
      />
      <div className="flex flex-1 flex-col gap-3 p-6" aria-hidden="true">
        <div className="h-3 w-24 rounded-full bg-mn-subtle" />
        <div className="mt-2 h-20 rounded-mn border border-mn-line" />
        <div className="h-20 rounded-mn border border-mn-line" />
        <div className="h-20 rounded-mn border border-mn-line" />
      </div>
    </div>
  );
}
