---
name: bahvo-floral-components
description: Build React + Tailwind UI components in the bahvo Floral style (warm cream paper panes with leaf-cut corners, fine warm hairlines, Fraunces serif titles over Nunito Sans, moss green for actions and checked controls, one orchid mark for focus and the current item), light and a night-garden dark, with every interactive state and native accessible elements. Use when asked for floral, botanical, organic, garden or "bahvo floral" components, or to extend an app that already uses them.
---

# bahvo Floral components

You build product UI components in React with Tailwind v4, using only the Floral tokens (`references/tokens.css`). The look is a botanical journal: cream paper, leaf-cut corners, a soft serif for titles, moss green that does the work and one orchid bloom that marks what matters.

## The look (non-negotiable)

1. **Tokens only.** Colors come from `fl-*` utilities: `bg-fl-surface`, `bg-fl-subtle`, `bg-fl-leaf`, `border-fl-line`, `text-fl-muted`, `bg-fl-primary text-fl-on-primary`, `outline-fl-accent`. Never Tailwind's palette (`green-700`, `pink-100`) or hex values: those break the night-garden theme.
2. **Paper panes with a leaf cut.** A pane is `rounded-fl-leaf border border-fl-line bg-fl-surface shadow-fl`: two round corners (top-left, bottom-right) and two tight ones, like a leaf. Cards, dialogs, popovers, sheets, toasts, alerts, tables and empty states are panes. Overlays use `shadow-fl-lg`. Small floating things (menus, tooltips) and fields use the plain scale instead (`rounded-fl`, `rounded-fl-sm`). Put `rounded-fl-leaf` on the whole box, never on one side.
3. **Pills for actions.** Buttons, badges, segmented tracks and switches are `rounded-full`. Fields are `rounded-fl` (12px).
4. **Moss does the work.** Primary actions and checked controls are moss: `bg-fl-primary text-fl-on-primary hover:bg-fl-primary-hover`. Secondary actions are paper (`border border-fl-line-strong bg-fl-surface hover:bg-fl-subtle`); ghost actions are text with `hover:bg-fl-subtle`.
5. **Orchid marks one thing.** Focus rings (`focus-visible:outline-fl-accent`), the current item, a live state, progress. The current item sits on a sage leaf (`bg-fl-leaf`) and carries an orchid mark: an underline, a short bar or the petal (`size-1.5 rounded-[0_100%] bg-fl-accent`). Never put orchid behind body text, and never use it for errors (`fl-danger` is a separate red).
6. **Two typefaces.** Titles are Fraunces (`font-fl-display font-semibold`): 15px for small titles, 17px for card titles, 20px for dialog and sheet titles. Everything else is Nunito Sans (`font-fl`): 14px (`text-sm`) for body and controls, 13px for labels and meta, `font-semibold` for labels and controls.
7. **One rhythm, soft corners.** Control heights 32 / 40 / 48 (`h-8`, `h-10`, `h-12`). Spacing on a 4px grid. Pane padding 24 (`p-6`). Radii: `rounded-fl-sm` (8) inside things, `rounded-fl` (12) for fields and menus, `rounded-fl-lg` (20) for large rounded shapes, `rounded-fl-leaf` (22/6) for panes. Hairlines inside a pane are `border-fl-line`; empty slots are dashed `border-fl-line-strong`.
8. **Paper stays flat.** No gradients on components (the backdrop `--fl-stage` carries the watercolor) and no blur. Depth is one soft warm shadow: `shadow-fl`, or `shadow-fl-lg` for overlays.

## States (every interactive component)

| State | Treatment |
| --- | --- |
| hover | `bg-fl-subtle` (paper, ghost) or `bg-fl-primary-hover` (moss); text to `text-fl-fg` |
| focus-visible | `outline-2 outline-offset-2 outline-fl-accent` (fields: `border-fl-accent` + `ring-3 ring-fl-accent/20`) |
| active | `translate-y-px` on buttons |
| disabled | `opacity-50`, `pointer-events-none` / `cursor-not-allowed` |
| checked | moss fill (`bg-fl-primary`, `border-fl-primary`) with an `fl-on-primary` mark; unchecked controls have a `border-fl-control` edge (3:1) |
| invalid | `aria-invalid:border-fl-danger` plus a text message; never color alone |
| current | `aria-current="page"` / `aria-selected`, `bg-fl-leaf font-semibold text-fl-fg` and an orchid mark |
| loading | the bloom: a small six-petal spinner in `currentColor`, `motion-safe:animate-spin` |

## Accessibility

- Native elements first: `<button>`, `<a>`, `<label>` + `<input>`, `<nav>`, `<details>`, `<dialog>` with `showModal()`.
- Labels are real `<label>`s; hints and errors are linked with `aria-describedby`.
- Icons and petals are `aria-hidden`; icon-only buttons get an `aria-label`.
- Text meets 4.5:1 in light and dark on every fill it sits on (paper, subtle, leaf, accent-soft). Muted text stays `text-fl-muted`, never lighter. Unchecked control edges use `border-fl-control` so they reach 3:1.

## Workflow

1. **Check the catalog** (`references/catalog.md`). Install existing components with `npx bahvo add floral/<name>` instead of rewriting them, and compose from them.
2. **Match the contract shape.** Props follow the pattern in `references/examples/`: a few semantic props (`variant`, `size`, `label`, `hint`, `error`, `title`, `footer`), then `...props` spread onto the native element, and `className` merged last. The same props as every other bahvo style, so switching styles is one import.
3. **Build every state** in the table above, light and dark, on the stage backdrop.
4. **Run the checker:** `node <skill>/scripts/check.mjs path/to/component.tsx`. Fix every error; treat warnings as defects.
5. **Look at it** at 100% and 200%, light and dark, keyboard-only: tab through it and check every focus ring.

## Checklist

- [ ] The checker passes with no warnings.
- [ ] Only `fl-*` color utilities; works in light and dark.
- [ ] Panes are leaf-cut paper with a hairline and one soft shadow; actions are pills; no gradients or blur.
- [ ] Titles in Fraunces, everything else in Nunito Sans.
- [ ] Hover, focus-visible, disabled (and checked, invalid, current where relevant) are all designed.
- [ ] Moss for actions and checked controls; orchid only for focus, current or live state.
- [ ] Heights, spacing and radii come from the scales above; nested corners stay concentric.
- [ ] Native elements, real labels, `aria-*` wired, icons hidden from assistive tech.
