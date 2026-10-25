import type { ManifestItem, ManifestStyle } from "@bahvo/registry";
import { Badge } from "@bahvo/ui/badge";
import Link from "next/link";
import { Thumb } from "./thumb";

export function StyleCard({ style, cover }: { style: ManifestStyle; cover?: ManifestItem }) {
  return (
    <Link
      href={`/styles/${style.slug}`}
      className="cv-auto group block overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-fg/30"
    >
      {cover ? (
        <Thumb src={cover.thumb} alt={`${style.name} preview`} accent={style.accent} />
      ) : (
        <div className="aspect-[16/10] bg-subtle" />
      )}
      <div className="space-y-1.5 p-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: style.accent }} />
          <h3 className="font-medium">{style.name}</h3>
          <Badge className="ml-auto">{style.status}</Badge>
        </div>
        <p className="text-sm text-muted">{style.tagline}</p>
        <p className="text-xs text-muted">
          {style.items.length} component{style.items.length === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}

export function ItemCard({
  item,
  accent,
  label,
}: {
  item: ManifestItem;
  accent: string;
  label: string;
}) {
  return (
    <Link
      href={`/styles/${item.style}/${item.component}`}
      className="cv-auto group block overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-fg/30"
    >
      <Thumb src={item.thumb} alt={label} accent={accent} />
      <div className="flex items-center justify-between gap-2 p-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted">{item.category}</span>
      </div>
    </Link>
  );
}
