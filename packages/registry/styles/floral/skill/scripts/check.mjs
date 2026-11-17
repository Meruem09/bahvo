#!/usr/bin/env node
/**
 * Floral component checker. The same rules run in the bahvo registry build
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
    message: "Every interactive element needs a focus-visible style (the orchid ring or outline).",
  },
  {
    rule: "display-font",
    level: "warning",
    test: (src) => /<h[1-4]\b/.test(src) && !/\bfont-fl-display\b/.test(src),
    message: "Titles are set in Fraunces: give headings font-fl-display.",
  },
];

const LINE_RULES = [
  {
    rule: "token-colors",
    level: "error",
    pattern: /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i,
    message: "Use fl-* token utilities only. Hard-coded colors break the dark theme.",
  },
  {
    rule: "token-utilities",
    level: "error",
    pattern: new RegExp(
      `\\b(?:bg|text|border|ring|outline|fill|stroke|divide|from|to|via|decoration|accent|caret)-(?:${PALETTE})(?:-\\d{2,3})?\\b`,
    ),
    message: "Use fl-* color utilities (bg-fl-surface, text-fl-muted...), not Tailwind's palette.",
  },
  {
    rule: "radius-scale",
    level: "warning",
    pattern: /\brounded-(?:[trblse]{1,2}-)?(?:xs|sm|md|lg|xl|2xl|3xl)\b/,
    message:
      "Use the radius scale: rounded-fl-sm, rounded-fl, rounded-fl-lg, rounded-fl-leaf (panes) or rounded-full (pills).",
  },
  {
    rule: "leaf-whole",
    level: "warning",
    pattern: /\brounded-[trblse]{1,2}-fl-leaf\b/,
    message:
      "The leaf cut is a two-value radius: use rounded-fl-leaf on the whole box, never one side.",
  },
  {
    rule: "shadow-scale",
    level: "warning",
    pattern: /\bshadow-(?:xs|sm|md|lg|xl|2xl)\b/,
    message: "Use shadow-fl for panes and controls and shadow-fl-lg for overlays only.",
  },
  {
    rule: "no-gradients",
    level: "warning",
    pattern: /\bbg-(?:linear|radial|conic|gradient)-/,
    message: "The backdrop carries the watercolor; components stay flat paper fills.",
  },
  {
    rule: "native-elements",
    level: "warning",
    pattern: /<div\b[^>]*\bonClick=/,
    message: "Clickable things are <button> or <a>, not a div with onClick.",
  },
];

/** At most this many accent utilities per file: orchid marks one meaning. */
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
  const accents = (source.match(/\b[\w:-]*-fl-accent(?:-soft)?\b/g) ?? []).filter(
    (cls) => !/(?:outline|ring)-fl-accent/.test(cls),
  ).length;
  if (accents > ACCENT_BUDGET) {
    issues.push({
      level: "warning",
      rule: "accent-budget",
      message: `${accents} non-focus accent uses; orchid should mark one thing: the current, live or active item.`,
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
