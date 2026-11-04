/**
 * Accessibility checks: runs axe-core on every item's stage (see stage.ts),
 * in light and in dark, against WCAG 2.2 A and AA. Contrast is checked per
 * theme, so a token that only fails in dark mode is caught. Best-practice
 * rules for whole pages (landmarks, one h1) are left out: an item is a part.
 *
 *   pnpm a11y [style/slug,style/slug]      exits 1 on any violation
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { AxeResults, RunOptions } from "axe-core";
import { chromium } from "playwright";
import { readItem, readManifest, showItem, stagePage, THEMES } from "./stage";

const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
const options: RunOptions = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  resultTypes: ["violations"],
};

const only = process.argv[2]?.split(",");
const manifest = await readManifest();
const items = manifest.items.filter((item) => !only || only.includes(item.id));
const browser = await chromium.launch();
const page = await stagePage(browser, 1);

let violations = 0;
for (const entry of items) {
  const item = await readItem(entry.id);
  for (const theme of THEMES) {
    await showItem(page, manifest, item, theme);
    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(
      (opts) =>
        (
          window as unknown as { axe: { run: (c: Document, o: RunOptions) => Promise<AxeResults> } }
        ).axe.run(document, opts),
      options,
    );
    for (const violation of results.violations) {
      violations++;
      console.log(
        `\n${item.id} (${theme}) [${violation.impact}] ${violation.id}: ${violation.help}`,
      );
      for (const node of violation.nodes.slice(0, 4)) {
        const detail = node.any[0]?.message ?? node.failureSummary?.split("\n")[1]?.trim() ?? "";
        console.log(`  ${node.target.join(" ")}\n    ${detail}`);
      }
      if (violation.nodes.length > 4) console.log(`  …and ${violation.nodes.length - 4} more`);
    }
  }
}
await browser.close();

console.log(
  `\na11y: ${items.length} items × ${THEMES.length} themes, ${violations} violation${violations === 1 ? "" : "s"}`,
);
process.exit(violations > 0 ? 1 : 0);
