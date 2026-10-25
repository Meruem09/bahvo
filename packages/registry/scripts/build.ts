/**
 * Registry build: validates source content and generates everything the site,
 * CLI and agents consume.
 *
 *   src/generated/manifest.json          small index (grids, filters, search)
 *   src/generated/items/<s>/<c>.json     full detail per item (one chunk each)
 *   src/generated/loaders.ts             lazy loaders for item detail
 *   src/generated/previews.ts            lazy loaders for preview demos
 *   apps/web/public/r/**                 shadcn-compatible registry JSON
 *   apps/web/public/css/<s>/<c>.<h>.css  per-item stylesheet (preview, thumbs, HTML export)
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
  type ManifestComponent,
  type ManifestItem,
  type ManifestStyle,
  type StyleMeta,
  styleMetaSchema,
  type Tokens,
  tokensSchema,
} from "../src/schema";

/** Bump to invalidate every item hash (thumbnails, CSS) after a pipeline change. */
const PIPELINE_VERSION = "1";

const root = fileURLToPath(new URL("..", import.meta.url));
const generatedDir = path.join(root, "src/generated");
const webPublic = path.resolve(root, "../../apps/web/public");
const publicUrl = (process.env.BAHVO_PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "");

const errors: string[] = [];

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

const escapeHtml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const stripDashes = (vars: Record<string, string>) =>
  Object.fromEntries(Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ""), v]));

