/**
 * Contact sheet: renders illustrations into one PNG, for reviewing artwork
 * while drawing it.
 *
 *   pnpm sheet [out.png] [slug,slug] [--width=380] [--theme=light|dark|both] [--scale=1.5]
 *
 * Use a large --width with one slug to inspect line weights up close.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../styles/isometric", import.meta.url));
const flags = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => a.slice(2).split("=") as [string, string]),
);
const [out = "dist/sheet.png", only] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const width = Number(flags.width ?? 380);
const scale = Number(flags.scale ?? 1.5);
const themes =
  flags.theme === "light" || flags.theme === "dark" ? [flags.theme] : ["light", "dark"];

const tokens = JSON.parse(readFileSync(`${root}/tokens.json`, "utf8"));
const vars = (m: Record<string, string>) =>
  Object.entries(m)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");

const cells: string[] = [];
for (const slug of readdirSync(`${root}/illustrations`)) {
  if (only && !only.split(",").includes(slug)) continue;
  const mod = await import(
    pathToFileURL(path.join(root, "illustrations", slug, "illustration.tsx")).href
  );
  const svg = renderToStaticMarkup(createElement(mod.default, { width }));
  for (const theme of themes) {
    cells.push(
      `<div class="cell" style="${vars(tokens[theme])};background:var(--iso-stage)">${svg}<p style="color:var(--iso-text)">${slug}</p></div>`,
    );
  }
}
const html = `<!doctype html><html data-iso-motion="off"><body style="margin:0;font:12px system-ui"><style>.cell{display:inline-block;padding:12px;vertical-align:top}.cell svg{display:block;height:auto}p{margin:4px 0 0}</style>${cells.join("")}</body></html>`;
const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: Math.max(860, (width + 24) * themes.length), height: 400 },
  deviceScaleFactor: scale,
});
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log("wrote", out);
