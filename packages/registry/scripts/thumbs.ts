/**
 * Renders a thumbnail for every registry item on its stage (see stage.ts),
 * so it needs no running site. Files are named by content hash: unchanged
 * items are skipped and stale files are pruned.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import type { ItemDetail } from "../src/schema";
import { readItem, readManifest, showItem, stagePage, THEMES, webPublic } from "./stage";

const manifest = await readManifest();

const wanted = new Set(
  manifest.items.flatMap((item) =>
    [item.thumbs.light, item.thumbs.dark].map((t) => path.join(webPublic, t)),
  ),
);
const pending: ItemDetail[] = [];
for (const item of manifest.items) {
  const existing = await Promise.all(
    [item.thumbs.light, item.thumbs.dark].map((t) =>
      readFile(path.join(webPublic, t)).catch(() => null),
    ),
  );
  if (existing.some((file) => !file)) pending.push(await readItem(item.id));
}

if (pending.length > 0) {
  const browser = await chromium.launch();
  const page = await stagePage(browser);
  for (const item of pending) {
    for (const theme of THEMES) {
      await showItem(page, manifest, item, theme);
      const png = await page.screenshot({ type: "png" });
      const out = path.join(webPublic, item.thumbs[theme]);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(
        out,
        await sharp(png).resize({ width: 960 }).webp({ quality: 82 }).toBuffer(),
      );
    }
    console.log(`thumbs: ${item.id}`);
  }
  await browser.close();
}

// Prune thumbnails whose hash no longer matches any item.
const thumbsDir = path.join(webPublic, "thumbs");
let pruned = 0;
for (const style of await readdir(thumbsDir).catch(() => [] as string[])) {
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
