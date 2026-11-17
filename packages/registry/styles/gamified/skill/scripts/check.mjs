#!/usr/bin/env node
/**
 * Gamified component checker. The same rules run in the bahvo registry build
 * and in the agent skill, so "passes the checker" means the same thing for a
 * hand-built component and an agent-built one.
 *
 * Usage: node check.mjs <file.tsx>...   (exit code 1 when any error is found)
 */
import { readFileSync } from "node:fs";

/** @typedef {{ level: "error" | "warning", rule: string, message: string, line: number }} Issue */

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";

const RULES = [
  {
    rule: "named-export",
    level: "error",
    test: (src) => !/export function [A-Z]\w*/.test(src),
    message: "Export the component as a named PascalCase function.",
  },
  {
    rule: "focus-visible",
    level: "error",
    test: (src) => /<(?:button|a|input|select|textarea)\b/.test(src) && !/focus-visible:/.test(src),
    message: "Every interactive element needs a focus-visible style (the violet ring).",
  },
  {
    rule: "display-font",
    level: "warning",
    test: (src) => /<h[1-4]\b/.test(src) && !/\bfont-gm-display\b/.test(src),
    message: "Titles are set in Fredoka: give headings font-gm-display.",
  },
  {
    rule: "press",
    level: "warning",
    test: (src) =>
      /\bshadow-gm-(?:primary|gold|danger)\b/.test(src) && !/\bactive:translate-y-/.test(src),
    message:
      "Raised buttons sink when pressed: pair the ledge shadow with active:translate-y-1 active:shadow-none.",
  },
];

const LINE_RULES = [
  {
    rule: "token-colors",
    level: "error",
    pattern: /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i,
    message: "Use gm-* token utilities only. Hard-coded colors break the dark theme.",
  },
  {
    rule: "token-utilities",
    level: "error",
    pattern: new RegExp(
      `\\b(?:bg|text|border|ring|outline|fill|stroke|divide|from|to|via|decoration|accent|caret)-(?:${PALETTE})(?:-\\d{2,3})?\\b`,
    ),
    message: "Use gm-* color utilities (bg-gm-surface, text-gm-muted...), not Tailwind's palette.",
  },
  {
    rule: "chunky-edges",
    level: "warning",
    pattern: /(?:^|[\s"'`])border border-gm-/,
    message:
      "Edges are chunky: panes and controls take border-2 (hairline dividers use border-t / divide-y).",
  },
  {
    rule: "gold-text",
    level: "warning",
    pattern: /\btext-gm-gold\b/,
    message:
      "Gold fails contrast as text: put text-gm-on-gold on a bg-gm-gold fill, or use gold for icons with a gold-depth edge.",
  },
  {
    rule: "radius-scale",
    level: "warning",
    pattern: /\brounded-(?:[trblse]{1,2}-)?(?:xs|sm|md|lg|xl|2xl|3xl)\b/,
    message:
      "Use the radius scale: rounded-gm-sm, rounded-gm, rounded-gm-lg (or rounded-full for pills).",
  },
  {
    rule: "shadow-scale",
    level: "warning",
    pattern: /\bshadow-(?:xs|sm|md|lg|xl|2xl)\b/,
    message:
      "Depth is a hard ledge: shadow-gm(-sm), shadow-gm-primary/gold/danger, and shadow-gm-lg for overlays only.",
  },
  {
    rule: "no-blur",
    level: "warning",
    pattern: /\b(?:backdrop-)?blur(?:-|\b)/,
    message: "Gamified is solid and crisp: no blur.",
  },
  {
    rule: "no-gradients",
    level: "warning",
    pattern: /\bbg-(?:linear|radial|conic|gradient)-/,
    message:
      "Fills are flat and bright; the shine comes from the inset highlight in the shadow tokens.",
  },
  {
    rule: "native-elements",
    level: "warning",
    pattern: /<div\b[^>]*\bonClick=/,
    message: "Clickable things are <button> or <a>, not a div with onClick.",
  },
];

/** At most this many gold utilities per file: gold marks one thing. */
const GOLD_BUDGET = 6;

/**
 * @param {string} source
 * @returns {Issue[]}
 */
export function check(source) {
  /** @type {Issue[]} */
  const issues = [];
  for (const { rule, level, test, message } of RULES) {
    if (test(source)) issues.push({ level, rule, message, line: 1 });
  }
  source.split("\n").forEach((text, i) => {
    if (/^\s*(?:\/\/|\*|\/\*)/.test(text)) return;
    for (const { rule, level, pattern, message } of LINE_RULES) {
      if (pattern.test(text)) issues.push({ level, rule, message, line: i + 1 });
    }
  });
  const golds = (source.match(/\b[\w:-]*-gm-gold(?:-depth|-soft)?\b/g) ?? []).length;
  if (golds > GOLD_BUDGET) {
    issues.push({
      level: "warning",
      rule: "gold-budget",
      message: `${golds} gold uses; gold should mark one thing: a reward, the live state or the current item.`,
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
    const issues = check(readFileSync(file, "utf8"));
    for (const issue of issues) {
      if (issue.level === "error") errors++;
      console.log(`${file}:${issue.line} ${issue.level} [${issue.rule}] ${issue.message}`);
    }
    if (issues.length === 0) console.log(`${file}: ok`);
  }
  process.exit(errors > 0 ? 1 : 0);
}
