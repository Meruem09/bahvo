/**
 * Renders a thumbnail for every registry item from its HTML export and
 * per-item CSS, so it needs no running site. Files are named by content hash:
 * unchanged items are skipped and stale files are pruned.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import type { ItemDetail, Manifest } from "../src/schema";

const root = fileURLToPath(new URL("..", import.meta.url));
const webPublic = path.resolve(root, "../../apps/web/public");
const manifest = JSON.parse(
  await readFile(path.join(root, "src/generated/manifest.json"), "utf8"),
) as Manifest;

const wanted = new Set(manifest.items.map((item) => path.join(webPublic, item.thumb)));
const pending: ItemDetail[] = [];
for (const item of manifest.items) {
  const existing = await readFile(path.join(webPublic, item.thumb)).catch(() => null);
  if (!existing) {
    pending.push(
      JSON.parse(
        await readFile(path.join(root, "src/generated/items", `${item.id}.json`), "utf8"),
      ) as ItemDetail,
    );
  }
}

const fontsFor = (style: string) =>
  manifest.styles
    .find((s) => s.slug === style)
    ?.fonts.map(
      (f) =>
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family)}:wght@${f.weights.join(";")}&display=block">`,
    )
    .join("") ?? "";

if (pending.length > 0) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 720, height: 450 },
    deviceScaleFactor: 2,
  });
  for (const item of pending) {
    const css = await readFile(path.join(webPublic, item.cssUrl), "utf8");
    await page.setContent(
      `<!doctype html><html><head>${fontsFor(item.style)}<style>${css}</style></head>` +
        `<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:${item.stage.light}">` +
        `${item.htmlExport.markup.code}</body></html>`,
      { waitUntil: "networkidle" },
    );
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: "png" });
    const out = path.join(webPublic, item.thumb);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, await sharp(png).resize({ width: 960 }).webp({ quality: 82 }).toBuffer());
    console.log(`thumbs: ${item.id}`);
  }
  await browser.close();
}

// Prune thumbnails whose hash no longer matches any item.
const thumbsDir = path.join(webPublic, "thumbs");
let pruned = 0;
for (const style of await readdir(thumbsDir).catch(() => [])) {
  for (const file of await readdir(path.join(thumbsDir, style))) {
    const full = path.join(thumbsDir, style, file);
    if (!wanted.has(full)) {
      await rm(full);
      pruned++;
    }
  }
}
console.log(
  `thumbs: ${pending.length} rendered, ${manifest.items.length - pending.length} cached, ${pruned} pruned`,
);
