# bahvo

**Every UI style, every component, ready to copy, install, or hand to your agent.**

bahvo is a community-built library of UI design styles. Pick a style (Isometric, Glassmorphism, Pixel, Neubrutalism...) and get the full component set built in that style: buttons, cards, inputs, sidebars, dialogs, tables, and more. Each component comes in three forms:

- **Raw code**: copy React + Tailwind or plain HTML/CSS straight from the site.
- **CLI**: `npx bahvo add isometric/button` drops it into your project.
- **Agent skill**: install the style's skill, and your coding agent (Claude Code, Codex, Cursor, ...) can build new components in that same style.

bahvo will be open source.

> **Status:** pre-V1, being planned and scaffolded. Nothing below is shipped yet.

---

## The core idea: styles × components

bahvo is a matrix, not a pile of separate libraries.

- **Component catalog**: a fixed list of components. Each one has a shared **contract** (anatomy, props API, required states, accessibility).
- **Style families**: each style is a **spec + design tokens + signature recipes**, and it implements every component in the catalog.

Every `Button` has the same API in every style, so switching from Minimalist to Pixel means changing one import.

### V1 scope

| | |
|---|---|
| **Styles (12)** | Minimalist, Glassmorphism, Neumorphism, Neubrutalism, Pixel/8-bit, Isometric, Claymorphism, Skeuomorphic, Retro OS, Y2K/Aqua, Terminal/Cyberpunk, Floral/Organic |
| **Components (30)** | Button, IconButton, Badge, Avatar, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Card, StatCard, PricingCard, Tabs, Accordion, Dialog, Tooltip, Dropdown, Toast, Alert, Progress, Navbar, Sidebar, Breadcrumbs, Pagination, Table, EmptyState, LoginForm, Hero |

That's 360 component implementations and 12 agent skills. Every one of them must work at launch.

---

## Architecture

```
registry/                         source of truth (git, no database in V1)
 ├─ contracts/<component>.md      anatomy, props, states, a11y (shared by all styles)
 └─ styles/<style>/
     ├─ style.json                name, tagline, description, tags, fonts, preview stage
     ├─ tokens.css                CSS variables: color, radius, shadow, depth, motion
     ├─ spec.md                   principles, signature moves, translation rules
     ├─ components/<name>/        <name>.tsx · <name>.html · meta.json
     ├─ assertions.ts             machine-checkable style rules
     └─ skill/                    SKILL.md · references/ · scripts/check.mjs

packages/build    registry JSON, HTML exports, screenshots, skill zips
packages/cli      npx bahvo add / skill / init
packages/evals    skill eval harness (sandboxed agent runs, render, score)
apps/web          Next.js gallery: filter by style, live preview, copy, install
```

- **Static output.** The build emits shadcn-compatible registry items at `/r/<style>/<component>.json`, so `npx shadcn add <url>` works too, alongside skill zips and preview screenshots.
- **Isolated previews.** Each component renders in a sandboxed iframe on its style's **stage** (glass needs a colorful backdrop; pixel needs a flat one).
- **Component page:** Preview | React | HTML | CLI tabs, plus "Copy agent prompt".
- **Style page:** description, token swatches, full component grid, "Install skill", and a public **skill score badge**.

---

## How a style gets made

1. **Dossier.** Collect references, then extract principles, exact token values, signature moves, translation rules (how the style applies to awkward components like tables or tooltips), and anti-patterns. References are linked, never redistributed. Components must be original.
2. **Spec.** Write `spec.md` + `tokens.css`, the style's rulebook.
3. **Golden components.** Hand-craft 5 (Button, Card, Input, Sidebar, Dialog). These set the quality bar.
4. **Generate the rest** with the draft skill. If the skill can't build our own library well, it isn't ready.
5. **Gate.** CI checks: build, axe a11y, required states (hover, focus-visible, active, disabled, loading), 3 viewports, style assertions, visual diff. Then a human reviews it. Every reviewer fix is added back into the skill.

---

## Agent skills

A skill is context the agent loads at runtime, not training. It uses the Agent Skills format and loads in stages:

```
skills/<style>/
├─ SKILL.md            philosophy, non-negotiables, workflow, self-check list
├─ references/         tokens.css, recipes.md, translation.md, anti-patterns.md, examples/*.tsx
└─ scripts/check.mjs   the style linter; the agent runs it on its own output
```

What makes a skill produce excellent output:

- **Exact values, not adjectives.** "`4px 4px 0 var(--iso-edge)`", not "make it feel 3D".
- **Golden examples** to copy patterns from.
- **Anti-patterns** that block generic AI output.
- **A bundled linter.** It's the same rules CI and the evals use.
- **CLI first.** The agent installs existing registry components and only generates what's missing.

Planned install command:

```bash
npx bahvo skill add isometric --agent claude
```

### Proving a skill works

Every skill ships only after passing an eval suite, rerun in CI whenever it changes:

- **Prompts:** about 25 per style. Held-out catalog components, full screens, stress cases, integration into an existing repo. 30% stay hidden from whoever edits the skill.
- **Matrix:** several agents and model sizes, each run with and without the skill, in clean sandboxes.
- **Scoring:** hard checks → style assertions → token usage → vision-model judge (pairwise vs no-skill and vs golden) → human ratings (calibration + a community Arena).
- **Release bar:** hard checks 100%, style assertions ≥ 90%, ≥ 85% pairwise win rate vs no-skill, ≥ 4/5 golden-match on hidden prompts, passes on the smallest supported model.

---

## Roadmap to V1

1. Monorepo, contracts, registry build, CLI, gallery shell, **eval harness first**
2. Pilot style: **Isometric**, end to end
3. The remaining 11 styles through the same pipeline
4. Arena, analytics, docs, contribution guide, launch

## Contributing

Contribution guidelines will land with the first style. New styles will come in as a pull request containing a dossier, spec, golden components, and a passing eval.

## License

To be decided before the open-source release.
