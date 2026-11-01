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

function Command({ label, command, note }: { label: string; command: string; note?: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{label}</h3>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
        <code className="flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap">
          {command}
        </code>
        <CopyButton value={command} />
      </div>
      {note && <p className="text-xs text-muted">{note}</p>}
    </div>
  );
}

async function Style({ params }: Pick<PageProps<"/styles/[style]">, "params">) {
  const style = getStyle((await params).style);
  if (!style) notFound();
  const items = getItemsForStyle(style.slug);
  const noun = style.kind === "illustrations" ? "Illustrations" : "Components";

  return (
    <div className="space-y-12">
      <header className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{style.name}</h1>
          <Badge>{style.status}</Badge>
          <Badge>{style.kind}</Badge>
        </div>
        <p className="text-lg text-pretty">{style.tagline}</p>
        <p className="text-muted text-pretty">{style.description}</p>
        <div className="flex flex-wrap gap-2">
          {style.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted">
          {noun} ({items.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} label={item.name} priority={i < 3} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {style.skill && (
          <div className="space-y-4 rounded-xl border border-line bg-card p-5">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 font-medium">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                Agent skill
              </h2>
              <p className="text-sm text-muted text-pretty">
                Teaches your coding agent to draw new {style.name.toLowerCase()}{" "}
                {noun.toLowerCase()} in this exact style, with the drawing kit, every example above,
                and a checker it runs on its own output.
              </p>
            </div>
            <Command
              label="Install for Claude Code"
              command={`${style.skill.install} --agent claude`}
              note="Use --agent agents for Codex, Cursor and other agents that read .agents/skills."
            />
          </div>
        )}
        <div className="space-y-4">
          <Command
            label="Install the tokens"
            command={`npx shadcn@latest add ${style.tokensUrl}`}
          />
          {style.kit.length > 0 && (
            <Command
              label="Install the drawing kit"
              command={`npx shadcn@latest add ${style.tokensUrl.replace(/tokens\.json$/, "kit.json")}`}
              note="Every item installs the kit for you; add it on its own to draw your own."
            />
          )}
        </div>
      </section>
    </div>
  );
}
