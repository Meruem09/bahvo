import { Navbar } from "./navbar";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mn-accent";

export default function NavbarDemo() {
  return (
    <div className="w-[680px] max-w-full overflow-hidden rounded-mn-lg border border-mn-line bg-mn-bg font-mn">
      <Navbar
        brand={
          <a href="#home" className={`flex items-center gap-2 rounded-mn-sm ${focusRing}`}>
            <span
              aria-hidden="true"
              className="inline-flex size-6 items-center justify-center rounded-mn-sm bg-mn-fg text-xs font-semibold text-mn-inverse"
            >
              A
            </span>
            <span className="text-sm font-semibold tracking-tight text-mn-fg">Acme</span>
          </a>
        }
        links={[
          { label: "Overview", href: "#overview", current: true },
          { label: "Deployments", href: "#deployments" },
          { label: "Analytics", href: "#analytics" },
          { label: "Settings", href: "#settings" },
        ]}
        actions={
          <>
            <button
              type="button"
              className={`inline-flex h-8 items-center rounded-mn px-3 text-[13px] font-medium text-mn-fg transition-colors hover:bg-mn-subtle ${focusRing}`}
            >
              Feedback
            </button>
            <button
              type="button"
              aria-label="KS, account"
              className={`inline-flex size-8 items-center justify-center rounded-full border border-mn-line bg-mn-subtle text-xs font-medium text-mn-fg transition-colors hover:border-mn-line-strong ${focusRing}`}
            >
              KS
            </button>
          </>
        }
      />
      <div aria-hidden="true" className="flex flex-col gap-3 p-5">
        <div className="text-[15px] font-semibold tracking-tight text-mn-fg">Overview</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Requests", "1.2M"],
            ["Deployments", "214"],
            ["Uptime", "99.98%"],
          ].map(([name, value]) => (
            <div
              key={name}
              className="flex flex-col gap-1 rounded-mn border border-mn-line bg-mn-surface px-4 py-3"
            >
              <span className="text-[13px] text-mn-muted">{name}</span>
              <span className="text-[15px] font-semibold tracking-tight text-mn-fg tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
