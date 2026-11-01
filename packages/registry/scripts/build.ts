/**
 * Registry build: validates source content and generates everything the site,
 * CLI and agents consume.
 *
 *   src/generated/manifest.json            small index (grids, filters, search)
 *   src/generated/items/<s>/<slug>.json    full detail per item (one chunk each)
 *   src/generated/loaders.ts               lazy loaders for item detail
 *   src/generated/previews.ts              lazy loaders for preview demos
 *   apps/web/public/r/**                   shadcn-compatible registry JSON
 *   apps/web/public/css/<s>/<slug>.<h>.css per-item stylesheet (preview, thumbs, HTML export)
 *   apps/web/public/svg/<s>/<slug>.<h>.<theme>.svg  standalone illustrations
 *   apps/web/public/skills/<s>/**          the style's agent skill bundle
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import tailwind from "@tailwindcss/postcss";
import { transform } from "lightningcss";
import postcss from "postcss";
import * as prettier from "prettier";
import { type ComponentType, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createHighlighter } from "shiki";
import type { z } from "zod";
import {
  type CodeFile,
  type Contract,
  contractSchema,
  type ImplementationMeta,
  type ItemDetail,
  implementationMetaSchema,
  type Manifest,
  type ManifestItem,
  type ManifestStyle,
  type ManifestSubject,
  type StyleMeta,
  type Subject,
  styleMetaSchema,
  subjectSchema,
  type Tokens,
  tokensSchema,
} from "../src/schema";

/** Bump to invalidate every item hash (thumbnails, CSS) after a pipeline change. */
const PIPELINE_VERSION = "2";

const root = fileURLToPath(new URL("..", import.meta.url));
const generatedDir = path.join(root, "src/generated");
const webPublic = path.resolve(root, "../../apps/web/public");
const publicUrl = (process.env.BAHVO_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "");

const errors: string[] = [];
const warnings: string[] = [];

type Issue = { level: "error" | "warning"; rule: string; message: string; line: number };
type Checker = (source: string) => Issue[];

async function exists(file: string) {
  return access(file).then(
    () => true,
    () => false,
  );
}

async function readJson<S extends z.ZodType>(file: string, schema: S): Promise<z.infer<S> | null> {
  const parsed = schema.safeParse(JSON.parse(await readFile(file, "utf8")));
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(
        `${path.relative(root, file)}: ${issue.path.join(".") || "(root)"} ${issue.message}`,
      );
    }
    return null;
  }
  return parsed.data;
}

async function dirs(parent: string) {
  if (!(await exists(parent))) return [];
  const entries = await readdir(parent, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

async function jsonFiles(dir: string) {
  if (!(await exists(dir))) return [];
  return (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
}

async function write(file: string, contents: string) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
}

function tokensCss(tokens: Tokens) {
  const block = (selector: string, vars: Record<string, string>) =>
    `${selector} {\n${Object.entries(vars)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join("\n")}\n}`;
  return [
    block(":root", tokens.light),
    block(".dark", tokens.dark),
    block("@theme inline", tokens.theme),
  ].join("\n\n");
}

/** Compiles preflight + tokens + only the utilities used inside `dir`. */
async function compileCss(dir: string, tokens: string) {
  const input = [
    "@layer theme, base, components, utilities;",
    '@import "tailwindcss/theme.css" layer(theme);',
    '@import "tailwindcss/preflight.css" layer(base);',
    '@import "tailwindcss/utilities.css" layer(utilities);',
    tokens,
  ].join("\n");
  const result = await postcss([tailwind({ base: dir, optimize: false })]).process(input, {
    from: path.join(dir, "__bahvo__.css"),
  });
  const pretty = await prettier.format(result.css, { parser: "css" });
  const { code } = transform({
    filename: "item.css",
    code: Buffer.from(result.css),
    minify: true,
  });
  return { pretty, minified: code.toString() };
}

/** Replaces `var(--name, fallback)` with the theme's token value, for standalone SVG. */
function bakeColors(svg: string, vars: Record<string, string>) {
  return svg.replace(
    /var\((--[a-z0-9-]+)(?:,\s*([^)]*))?\)/g,
    (_, name: string, fallback?: string) => {
      return vars[name] ?? fallback?.trim() ?? "currentColor";
    },
  );
}

/** Published files import the kit from the user's lib alias, not our relative path. */
function rewriteKitImports(code: string, kit: StyleMeta["kit"]) {
  let out = code;
  for (const file of kit) {
    const base = path.basename(file.path).replace(/\.tsx?$/, "");
    const lib = file.target.replace(/^@lib\//, "@/lib/").replace(/\.tsx?$/, "");
    out = out.replace(new RegExp(`(["'])(?:\\.\\./)+kit/${base}\\1`, "g"), `"${lib}"`);
  }
  return out;
}

const escapeHtml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const stripDashes = (vars: Record<string, string>) =>
  Object.fromEntries(Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ""), v]));

