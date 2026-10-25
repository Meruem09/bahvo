import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ItemCard } from "@/components/cards";
import { getComponent, getItemsForComponent, getStyle, manifest } from "@/lib/registry";

export function generateStaticParams() {
  return manifest.components.map((component) => ({ component: component.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[component]">): Promise<Metadata> {
  const component = getComponent((await params).component);
  return component ? { title: component.name, description: component.description } : {};
}

export default function ComponentPage({ params }: PageProps<"/components/[component]">) {
  return (
    <Suspense>
      <ComponentStyles params={params} />
    </Suspense>
  );
}

async function ComponentStyles({ params }: Pick<PageProps<"/components/[component]">, "params">) {
  const component = getComponent((await params).component);
  if (!component) notFound();

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{component.name}</h1>
        <p className="text-muted">{component.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getItemsForComponent(component.slug).map((item) => {
          const style = getStyle(item.style);
          return (
            <ItemCard
              key={item.id}
              item={item}
              accent={style?.accent ?? "#888888"}
              label={style?.name ?? item.style}
            />
          );
        })}
      </div>
    </div>
  );
}
