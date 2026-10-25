import { z } from "zod";

/**
 * Zod schemas are the single source of truth for registry data. The build
 * validates every source file against them, and the site, CLI and agents
 * consume the generated output typed by them.
 */

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case");

const cssVarName = z.string().regex(/^--[a-z0-9-]+$/, "must be a CSS custom property name");
const cssVarMap = z.record(cssVarName, z.string().min(1));

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

export const styleMetaSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
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

/** `meta.json` next to each component implementation. */
export const implementationMetaSchema = z.object({
  description: z.string().min(1),
  files: z
    .array(
      z.object({
        path: z.string().min(1),
        /** Install target, using shadcn placeholders such as `@ui/`. */
        target: z.string().min(1),
      }),
    )
    .min(1),
  demo: z.string().default("demo.tsx"),
  dependencies: z.array(z.string()).default([]),
  states: z.array(componentStateSchema).min(1),
});

export type Contract = z.infer<typeof contractSchema>;
export type StyleMeta = z.infer<typeof styleMetaSchema>;
export type Tokens = z.infer<typeof tokensSchema>;
export type ImplementationMeta = z.infer<typeof implementationMetaSchema>;

/* ---------- Generated output (written by scripts/build.ts) ---------- */

/** Small index used by grids, filters and search. Never holds source code. */
export interface ManifestItem {
  id: string;
  style: string;
  component: string;
  name: string;
  category: Contract["category"];
  description: string;
  hash: string;
  thumb: string;
}

export interface ManifestStyle extends StyleMeta {
  items: string[];
  /** shadcn registry URL for the style's tokens. */
  tokensUrl: string;
}

export interface ManifestComponent {
  slug: string;
  name: string;
  category: Contract["category"];
  description: string;
  styles: string[];
}

export interface Manifest {
  generatedAt: string;
  styles: ManifestStyle[];
  components: ManifestComponent[];
  items: ManifestItem[];
}

export interface CodeFile {
  /** Display name, e.g. `button.tsx`. */
  name: string;
  language: "tsx" | "html" | "css";
  code: string;
  /** Shiki HTML (light + dark themes), produced at build time. */
  html: string;
}

/** Everything a detail page, the CLI or an agent needs for one item. */
export interface ItemDetail extends ManifestItem {
  styleName: string;
  contract: Contract;
  states: Contract["states"];
  dependencies: string[];
  react: CodeFile[];
  htmlExport: { markup: CodeFile; css: CodeFile };
  /** Hashed, minified stylesheet: preflight + tokens + only this item's utilities. */
  cssUrl: string;
  stage: StyleMeta["stage"];
  registryUrl: string;
  install: { bahvo: string; shadcn: string };
}
