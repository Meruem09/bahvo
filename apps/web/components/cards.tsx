import type { ManifestItem, ManifestStyle } from "@bahvo/registry";
import { Badge } from "@bahvo/ui/badge";
import Link from "next/link";
import { plural } from "@/lib/text";
import { Thumb } from "./thumb";

const card =
  "cv-auto group block overflow-hidden rounded-xl border border-line bg-card transition-[border-color,box-shadow,translate] duration-150 " +
  "hover:-translate-y-px hover:border-fg/30 hover:shadow-[0_4px_16px_-8px_rgb(0_0_0/0.18)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const kindLabel = (style: ManifestStyle) =>
  plural(style.items.length, style.kind === "illustrations" ? "illustration" : "component");

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
    <Link href={`/styles/${style.slug}`} className={card}>
      {cover ? (
        <Thumb thumbs={cover.thumbs} alt={`${style.name} preview`} priority={priority} />
      ) : (
        <div className="aspect-[16/10] bg-subtle" />
      )}
      <div className="space-y-1.5 border-t border-line p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-medium tracking-tight">{style.name}</h3>
          <Badge className="ml-auto capitalize">{style.status}</Badge>
        </div>
        <p className="text-sm text-muted">{style.tagline}</p>
        <p className="text-[13px] text-muted">
          {kindLabel(style)}
          {style.skill && (
            <>
              <span aria-hidden="true"> · </span>
              Agent skill
            </>
          )}
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
    <Link href={`/styles/${item.style}/${item.slug}`} className={card}>
      <Thumb thumbs={item.thumbs} alt={label} priority={priority} />
      <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
        <span className="text-[15px] font-medium tracking-tight">{label}</span>
        <span className="text-[13px] text-muted capitalize">{item.category}</span>
      </div>
    </Link>
  );
}
