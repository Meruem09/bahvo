/**
 * The page every item is rendered on outside the site: its HTML export (or
 * standalone SVG) with its own compiled CSS, centered on its stage, with
 * motion off. Thumbnails, accessibility checks and visual regression all use
 * this one document, so they all look at the same thing. Needs a built
 * registry (src/generated and apps/web/public/css), not a running site.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, Page } from "playwright";
import type { ItemDetail, Manifest } from "../src/schema";

export const root = fileURLToPath(new URL("..", import.meta.url));
export const webPublic = path.resolve(root, "../../apps/web/public");
export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export async function readManifest() {
  return JSON.parse(
    await readFile(path.join(root, "src/generated/manifest.json"), "utf8"),
  ) as Manifest;
}

export async function readItem(id: string) {
  return JSON.parse(
    await readFile(path.join(root, "src/generated/items", `${id}.json`), "utf8"),
  ) as ItemDetail;
}

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch] ?? ch,
  );

/** The full HTML document for one item in one theme. */
export async function stageDocument(manifest: Manifest, item: ItemDetail, theme: Theme) {
  const css = await readFile(path.join(webPublic, item.cssUrl), "utf8");
  const fonts =
    manifest.styles
      .find((s) => s.slug === item.style)
      ?.fonts.map(
        (f) =>
          `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family)}:wght@${f.weights.join(";")}&display=block">`,
      )
      .join("") ?? "";
  // Illustrations render their standalone SVG for the theme; components render their HTML export.
  const body = item.svg ? item.svg[theme].code : (item.htmlExport?.markup.code ?? "");
  return (
    `<!doctype html><html lang="en" class="${theme}" data-motion="off"><head><meta charset="utf-8">` +
    `<title>${escapeHtml(item.name)}</title>${fonts}<style>${css}</style>` +
    "<style>body>svg{width:min(560px,82vw);height:auto}</style></head>" +
    `<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:${item.stage[theme]}">` +
    `${body}</body></html>`
  );
}

/** A page sized like a thumbnail, with motion-safe animation held still. */
export function stagePage(browser: Browser, deviceScaleFactor = 2) {
  return browser.newPage({
    viewport: { width: 720, height: 450 },
    deviceScaleFactor,
    // motion-safe: pulses and spinners hold still, so a capture never lands mid-fade.
    reducedMotion: "reduce",
  });
}

/** Loads an item's document into the page and waits for its fonts. */
export async function showItem(page: Page, manifest: Manifest, item: ItemDetail, theme: Theme) {
  await page.setContent(await stageDocument(manifest, item, theme), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}
