import { Badge } from "@bahvo/ui/badge";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ItemCard } from "@/components/cards";
import { CopyButton } from "@/components/copy-button";
import { getItemsForStyle, getStyle, manifest } from "@/lib/registry";

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
  const items = getItemsForStyle(style.slug);
  const tokensCommand = `npx shadcn@latest add ${style.tokensUrl}`;

  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="size-3 rounded-full" style={{ background: style.accent }} />
          <h1 className="text-3xl font-semibold tracking-tight">{style.name}</h1>
          <Badge>{style.status}</Badge>
        </div>
        <p className="text-lg text-pretty">{style.tagline}</p>
        <p className="text-muted text-pretty">{style.description}</p>
        <div className="flex flex-wrap gap-2">
          {style.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Install the tokens</h2>
        <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
          <code className="flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap">
            {tokensCommand}
          </code>
          <CopyButton value={tokensCommand} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted">Components ({items.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} accent={style.accent} label={item.name} />
          ))}
        </div>
      </section>
    </div>
  );
}