async function build() {
  const started = performance.now();

  // ---- Contracts ----------------------------------------------------------
  const contracts = new Map<string, Contract>();
  const contractDir = path.join(root, "contracts");
  for (const file of (await readdir(contractDir)).filter((f) => f.endsWith(".json")).sort()) {
    const contract = await readJson(path.join(contractDir, file), contractSchema);
    if (!contract) continue;
    if (`${contract.slug}.json` !== file) {
      errors.push(`contracts/${file}: slug "${contract.slug}" must match the file name`);
    }
    contracts.set(contract.slug, contract);
  }

  // ---- Styles and implementations -----------------------------------------
  type Source = {
    style: StyleMeta;
    tokens: Tokens;
    tokensJson: string;
    styleJson: string;
    components: {
      slug: string;
      dir: string;
      meta: ImplementationMeta;
      contract: Contract;
      files: { name: string; target: string; code: string }[];
      demoPath: string;
      demoCode: string;
    }[];
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

    const source: Source = {
      style,
      tokens,
      tokensJson: await readFile(path.join(styleDir, "tokens.json"), "utf8"),
      styleJson: await readFile(path.join(styleDir, "style.json"), "utf8"),
      components: [],
    };

    for (const componentSlug of await dirs(path.join(styleDir, "components"))) {
      const dir = path.join(styleDir, "components", componentSlug);
      const where = `styles/${styleSlug}/components/${componentSlug}`;
      const meta = await readJson(path.join(dir, "meta.json"), implementationMetaSchema);
      if (!meta) continue;

      const contract = contracts.get(componentSlug);
      if (!contract) {
        errors.push(`${where}: no contract at contracts/${componentSlug}.json`);
        continue;
      }
      const missing = contract.states.filter((state) => !meta.states.includes(state));
      if (missing.length > 0) {
        errors.push(`${where}: missing required states from the contract: ${missing.join(", ")}`);
      }

      const files = [];
      for (const file of meta.files) {
        const filePath = path.join(dir, file.path);
        if (!(await exists(filePath))) {
          errors.push(`${where}: file ${file.path} listed in meta.json does not exist`);
          continue;
        }
        files.push({
          name: file.path,
          target: file.target,
          code: await readFile(filePath, "utf8"),
        });
      }

      const demoPath = path.join(dir, meta.demo);
      if (!(await exists(demoPath))) {
        errors.push(`${where}: demo ${meta.demo} does not exist`);
        continue;
      }

      source.components.push({
        slug: componentSlug,
        dir,
        meta,
        contract,
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
  await rm(path.join(webPublic, "r"), { recursive: true, force: true });
  await rm(path.join(webPublic, "css"), { recursive: true, force: true });

  const highlighter = await createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "html", "css"],
  });
  const codeFile = (name: string, language: CodeFile["language"], code: string): CodeFile => ({
    name,
    language,
    code,
    // Generated CSS (preflight + utilities) is long, and token-level highlighting
    // would make it ~12x heavier on every detail page, so it ships as plain text.
    html:
      language === "css"
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
    components: [],
    items: [],
  };
  const componentIndex = new Map<string, ManifestComponent>();
  const registryItems: object[] = [];
  const loaderLines: string[] = [];
  const previewLines: string[] = [];

  for (const { style, tokens, tokensJson, styleJson, components } of sources) {
    const css = tokensCss(tokens);
    const manifestStyle: ManifestStyle = {
      ...style,
      items: [],
      tokensUrl: `${publicUrl}/r/${style.slug}/tokens.json`,
    };

    const tokensItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
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

    for (const component of components) {
      const id = `${style.slug}/${component.slug}`;
      const hash = createHash("sha256")
        .update(PIPELINE_VERSION)
        .update(styleJson)
        .update(tokensJson)
        .update(JSON.stringify(component.contract))
        .update(JSON.stringify(component.meta))
        .update(component.demoCode)
        .update(component.files.map((f) => f.code).join("\0"))
        .digest("hex")
        .slice(0, 10);

      const { default: Demo } = (await import(pathToFileURL(component.demoPath).href)) as {
        default: ComponentType;
      };
      const markup = await prettier.format(renderToStaticMarkup(createElement(Demo)), {
        parser: "html",
        printWidth: 100,
      });
      const compiled = await compileCss(component.dir, css);

      const cssUrl = `/css/${style.slug}/${component.slug}.${hash}.css`;
      await write(path.join(webPublic, cssUrl), compiled.minified);

      const registryUrl = `${publicUrl}/r/${id}.json`;
      const registryItem = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: `${style.slug}-${component.slug}`,
        type: "registry:ui",
        title: `${style.name} ${component.contract.name}`,
        description: component.meta.description,
        dependencies: component.meta.dependencies,
        registryDependencies: [`${publicUrl}/r/${style.slug}/tokens.json`],
        files: component.files.map((f) => ({
          path: `registry/${style.slug}/${f.name}`,
          type: "registry:ui",
          target: f.target,
          content: f.code,
        })),
        meta: { bahvo: { style: style.slug, component: component.slug, hash } },
      };
      await write(path.join(webPublic, "r", `${id}.json`), JSON.stringify(registryItem, null, 2));
      registryItems.push({
        ...registryItem,
        files: registryItem.files.map(({ content: _, ...f }) => f),
      });

      const item: ManifestItem = {
        id,
        style: style.slug,
        component: component.slug,
        name: component.contract.name,
        category: component.contract.category,
        description: component.meta.description,
        hash,
        thumb: `/thumbs/${style.slug}/${component.slug}.${hash}.webp`,
      };
      const detail: ItemDetail = {
        ...item,
        styleName: style.name,
        contract: component.contract,
        states: component.meta.states,
        dependencies: component.meta.dependencies,
        react: component.files.map((f) => codeFile(f.name, "tsx", f.code)),
        htmlExport: {
          markup: codeFile("index.html", "html", markup),
          css: codeFile("styles.css", "css", compiled.pretty),
        },
        cssUrl,
        stage: style.stage,
        registryUrl,
        install: {
          bahvo: `npx bahvo add ${id}`,
          shadcn: `npx shadcn@latest add ${registryUrl}`,
        },
      };
      await write(path.join(generatedDir, "items", `${id}.json`), JSON.stringify(detail));

      manifest.items.push(item);
      manifestStyle.items.push(id);
      const entry = componentIndex.get(component.slug) ?? {
        slug: component.slug,
        name: component.contract.name,
        category: component.contract.category,
        description: component.contract.description,
        styles: [],
      };
      entry.styles.push(style.slug);
      componentIndex.set(component.slug, entry);

      loaderLines.push(
        `  "${id}": () => import("./items/${id}.json").then((m) => m.default as unknown as ItemDetail),`,
      );
      const demoImport = path
        .relative(generatedDir, component.demoPath)
        .replaceAll(path.sep, "/")
        .replace(/\.tsx$/, "");
      previewLines.push(`  "${id}": () => import("${demoImport}"),`);
    }
    manifest.styles.push(manifestStyle);
  }
  manifest.components = [...componentIndex.values()].sort((a, b) => a.name.localeCompare(b.name));

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

  const ms = Math.round(performance.now() - started);
  console.log(
    `registry: ${manifest.styles.length} style(s), ${manifest.items.length} item(s) in ${ms}ms`,
  );
  return true;
}

const ok = await build();
if (!ok) {
  console.error(`registry: ${errors.length} error(s)\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
