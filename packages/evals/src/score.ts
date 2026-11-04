/**
 * Scoring for one answer: does it render, does it pass the style's checker,
 * and how does it look (light and dark screenshots for the judge and report).
 *
 * structural = 0 if it doesn't render, otherwise
 *   40 (renders) + 40 (no checker errors) + 20 × (1 − warnings / 5, floored at 0)
 */
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import tailwind from "@tailwindcss/postcss";
import type { Browser } from "playwright";
import postcss from "postcss";
import { evalsRoot, repoRoot, type StyleInfo, tokensCss } from "./sandbox";

export interface Score {
  rendered: boolean;
  renderError?: string;
  errors: number;
  warnings: number;
  issues: string[];
  structural: number;
  shots?: { light: string; dark: string };
}

type Issue = { level: "error" | "warning"; rule: string; message: string; line: number };

function render(sandbox: string, file: string) {
  const tsx = createRequire(import.meta.url).resolve("tsx/cli");
  return new Promise<{ ok: boolean; markup?: string; error?: string }>((resolve) => {
    const child = spawn(process.execPath, [tsx, path.join(evalsRoot, "src/render.ts"), file], {
      cwd: sandbox,
      env: { ...process.env, TSX_TSCONFIG_PATH: path.join(sandbox, "tsconfig.json") },
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (c: Buffer) => {
      out += c.toString();
    });
    child.stderr.on("data", (c: Buffer) => {
      err += c.toString();
    });
    child.on("close", () => {
      const line = out.trim().split("\n").pop() ?? "";
      try {
        resolve(JSON.parse(line));
      } catch {
        resolve({ ok: false, error: (err || out).slice(0, 400) || "Render produced no output." });
      }
    });
  });
}

async function checker(style: string) {
  const file = path.join(repoRoot, "packages/registry/styles", style, "skill/scripts/check.mjs");
  const mod = (await import(pathToFileURL(file).href)) as {
    check?: (s: string) => Issue[];
    checkIllustration?: (s: string) => Issue[];
  };
  const fn = mod.check ?? mod.checkIllustration;
  if (!fn) throw new Error(`${style} checker exports no check function`);
  return fn;
}

/** Preflight + the style's tokens + only the utilities the answer uses. */
async function compileCss(style: string, sandbox: string) {
  const input = [
    "@layer theme, base, components, utilities;",
    '@import "tailwindcss/theme.css" layer(theme);',
    '@import "tailwindcss/preflight.css" layer(base);',
    '@import "tailwindcss/utilities.css" layer(utilities);',
    await tokensCss(style),
  ].join("\n");
  const result = await postcss([tailwind({ base: sandbox, optimize: false })]).process(input, {
    from: path.join(evalsRoot, "__eval__.css"),
  });
  return result.css;
}

export async function score(
  browser: Browser,
  options: {
    style: string;
    info: StyleInfo;
    sandbox: string;
    output: string;
    shotBase: string;
  },
): Promise<Score> {
  const file = path.join(options.sandbox, options.output);
  const source = await readFile(file, "utf8").catch(() => null);
  if (source === null) {
    return {
      rendered: false,
      renderError: `The agent didn't write ${options.output}.`,
      errors: 0,
      warnings: 0,
      issues: [],
      structural: 0,
    };
  }

  const issues = (await checker(options.style))(source);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.length - errors;
  const listed = issues.map((i) => `${i.level} [${i.rule}] line ${i.line}: ${i.message}`);

  const rendered = await render(options.sandbox, file);
  if (!rendered.ok || !rendered.markup) {
    return {
      rendered: false,
      renderError: rendered.error,
      errors,
      warnings,
      issues: listed,
      structural: 0,
    };
  }

  const css = await compileCss(options.style, options.sandbox);
  const fonts = options.info.fonts
    .map(
      (f) =>
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family)}:wght@${f.weights.join(";")}&display=block">`,
    )
    .join("");
  const page = await browser.newPage({
    viewport: { width: 720, height: 450 },
    deviceScaleFactor: 2,
  });
  const shots = { light: `${options.shotBase}.light.png`, dark: `${options.shotBase}.dark.png` };
  for (const theme of ["light", "dark"] as const) {
    await page.setContent(
      `<!doctype html><html class="${theme}" data-motion="off"><head>${fonts}<style>${css}</style>` +
        "<style>body>svg{width:min(560px,82vw);height:auto}</style></head>" +
        `<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:${options.info.stage[theme]}">` +
        `${rendered.markup}</body></html>`,
      { waitUntil: "networkidle" },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: shots[theme] });
  }
  await page.close();

  const structural = Math.round(40 + (errors === 0 ? 40 : 0) + 20 * Math.max(0, 1 - warnings / 5));
  return { rendered: true, errors, warnings, issues: listed, structural, shots };
}