const skillName = (skillMd: string) => /^name:\s*(.+)$/m.exec(skillMd)?.[1]?.trim();

async function build() {
  const started = performance.now();

  // ---- Shared catalogs ----------------------------------------------------
  const contracts = new Map<string, Contract>();
  for (const file of await jsonFiles(path.join(root, "contracts"))) {
    const contract = await readJson(path.join(root, "contracts", file), contractSchema);
    if (!contract) continue;
    if (`${contract.slug}.json` !== file) {
      errors.push(`contracts/${file}: slug "${contract.slug}" must match the file name`);
    }
    contracts.set(contract.slug, contract);
  }
  const subjects = new Map<string, Subject>();
  for (const file of await jsonFiles(path.join(root, "subjects"))) {
    const subject = await readJson(path.join(root, "subjects", file), subjectSchema);
    if (!subject) continue;
    if (`${subject.slug}.json` !== file) {
      errors.push(`subjects/${file}: slug "${subject.slug}" must match the file name`);
    }
    subjects.set(subject.slug, subject);
  }

  // ---- Styles and their items ---------------------------------------------
  type Item = {
    slug: string;
    dir: string;
    meta: ImplementationMeta;
    contract?: Contract;
    subject?: Subject;
    files: { name: string; target: string; code: string }[];
    demoPath: string;
    demoCode: string;
  };
  type Source = {
    style: StyleMeta;
    dir: string;
    tokens: Tokens;
    tokensJson: string;
    styleJson: string;
    kitFiles: { name: string; target: string; code: string }[];
    skill?: { md: string; name: string };
    items: Item[];
  };
  const sources: Source[] = [];

  for (const styleSlug of await dirs(path.join(root, "styles"))) {
    const styleDir = path.join(root, "styles", styleSlug);
    const style = await readJson(path.join(styleDir, "style.json"), styleMetaSchema);
    const tokens = await readJson(path.join(styleDir, "tokens.json"), tokensSchema);
    if (!style || !tokens) continue;
    if (style.slug !== styleSlug) {
      errors.push(
        `styles/${styleSlug}/style.json: slug "${style.slug}" must match the folder name`,
      );
    }

    const kitFiles = [];
    for (const file of style.kit) {
      const kitPath = path.join(styleDir, file.path);
      if (!(await exists(kitPath))) {
        errors.push(`styles/${styleSlug}/style.json: kit file ${file.path} does not exist`);
        continue;
      }
      kitFiles.push({
        name: path.basename(file.path),
        target: file.target,
        code: await readFile(kitPath, "utf8"),
      });
    }

    const checkerPath = path.join(styleDir, "skill/scripts/check.mjs");
    const checker = (await exists(checkerPath))
      ? ((await import(pathToFileURL(checkerPath).href)) as { checkIllustration: Checker })
          .checkIllustration
      : undefined;

    const skillPath = path.join(styleDir, "skill/SKILL.md");
    let skill: Source["skill"];
    if (await exists(skillPath)) {
      const md = await readFile(skillPath, "utf8");
      const name = skillName(md);
      if (name) skill = { md, name };
      else errors.push(`styles/${styleSlug}/skill/SKILL.md: frontmatter needs a name`);
    }

    const source: Source = {
      style,
      dir: styleDir,
      tokens,
      tokensJson: await readFile(path.join(styleDir, "tokens.json"), "utf8"),
      styleJson: await readFile(path.join(styleDir, "style.json"), "utf8"),
      kitFiles,
      skill,
      items: [],
    };

    for (const slug of await dirs(path.join(styleDir, style.kind))) {
      const dir = path.join(styleDir, style.kind, slug);
      const where = `styles/${styleSlug}/${style.kind}/${slug}`;
      const meta = await readJson(path.join(dir, "meta.json"), implementationMetaSchema);
      if (!meta) continue;

      let contract: Contract | undefined;
      let subject: Subject | undefined;
      if (style.kind === "components") {
        contract = contracts.get(slug);
        if (!contract) {
          errors.push(`${where}: no contract at contracts/${slug}.json`);
          continue;
        }
        const missing = contract.states.filter((state) => !meta.states.includes(state));
        if (missing.length > 0) {
          errors.push(`${where}: missing required states from the contract: ${missing.join(", ")}`);
        }
      } else {
        subject = subjects.get(slug);
        if (!subject) {
          errors.push(`${where}: no subject at subjects/${slug}.json`);
          continue;
        }
      }

      const files = [];
      for (const file of meta.files) {
        const filePath = path.join(dir, file.path);
        if (!(await exists(filePath))) {
          errors.push(`${where}: file ${file.path} listed in meta.json does not exist`);
          continue;
        }
        const code = await readFile(filePath, "utf8");
        for (const issue of checker?.(code) ?? []) {
          const line = `${where}/${file.path}:${issue.line} [${issue.rule}] ${issue.message}`;
          (issue.level === "error" ? errors : warnings).push(line);
        }
        files.push({ name: file.path, target: file.target, code });
      }

      const demoPath = path.join(dir, meta.demo);
      if (!(await exists(demoPath))) {
        errors.push(`${where}: demo ${meta.demo} does not exist`);
        continue;
      }

      source.items.push({
        slug,
        dir,
        meta,
        contract,
        subject,
        files,
        demoPath,
        demoCode: await readFile(demoPath, "utf8"),
      });
    }
    sources.push(source);
  }

  if (errors.length > 0) return false;

  // ---- Generate -----------------------------------------------------------
  await rm(generatedDir, { recursive: true, force: true });
  for (const dir of ["r", "css", "svg", "skills"]) {
    await rm(path.join(webPublic, dir), { recursive: true, force: true });
  }

  const highlighter = await createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "html"],
  });
  // Generated CSS and SVG are long, and token-level highlighting would make
  // them ~12x heavier on every detail page, so they ship as plain text.
  const codeFile = (name: string, language: CodeFile["language"], code: string): CodeFile => ({
    name,
    language,
    code,
    html:
      language === "css" || language === "svg"
        ? `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
        : highlighter.codeToHtml(code, {
            lang: language,
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          }),
  });

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    styles: [],
    subjects: [],
    items: [],
  };
  const subjectIndex = new Map<string, ManifestSubject>();
  const registryItems: object[] = [];
  const loaderLines: string[] = [];
  const previewLines: string[] = [];
  const schemaUrl = "https://ui.shadcn.com/schema/registry-item.json";

  for (const source of sources) {
    const { style, tokens, tokensJson, styleJson, kitFiles, items } = source;
    const css = tokensCss(tokens);
    const tokensUrl = `${publicUrl}/r/${style.slug}/tokens.json`;
    const kitUrl = `${publicUrl}/r/${style.slug}/kit.json`;
    const manifestStyle: ManifestStyle = { ...style, items: [], tokensUrl };

    const tokensItem = {
      $schema: schemaUrl,
      name: `${style.slug}-tokens`,
      type: "registry:theme",
      title: `${style.name} tokens`,
      description: `Design tokens for the ${style.name} style.`,
      cssVars: {
        theme: stripDashes(tokens.theme),
        light: stripDashes(tokens.light),
        dark: stripDashes(tokens.dark),
      },
    };
    await write(
      path.join(webPublic, "r", style.slug, "tokens.json"),
      JSON.stringify(tokensItem, null, 2),
    );
    registryItems.push({ ...tokensItem, cssVars: undefined });

    if (kitFiles.length > 0) {
      const kitItem = {
        $schema: schemaUrl,
        name: `${style.slug}-kit`,
        type: "registry:lib",
        title: `${style.name} kit`,
        description: `Drawing primitives shared by every ${style.name} item.`,
        files: kitFiles.map((f) => ({
          path: `registry/${style.slug}/${f.name}`,
          type: "registry:lib",
          target: f.target,
          content: f.code,
        })),
      };
      await write(
        path.join(webPublic, "r", style.slug, "kit.json"),
        JSON.stringify(kitItem, null, 2),
      );
      registryItems.push({ ...kitItem, files: kitItem.files.map(({ content: _, ...f }) => f) });
    }

    const kitHash = kitFiles.map((f) => f.code).join("\0");
    const isIllustration = style.kind === "illustrations";

    for (const item of items) {
      const id = `${style.slug}/${item.slug}`;
      const hash = createHash("sha256")
        .update(PIPELINE_VERSION)
        .update(styleJson)
        .update(tokensJson)
        .update(kitHash)
        .update(JSON.stringify(item.contract ?? item.subject))
        .update(JSON.stringify(item.meta))
        .update(item.demoCode)
        .update(item.files.map((f) => f.code).join("\0"))
        .digest("hex")
        .slice(0, 10);

      const { default: Demo } = (await import(pathToFileURL(item.demoPath).href)) as {
        default: ComponentType;
      };
      const markup = await prettier.format(renderToStaticMarkup(createElement(Demo)), {
        parser: "html",
        printWidth: 100,
      });
      const compiled = await compileCss(item.dir, css);
      const cssUrl = `/css/${id}.${hash}.css`;
      await write(path.join(webPublic, cssUrl), compiled.minified);

      const name = item.contract?.name ?? item.subject?.name ?? item.slug;
      const category = item.contract?.category ?? item.subject?.category ?? "other";
      const publishedFiles = item.files.map((f) => ({
        ...f,
        code: rewriteKitImports(f.code, style.kit),
      }));

      const registryUrl = `${publicUrl}/r/${id}.json`;
      const fileType = isIllustration ? "registry:component" : "registry:ui";
      const registryItem = {
        $schema: schemaUrl,
        name: `${style.slug}-${item.slug}`,
        type: fileType,
        title: `${style.name} ${name}`,
        description: item.meta.description,
        dependencies: item.meta.dependencies,
        registryDependencies: [tokensUrl, ...(kitFiles.length > 0 ? [kitUrl] : [])],
        files: publishedFiles.map((f) => ({
          path: `registry/${style.slug}/${f.name === "illustration.tsx" ? `${item.slug}.tsx` : f.name}`,
          type: fileType,
          target: f.target,
          content: f.code,
        })),
        meta: { bahvo: { kind: style.kind, style: style.slug, slug: item.slug, hash } },
      };
      await write(path.join(webPublic, "r", `${id}.json`), JSON.stringify(registryItem, null, 2));
      registryItems.push({
        ...registryItem,
        files: registryItem.files.map(({ content: _, ...f }) => f),
      });

      let svg: ItemDetail["svg"];
      if (isIllustration) {
        const light = bakeColors(markup, tokens.light);
        const dark = bakeColors(markup, tokens.dark);
        const lightUrl = `/svg/${id}.${hash}.light.svg`;
        const darkUrl = `/svg/${id}.${hash}.dark.svg`;
        await write(path.join(webPublic, lightUrl), light);
        await write(path.join(webPublic, darkUrl), dark);
        svg = {
          light: codeFile(`${item.slug}.light.svg`, "svg", light),
          dark: codeFile(`${item.slug}.dark.svg`, "svg", dark),
          lightUrl,
          darkUrl,
        };
      }

      const manifestItem: ManifestItem = {
        id,
        kind: style.kind,
        style: style.slug,
        slug: item.slug,
        name,
        category,
        description: item.meta.description,
        hash,
        thumbs: {
          light: `/thumbs/${id}.${hash}.light.webp`,
          dark: `/thumbs/${id}.${hash}.dark.webp`,
        },
      };
      const detail: ItemDetail = {
        ...manifestItem,
        styleName: style.name,
        contract: item.contract,
        subject: item.subject,
        states: item.meta.states,
        dependencies: item.meta.dependencies,
        react: [
          ...publishedFiles.map((f) =>
            codeFile(f.name === "illustration.tsx" ? `${item.slug}.tsx` : f.name, "tsx", f.code),
          ),
          ...kitFiles.map((f) => codeFile(f.name, "tsx", f.code)),
        ],
        htmlExport: isIllustration
          ? undefined
          : {
              markup: codeFile("index.html", "html", markup),
              css: codeFile("styles.css", "css", compiled.pretty),
            },
        svg,
        cssUrl,
        stage: style.stage,
        registryUrl,
        install: {
          bahvo: `npx bahvo add ${id}`,
          shadcn: `npx shadcn@latest add ${registryUrl}`,
        },
      };
      await write(path.join(generatedDir, "items", `${id}.json`), JSON.stringify(detail));

      manifest.items.push(manifestItem);
      manifestStyle.items.push(id);
      const key = `${style.kind}:${item.slug}`;
      const entry = subjectIndex.get(key) ?? {
        kind: style.kind,
        slug: item.slug,
        name,
        category,
        description: item.contract?.description ?? item.subject?.description ?? "",
        styles: [],
      };
      entry.styles.push(style.slug);
      subjectIndex.set(key, entry);

      loaderLines.push(
        `  "${id}": () => import("./items/${id}.json").then((m) => m.default as unknown as ItemDetail),`,
      );
      const demoImport = path
        .relative(generatedDir, item.demoPath)
        .replaceAll(path.sep, "/")
        .replace(/\.tsx$/, "");
      previewLines.push(`  "${id}": () => import("${demoImport}"),`);
    }

    if (source.skill) {
      manifestStyle.skill = await writeSkill(source, css);
    }
    manifest.styles.push(manifestStyle);
  }
  manifest.subjects = [...subjectIndex.values()].sort((a, b) => a.name.localeCompare(b.name));

  highlighter.dispose();

  const banner = "// Generated by packages/registry/scripts/build.ts. Do not edit.\n";
  await write(path.join(generatedDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  await write(
    path.join(generatedDir, "loaders.ts"),
    `${banner}import type { ItemDetail } from "../schema";\n\nexport const itemLoaders: Record<string, () => Promise<ItemDetail>> = {\n${loaderLines.join("\n")}\n};\n`,
  );
  await write(
    path.join(generatedDir, "previews.ts"),
    `${banner}import type { ComponentType } from "react";\n\nexport const previews: Record<string, () => Promise<{ default: ComponentType }>> = {\n${previewLines.join("\n")}\n};\n`,
  );
  await write(
    path.join(webPublic, "r", "registry.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: "bahvo",
        homepage: publicUrl,
        items: registryItems,
      },
      null,
      2,
    ),
  );

  for (const warning of warnings) console.warn(`registry: warning ${warning}`);
  const ms = Math.round(performance.now() - started);
  console.log(
    `registry: ${manifest.styles.length} style(s), ${manifest.items.length} item(s) in ${ms}ms`,
  );
  return true;
}

/**
 * Writes the style's agent skill as static files plus an index the CLI reads:
 * SKILL.md, the kit, every published item as an example, tokens and scripts.
 */
async function writeSkill(
  source: {
    style: StyleMeta;
    dir: string;
    kitFiles: { name: string; code: string }[];
    skill?: { md: string; name: string };
    items: { slug: string; files: { name: string; code: string }[]; subject?: Subject }[];
  },
  tokensCssText: string,
): Promise<ManifestStyle["skill"]> {
  const { style, skill } = source;
  if (!skill) return undefined;
  const base = path.join(webPublic, "skills", style.slug);
  const files: Record<string, string> = {
    "SKILL.md": skill.md,
    "references/tokens.css": tokensCssText,
    "scripts/check.mjs": await readFile(path.join(source.dir, "skill/scripts/check.mjs"), "utf8"),
  };
  for (const ref of await readdir(path.join(source.dir, "skill")).catch(() => [])) {
    if (ref.endsWith(".md") && ref !== "SKILL.md") {
      files[`references/${ref}`] = await readFile(path.join(source.dir, "skill", ref), "utf8");
    }
  }
  for (const kit of source.kitFiles) files[`references/kit/${kit.name}`] = kit.code;
  for (const item of source.items) {
    for (const file of item.files) {
      const name = file.name === "illustration.tsx" ? `${item.slug}.tsx` : file.name;
      files[`references/examples/${name}`] = rewriteKitImports(file.code, style.kit);
    }
  }
  files["references/catalog.md"] = [
    `# ${style.name} catalog`,
    "",
    "Subjects already drawn. Reuse their composition before inventing a new one.",
    "",
    ...source.items.map(
      (item) =>
        `- **${item.subject?.name ?? item.slug}** (\`examples/${item.slug}.tsx\`): ${item.subject?.description ?? ""}`,
    ),
    "",
  ].join("\n");

  for (const [file, contents] of Object.entries(files))
    await write(path.join(base, file), contents);
  await write(
    path.join(base, "index.json"),
    JSON.stringify(
      { name: skill.name, style: style.slug, files: Object.keys(files).sort() },
      null,
      2,
    ),
  );
  return {
    name: skill.name,
    url: `${publicUrl}/skills/${style.slug}/index.json`,
    install: `npx bahvo skill add ${style.slug}`,
  };
}

const ok = await build();
if (!ok) {
  console.error(`registry: ${errors.length} error(s)\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
