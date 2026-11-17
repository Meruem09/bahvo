/**
 * Prints each component demo's size on its stage, to check it fits the
 * fixed thumbnail window (see thumbs.ts).
 *
 *   pnpm tsx scripts/measure.ts
 */
import { chromium } from "playwright";
import { readItem, readManifest, showItem, stagePage } from "./stage";

const manifest = await readManifest();
const browser = await chromium.launch();
const page = await stagePage(browser, 1);
for (const entry of manifest.items.filter((item) => item.kind === "components")) {
  const item = await readItem(entry.id);
  await showItem(page, manifest, item, "light");
  const box = await page.evaluate(() => {
    const rect = document.body.firstElementChild?.getBoundingClientRect();
    return rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : "?";
  });
  console.log(`${item.id.padEnd(32)} ${box}`);
}
await browser.close();
