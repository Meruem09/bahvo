---
name: bahvo-minimalist-components
description: Build React + Tailwind UI components in the bahvo Minimalist style (warm whites and near-blacks, hairline borders, Geist, one orange touch for focus and the current item), light and dark, with every interactive state and native accessible elements. Use when asked for minimal, clean, quiet or "bahvo minimalist" components, or to extend an app that already uses them.
---

# bahvo Minimalist components

You build product UI components in React with Tailwind v4, using only the Minimalist tokens (`references/tokens.css`). The look is quiet and exact: nothing decorative, every pixel aligned, and orange only where it means something.

## The look (non-negotiable)

1. **Tokens only.** Colors come from `mn-*` utilities: `bg-mn-surface`, `bg-mn-subtle`, `border-mn-line`, `text-mn-muted`, `bg-mn-fg text-mn-inverse`, `outline-mn-accent`. Never Tailwind's palette (`gray-100`, `zinc-500`) or hex values: those break dark mode.
2. **Hairlines, not shadows.** Surfaces are defined by a 1px `border-mn-line`; hover strengthens it to `border-mn-line-strong`. `shadow-mn-sm` only on raised controls and cards, `shadow-mn-lg` only on overlays. No gradients, no blur.
3. **Orange marks one thing.** Focus rings (`focus-visible:outline-mn-accent`), the current item, a live state, progress. Primary actions are near-black (`bg-mn-fg text-mn-inverse`), never orange: white on orange fails contrast.
4. **Quiet type.** Geist via `font-mn`. Sizes: 13px for labels and meta, 14px (`text-sm`) for body and controls, 15px for card titles, 16px for dialog titles. `font-medium` for labels and controls, `font-semibold tracking-tight` for titles. Never bold body text.
5. **One rhythm.** Control heights 32 / 36 / 44 (`h-8`, `h-9`, `h-11`). Spacing on a 4px grid. Card padding 20 (`p-5`). Radii: `rounded-mn-sm` (6) inside things, `rounded-mn` (8) for controls, `rounded-mn-lg` (12) for surfaces; nested corners stay concentric (a section flush with a 12px card's bottom edge gets `rounded-b-[11px]`).

## States (every interactive component)

| State | Treatment |
| --- | --- |
| hover | `bg-mn-subtle` or a stronger border; text to `text-mn-fg` |
| focus-visible | `outline-2 outline-offset-2 outline-mn-accent` (fields: accent border + `ring-3 ring-mn-accent/20`) |
| active | `translate-y-px` on buttons |
| disabled | `opacity-45` or `bg-mn-subtle text-mn-muted`, `pointer-events-none` / `cursor-not-allowed` |
| invalid | `aria-invalid:border-mn-danger` plus a text message; never color alone |
| current | `aria-current="page"`, `bg-mn-subtle font-medium` and a 2px orange bar |

## Accessibility

- Native elements first: `<button>`, `<a>`, `<label>` + `<input>`, `<nav>`, `<dialog>` with `showModal()`.
- Labels are real `<label>`s; hints and errors are linked with `aria-describedby`.
- Icons are `aria-hidden`; icon-only buttons get an `aria-label`.
- Text meets 4.5:1 and focus indicators 3:1 against their surface, in light and dark.

## Workflow

1. **Check the catalog** (`references/catalog.md`). Install existing components with `npx bahvo add minimalist/<name>` instead of rewriting them, and compose from them.
2. **Match the contract shape.** Props follow the pattern in `references/examples/`: a few semantic props (`variant`, `size`, `label`, `hint`, `error`, `title`, `footer`), then `...props` spread onto the native element, and `className` merged last.
3. **Build every state** in the table above, light and dark.
4. **Run the checker:** `node <skill>/scripts/check.mjs path/to/component.tsx`. Fix every error; treat warnings as defects.
5. **Look at it** at 100% and 200%, light and dark, keyboard-only: tab through it and check every focus ring.

## Checklist

- [ ] The checker passes with no warnings.
- [ ] Only `mn-*` color utilities; works in light and dark.
- [ ] Hover, focus-visible, disabled (and invalid/current where relevant) are all designed.
- [ ] Orange appears only for focus, current or live state.
- [ ] Heights, spacing and radii come from the scales above; nested corners are concentric.
- [ ] Native elements, real labels, `aria-*` wired, icons hidden from assistive tech.
