import { ClientPreview } from "@bahvo/registry/client-previews";
import { clientPreviews, previews } from "@bahvo/registry/previews";
import { notFound } from "next/navigation";
import { type CSSProperties, Suspense } from "react";
import { previewFonts } from "@/lib/preview-fonts";
import { getItem, manifest } from "@/lib/registry";

export function generateStaticParams() {
  return manifest.items.map((item) => ({ style: item.style, item: item.slug }));
}

/**
 * The page rendered inside each preview iframe: one item, its style's
 * hashed stylesheet and font, and nothing from the site shell. Known items are
 * fully prerendered; anything else gets an instant empty shell, then streams.
 */
export default function PreviewPage({ params }: PageProps<"/preview/[style]/[item]">) {
  return (
    <Suspense>
      <Preview params={params} />
    </Suspense>
  );
}

async function Preview({ params }: Pick<PageProps<"/preview/[style]/[item]">, "params">) {
  const { style, item: slug } = await params;
  const item = await getItem(style, slug);
  const id = `${style}/${slug}`;
  const load = previews[id];
  if (!item || (!load && !clientPreviews.has(id))) notFound();
  // Server demos render here with no JS; demos with client code load only their own chunk.
  const Demo = load ? (await load()).default : null;

  return (
    <>
      <link rel="stylesheet" href={item.cssUrl} precedence="default" />
      <div
        className={`bahvo-stage ${previewFonts[style] ?? ""}`}
        style={
          { "--stage-light": item.stage.light, "--stage-dark": item.stage.dark } as CSSProperties
        }
      >
        <div data-bahvo-content>{Demo ? <Demo /> : <ClientPreview id={id} />}</div>
      </div>
    </>
  );
}
