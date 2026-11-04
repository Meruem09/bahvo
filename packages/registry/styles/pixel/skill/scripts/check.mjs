#!/usr/bin/env node
/**
 * Pixel illustration checker. The same rules run in the bahvo registry build
 * and in the agent skill, so "passes the checker" means the same thing for a
 * hand-drawn illustration and an agent-drawn one.
 *
 * Usage: node check.mjs <file.tsx>...   (exit code 1 when any error is found)
 */
import { readFileSync } from "node:fs";

/** @typedef {{ level: "error" | "warning", rule: string, message: string, line: number }} Issue */

const RULES = [
  {
    rule: "use-kit",
    level: "error",
    test: (src) => !/from\s+["'](?:\.\.\/\.\.\/kit\/pixel|@\/lib\/pixel)["']/.test(src),
    message: 'Draw with the pixel kit ("@/lib/pixel"): a Canvas, masks and roles.',
  },
  {
    rule: "pixels-canvas",
    level: "error",
    test: (src) => !/new Canvas\(/.test(src) || !/<Pixels\b[^>]*\btitle=/.test(src),
    message:
      "Paint on a `new Canvas(w, h)` and render it with <Pixels title=... canvas={...}> for an accessible name.",
  },
  {
    rule: "default-export",
    level: "error",
    test: (src) => !/export\s+default\s+\w+/.test(src),
    message: "Default-export the illustration component.",
  },
];

const LINE_RULES = [
  {
    rule: "token-colors",
    level: "error",
    pattern: /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i,
    message: "Paint roles only (line, white, accent...). Hard-coded colors break the dark theme.",
  },
  {
    rule: "no-raw-svg",
    level: "error",
    pattern: /<(?:rect|path|circle|ellipse|line|polygon|polyline|g|image)\b/,
    message: "Paint cells on the Canvas; raw SVG shapes don't snap to the grid.",
  },
  {
    rule: "no-blur-or-gradients",
    level: "error",
    pattern: /\b(?:filter|linearGradient|radialGradient|drop-shadow|blur)\b/,
    message: "Pixel art is flat cells: no blur, filters or gradients.",
  },
];

/** Keep cells chunky: past this, a cell drops below 9px at the 560px preview size. */
const MAX_WIDTH = 64;
const MAX_HEIGHT = 48;

/** At most this many accent paints: orange is a touch, not a fill. */
const ACCENT_BUDGET = 8;

/** At most this many motion layers. */
const MOTION_BUDGET = 2;

/**
 * @param {string} source
 * @returns {Issue[]}
 */
export function checkIllustration(source) {
  /** @type {Issue[]} */
  const issues = [];
  for (const { rule, level, test, message } of RULES) {
    if (test(source)) issues.push({ level, rule, message, line: 1 });
  }
  const lines = source.split("\n");
  lines.forEach((text, i) => {
    if (/^\s*(?:\/\/|\*|\/\*)/.test(text)) return;
    for (const { rule, level, pattern, message } of LINE_RULES) {
      if (pattern.test(text)) issues.push({ level, rule, message, line: i + 1 });
    }
    const size = text.match(/new Canvas\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (size && (Number(size[1]) > MAX_WIDTH || Number(size[2]) > MAX_HEIGHT)) {
      issues.push({
        level: "warning",
        rule: "canvas-size",
        message: `Keep the canvas within ${MAX_WIDTH}x${MAX_HEIGHT} cells (56x40 is the house size) so cells stay chunky.`,
        line: i + 1,
      });
    }
  });
  const accents = (source.match(/["']accent(?:Dark|Light)?["']/g) ?? []).length;
  if (accents > ACCENT_BUDGET) {
    issues.push({
      level: "warning",
      rule: "accent-budget",
      message: `${accents} accent paints; keep orange to ${ACCENT_BUDGET} or fewer so it stays a touch.`,
      line: 1,
    });
  }
  const motions = (source.match(/\.layer\(/g) ?? []).length;
  if (motions > MOTION_BUDGET) {
    issues.push({
      level: "warning",
      rule: "motion-budget",
      message: `${motions} motion layers; keep it to ${MOTION_BUDGET} so the drawing stays calm.`,
      line: 1,
    });
  }
  return issues;
}

const isMain =
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replaceAll("\\", "/").split("/").pop());
if (isMain) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: node check.mjs <file.tsx>...");
    process.exit(2);
  }
  let errors = 0;
  for (const file of files) {
    const issues = checkIllustration(readFileSync(file, "utf8"));
    for (const issue of issues) {
      if (issue.level === "error") errors++;
      console.log(`${file}:${issue.line} ${issue.level} [${issue.rule}] ${issue.message}`);
    }
    if (issues.length === 0) console.log(`${file}: ok`);
  }
  process.exit(errors > 0 ? 1 : 0);
}
