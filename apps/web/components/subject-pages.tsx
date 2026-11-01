import type { ItemKind } from "@bahvo/registry";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/cards";
import { getItemsForSubject, getStyle, getSubject, getSubjects } from "@/lib/registry";

const copy = {
  components: {
    title: "Components",
    intro:
      "Every component has one API in every style. Switching styles means changing one import.",
    empty: "No component styles yet. The first ones are on the way.",
  },
  illustrations: {
    title: "Illustrations",
    intro:
      "Ready-made artwork for product sites and docs, in light and dark. Copy the SVG or the React component, or have your agent draw new ones with the style's skill.",
    empty: "No illustration styles yet.",
  },
} as const;

/** Index of every subject of one kind, each linking to its cross-style page. */
export function SubjectIndex({ kind }: { kind: ItemKind }) {
  const subjects = getSubjects(kind);
  const text = copy[kind];
  return (
    <div className="space-y-8">
      <header className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{text.title}</h1>
        <p className="text-muted text-pretty">{text.intro}</p>
      </header>
      {subjects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          {text.empty}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects
            .flatMap((subject) =>
              getItemsForSubject(kind, subject.slug)
                .slice(0, 1)
                .map((item) => ({ item, label: subject.name })),
            )
            .map(({ item, label }, i) => (
              <ItemCard key={item.id} item={item} label={label} priority={i < 3} />
            ))}
        </div>
      )}
    </div>
  );
}

/** One subject across every style that implements it. */
export async function SubjectStyles({
  kind,
  params,
}: {
  kind: ItemKind;
  params: Promise<{ slug: string }>;
}) {
  const subject = getSubject(kind, (await params).slug);
  if (!subject) notFound();
  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{subject.name}</h1>
        <p className="text-muted">{subject.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getItemsForSubject(kind, subject.slug).map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            label={getStyle(item.style)?.name ?? item.style}
            priority={i < 3}
          />
        ))}
      </div>
    </div>
  );
}
