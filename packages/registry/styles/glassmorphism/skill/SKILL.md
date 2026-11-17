---
name: bahvo-glassmorphism-components
description: Build React + Tailwind UI components in the bahvo Glassmorphism style (translucent frosted panes over a warm-gray backdrop, a bright rim and one soft shadow, Plus Jakarta Sans, one orange touch for focus and the current item), light and dark, with every interactive state and native accessible elements. Use when asked for glass, frosted, translucent or "bahvo glassmorphism" components, or to extend an app that already uses them.
---

# bahvo Glassmorphism components

You build product UI components in React with Tailwind v4, using only the Glassmorphism tokens (`references/tokens.css`). The look is soft and layered: panes of frosted glass over a backdrop, depth from what shows through, and orange only where it means something.

## The look (non-negotiable)

1. **Tokens only.** Colors come from `gl-*` utilities: `bg-gl-glass`, `bg-gl-glass-strong`, `border-gl-edge`, `border-gl-line`, `text-gl-muted`, `bg-gl-fg text-gl-inverse`, `outline-gl-accent`. Never Tailwind's palette (`white/50`, `gray-100`) or hex values: those break dark mode.
2. **A pane is four things together.** `border border-gl-edge bg-gl-glass shadow-gl backdrop-blur-gl backdrop-saturate-150`. The bright rim (`border-gl-edge`) and the inner top highlight inside `shadow-gl` are what make it glass; without them it reads as a smudge. Overlays and anything holding text over busy content (menus, dialogs, inputs) use `bg-gl-glass-strong` and `shadow-gl-lg` (overlays only).
3. **The backdrop carries the color.** The page sits on `--gl-stage` (`style={{ background: "var(--gl-stage)" }}` on the page or app shell). Panes stay flat translucent fills: no gradients, and one frost, `backdrop-blur-gl`, everywhere. Dividers inside a pane are `border-gl-line` hairlines.
4. **Orange marks one thing.** Focus rings (`focus-visible:outline-gl-accent`), the current item, a live state, progress. Primary actions are near-black (`bg-gl-fg text-gl-inverse`), never orange: white on orange fails contrast.
5. **Soft type.** Plus Jakarta Sans via `font-gl`. Sizes: 13px for labels and meta, 14px (`text-sm`) for body and controls, 15px for card titles, 17px for dialog titles. `font-medium` for labels and controls, `font-semibold tracking-tight` for titles.
6. **One rhythm, generous corners.** Control heights 32 / 40 / 48 (`h-8`, `h-10`, `h-12`). Spacing on a 4px grid. Pane padding 24 (`p-6`). Radii: `rounded-gl-sm` (8) inside things, `rounded-gl` (12) for controls, `rounded-gl-lg` (20) for panes; nested corners stay concentric (a control inset by 8px in a 20px pane gets 12px).

## States (every interactive component)

| State | Treatment |
| --- | --- |
| hover | `bg-gl-glass-hover` (glass) or `bg-gl-fg/85` (primary); text to `text-gl-fg` |
| focus-visible | `outline-2 outline-offset-2 outline-gl-accent` (fields: accent border + `ring-3 ring-gl-accent/25`) |
| active | `translate-y-px` on buttons |
| disabled | `opacity-45`, `pointer-events-none` / `cursor-not-allowed` |
| invalid | `aria-invalid:border-gl-danger` plus a text message; never color alone |
| current | `aria-current="page"`, `bg-gl-glass-strong font-medium` and a 2px orange bar |

## Accessibility

- Native elements first: `<button>`, `<a>`, `<label>` + `<input>`, `<nav>`, `<dialog>` with `showModal()`.
- Labels are real `<label>`s; hints and errors are linked with `aria-describedby`.
- Icons are `aria-hidden`; icon-only buttons get an `aria-label`.
- Text meets 4.5:1 against the pane as it renders over the backdrop, in light and dark. Muted text stays `text-gl-muted`, never lighter, and never sits on `bg-gl-glass` over a dark area of the backdrop in light mode.
- Honor `prefers-reduced-transparency` where the platform supports it by keeping panes readable without the blur: the strong glass fill alone must still give 4.5:1.

## Workflow

1. **Check the catalog** (`references/catalog.md`). Install existing components with `npx bahvo add glassmorphism/<name>` instead of rewriting them, and compose from them.
2. **Match the contract shape.** Props follow the pattern in `references/examples/`: a few semantic props (`variant`, `size`, `label`, `hint`, `error`, `title`, `footer`), then `...props` spread onto the native element, and `className` merged last. The same props as every other bahvo style, so switching styles is one import.
3. **Build every state** in the table above, light and dark, on the stage backdrop.
4. **Run the checker:** `node <skill>/scripts/check.mjs path/to/component.tsx`. Fix every error; treat warnings as defects.
5. **Look at it** at 100% and 200%, light and dark, keyboard-only, over the stage: tab through it and check every focus ring.

## Checklist

- [ ] The checker passes with no warnings.
- [ ] Only `gl-*` color utilities; works in light and dark.
- [ ] Every pane has its rim, highlight, blur and shadow; no gradients on components.
- [ ] Hover, focus-visible, disabled (and invalid/current where relevant) are all designed.
- [ ] Orange appears only for focus, current or live state.
- [ ] Heights, spacing and radii come from the scales above; nested corners are concentric.
- [ ] Native elements, real labels, `aria-*` wired, icons hidden from assistive tech.
