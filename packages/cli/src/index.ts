#!/usr/bin/env node
/**
 * bahvo CLI. Items are served as shadcn-compatible registry items, so `add`
 * resolves and validates bahvo ids, then hands installation to the shadcn CLI
 * (which handles aliases, dependencies and CSS variables). `skill add` copies
 * a style's agent skill into the project.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

// TODO: switch to the production URL once the site is deployed.
const DEFAULT_REGISTRY = "http://localhost:3000";

/** Where each agent looks for project skills. */
const SKILL_DIRS = {
  claude: ".claude/skills",
  agents: ".agents/skills",
} as const;

const HELP = `bahvo: UI styles, components and illustrations

Usage
  bahvo add <style>/<item>...      Install components or illustrations into this project
  bahvo list [style]               List available items
  bahvo skill add <style>          Install a style's agent skill

Options
  --registry <url>   Registry base URL (env: BAHVO_REGISTRY, default ${DEFAULT_REGISTRY})
  --agent <name>     For skill add: ${Object.keys(SKILL_DIRS).join(" | ")} (default claude)
  --dir <path>       For skill add: install into this skills folder instead
  --dry-run          Show what would happen without changing anything
  -h, --help         Show this help
`;

interface RegistryIndex {
  items: {
    name: string;
    type: string;
    title?: string;
    meta?: { bahvo?: { kind: string; style: string; slug: string } };
  }[];
}

interface SkillIndex {
  name: string;
  style: string;
  files: string[];
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    registry: { type: "string" },
    agent: { type: "string", default: "claude" },
    dir: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

const registry = (values.registry ?? process.env.BAHVO_REGISTRY ?? DEFAULT_REGISTRY).replace(
  /\/$/,
  "",
);
const [command, ...args] = positionals;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url).catch((error: unknown) => {
    throw new Error(`Could not reach the registry at ${registry} (${String(error)})`);
  });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return (await res.json()) as T;
}

async function items() {
  const index = await fetchJson<RegistryIndex>(`${registry}/r/registry.json`);
  return index.items.flatMap((item) =>
    item.meta?.bahvo ? [{ ...item.meta.bahvo, title: item.title ?? item.name }] : [],
  );
}

async function list(style?: string) {
  const all = (await items()).filter((item) => !style || item.style === style);
  if (all.length === 0) {
    console.log(style ? `No items for style "${style}".` : "The registry is empty.");
    return;
  }
  for (const item of all) {
    console.log(`${`${item.style}/${item.slug}`.padEnd(28)} ${item.kind.padEnd(14)} ${item.title}`);
  }
}

async function add(ids: string[]) {
  if (ids.length === 0) throw new Error("Usage: bahvo add <style>/<item>...");
  const available = new Set((await items()).map((item) => `${item.style}/${item.slug}`));
  const unknown = ids.filter((id) => !available.has(id));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown item(s): ${unknown.join(", ")}. Run "bahvo list" to see what's available.`,
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

async function addSkill(style: string | undefined) {
  if (!style) throw new Error("Usage: bahvo skill add <style>");
  const agent = values.agent as keyof typeof SKILL_DIRS;
  if (!values.dir && !(agent in SKILL_DIRS)) {
    throw new Error(
      `Unknown agent "${values.agent}". Use one of: ${Object.keys(SKILL_DIRS).join(", ")}`,
    );
  }
  const base = `${registry}/skills/${style}`;
  const skill = await fetchJson<SkillIndex>(`${base}/index.json`).catch(() => {
    throw new Error(`Style "${style}" has no agent skill.`);
  });
  const target = path.resolve(values.dir ?? SKILL_DIRS[agent], skill.name);

  for (const file of skill.files) {
    // Never write outside the skill folder, whatever the index says.
    const out = path.resolve(target, file);
    if (!out.startsWith(target + path.sep))
      throw new Error(`Refusing unsafe path in skill: ${file}`);
    if (values["dry-run"]) {
      console.log(`Would write ${path.relative(process.cwd(), out)}`);
      continue;
    }
    const res = await fetch(`${base}/${file}`);
    if (!res.ok) throw new Error(`${base}/${file} returned ${res.status}`);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, await res.text());
  }
  if (!values["dry-run"]) {
    console.log(
      `Installed skill "${skill.name}" (${skill.files.length} files) in ${path.relative(process.cwd(), target)}`,
    );
  }
}

try {
  if (values.help || !command) console.log(HELP);
  else if (command === "add") await add(args);
  else if (command === "list") await list(args[0]);
  else if (command === "skill" && args[0] === "add") await addSkill(args[1]);
  else throw new Error(`Unknown command "${positionals.join(" ")}".\n\n${HELP}`);
} catch (error) {
  console.error(`bahvo: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
