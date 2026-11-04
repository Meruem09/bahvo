# Pixel: style spec

Kind: **illustrations**. Status: beta.

Pixel is bahvo's pixel-art illustration style. It draws the same subjects as Isometric, as chunky cells in warm white and gray with one orange touch, in both light and dark themes.

The full rules, the workflow and the kit reference live in the agent skill, so people and agents follow the same rules:

- `skill/SKILL.md`: the look, the workflow, the kit cheatsheet and the checklist.
- `skill/recipes.md`: composition patterns, each linked to an example.
- `skill/scripts/check.mjs`: the machine-checkable rules. It runs in the registry build and in the skill.
- `kit/pixel.tsx`: the Canvas, masks and `<Pixels>` renderer every illustration uses.

## Tokens

All colors are CSS variables in `tokens.json`, defined for `:root` (light) and `.dark`. The kit paints roles through `ink.*` with light fallbacks, so an illustration renders without setup and switches themes once the tokens are installed.

| Token                                                | Role                                      |
| ---------------------------------------------------- | ----------------------------------------- |
| `--px-line`                                          | Outlines, and anything drawn on the stage |
| `--px-white`, `--px-light`                           | Top faces and highlights, front faces     |
| `--px-mid`, `--px-shade`                             | Details and shading on faces              |
| `--px-ground`                                        | Ground and drop shadows                   |
| `--px-accent`, `--px-accent-dark`, `--px-accent-light` | The orange touch, its outline and highlight |
| `--px-stage`                                         | Preview background                        |
