import { z } from "zod";

/**
 * Zod schemas are the single source of truth for registry data. The build
 * validates every source file against them, and the site, CLI and agents
 * consume the generated output typed by them.
 *
 * A style is one of two kinds:
 * - "components": UI components that implement shared contracts (contracts/).
 * - "illustrations": artwork for shared subjects (subjects/), drawn with the
 *   style's kit.
 */

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case");

const cssVarName = z.string().regex(/^--[a-z0-9-]+$/, "must be a CSS custom property name");
const cssVarMap = z.record(cssVarName, z.string().min(1));

export const itemKindSchema = z.enum(["components", "illustrations"]);

export const componentStateSchema = z.enum([
  "default",
  "hover",
  "focus-visible",
  "active",
  "disabled",
  "loading",
  "open",
  "checked",
  "invalid",
]);

export const componentCategorySchema = z.enum([
  "actions",
  "forms",
  "display",
  "feedback",
  "navigation",
  "overlay",
  "layout",
]);

export const subjectCategorySchema = z.enum([
  "infrastructure",
  "data",
  "documents",
  "devices",
  "business",
  "integrations",
  "abstract",
]);

/** Shared contract every style's implementation of a component must satisfy. */
export const contractSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  category: componentCategorySchema,
  description: z.string().min(1),
  anatomy: z.array(z.string()).min(1),
  props: z.array(
    z.object({
      name: z.string().min(1),
      type: z.string().min(1),
      default: z.string().optional(),
      description: z.string().min(1),
    }),
  ),
  states: z.array(componentStateSchema).min(1),
  a11y: z.array(z.string()).min(1),
});

/** A shared illustration subject: what is drawn, and where it is useful. */
export const subjectSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  category: subjectCategorySchema,
  description: z.string().min(1),
  /** Where the illustration fits: hero, feature card, empty state, docs... */
  uses: z.array(z.string().min(1)).min(1),
  tags: z.array(slugSchema),
});

const fileTarget = z.object({
  path: z.string().min(1),
  /** Install target, using shadcn placeholders such as `@ui/`, `@components/`, `@lib/`. */
  target: z.string().min(1),
});

export const styleMetaSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  kind: itemKindSchema,
  tagline: z.string().min(1).max(80),
  description: z.string().min(1),
  tags: z.array(slugSchema),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  status: z.enum(["draft", "beta", "stable"]),
  fonts: z.array(
    z.object({
      family: z.string().min(1),
      /** CSS variable the site sets when it loads this font via next/font. */
      variable: cssVarName,
      weights: z.array(z.number().int()).min(1),
    }),
  ),
  /** Shared library files every item of the style imports (e.g. a drawing kit). */
  kit: z.array(fileTarget).default([]),
  /** Background the style's previews sit on (any CSS `background` value). */
  stage: z.object({ light: z.string().min(1), dark: z.string().min(1) }),
});

/**
 * Design tokens. `light`/`dark` become `:root`/`.dark` variables; `theme`
 * becomes `@theme inline`, which is what Tailwind turns into utilities.
 */
export const tokensSchema = z.object({
  light: cssVarMap,
  dark: cssVarMap,
  theme: cssVarMap,
});

/** `meta.json` next to each component or illustration. */
export const implementationMetaSchema = z.object({
  description: z.string().min(1),
  files: z.array(fileTarget).min(1),
  /** File whose default export is rendered in previews and thumbnails. */
  demo: z.string().default("demo.tsx"),
  dependencies: z.array(z.string()).default([]),
  /** Components only: the contract states this implementation covers. */
  states: z.array(componentStateSchema).default([]),
});

export type ItemKind = z.infer<typeof itemKindSchema>;
export type Contract = z.infer<typeof contractSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type StyleMeta = z.infer<typeof styleMetaSchema>;
export type Tokens = z.infer<typeof tokensSchema>;
export type ImplementationMeta = z.infer<typeof implementationMetaSchema>;

/* ---------- Generated output (written by scripts/build.ts) ---------- */

export interface Thumbs {
  light: string;
  dark: string;
}

/** Small index used by grids, filters and search. Never holds source code. */
export interface ManifestItem {
  /** `<style>/<slug>`. */
  id: string;
  kind: ItemKind;
  style: string;
  /** The component or subject slug. */
  slug: string;
  name: string;
  category: string;
  description: string;
  hash: string;
  thumbs: Thumbs;
}

export interface ManifestStyle extends StyleMeta {
  items: string[];
  /** shadcn registry URL for the style's tokens. */
  tokensUrl: string;
  /** Agent skill, when the style ships one. */
  skill?: { name: string; url: string; install: string };
}

/** A component contract or illustration subject, with the styles that implement it. */
export interface ManifestSubject {
  kind: ItemKind;
  slug: string;
  name: string;
  category: string;
  description: string;
  styles: string[];
}

export interface Manifest {
  generatedAt: string;
  styles: ManifestStyle[];
  subjects: ManifestSubject[];
  items: ManifestItem[];
}

export interface CodeFile {
  /** Display name, e.g. `button.tsx`. */
  name: string;
  language: "tsx" | "html" | "css" | "svg";
  code: string;
  /** Shiki HTML (light + dark themes), produced at build time. */
  html: string;
}

/** Everything a detail page, the CLI or an agent needs for one item. */
export interface ItemDetail extends ManifestItem {
  styleName: string;
  /** Components: the shared contract. */
  contract?: Contract;
  /** Illustrations: the shared subject. */
  subject?: Subject;
  states: string[];
  dependencies: string[];
  /** The item's files, then any kit files it imports. */
  react: CodeFile[];
  /** Components: static markup + the item's stylesheet. */
  htmlExport?: { markup: CodeFile; css: CodeFile };
  /** Illustrations: standalone SVG with colors baked in for each theme. */
  svg?: { light: CodeFile; dark: CodeFile; lightUrl: string; darkUrl: string };
  /** Hashed, minified stylesheet: preflight + tokens + only this item's utilities. */
  cssUrl: string;
  stage: StyleMeta["stage"];
  registryUrl: string;
  install: { bahvo: string; shadcn: string };
}
