import { Badge } from "@bahvo/ui/badge";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { PreviewFrame } from "@/components/preview-frame";
import { getItem, manifest } from "@/lib/registry";

export function generateStaticParams() {
  return manifest.items.map((item) => ({ style: item.style, component: item.component }));
}

export async function generateMetadata({
  params,
}: PageProps<"/styles/[style]/[component]">): Promise<Metadata> {
  const { style, component } = await params;
  const item = await getItem(style, component);
  return item ? { title: `${item.styleName} ${item.name}`, description: item.description } : {};
}

export default function ItemPage({ params }: PageProps<"/styles/[style]/[component]">) {
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

async function Item({ params }: Pick<PageProps<"/styles/[style]/[component]">, "params">) {
  const { style, component } = await params;
  const item = await getItem(style, component);
  if (!item) notFound();

  const cli = [item.install.bahvo, "", "# or with the shadcn CLI", item.install.shadcn].join("\n");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <nav className="text-sm text-muted">
          <Link href="/styles" className="hover:text-fg">
            Styles
          </Link>{" "}
          /{" "}
          <Link href={`/styles/${item.style}`} className="hover:text-fg">
            {item.styleName}
          </Link>
        </nav>
        <h1 className="text-3xl font-semibold tracking-tight">
          {item.styleName} {item.name}
        </h1>
        <p className="max-w-2xl text-muted">{item.description}</p>
      </header>

      <PreviewFrame
        src={`/preview/${item.style}/${item.component}`}
        title={`${item.styleName} ${item.name} preview`}
      />

      <CodeTabs
        tabs={[
          ...item.react.map((file) => ({
            id: `react-${file.name}`,
            label: `React · ${file.name}`,
            copy: file.code,
            panel: <CodeBlock file={file} />,
          })),
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
          {
            id: "cli",
            label: "CLI",
            copy: item.install.bahvo,
            panel: (
              <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap">{cli}</pre>
            ),
          },
        ]}
      />

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
            <div className="flex flex-wrap gap-2">
              {item.states.map((state) => (
                <Badge key={state}>{state}</Badge>
              ))}
            </div>
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
    </div>
  );
}
