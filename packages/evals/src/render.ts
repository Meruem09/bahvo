/**
 * Renders an agent's answer to static markup, in its own process (run with
 * cwd = the sandbox, so its tsconfig paths and node_modules apply). Prints one
 * JSON line: { ok, markup } or { ok: false, error }.
 */
import { pathToFileURL } from "node:url";
import { type ComponentType, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const file = process.argv[2];
try {
  if (!file) throw new Error("usage: render.ts <file>");
  const mod = (await import(pathToFileURL(file).href)) as { default?: ComponentType };
  if (typeof mod.default !== "function")
    throw new Error("The file has no default-exported component.");
  const markup = renderToStaticMarkup(createElement(mod.default));
  if (!markup.trim()) throw new Error("The component rendered nothing.");
  console.log(JSON.stringify({ ok: true, markup }));
} catch (error) {
  console.log(
    JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }),
  );
}
