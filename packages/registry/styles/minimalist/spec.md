# Minimalist: style spec

Kind: **components**. Status: beta.

Quiet, precise product UI. It shares its palette with the bahvo site: warm whites and near-blacks, single hairline borders, Geist type, and orange only where it means something.

The full rules, the workflow and the component checklist live in the agent skill (`skill/SKILL.md`), so people and agents build to the same bar. `skill/scripts/check.mjs` holds the machine-checkable rules; it runs in the registry build and in the skill.

## Tokens

All colors are CSS variables in `tokens.json`, defined for `:root` (light) and `.dark`, and exposed as Tailwind utilities through `@theme inline` (`bg-mn-surface`, `border-mn-line`, `text-mn-muted`, `outline-mn-accent`, `rounded-mn`, `shadow-mn-lg`...).

| Token | Role |
| --- | --- |
| `--mn-bg`, `--mn-surface`, `--mn-subtle` | Page, raised surface, hover and wells |
| `--mn-line`, `--mn-line-strong` | Hairline borders; hover and emphasis borders |
| `--mn-fg`, `--mn-muted`, `--mn-inverse` | Text; secondary text; text on `fg` fills |
| `--mn-accent`, `--mn-accent-soft` | Focus rings, the current item, live states |
| `--mn-danger` | Errors only |
| `--mn-overlay`, `--mn-shadow` | Dialog backdrop; the one soft shadow |

Radii: `rounded-mn-sm` (6px) for controls inside things, `rounded-mn` (8px) for controls, `rounded-mn-lg` (12px) for surfaces. A control inset by `p` in a surface keeps a concentric radius.
