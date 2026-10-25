import { loadItem } from "@bahvo/registry";
import { cacheLife, cacheTag } from "next/cache";

export {
  getComponent,
  getItemsForComponent,
  getItemsForStyle,
  getStyle,
  manifest,
} from "@bahvo/registry";

/**
 * Item detail is cached forever and tagged, so once the catalog is too big to
 * prebuild, a content change can refresh just the affected pages with
 * revalidateTag("item:<style>/<component>") or revalidateTag("style:<style>").
 */
export async function getItem(style: string, component: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`item:${style}/${component}`, `style:${style}`, `component:${component}`);
  return loadItem(style, component);
}
