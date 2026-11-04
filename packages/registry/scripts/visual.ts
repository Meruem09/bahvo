/**
 * Visual regression: renders every item on its stage (see stage.ts), light
 * and dark, and compares each render with a baseline, pixel by pixel. Writes
 * visual/report/index.html with the baseline, the new render and a diff for
 * every change, and marks the changes that came only from shared code (a kit,
 * tokens, the pipeline) without the item's own code changing: those
 * collateral changes are what this exists to catch.
 *
 *   pnpm visual                compare with visual/baseline; exit 1 on changes
 *   pnpm visual --update       accept the current renders as the baseline
 *   pnpm visual --report-only  compare, but always exit 0 (CI)
 *   pnpm visual style/slug,…   only these items
 *
 * Baselines are per machine (visual/ is gitignored): text renders differently
 * on each OS, so CI keeps its own baseline as an artifact of the last green
 * main run.
 */
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { readItem, readManifest, root, showItem, stagePage, THEMES, type Theme } from "./stage";

const dir = path.join(root, "visual");
const baselineDir = path.join(dir, "baseline");
const currentDir = path.join(dir, "current");
const reportDir = path.join(dir, "report");

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
const only = process.argv
  .slice(2)
  .find((a) => !a.startsWith("--"))
  ?.split(",");

/** A pixel differs when any channel moves more than this; a render differs past MIN_PIXELS. */
const CHANNEL = 24;
const MIN_PIXELS = 10;

type Owners = Record<string, string>;
const readOwners = async (from: string): Promise<Owners> =>
  JSON.parse(await readFile(path.join(from, "owners.json"), "utf8").catch(() => "{}"));
const file = (from: string, id: string, theme: Theme) => path.join(from, `${id}.${theme}.png`);

// 1. Render everything to visual/current, and hash each item's own code.
const manifest = await readManifest();
const items = manifest.items.filter((item) => !only || only.includes(item.id));
await rm(currentDir, { recursive: true, force: true });
const owners: Owners = {};
const browser = await chromium.launch();
const page = await stagePage(browser, 1);
for (const entry of items) {
  const item = await readItem(entry.id);
  owners[item.id] = createHash("sha256")
    .update(item.react.map((f) => f.code).join("\0"))
    .digest("hex")
    .slice(0, 12);
  for (const theme of THEMES) {
    await showItem(page, manifest, item, theme);
    const out = file(currentDir, item.id, theme);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, await page.screenshot({ type: "png" }));
  }
}
await browser.close();
await writeFile(path.join(currentDir, "owners.json"), JSON.stringify(owners, null, 2));

// 2. Accept: the current renders become the baseline.
if (flags.has("--update")) {
  const kept = only ? await readOwners(baselineDir) : {};
  if (!only) await rm(baselineDir, { recursive: true, force: true });
  await cp(currentDir, baselineDir, { recursive: true });
  await writeFile(
    path.join(baselineDir, "owners.json"),
    JSON.stringify({ ...kept, ...owners }, null, 2),
  );
  console.log(`visual: baseline updated with ${items.length} items × ${THEMES.length} themes`);
  process.exit(0);
}

// 3. Compare.
const raw = async (png: string) => {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
};

/** Changed pixels in orange over a faded copy of the new render. */
async function diff(before: string, after: string) {
  const [a, b] = await Promise.all([raw(before), raw(after)]);
  if (a.width !== b.width || a.height !== b.height)
    return { changed: a.width * a.height, image: null };
  const out = Buffer.alloc(b.data.length);
  let changed = 0;
  for (let i = 0; i < b.data.length; i += 4) {
    const moved =
      Math.abs((a.data[i] ?? 0) - (b.data[i] ?? 0)) > CHANNEL ||
      Math.abs((a.data[i + 1] ?? 0) - (b.data[i + 1] ?? 0)) > CHANNEL ||
      Math.abs((a.data[i + 2] ?? 0) - (b.data[i + 2] ?? 0)) > CHANNEL;
    if (moved) changed++;
    const gray = 0.3 * (b.data[i] ?? 0) + 0.59 * (b.data[i + 1] ?? 0) + 0.11 * (b.data[i + 2] ?? 0);
    const faded = Math.round(200 + (gray * 55) / 255);
    out.set(moved ? [247, 107, 21, 255] : [faded, faded, faded, 255], i);
  }
  const image = await sharp(out, { raw: { width: b.width, height: b.height, channels: 4 } })
    .png()
    .toBuffer();
  return { changed, image };
}

