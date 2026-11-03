/**
 * Sandboxes: a fresh project per task and condition, created in the OS temp
 * directory so an agent can't read the registry's examples from a parent
 * folder. Both conditions get the same project (the style's tokens and kit, as
 * a user would have after installing them); only "skill" also gets the skill.
 */
import { cp, mkdir, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const evalsRoot = fileURLToPath(new URL("../", import.meta.url));
export const repoRoot = path.resolve(evalsRoot, "../..");
const registryRoot = path.join(repoRoot, "packages/registry");
const webPublic = path.join(repoRoot, "apps/web/public");

export type Condition = "skill" | "baseline";

export interface Suite {
  style: string;
  kind: "components" | "illustrations";
  output: string;
  prompt: string;
  tasks: { id: string; subject: string }[];
}

export interface StyleInfo {
  stage: { light: string; dark: string };
  fonts: { family: string; weights: number[] }[];
  kit: { path: string; target: string }[];
}

export async function loadSuite(style: string): Promise<Suite> {
  return JSON.parse(await readFile(path.join(evalsRoot, "suites", `${style}.json`), "utf8"));
}

export async function loadStyle(style: string): Promise<StyleInfo> {
  const meta = JSON.parse(
    await readFile(path.join(registryRoot, "styles", style, "style.json"), "utf8"),
  );
  return { stage: meta.stage, fonts: meta.fonts ?? [], kit: meta.kit ?? [] };
}

/** The style's tokens as CSS: `:root`, `.dark` and `@theme inline`, as the registry ships them. */
export async function tokensCss(style: string) {
  const tokens = JSON.parse(
    await readFile(path.join(registryRoot, "styles", style, "tokens.json"), "utf8"),
  ) as Record<"light" | "dark" | "theme", Record<string, string>>;
  const block = (selector: string, vars: Record<string, string>) =>
    `${selector} {\n${Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n")}\n}`;
  return [
    block(":root", tokens.light),
    block(".dark", tokens.dark),
    block("@theme inline", tokens.theme),
  ].join("\n\n");
}

/** Maps a shadcn-style install target to a project path. */
function targetPath(target: string) {
  return target
    .replace(/^@lib\//, "lib/")
    .replace(/^@ui\//, "components/ui/")
    .replace(/^@components\//, "components/");
}

export async function createSandbox(suite: Suite, condition: Condition, taskId: string) {
  const dir = await mkdtemp(
    path.join(os.tmpdir(), `bahvo-eval-${suite.style}-${taskId}-${condition}-`),
  );
  const style = await loadStyle(suite.style);
  const css = await tokensCss(suite.style);

  await writeFile(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "app", private: true, type: "module" }, null, 2),
  );
  await writeFile(
    path.join(dir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          module: "ESNext",
          moduleResolution: "Bundler",
          strict: true,
          baseUrl: ".",
          paths: { "@/*": ["./*"] },
        },
      },
      null,
      2,
    ),
  );
  await mkdir(path.join(dir, "app"), { recursive: true });
  await writeFile(path.join(dir, "app/globals.css"), `@import "tailwindcss";\n\n${css}\n`);

  for (const file of style.kit) {
    const out = path.join(dir, targetPath(file.target));
    await mkdir(path.dirname(out), { recursive: true });
    await cp(path.join(registryRoot, "styles", suite.style, file.path), out);
  }

  // The renderer resolves react from the sandbox; a junction keeps it outside the repo tree.
  await symlink(path.join(evalsRoot, "node_modules"), path.join(dir, "node_modules"), "junction");

  if (condition === "skill") {
    const skillDir = path.join(webPublic, "skills", suite.style);
    const index = JSON.parse(
      await readFile(path.join(skillDir, "index.json"), "utf8").catch(() => {
        throw new Error(
          `No skill bundle for "${suite.style}". Run the registry build first (pnpm --filter @bahvo/registry build).`,
        );
      }),
    ) as { name: string; files: string[] };
    for (const file of index.files) {
      const out = path.join(dir, ".claude/skills", index.name, file);
      await mkdir(path.dirname(out), { recursive: true });
      await cp(path.join(skillDir, file), out);
    }
  }
  return dir;
}
