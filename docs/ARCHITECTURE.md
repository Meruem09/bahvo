# bahvo architecture

This is how bahvo is built so it stays fast with tens of thousands of components. Every rule here is enforced by the build, CI, or a check in the code, not just written down.

## The three rules

1. **Static by default.** Pages are prerendered and served from the CDN. The root layout sets `ensureStatic = "navigation"`, so the build fails if anything would render at request time. Dynamic features (accounts, likes, the Arena) come later as Suspense-wrapped pieces inside static pages, with the guard relaxed per segment.
2. **The site never imports hosted components.** Each preview is its own page, `/preview/[style]/[component]`, shown in a lazy-loaded iframe. The site's JS and CSS stay the same size whether we host 1 component or 50,000.
3. **Grids show thumbnails, not live components.** Grid pages render prebuilt WebP thumbnails. A live iframe mounts only on a component's detail page. CI fails if a grid page contains an iframe.

```
Grid page (/styles/isometric)            Detail page (/styles/isometric/button)
static HTML + WebP thumbnails            static shell + code highlighted at build time
lazy <img>, content-visibility           <iframe loading="lazy" src="/preview/isometric/button">
                                           └─ loads only: that item's hashed CSS,
                                              the style's font, one demo component
```

## Stack

| Layer             | Choice                                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | Next.js 16.4 (App Router, Turbopack), React 19.3, React Compiler                                                                                                     |
| Rendering         | Cache Components (`cacheComponents`, `partialPrefetching`), `'use cache'` + `cacheTag`, `ensureStatic`                                                               |
| Language          | TypeScript 7, strict, `noUncheckedIndexedAccess`                                                                                                                     |
| Styling           | Tailwind CSS 4.3; hosted styles define tokens as CSS variables + `@theme inline`                                                                                     |
| Monorepo          | pnpm workspaces + Turborepo                                                                                                                                          |
| Data contracts    | Zod 4                                                                                                                                                                |
| Code highlighting | Shiki, at registry build time (no client JS)                                                                                                                         |
| Thumbnails        | Playwright + sharp (WebP), named by content hash                                                                                                                     |
| Distribution      | shadcn-compatible registry JSON + the `bahvo` CLI                                                                                                                    |
| Lint/format       | Biome                                                                                                                                                                |
| Later             | nuqs (URL filter state), TanStack Virtual (long grids), Orama (search), Fumadocs (`/docs`), Better Auth + Postgres + Drizzle (accounts), R2/Blob (thumbnail storage) |

## Repository layout

```
apps/web/                 Next.js site
  app/layout.tsx          bare root layout (no CSS, no fonts) + ensureStatic
  app/(site)/             site shell: header, Geist fonts, globals.css, all browsing pages
  app/preview/            iframe pages: per-item CSS + the style's font only
  lib/registry.ts         'use cache' wrappers over @bahvo/registry
  lib/preview-fonts.ts    hosted-style fonts (preload: false), imported only by previews
  scripts/check-budgets.ts  CI performance and isolation checks
packages/registry/        the hosted content and its build
  contracts/<component>.json         shared API, states, a11y per component
  styles/<style>/style.json          name, tagline, tags, fonts, preview stage
  styles/<style>/tokens.json         light/dark variables + @theme inline mapping
  styles/<style>/spec.md             principles, signature moves, anti-patterns
  styles/<style>/components/<c>/     <c>.tsx, demo.tsx, meta.json
  src/schema.ts                      Zod schemas: the single source of truth
  scripts/build.ts                   validate + generate (see below)
  scripts/thumbs.ts                  render thumbnails from the HTML export
packages/ui/              the site's own UI primitives (never the hosted styles)
packages/cli/             `npx bahvo add <style>/<component>`
packages/config/          shared tsconfig presets
```

## Registry pipeline

`pnpm --filter @bahvo/registry build` checks every source file against its Zod schema, then writes:

