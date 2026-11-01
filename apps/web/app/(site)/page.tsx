import Link from "next/link";
import { ItemCard, StyleCard } from "@/components/cards";
import { getItems, manifest } from "@/lib/registry";

export default function HomePage() {
  const coverFor = (ids: string[]) => manifest.items.find((item) => item.id === ids[0]);
  const illustrations = getItems("illustrations").slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="max-w-2xl space-y-5 pt-6">
        <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-accent-text uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          Open UI styles for people and agents
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Every UI style. Every component.
        </h1>
        <p className="text-lg text-muted text-pretty">
          Pick a design style and get everything built in it: components, illustrations, tokens.
          Copy the code, install it with the CLI, or give your coding agent the skill to make more.
        </p>
        <div className="flex gap-3 text-sm">
          <Link href="/styles" className="rounded-md bg-fg px-4 py-2 font-medium text-bg">
            Browse styles
          </Link>
          <Link
            href="/illustrations"
            className="rounded-md border border-line bg-card px-4 py-2 font-medium hover:bg-subtle"
          >
            Illustrations
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted">Styles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {manifest.styles.map((style, i) => (
            <StyleCard
              key={style.slug}
              style={style}
              cover={coverFor(style.items)}
              priority={i < 3}
            />
          ))}
        </div>
      </section>

      {illustrations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-muted">Latest illustrations</h2>
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
