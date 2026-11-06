import type { Metadata } from "next";
import { StyleCard } from "@/components/cards";
import { Gallery } from "@/components/gallery";
import { manifest } from "@/lib/registry";

export const metadata: Metadata = { title: "Styles" };

export default function StylesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Styles</h1>
        <p className="text-muted">
          Each style ships its full set of components or illustrations, its tokens, and an agent
          skill.
        </p>
      </header>
      <Gallery
        id="styles"
        label="styles"
        facets={[{ key: "kind", label: "Kind" }]}
        entries={manifest.styles.map((style, i) => ({
          key: style.slug,
          facets: { kind: style.kind },
          text: `${style.name} ${style.tagline} ${style.tags.join(" ")}`,
          card: (
            <StyleCard
              style={style}
              cover={manifest.items.find((item) => item.id === style.items[0])}
              priority={i < 3}
            />
          ),
        }))}
      />
    </div>
  );
}
