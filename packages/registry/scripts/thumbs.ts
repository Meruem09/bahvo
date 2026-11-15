/**
 * Renders a thumbnail for every registry item on its stage (see stage.ts),
 * so it needs no running site. Files are named by content hash: unchanged
 * items are skipped and stale files are pruned.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
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

/**
 * Each component is captured through a 16:10 window fitted to its demo with
 * a margin, so small demos (a button row, breadcrumbs) fill their card and
 * read at full size instead of floating in an empty frame. The window is
 * never wider than 576px, the largest demo's frame (demos fit 536x330;
 * scripts/measure.ts prints their sizes), and never narrower than 320px.
 */
const STAGE = { width: 720, height: 450 };
const MARGIN = { x: 56, y: 48 };
const WIDTH = { min: 320, max: 576 };

async function frameFor(page: Page) {
  // The union of every element's box, so open popovers and menus count too.
  const box = await page.evaluate(() => {
    const rects = [...document.body.querySelectorAll("*")]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 1 && r.height > 1);
    return {
      left: Math.min(...rects.map((r) => r.left)),
      top: Math.min(...rects.map((r) => r.top)),
      right: Math.max(...rects.map((r) => r.right)),
      bottom: Math.max(...rects.map((r) => r.bottom)),
    };
  });
  const content = { width: box.right - box.left, height: box.bottom - box.top };
  const width = Math.min(
    WIDTH.max,
    Math.max(WIDTH.min, content.width + MARGIN.x, (content.height + MARGIN.y) * 1.6),
  );
  const height = width / 1.6;
  const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);
  return {
    x: clamp((box.left + box.right) / 2 - width / 2, STAGE.width - width),
    y: clamp((box.top + box.bottom) / 2 - height / 2, STAGE.height - height),
    width,
    height,
  };
}

if (pending.length > 0) {
  const browser = await chromium.launch();
  const page = await stagePage(browser, 3);
  for (const item of pending) {
    for (const theme of THEMES) {
      await showItem(page, manifest, item, theme);
      const clip = item.svg ? undefined : await frameFor(page);
      const png = await page.screenshot({ type: "png", ...(clip ? { clip } : {}) });
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
