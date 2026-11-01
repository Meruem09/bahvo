import { itemLoaders } from "./generated/loaders";
import manifestJson from "./generated/manifest.json";
import type { ItemDetail, ItemKind, Manifest } from "./schema";

export * from "./schema";

export const manifest = manifestJson as Manifest;

export function itemId(style: string, slug: string) {
  return `${style}/${slug}`;
}

export function getStyle(slug: string) {
  return manifest.styles.find((style) => style.slug === slug);
}

/** A component contract or illustration subject that at least one style implements. */
export function getSubject(kind: ItemKind, slug: string) {
  return manifest.subjects.find((subject) => subject.kind === kind && subject.slug === slug);
}

export function getSubjects(kind: ItemKind) {
  return manifest.subjects.filter((subject) => subject.kind === kind);
}

export function getItemsForStyle(style: string) {
  return manifest.items.filter((item) => item.style === style);
}

export function getItemsForSubject(kind: ItemKind, slug: string) {
  return manifest.items.filter((item) => item.kind === kind && item.slug === slug);
}

export function getItems(kind: ItemKind) {
  return manifest.items.filter((item) => item.kind === kind);
}

/**
 * Loads one item's full detail (source code, highlighted HTML, install info).
 * Each item is its own JSON chunk, so pages only pay for the item they show.
 */
export async function loadItem(style: string, slug: string): Promise<ItemDetail | undefined> {
  const load = itemLoaders[itemId(style, slug)];
  return load ? load() : undefined;
}
