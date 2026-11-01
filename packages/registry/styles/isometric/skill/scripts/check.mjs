#!/usr/bin/env node
/**
 * Isometric illustration checker. The same rules run in the bahvo registry
 * build and in the agent skill, so "passes the checker" means the same thing
 * for a hand-drawn illustration and an agent-drawn one.
 *
 * Usage: node check.mjs <file.tsx>...   (exit code 1 when any error is found)
 */
import { readFileSync } from "node:fs";

/** @typedef {{ level: "error" | "warning", rule: string, message: string, line: number }} Issue */

const RULES = [
  {
    rule: "use-kit",
    level: "error",
    test: (src) => !/from\s+["'](?:\.\.\/\.\.\/kit\/isometric|@\/lib\/isometric)["']/.test(src),
    message:
      'Import primitives from the isometric kit ("@/lib/isometric"); never hand-project points.',
  },
  {
    rule: "iso-canvas",
    level: "error",
    test: (src) => !/<Iso\b[^>]*\btitle=/.test(src),
    message:
      "Wrap the drawing in <Iso title=...> so it has a canvas, an origin and an accessible name.",
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
    message: "Use ink.* colors only. Hard-coded colors break the dark theme.",
  },
  {
    rule: "no-blur-or-gradients",
    level: "error",
    pattern: /\b(?:filter|feGaussianBlur|linearGradient|radialGradient|drop-shadow|blur)\b/,
    message: "Faces are flat and edges are hairlines: no blur, filters or gradients.",
  },
  {
    rule: "no-free-transforms",
    level: "error",
    pattern: /\b(?:rotate|skewX|skewY|skew)\(/,
    message: "Put shapes on planes with <Face> instead of rotate/skew transforms.",
  },
  {
    rule: "hairline-strokes",
    level: "warning",
    pattern: /strokeWidth=\{?\s*["']?(?:[2-9]|1\.[6-9])/,
    message: "Keep strokes at 1px (the kit's default); heavier lines read as a different style.",
  },
  {
    rule: "no-gray-mass",
    level: "warning",
    pattern: /fill=\{ink\.(?:edge|line)\}|<FaceBar\b[^>]*color=\{ink\.(?:edge|line)\}/,
    message:
      "Don't fill shapes or bars with ink.edge/ink.line: they read as heavy strokes. Use ink.fill or ink.detail.",
  },
  {
    rule: "plate-thickness",
    level: "warning",
    pattern: /<Plate\b[^>]*thickness=\{[0-3](?:\.\d+)?\}/,
    message: "Plates thinner than 4 units merge their two outlines into one heavy line.",
  },
];

/** At most this many accent uses: orange is a touch, not a fill. */
const ACCENT_BUDGET = 8;

/** At most this many motions: ambient, on the active or floating part only. */
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
  });
  const accents = (source.match(/ink\.accent(?:Soft)?\b/g) ?? []).length;
  if (accents > ACCENT_BUDGET) {
    issues.push({
      level: "warning",
      rule: "accent-budget",
      message: `${accents} accent uses; keep orange to ${ACCENT_BUDGET} or fewer so it stays a touch.`,
      line: 1,
    });
  }
  const motions = (source.match(/<Motion\b/g) ?? []).length;
  if (motions > MOTION_BUDGET) {
    issues.push({
      level: "warning",
      rule: "motion-budget",
      message: `${motions} motions; keep it to ${MOTION_BUDGET} so the drawing stays calm.`,
      line: 1,
    });
  }
  if (/<Motion\b[^>]*kind="(?:float|spin)"[^>]*>\s*<Iso\b/.test(source)) {
    issues.push({
      level: "warning",
      rule: "motion-scope",
      message: "Animate a part (the floating piece, the active ring), never the whole drawing.",
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
