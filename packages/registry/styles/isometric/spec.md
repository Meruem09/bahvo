# Isometric: style spec

Kind: **illustrations**. Status: beta.

Isometric is bahvo's line-art illustration style. It covers technical isometric drawings for product sites and docs, in white and gray with a touch of orange, in both light and dark themes.

The full rules, the workflow and the kit reference live in the agent skill, so people and agents follow the same rules:

- `skill/SKILL.md`: the look, the workflow, the kit cheatsheet and the checklist.
- `skill/recipes.md`: composition patterns, each linked to an example.
- `skill/scripts/check.mjs`: the machine-checkable rules. It runs in the registry build and in the skill.
- `kit/isometric.tsx`: the drawing primitives every illustration uses.

## Tokens

All colors are CSS variables in `tokens.json`, defined for `:root` (light) and `.dark`. The kit refers to them through `ink.*` with light fallbacks, so an illustration renders without setup and switches themes once the tokens are installed.

| Token                                    | Role                                   |
| ---------------------------------------- | -------------------------------------- |
| `--iso-top`, `--iso-left`, `--iso-right` | Face fills, lit from the top-left      |
| `--iso-line`, `--iso-edge`               | Outlines (default, emphasis)           |
| `--iso-glass`                            | Translucent plates                     |
| `--iso-dash`, `--iso-grid`               | Construction lines and the ground grid |
| `--iso-detail`, `--iso-text`             | Face detail outlines and labels        |
| `--iso-fill`                             | Soft fills: text bars, blocks          |
| `--iso-accent`, `--iso-accent-soft`      | The orange touch                       |
| `--iso-stage`                            | Preview background                     |
