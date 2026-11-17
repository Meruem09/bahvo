# Floral: style spec

Kind: **components**. Status: beta.

A soft botanical product UI. Panes are warm cream paper with leaf-cut corners (two round, two tight), fine warm hairlines and one soft shadow, over a watercolor-petal backdrop. Titles are Fraunces, a soft old-style serif; everything else is Nunito Sans. Moss green carries primary actions and checked controls; orchid marks only focus, the current item and live states. The dark theme is a night garden: deep green-black paper, sage actions and a lighter orchid. It implements the same 30 component contracts as every other style.

The full rules, the workflow and the component checklist live in the agent skill (`skill/SKILL.md`), so people and agents build to the same bar. `skill/scripts/check.mjs` holds the machine-checkable rules; it runs in the registry build and in the skill.

## Tokens

All values are CSS variables in `tokens.json`, defined for `:root` (light) and `.dark`, and exposed as Tailwind utilities through `@theme inline` (`bg-fl-surface`, `border-fl-line`, `text-fl-muted`, `bg-fl-primary`, `outline-fl-accent`, `rounded-fl-leaf`, `shadow-fl`, `font-fl-display`...).

| Token | Role |
| --- | --- |
| `--fl-stage` | The backdrop: cream with watercolor blooms of rose, sage, butter and lilac. Pages set it as their background. |
| `--fl-bg`, `--fl-surface`, `--fl-subtle` | Page; paper panes and fields; hover and tracks |
| `--fl-leaf` | The sage tint under the current or selected item |
| `--fl-line`, `--fl-line-strong`, `--fl-control` | Hairlines; emphasis and dashed borders; unchecked control edges (3:1) |
| `--fl-fg`, `--fl-muted` | Text; secondary text |
| `--fl-primary`, `--fl-primary-hover`, `--fl-on-primary` | Moss: primary actions and checked controls, and the text on them |
| `--fl-accent`, `--fl-accent-soft` | Orchid: focus rings, the current item, live states, progress |
| `--fl-danger` | Errors only |
| `--fl-overlay`, `--fl-shadow` | Dialog backdrop; the soft warm shadow |

Radii: `rounded-fl-sm` (8px), `rounded-fl` (12px) for fields and menus, `rounded-fl-lg` (20px), and `rounded-fl-leaf` (22px / 6px) for panes. Shadows: `shadow-fl`, `shadow-fl-lg` (overlays). Fonts: `font-fl` (Nunito Sans) and `font-fl-display` (Fraunces).

## A pane

```tsx
<div className="rounded-fl-leaf border border-fl-line bg-fl-surface p-6 shadow-fl">
  <h3 className="font-fl-display text-[17px] font-semibold">Spring planting</h3>
</div>
```

Previews and thumbnails render on `--fl-stage`.
