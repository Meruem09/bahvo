import { Navbar } from "./navbar";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gm-primary";

export default function NavbarDemo() {
  return (
    <div className="w-[520px] max-w-full overflow-hidden rounded-gm-lg border-2 border-gm-line bg-gm-bg font-gm">
      <Navbar
        brand={
          <a href="#home" className={`flex items-center gap-2 rounded-gm-sm ${focusRing}`}>
            <span
              aria-hidden="true"
              className="inline-flex size-7 items-center justify-center rounded-gm-sm bg-gm-primary font-gm-display text-sm font-semibold text-gm-on-primary"
            >
              A
            </span>
            <span className="font-gm-display text-[17px] font-semibold text-gm-fg">Acme</span>
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
            className={`inline-flex size-8 items-center justify-center rounded-full border-2 border-gm-line bg-gm-surface font-gm-display text-xs font-semibold text-gm-fg shadow-gm-sm transition-[background-color,translate,box-shadow] duration-100 hover:bg-gm-subtle active:translate-y-0.5 active:shadow-none ${focusRing}`}
          >
            KS
          </button>
        }
      />
      <div aria-hidden="true" className="flex flex-col gap-3 p-5">
        <div className="font-gm-display text-lg font-semibold text-gm-fg">Overview</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Requests", "1.2M"],
            ["Deployments", "214"],
            ["Uptime", "99.98%"],
          ].map(([name, value]) => (
            <div
              key={name}
              className="flex flex-col gap-1 rounded-gm border-2 border-gm-line bg-gm-surface px-4 py-3 shadow-gm"
            >
              <span className="text-[13px] font-bold text-gm-muted">{name}</span>
              <span className="font-gm-display text-lg font-semibold text-gm-fg tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
