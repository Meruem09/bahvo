import Link from "next/link";
import { StyleCard } from "@/components/cards";
import { manifest } from "@/lib/registry";

export default function HomePage() {
  const coverFor = (ids: string[]) => manifest.items.find((item) => item.id === ids[0]);

  return (
    <div className="space-y-16">
      <section className="max-w-2xl space-y-5 pt-6">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Every UI style. Every component.
        </h1>
        <p className="text-lg text-muted text-pretty">
          Pick a design style and get the whole component set built in it. Copy the code, install it
          with the CLI, or give your coding agent the skill to build more.
        </p>
        <div className="flex gap-3 text-sm">
          <Link href="/styles" className="rounded-md bg-fg px-4 py-2 font-medium text-bg">
            Browse styles
          </Link>
          <Link href="/components" className="rounded-md border border-line px-4 py-2 font-medium">
            Browse components
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted">Styles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {manifest.styles.map((style) => (
            <StyleCard key={style.slug} style={style} cover={coverFor(style.items)} />
          ))}
        </div>
      </section>
    </div>
  );
}