| Output                                   | Used by                                                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/generated/manifest.json`            | Small index (no source code) for grids, filters and, later, search                                    |
| `src/generated/items/<s>/<c>.json`       | Full detail for one item. Loaded through `itemLoaders` dynamic imports, so each item is its own chunk |
| `src/generated/previews.ts`              | Dynamic-import map of demo components, so Turbopack splits each into its own chunk                    |
| `apps/web/public/r/**`                   | shadcn registry items (`registry.json`, `<s>/<c>.json`, `<s>/tokens.json`)                            |
| `apps/web/public/css/<s>/<c>.<hash>.css` | Per-item stylesheet: preflight + tokens + only that item's utilities                                  |

The per-item stylesheet is one file with three uses: the live preview, the thumbnail, and the "HTML + CSS" copy tab. All three always match.

Every item has a **content hash** covering its source, demo, tokens, style meta, contract, and the pipeline version. CSS and thumbnail file names include it, so they are cached forever (`immutable`), and only changed items get new thumbnails.

The build fails if a component is missing its contract or its demo, if a file listed in `meta.json` doesn't exist, or if an implementation skips a state its contract requires.

## Scaling path (designed in, no rewrite needed)

| Catalog size                      | What changes                                                                                                                                                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Up to ~10k items                  | Everything prebuilt with `generateStaticParams` (today)                                                                                                                                                                      |
| Beyond that                       | Prebuild only popular items. Dynamic routes already render their content inside `<Suspense>`, so unknown params get an instant static shell and the content streams in, then is cached by `'use cache'` + `cacheLife("max")` |
| Content edits without redeploying | `revalidateTag("item:<s>/<c>")`, `"style:<s>"` or `"component:<c>"`. The tags are already applied                                                                                                                            |
| Community submissions             | Swap the loaders in `@bahvo/registry` for a database. Pages only import through `lib/registry.ts`                                                                                                                            |
| Thumbnails                        | Move `public/thumbs` to R2/Blob behind the same hash-named URLs                                                                                                                                                              |
| Search                            | Orama index built at build time, downloaded on first search focus. Move to a server search engine past browser limits                                                                                                        |

## Guardrails (CI)

`.github/workflows/ci.yml` runs: Biome → typecheck → registry build + thumbnails → `next build` → `pnpm budgets`.

`pnpm budgets` starts the production server and checks each route in a cold browser:

- **Compressed JS per route.** About 136–147 KB today, which is mostly the Next/React runtime. The budgets sit just above that.
- **Compressed CSS per route.** Under 5 KB today.
- **No iframes on grid pages.**
- **No hosted-style tokens (`--iso-*`) in site CSS, and no site CSS in previews.**

Raise a budget deliberately in the same pull request that needs it, never just to make CI pass.

## Lessons recorded

- **Never import CSS in `app/not-found.tsx`.** It sits on the root layout, so its CSS loads on every route, previews included. The styled site 404 is `app/(site)/not-found.tsx`. The budget check caught this.
- **Measure the iframe's content, not its document.** The preview stage fills the viewport, so the document height just echoes the iframe's own height. The iframe also says hello back when asked, because it can finish loading before the parent hydrates.
- **Generated CSS ships unhighlighted.** Token-level Shiki markup made it about 12× heavier on every detail page.

## Roadmap

0. **Walking skeleton (done):** monorepo, registry schema and build, isolated previews, thumbnails, code tabs, CLI, budgets. Isometric Button runs end to end.
1. **Registry hardening:** style assertions (`assertions.ts`), visual regression, axe a11y checks in CI.
2. **Gallery:** filters (nuqs), virtualized grids, Orama search, token swatches on style pages.
3. **CLI:** `bahvo init`, `bahvo skill add <style> --agent <agent>`, publish to npm.
4. **Eval harness:** `packages/evals`, sandboxed agent runs, scoring, skill score badges.
5. **Content:** the 12 V1 styles × 30 components through this pipeline.
