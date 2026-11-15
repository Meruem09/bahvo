import Link from "next/link";
import { ItemCard, StyleCard } from "@/components/cards";
import { CommandField } from "@/components/command-field";
import { getCover, getItems, manifest } from "@/lib/registry";

const installs = [
  { label: "A component", command: "npx bahvo add minimalist/dialog" },
  { label: "An illustration", command: "npx bahvo add isometric/cloud" },
  { label: "A skill for your agent", command: "npx bahvo skill add pixel" },
];

export default function HomePage() {
  const illustrations = getItems("illustrations").slice(0, 6);

  return (
    <div className="space-y-14">
      {/* On the card grid below: the panel is the third column and stretches to the left
          column's height, so their edges meet. */}
      <section className="grid gap-x-4 gap-y-10 pt-6 lg:grid-cols-3">
        <div className="max-w-2xl space-y-5 lg:col-span-2">
          <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-accent-text uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            Open UI styles for people and agents
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Every UI style. Every component.
          </h1>
          <p className="text-lg text-muted text-balance">
            Pick a design style and get everything built in it: components, illustrations and
            tokens. Copy the code, install it with the CLI, or give your coding agent the skill.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <Link
              href="/styles"
              className="inline-flex h-9 items-center rounded-md bg-fg px-4 font-medium text-bg transition-colors hover:bg-fg/85"
            >
              Browse styles
            </Link>
            {(
              [
                { href: "/illustrations", label: "Illustrations" },
                { href: "/components", label: "Components" },
              ] as const
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
              >
                {link.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-xl border border-line bg-card">
          <p className="border-b border-line px-4 py-2.5 text-[13px] font-medium">
            Install anything
          </p>
          <ul className="flex flex-1 flex-col divide-y divide-line">
            {installs.map((install) => (
              <li
                key={install.command}
                className="flex flex-1 flex-col justify-center gap-1 px-4 py-2"
              >
                <p className="text-xs text-muted">{install.label}</p>
                <CommandField command={install.command} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Styles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {manifest.styles.map((style, i) => (
            <StyleCard key={style.slug} style={style} cover={getCover(style)} priority={i < 3} />
          ))}
        </div>
      </section>

      {illustrations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Latest illustrations</h2>
            <Link href="/illustrations" className="text-sm text-muted hover:text-fg">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {illustrations.map((item) => (
              <ItemCard key={item.id} item={item} label={item.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