const baselineOwners = await readOwners(baselineDir);
const hasBaseline = Object.keys(baselineOwners).length > 0;
await rm(reportDir, { recursive: true, force: true });
await mkdir(reportDir, { recursive: true });

interface Change {
  id: string;
  theme: Theme;
  pixels: number;
  collateral: boolean;
}
const changes: Change[] = [];
const added: string[] = [];
for (const id of Object.keys(owners)) {
  if (!baselineOwners[id]) {
    added.push(id);
    continue;
  }
  for (const theme of THEMES) {
    const result = await diff(file(baselineDir, id, theme), file(currentDir, id, theme)).catch(
      () => ({ changed: Number.POSITIVE_INFINITY, image: null }),
    );
    if (result.changed < MIN_PIXELS) continue;
    const name = `${id.replace("/", "-")}.${theme}`;
    await cp(file(baselineDir, id, theme), path.join(reportDir, `${name}.before.png`)).catch(
      () => {},
    );
    await cp(file(currentDir, id, theme), path.join(reportDir, `${name}.after.png`));
    if (result.image) await writeFile(path.join(reportDir, `${name}.diff.png`), result.image);
    changes.push({
      id,
      theme,
      pixels: result.changed,
      collateral: baselineOwners[id] === owners[id],
    });
  }
}
const removed = only ? [] : Object.keys(baselineOwners).filter((id) => !owners[id]);

// 4. Report.
const collateral = changes.filter((c) => c.collateral);
const card = (c: Change) => {
  const name = `${c.id.replace("/", "-")}.${c.theme}`;
  const img = (kind: string, label: string) =>
    `<figure><img src="${name}.${kind}.png" alt="${label}"><figcaption>${label}</figcaption></figure>`;
  return `<section><h2>${c.id} <small>${c.theme}</small> ${
    c.collateral ? '<b class="warn">shared change only</b>' : "<b>own code changed</b>"
  } <small>${Number.isFinite(c.pixels) ? `${c.pixels} px` : "size changed"}</small></h2>
<div class="row">${img("before", "Baseline")}${img("after", "Now")}${img("diff", "Diff")}</div></section>`;
};
await writeFile(
  path.join(reportDir, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>bahvo visual report</title><style>
body{font:14px system-ui;margin:24px;color:#1c1917;background:#fcfbfa}h1{font-size:18px}h2{font-size:14px;margin:0 0 8px}
small{color:#716a65;font-weight:400}b{font-size:12px;padding:2px 6px;border-radius:99px;background:#f5f3f0}b.warn{background:#feeadb;color:#c2410c}
section{margin:0 0 28px}.row{display:flex;gap:12px;flex-wrap:wrap}figure{margin:0}img{width:360px;border:1px solid #e9e6e2;border-radius:8px}
figcaption{color:#716a65;font-size:12px;margin-top:4px}</style></head><body>
<h1>${changes.length} changed render${changes.length === 1 ? "" : "s"}, ${collateral.length} from shared code only</h1>
<p>${added.length ? `New, no baseline yet: ${added.join(", ")}.` : ""} ${removed.length ? `Removed: ${removed.join(", ")}.` : ""}</p>
${[...collateral, ...changes.filter((c) => !c.collateral)].map(card).join("\n")}</body></html>`,
);

const lines = [
  hasBaseline
    ? `visual: ${items.length} items × ${THEMES.length} themes, ${changes.length} changed (${collateral.length} from shared code only), ${added.length} new, ${removed.length} removed`
    : "visual: no baseline yet; run `pnpm visual --update` to make one",
  ...collateral.map((c) => `  shared change only: ${c.id} (${c.theme}), ${c.pixels} px`),
  ...changes.filter((c) => !c.collateral).map((c) => `  own code changed: ${c.id} (${c.theme})`),
];
console.log(lines.join("\n"));
if (changes.length) console.log(`report: ${path.join(reportDir, "index.html")}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(
    process.env.GITHUB_STEP_SUMMARY,
    `## Visual regression\n\n${lines.join("\n")}\n`,
    {
      flag: "a",
    },
  );
}
process.exit(changes.length && !flags.has("--report-only") ? 1 : 0);
