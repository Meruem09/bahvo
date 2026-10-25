import { itemLoaders } from "./generated/loaders";
import manifestJson from "./generated/manifest.json";
import type { ItemDetail, Manifest } from "./schema";

export * from "./schema";

export const manifest = manifestJson as Manifest;

export function itemId(style: string, component: string) {
  return `${style}/${component}`;
}

export function getStyle(slug: string) {
  return manifest.styles.find((style) => style.slug === slug);
}

export function getComponent(slug: string) {
  return manifest.components.find((component) => component.slug === slug);
}

export function getItemsForStyle(style: string) {
  return manifest.items.filter((item) => item.style === style);
}

export function getItemsForComponent(component: string) {
  return manifest.items.filter((item) => item.component === component);
}

/**
 * Loads one item's full detail (source code, highlighted HTML, install info).
 * Each item is its own JSON chunk, so pages only pay for the item they show.
 */
export async function loadItem(style: string, component: string): Promise<ItemDetail | undefined> {
  const load = itemLoaders[itemId(style, component)];
  return load ? load() : undefined;
}
