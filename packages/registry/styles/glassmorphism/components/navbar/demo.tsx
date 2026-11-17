import { Navbar } from "./navbar";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gl-accent";

export default function NavbarDemo() {
  return (
    // The app shell sits on the stage, so the frosted bar has something to blur.
    <div
      className="w-[520px] max-w-full overflow-hidden rounded-gl-lg border border-gl-edge font-gl"
      style={{ background: "var(--gl-stage)" }}
    >
      <Navbar
        brand={
          <a href="#home" className={`flex items-center gap-2 rounded-gl-sm ${focusRing}`}>
            <span
              aria-hidden="true"
              className="inline-flex size-6 items-center justify-center rounded-gl-sm bg-gl-fg text-xs font-semibold text-gl-inverse"
            >
              A
            </span>
            <span className="text-sm font-semibold tracking-tight text-gl-fg">Acme</span>
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
            className={`inline-flex size-8 items-center justify-center rounded-full border border-gl-edge bg-gl-line text-xs font-medium text-gl-fg transition-colors hover:border-gl-line-strong ${focusRing}`}
          >
            KS
          </button>
        }
      />
      <div aria-hidden="true" className="flex flex-col gap-3 p-5">
        <div className="text-[15px] font-semibold tracking-tight text-gl-fg">Overview</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Requests", "1.2M"],
            ["Deployments", "214"],
            ["Uptime", "99.98%"],
          ].map(([name, value]) => (
            <div
              key={name}
              className="flex flex-col gap-1 rounded-gl border border-gl-edge bg-gl-glass px-4 py-3 shadow-gl backdrop-blur-gl backdrop-saturate-150"
            >
              <span className="text-[13px] text-gl-muted">{name}</span>
              <span className="text-[15px] font-semibold tracking-tight text-gl-fg tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
