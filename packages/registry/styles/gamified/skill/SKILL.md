---
name: bahvo-gamified-components
description: Build React + Tailwind UI components in the bahvo Gamified style (chunky 2px edges with a hard bottom ledge, buttons that press down like game-pad keys, Fredoka for titles and buttons over Nunito, violet for actions and selection, gold for rewards and the current item, green XP-style progress), light and a deep-violet dark, with every interactive state and native accessible elements. Use when asked for playful, game-like, gamified, tactile or "bahvo gamified" components, or to extend an app that already uses them.
---

# bahvo Gamified components

You build product UI components in React with Tailwind v4, using only the Gamified tokens (`references/tokens.css`). The look is a friendly game menu: solid, chunky, tactile. Everything sits on a hard ledge, buttons press down when clicked, and color always means something.

## The look (non-negotiable)

1. **Tokens only.** Colors come from `gm-*` utilities: `bg-gm-surface`, `bg-gm-subtle`, `border-gm-line`, `text-gm-muted`, `bg-gm-primary text-gm-on-primary`, `bg-gm-gold text-gm-on-gold`, `outline-gm-primary`. Never Tailwind's palette (`violet-600`, `yellow-400`) or hex values: those break the dark theme.
2. **Chunky edges on a ledge.** A pane is `rounded-gm-lg border-2 border-gm-line bg-gm-surface shadow-gm`: a 2px edge and a hard 4px ledge underneath (no blur). Small things sit on `shadow-gm-sm` (2px). Overlays use `shadow-gm-lg`, the ledge plus one soft drop. Inner dividers are 2px too (`border-t-2 border-gm-line`, `divide-y-2 divide-gm-line`).
3. **Buttons press down.** A raised button carries its own colored ledge and an inner shine: `shadow-gm-primary` (or `-gold`, `-danger`), and on press `active:translate-y-1 active:shadow-none`, so it sinks onto the page. Secondary buttons are white keys: `border-2 border-gm-line bg-gm-surface shadow-gm`, also pressing down. Ghost buttons have no ledge.
4. **Color means one thing each.** Violet (`gm-primary`) is action, selection and focus: primary buttons, checked controls, the selected tab or segment, focus rings. Gold (`gm-gold`) marks a reward, a live state or the current item: a star, a streak, the live badge. Green (`gm-success`) fills progress like an XP bar and marks success. Red (`gm-danger`) is errors only. Gold is never text: put `text-gm-on-gold` on a gold fill.
5. **Two typefaces.** Fredoka (`font-gm-display`) is for titles, buttons, tabs, badges and big numbers: `font-semibold`, 15px buttons, 18px card titles, 22px dialog titles. Nunito (`font-gm`) is for everything else: 14px (`text-sm`) body, 13px labels in `font-bold`, `font-semibold` for controls.
6. **One rhythm, round corners.** Control heights 32 / 40 / 48 (`h-8`, `h-10`, `h-12`), plus the ledge. Spacing on a 4px grid. Pane padding 20 to 24 (`p-5`, `p-6`). Radii: `rounded-gm-sm` (8) inside things, `rounded-gm` (12) for buttons, fields and menus, `rounded-gm-lg` (18) for panes, `rounded-full` for badges, switches and progress bars.
7. **Fields are sunk, not raised.** Inputs, selects and textareas are `border-2 border-gm-line bg-gm-surface shadow-gm-inset`: an inner top shade instead of a ledge, so they read as slots to fill.
8. **Solid and crisp.** No blur, no gradients on components (the backdrop `--gm-stage` carries the dots and glow). The shine on raised fills comes from the inset highlight inside the shadow tokens.

## States (every interactive component)

| State | Treatment |
| --- | --- |
| hover | `bg-gm-primary-hover` (violet), `bg-gm-subtle` (white keys, ghost, rows); a raised key may lift: `hover:-translate-y-px` |
| focus-visible | `outline-3 outline-offset-2 outline-gm-primary` (fields: `border-gm-primary` + `ring-4 ring-gm-primary/20`) |
| active | `active:translate-y-1 active:shadow-none` on anything with a ledge |
| disabled | `opacity-50`, no ledge (`disabled:shadow-none`), `pointer-events-none` / `cursor-not-allowed` |
| checked | violet fill (`bg-gm-primary border-gm-primary-depth`) with an `gm-on-primary` mark; unchecked controls have a `border-gm-control` edge (3:1) |
| invalid | `aria-invalid:border-gm-danger` plus a text message with an icon; never color alone |
| current | `aria-current="page"` / `aria-selected`: violet selection (`bg-gm-primary-soft text-gm-fg`), or a raised violet key, with a gold mark where it helps |
| loading | a chunky spinner: a ring of `border-current` with one transparent side, `motion-safe:animate-spin` |

## Accessibility

- Native elements first: `<button>`, `<a>`, `<label>` + `<input>`, `<nav>`, `<details>`, `<dialog>` with `showModal()`.
- Labels are real `<label>`s; hints and errors are linked with `aria-describedby`.
- Icons, stars and gems are `aria-hidden`; icon-only buttons get an `aria-label`.
- Text meets 4.5:1 in light and dark on every fill it sits on. Use `text-gm-on-primary`, `text-gm-on-gold` and `text-gm-on-color` (success, danger) on colored fills. Muted text stays `text-gm-muted`.
- Motion is a reward, not a requirement: any bounce or pulse is `motion-safe:` only.

## Workflow

1. **Check the catalog** (`references/catalog.md`). Install existing components with `npx bahvo add gamified/<name>` instead of rewriting them, and compose from them.
2. **Match the contract shape.** Props follow the pattern in `references/examples/`: a few semantic props (`variant`, `size`, `label`, `hint`, `error`, `title`, `footer`), then `...props` spread onto the native element, and `className` merged last. The same props as every other bahvo style, so switching styles is one import.
3. **Build every state** in the table above, light and dark, on the stage backdrop.
4. **Run the checker:** `node <skill>/scripts/check.mjs path/to/component.tsx`. Fix every error; treat warnings as defects.
5. **Look at it** at 100% and 200%, light and dark, keyboard-only: tab through it, press every button and check every focus ring.

## Checklist

- [ ] The checker passes with no warnings.
- [ ] Only `gm-*` color utilities; works in light and dark.
- [ ] 2px edges, hard ledges, buttons that press down; fields sunk; no blur or gradients.
- [ ] Fredoka for titles, buttons, tabs, badges and numbers; Nunito for the rest.
- [ ] Hover, focus-visible, active, disabled (and checked, invalid, current where relevant) are all designed.
- [ ] Violet for action and selection, gold for one reward or current mark, green for progress, red for errors.
- [ ] Heights, spacing and radii come from the scales above; nested corners stay concentric.
- [ ] Native elements, real labels, `aria-*` wired, icons hidden from assistive tech.
