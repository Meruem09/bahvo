import { Badge } from "@bahvo/ui/badge";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ItemCard } from "@/components/cards";
import { CommandField } from "@/components/command-field";
import { Gallery } from "@/components/gallery";
import { getCover, getItemsForStyle, getStyle, manifest } from "@/lib/registry";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

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

  return (
    <div className="space-y-16">
      <header className="max-w-3xl space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <li>
              <Link href="/styles" className="hover:text-fg">
                Styles
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {style.name}
            </li>
          </ol>
        </nav>
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

      <section
        id="install"
        aria-label="Install"
        className="grid divide-line rounded-xl border border-line bg-card sm:grid-cols-2 sm:divide-x max-sm:divide-y"
      >
        {cover && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex-1 space-y-0.5">
              <h2 className="text-sm font-medium">
                Add any {noun.toLowerCase().replace(/s$/, "")}
              </h2>
              <p className="text-[13px] text-muted text-pretty">
                Its tokens{style.kit.length > 0 ? " and the drawing kit" : ""} come with it.
              </p>
            </div>
            <CommandField command={`npx bahvo add ${cover.id}`} />
          </div>
        )}
        {style.skill && (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex-1 space-y-0.5">
              <h2 className="text-sm font-medium">Give your agent the skill</h2>
              <p className="text-[13px] text-muted text-pretty">
                It makes new {noun.toLowerCase()} in this style and checks its own work. For Codex,
                Cursor and other agents, add --agent agents.
              </p>
            </div>
            <CommandField command={style.skill.install} />
          </div>
        )}
      </section>

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
