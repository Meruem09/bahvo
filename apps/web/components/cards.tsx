import type { ManifestItem, ManifestStyle } from "@bahvo/registry";
import { Badge } from "@bahvo/ui/badge";
import Link from "next/link";
import { Thumb } from "./thumb";

const kindLabel = (style: ManifestStyle) =>
  `${style.items.length} ${style.kind === "illustrations" ? "illustration" : "component"}${style.items.length === 1 ? "" : "s"}`;

export function StyleCard({
  style,
  cover,
  priority,
}: {
  style: ManifestStyle;
  cover?: ManifestItem;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/styles/${style.slug}`}
      className="cv-auto group block overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-fg/25"
    >
      {cover ? (
        <Thumb thumbs={cover.thumbs} alt={`${style.name} preview`} priority={priority} />
      ) : (
        <div className="aspect-[16/10] bg-subtle" />
      )}
      <div className="space-y-1.5 border-t border-line p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{style.name}</h3>
          <Badge className="ml-auto">{style.status}</Badge>
        </div>
        <p className="text-sm text-muted">{style.tagline}</p>
        <p className="text-xs text-muted">
          {kindLabel(style)}
          {style.skill && <span className="text-accent-text"> · agent skill</span>}
        </p>
      </div>
    </Link>
  );
}

export function ItemCard({
  item,
  label,
  priority,
}: {
  item: ManifestItem;
  label: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/styles/${item.style}/${item.slug}`}
      className="cv-auto group block overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-fg/25"
    >
      <Thumb thumbs={item.thumbs} alt={label} priority={priority} />
      <div className="flex items-center justify-between gap-2 border-t border-line p-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted">{item.category}</span>
      </div>
    </Link>
  );
}
