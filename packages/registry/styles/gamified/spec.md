# Gamified: style spec

Kind: **components**. Status: beta.

A playful, tactile product UI. Panes and controls have chunky 2px edges and sit on a hard bottom ledge, and raised buttons press down onto the page when clicked, like keys on a game pad. Titles, buttons, tabs, badges and big numbers are Fredoka; everything else is Nunito. Violet carries actions, selection and focus; gold marks rewards, live states and the current item; green fills progress like an XP bar. The dark theme is deep violet with lighter, brighter fills. It implements the same 30 component contracts as every other style.

The full rules, the workflow and the component checklist live in the agent skill (`skill/SKILL.md`), so people and agents build to the same bar. `skill/scripts/check.mjs` holds the machine-checkable rules; it runs in the registry build and in the skill.

## Tokens

All values are CSS variables in `tokens.json`, defined for `:root` (light) and `.dark`, and exposed as Tailwind utilities through `@theme inline` (`bg-gm-surface`, `border-gm-line`, `text-gm-muted`, `bg-gm-primary`, `outline-gm-primary`, `rounded-gm-lg`, `shadow-gm`, `shadow-gm-primary`, `font-gm-display`...).

| Token | Role |
| --- | --- |
| `--gm-stage` | The backdrop: soft lavender with a dot grid and a gold and violet glow. Pages set it as their background. |
| `--gm-bg`, `--gm-surface`, `--gm-subtle` | Page; panes, keys and fields; hover, tracks and wells |
| `--gm-line`, `--gm-depth`, `--gm-control` | 2px edges and dividers; the ledge under panes and white keys; unchecked control edges (3:1) |
| `--gm-fg`, `--gm-muted` | Text; secondary text |
| `--gm-primary`, `-hover`, `-depth`, `-soft`, `--gm-on-primary` | Violet: actions, selection, focus; its ledge; its tint; the text on it |
| `--gm-gold`, `-depth`, `-soft`, `--gm-on-gold` | Gold: rewards, live states, the current mark |
| `--gm-success`, `-depth`, `-soft` | Green: progress and success |
| `--gm-danger`, `-depth`, `-soft` | Red: errors and destructive actions |
| `--gm-on-color` | Text on green and red fills |
| `--gm-shine`, `--gm-overlay`, `--gm-shadow` | The inset highlight on raised fills; dialog backdrop; the soft drop under overlays |

Radii: `rounded-gm-sm` (8px), `rounded-gm` (12px) for buttons, fields and menus, `rounded-gm-lg` (18px) for panes. Shadows: `shadow-gm` (4px ledge), `shadow-gm-sm` (2px), `shadow-gm-primary` / `-gold` / `-danger` (colored ledge plus shine), `shadow-gm-inset` (sunk fields), `shadow-gm-lg` (overlays). Fonts: `font-gm` (Nunito) and `font-gm-display` (Fredoka).

## A pane and a key

```tsx
<div className="rounded-gm-lg border-2 border-gm-line bg-gm-surface p-5 shadow-gm">
  <button className="h-10 rounded-gm bg-gm-primary px-5 font-gm-display font-semibold text-gm-on-primary shadow-gm-primary active:translate-y-1 active:shadow-none">
    Play
  </button>
</div>
```

Previews and thumbnails render on `--gm-stage`.
