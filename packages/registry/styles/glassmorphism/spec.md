# Glassmorphism: style spec

Kind: **components**. Status: beta.

Soft, layered product UI. Panes of frosted glass sit on a warm-gray backdrop: translucent white in light, smoked in dark, each with a bright rim, an inner top highlight and one soft shadow. It keeps the bahvo palette (warm neutrals, orange only where it means something) and the same 30 component contracts as every other style.

The full rules, the workflow and the component checklist live in the agent skill (`skill/SKILL.md`), so people and agents build to the same bar. `skill/scripts/check.mjs` holds the machine-checkable rules; it runs in the registry build and in the skill.

## Tokens

All values are CSS variables in `tokens.json`, defined for `:root` (light) and `.dark`, and exposed as Tailwind utilities through `@theme inline` (`bg-gl-glass`, `border-gl-edge`, `text-gl-muted`, `outline-gl-accent`, `rounded-gl-lg`, `shadow-gl`, `backdrop-blur-gl`...).

| Token | Role |
| --- | --- |
| `--gl-stage` | The backdrop: soft warm-gray light and shadow, with a faint orange glow. Pages set it as their background. |
| `--gl-glass`, `--gl-glass-strong`, `--gl-glass-hover` | Pane fill; overlays, menus and fields; hover |
| `--gl-edge` | The bright rim around every pane |
| `--gl-line`, `--gl-line-strong` | Hairline dividers inside panes; emphasis borders |
| `--gl-fg`, `--gl-muted`, `--gl-inverse` | Text; secondary text; text on `fg` fills |
| `--gl-accent`, `--gl-accent-soft` | Focus rings, the current item, live states |
| `--gl-danger` | Errors only |
| `--gl-overlay`, `--gl-shadow`, `--gl-highlight` | Dialog backdrop; the soft shadow; the inner top highlight inside `shadow-gl` |

Radii: `rounded-gl-sm` (8px) inside things, `rounded-gl` (12px) for controls, `rounded-gl-lg` (20px) for panes. One frost: `backdrop-blur-gl` (18px) with `backdrop-saturate-150`.

## A pane

```tsx
<div className="rounded-gl-lg border border-gl-edge bg-gl-glass shadow-gl backdrop-blur-gl backdrop-saturate-150">
```

Previews and thumbnails render on `--gl-stage`, so what you see is how the components read over their backdrop.
