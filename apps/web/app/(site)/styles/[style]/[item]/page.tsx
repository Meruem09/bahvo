import type { ItemDetail } from "@bahvo/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CodeBlock } from "@/components/code-block";
import { type CodeTab, CodeTabs } from "@/components/code-tabs";
import { PreviewFrame } from "@/components/preview-frame";
import { getItem, manifest } from "@/lib/registry";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function generateStaticParams() {
  return manifest.items.map((item) => ({ style: item.style, item: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/styles/[style]/[item]">): Promise<Metadata> {
  const { style, item: slug } = await params;
  const item = await getItem(style, slug);
  return item ? { title: `${item.styleName} ${item.name}`, description: item.description } : {};
}

export default function ItemPage({ params }: PageProps<"/styles/[style]/[item]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Item params={params} />
    </Suspense>
  );
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-10" aria-hidden="true">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-subtle" />
        <div className="h-8 w-64 rounded bg-subtle" />
      </div>
      <div className="h-[360px] rounded-xl bg-subtle" />
    </div>
  );
}

function codeTabs(item: ItemDetail): CodeTab[] {
  const cli = [item.install.bahvo, "", "# or with the shadcn CLI", item.install.shadcn].join("\n");
  const tabs: CodeTab[] = item.react.map((file, i) => ({
    id: `react-${file.name}`,
    label: i === 0 ? `React · ${file.name}` : `Kit · ${file.name}`,
    copy: file.code,
    panel: <CodeBlock file={file} />,
  }));
  if (item.svg) {
    for (const theme of ["light", "dark"] as const) {
      const file = item.svg[theme];
      tabs.push({
        id: `svg-${theme}`,
        label: `SVG · ${theme}`,
        copy: file.code,
        panel: <CodeBlock file={file} />,
      });
    }
  }
  if (item.htmlExport) {
    tabs.push(
      {
        id: "html",
        label: "HTML",
        copy: item.htmlExport.markup.code,
        panel: <CodeBlock file={item.htmlExport.markup} />,
      },
      {
        id: "css",
        label: "CSS",
        copy: item.htmlExport.css.code,
        panel: <CodeBlock file={item.htmlExport.css} />,
      },
    );
  }
  tabs.push({
    id: "cli",
    label: "CLI",
    copy: item.install.bahvo,
    panel: <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap">{cli}</pre>,
  });
  return tabs;
}

async function Item({ params }: Pick<PageProps<"/styles/[style]/[item]">, "params">) {
  const { style, item: slug } = await params;
  const item = await getItem(style, slug);
  if (!item) notFound();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <li>
              <Link href={`/${item.kind}`} className="capitalize hover:text-fg">
                {item.kind}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/styles/${item.style}`} className="hover:text-fg">
                {item.styleName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {item.name}
            </li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{item.name}</h1>
            <p className="max-w-2xl text-muted">{item.description}</p>
          </div>
        </div>
      </header>

      <PreviewFrame
        src={`/preview/${item.style}/${item.slug}`}
        title={`${item.styleName} ${item.name} preview`}
        download={item.svg && { light: item.svg.lightUrl, dark: item.svg.darkUrl, name: item.slug }}
      />

      <CodeTabs tabs={codeTabs(item)} />

      {item.subject && (
        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted">Good for</h2>
            <ul className="space-y-2 text-sm">
              {item.subject.uses.map((use) => (
                <li key={use} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted">Tags</h2>
            <p className="text-sm text-muted">{item.subject.tags.map(capitalize).join(" · ")}</p>
          </div>
        </section>
      )}

      {item.contract && (
        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted">Props</h2>
            <div className="overflow-x-auto rounded-xl border border-line bg-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-xs text-muted">
                  <tr>
                    <th className="p-3 font-medium">Prop</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Default</th>
                    <th className="p-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {item.contract.props.map((prop) => (
                    <tr key={prop.name} className="align-top">
                      <td className="p-3 font-mono text-xs">{prop.name}</td>
                      <td className="p-3 font-mono text-xs text-muted">{prop.type}</td>
                      <td className="p-3 font-mono text-xs text-muted">{prop.default ?? "–"}</td>
                      <td className="p-3 text-muted">{prop.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted">States</h2>
              <p className="text-sm text-muted">{item.states.map(capitalize).join(" · ")}</p>
            </div>
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted">Accessibility</h2>
              <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted">
                {item.contract.a11y.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
