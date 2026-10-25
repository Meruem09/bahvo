import type { Metadata } from "next";
import { StyleCard } from "@/components/cards";
import { manifest } from "@/lib/registry";

export const metadata: Metadata = { title: "Styles" };

export default function StylesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Styles</h1>
        <p className="text-muted">
          Each style comes with the full component set and an agent skill.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {manifest.styles.map((style) => (
          <StyleCard
            key={style.slug}
            style={style}
            cover={manifest.items.find((item) => item.id === style.items[0])}
          />
        ))}
      </div>
    </div>
  );
}
