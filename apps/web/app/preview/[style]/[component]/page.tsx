import { previews } from "@bahvo/registry/previews";
import { notFound } from "next/navigation";
import { type CSSProperties, Suspense } from "react";
import { previewFonts } from "@/lib/preview-fonts";
import { getItem, manifest } from "@/lib/registry";

export function generateStaticParams() {
  return manifest.items.map((item) => ({ style: item.style, component: item.component }));
}

/**
 * The page rendered inside each preview iframe: one component, its style's
 * hashed stylesheet and font, and nothing from the site shell. Known items are
 * fully prerendered; anything else gets an instant empty shell, then streams.
 */
export default function PreviewPage({ params }: PageProps<"/preview/[style]/[component]">) {
  return (
    <Suspense>
      <Preview params={params} />
    </Suspense>
  );
}

async function Preview({ params }: Pick<PageProps<"/preview/[style]/[component]">, "params">) {
  const { style, component } = await params;
  const item = await getItem(style, component);
  const load = previews[`${style}/${component}`];
  if (!item || !load) notFound();
  const { default: Demo } = await load();

  return (
    <>
      <link rel="stylesheet" href={item.cssUrl} precedence="default" />
      <div
        className={`bahvo-stage ${previewFonts[style] ?? ""}`}
        style={
          { "--stage-light": item.stage.light, "--stage-dark": item.stage.dark } as CSSProperties
        }
      >
        <div data-bahvo-content>
          <Demo />
        </div>
      </div>
    </>
  );
}
