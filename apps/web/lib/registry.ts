import { loadItem } from "@bahvo/registry";
import { cacheLife, cacheTag } from "next/cache";

export {
  getItems,
  getItemsForStyle,
  getItemsForSubject,
  getStyle,
  getSubject,
  getSubjects,
  manifest,
} from "@bahvo/registry";

/**
 * Item detail is cached forever and tagged, so once the catalog is too big to
 * prebuild, a content change can refresh just the affected pages with
 * revalidateTag("item:<style>/<slug>") or revalidateTag("style:<style>").
 */
export async function getItem(style: string, slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`item:${style}/${slug}`, `style:${style}`, `subject:${slug}`);
  return loadItem(style, slug);
}
