import { Navbar } from "./navbar";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-accent";

export default function NavbarDemo() {
  return (
    <div className="w-[520px] max-w-full overflow-hidden rounded-fl-leaf border border-fl-line bg-fl-bg font-fl shadow-fl">
      <Navbar
        brand={
          <a href="#home" className={`flex items-center gap-2 rounded-fl-sm ${focusRing}`}>
            <span
              aria-hidden="true"
              className="inline-flex size-6 items-center justify-center rounded-fl-sm bg-fl-primary font-fl-display text-[13px] font-semibold text-fl-on-primary"
            >
              A
            </span>
            <span className="font-fl-display text-[15px] font-semibold text-fl-fg">Acme</span>
          </a>
        }
        links={[
          { label: "Overview", href: "#overview", current: true },
          { label: "Deployments", href: "#deployments" },
          { label: "Settings", href: "#settings" },
        ]}
        actions={
          <button
            type="button"
            aria-label="KS, account"
            className={`inline-flex size-8 items-center justify-center rounded-full border border-fl-line bg-fl-subtle text-xs font-semibold text-fl-fg transition-colors hover:border-fl-line-strong ${focusRing}`}
          >
            KS
          </button>
        }
      />
      <div aria-hidden="true" className="flex flex-col gap-3 p-6">
        <div className="font-fl-display text-[15px] leading-snug font-semibold text-fl-fg">
          Overview
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Requests", "1.2M"],
            ["Deployments", "214"],
            ["Uptime", "99.98%"],
          ].map(([name, value]) => (
            <div
              key={name}
              className="flex flex-col gap-1 rounded-fl border border-fl-line bg-fl-surface px-4 py-3"
            >
              <span className="text-[13px] text-fl-muted">{name}</span>
              <span className="font-fl-display text-[17px] leading-snug font-semibold text-fl-fg tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
