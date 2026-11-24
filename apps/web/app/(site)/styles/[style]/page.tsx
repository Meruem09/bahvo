import { Badge } from "@bahvo/ui/badge";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ItemCard } from "@/components/cards";
import { Gallery } from "@/components/gallery";
import { InstallPanel, type InstallStep } from "@/components/install-panel";
import { getCover, getItemsForStyle, getStyle, manifest } from "@/lib/registry";
import { capitalize } from "@/lib/text";

export function generateStaticParams() {
  return manifest.styles.map((style) => ({ style: style.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/styles/[style]">): Promise<Metadata> {
  const style = getStyle((await params).style);
  return style ? { title: style.name, description: style.tagline } : {};
}

export default function StylePage({ params }: PageProps<"/styles/[style]">) {
  return (
    <Suspense>
      <Style params={params} />
    </Suspense>
  );
}

async function Style({ params }: Pick<PageProps<"/styles/[style]">, "params">) {
  const style = getStyle((await params).style);
  if (!style) notFound();
  const items = [...getItemsForStyle(style.slug)].sort((a, b) => a.name.localeCompare(b.name));
  const cover = getCover(style);
  const noun = style.kind === "illustrations" ? "Illustrations" : "Components";
  const steps: InstallStep[] = [];
  if (cover) {
    steps.push({
      title: `Add any ${noun.toLowerCase().replace(/s$/, "")}`,
      description: `Its tokens${style.kit.length > 0 ? " and the drawing kit" : ""} come with it.`,
      command: `npx bahvo add ${cover.id}`,
    });
  }
  if (style.skill) {
    steps.push({
      title: "Give your agent the skill",
      description: `It makes new ${noun.toLowerCase()} in this style and checks its own work. For Codex, Cursor and other agents, add --agent agents.`,
      command: style.skill.install,
    });
  }

  return (
    <div className="space-y-16">
      <header className="max-w-3xl space-y-4">
        <Breadcrumbs trail={[{ href: "/styles", label: "Styles" }]} current={style.name} />
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{style.name}</h1>
          <Badge className="capitalize">{style.status}</Badge>
        </div>
        <p className="text-lg text-pretty">{style.tagline}</p>
        <p className="text-muted text-pretty">{style.description}</p>
        <p className="text-sm text-muted">
          {[`${items.length} ${noun.toLowerCase()}`, ...style.tags.map(capitalize)].join(" · ")}
        </p>
      </header>

      <InstallPanel id="install" title="Install" steps={steps} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">{noun}</h2>
        <Gallery
          id={`style-${style.slug}`}
          label={noun.toLowerCase()}
          facets={[{ key: "category", label: "Category" }]}
          entries={items.map((item, i) => ({
            key: item.id,
            facets: { category: item.category },
            text: `${item.name} ${item.description} ${item.category}`,
            card: <ItemCard item={item} label={item.name} priority={i < 3} />,
          }))}
        />
      </section>

      {style.colors.length > 0 && (
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Color tokens</h2>
            <p className="text-sm text-muted">
              Each swatch shows the light value, then the dark one.
            </p>
          </div>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-2">
            {style.colors.map((color) => (
              <li
                key={color.name}
                className="flex items-center gap-2.5 rounded-[10px] border border-line bg-card p-2"
              >
                <span
                  aria-hidden="true"
                  className="flex shrink-0 divide-x divide-line overflow-hidden rounded-md border border-line"
                >
                  {color.light === color.dark ? (
                    <span className="h-7 w-14" style={{ background: color.light }} />
                  ) : (
                    <>
                      <span className="size-7" style={{ background: color.light }} />
                      <span className="size-7" style={{ background: color.dark }} />
                    </>
                  )}
                </span>
                <span className="min-w-0">
                  <code className="block truncate font-mono text-xs">{color.name}</code>
                  <span className="block font-mono text-xs text-muted">
                    {color.light === color.dark
                      ? `${color.light} · both`
                      : `${color.light} · ${color.dark}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
