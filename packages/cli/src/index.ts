#!/usr/bin/env node
/**
 * bahvo CLI. Components are served as shadcn-compatible registry items, so
 * `add` resolves and validates bahvo ids, then hands installation to the
 * shadcn CLI (which handles aliases, dependencies and CSS variables).
 */
import { spawn } from "node:child_process";
import { parseArgs } from "node:util";

// TODO: switch to the production URL once the site is deployed.
const DEFAULT_REGISTRY = "http://localhost:3000";

const HELP = `bahvo: UI styles and components

Usage
  bahvo add <style>/<component>...   Install components into this project
  bahvo list [style]                 List available components

Options
  --registry <url>   Registry base URL (env: BAHVO_REGISTRY, default ${DEFAULT_REGISTRY})
  --dry-run          Show what would be installed without installing
  -h, --help         Show this help
`;

interface RegistryIndex {
  items: {
    name: string;
    type: string;
    title?: string;
    meta?: { bahvo?: { style: string; component: string } };
  }[];
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    registry: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

const registry = (values.registry ?? process.env.BAHVO_REGISTRY ?? DEFAULT_REGISTRY).replace(
  /\/$/,
  "",
);
const [command, ...args] = positionals;

async function fetchIndex(): Promise<RegistryIndex> {
  const url = `${registry}/r/registry.json`;
  const res = await fetch(url).catch((error: unknown) => {
    throw new Error(`Could not reach the registry at ${registry} (${String(error)})`);
  });
  if (!res.ok) throw new Error(`Registry index ${url} returned ${res.status}`);
  return (await res.json()) as RegistryIndex;
}

function components(index: RegistryIndex) {
  return index.items.flatMap((item) =>
    item.meta?.bahvo ? [{ ...item.meta.bahvo, title: item.title ?? item.name }] : [],
  );
}

async function list(style?: string) {
  const all = components(await fetchIndex()).filter((c) => !style || c.style === style);
  if (all.length === 0) {
    console.log(style ? `No components for style "${style}".` : "The registry is empty.");
    return;
  }
  for (const c of all) console.log(`${`${c.style}/${c.component}`.padEnd(32)} ${c.title}`);
}

async function add(ids: string[]) {
  if (ids.length === 0) throw new Error("Usage: bahvo add <style>/<component>...");
  const available = new Set(components(await fetchIndex()).map((c) => `${c.style}/${c.component}`));
  const unknown = ids.filter((id) => !available.has(id));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown component(s): ${unknown.join(", ")}. Run "bahvo list" to see what's available.`,
    );
  }

  const urls = ids.map((id) => `${registry}/r/${id}.json`);
  if (values["dry-run"]) {
    console.log(`Would run: npx shadcn@latest add ${urls.join(" ")}`);
    return;
  }
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const code = await new Promise<number>((resolve) => {
    const child = spawn(npx, ["shadcn@latest", "add", ...urls], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("exit", (exitCode) => resolve(exitCode ?? 1));
  });
  process.exitCode = code;
}

try {
  if (values.help || !command) console.log(HELP);
  else if (command === "add") await add(args);
  else if (command === "list") await list(args[0]);
  else throw new Error(`Unknown command "${command}".\n\n${HELP}`);
} catch (error) {
  console.error(`bahvo: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
