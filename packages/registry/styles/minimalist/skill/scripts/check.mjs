#!/usr/bin/env node
/**
 * Minimalist component checker. The same rules run in the bahvo registry
 * build and in the agent skill, so "passes the checker" means the same thing
 * for a hand-built component and an agent-built one.
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
    message: "Every interactive element needs a focus-visible style (the orange ring or outline).",
  },
];

const LINE_RULES = [
  {
    rule: "token-colors",
    level: "error",
    pattern: /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i,
    message: "Use mn-* token utilities only. Hard-coded colors break the dark theme.",
  },
  {
    rule: "token-utilities",
    level: "error",
    pattern: new RegExp(
      `\\b(?:bg|text|border|ring|outline|fill|stroke|divide|from|to|via|decoration|accent|caret)-(?:${PALETTE})(?:-\\d{2,3})?\\b`,
    ),
    message: "Use mn-* color utilities (bg-mn-surface, text-mn-muted...), not Tailwind's palette.",
  },
  {
    rule: "flat-surfaces",
    level: "error",
    pattern: /\bbg-(?:linear|radial|conic|gradient)-|\bblur(?:-\w+)?\b|\bdrop-shadow\b/,
    message: "Minimalist surfaces are flat: no gradients, blur or drop shadows.",
  },
  {
    rule: "radius-scale",
    level: "warning",
    pattern: /\brounded-(?:xs|sm|md|lg|xl|2xl|3xl)\b/,
    message:
      "Use the radius scale: rounded-mn-sm, rounded-mn, rounded-mn-lg (or rounded-full for pills).",
  },
  {
    rule: "shadow-scale",
    level: "warning",
    pattern: /\bshadow-(?:xs|sm|md|lg|xl|2xl)\b/,
    message: "Use shadow-mn-sm for controls and shadow-mn-lg for overlays only.",
  },
  {
    rule: "native-elements",
    level: "warning",
    pattern: /<div\b[^>]*\bonClick=/,
    message: "Clickable things are <button> or <a>, not a div with onClick.",
  },
];

/** At most this many accent utilities per file: orange marks one meaning. */
const ACCENT_BUDGET = 6;

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
  const accents = (source.match(/\b[\w:-]*-mn-accent(?:-soft)?\b/g) ?? []).filter(
    (cls) => !/(?:outline|ring)-mn-accent/.test(cls),
  ).length;
  if (accents > ACCENT_BUDGET) {
    issues.push({
      level: "warning",
      rule: "accent-budget",
      message: `${accents} non-focus accent uses; orange should mark one thing: the current, live or active item.`,
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
