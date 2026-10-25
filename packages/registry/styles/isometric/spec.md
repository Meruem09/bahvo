# Isometric: style spec

Status: draft. This is the rulebook every Isometric component follows, and the core of the Isometric agent skill.

## Principles

1. **One light source, top-left.** Top faces are the lightest. Extruded sides fall down and to the right and are always darker than the face.
2. **Depth is structural.** Only surfaces you can act on or that contain content get depth. Nothing gets depth just for decoration.
3. **Hard edges only.** Depth comes from stacked, unblurred shadows at the 30° isometric angle. No blur, ever.
4. **Pressing pushes flush.** An active element moves by exactly its depth (`--spacing-iso-dx`, `--spacing-iso-dy`) and its extrusion collapses to nothing.
5. **Text stays flat.** Labels sit on the top face, axis-aligned, never skewed or rotated.

## Tokens

All values live in `tokens.json`. Components use only the Tailwind utilities generated from it:

| Purpose         | Utility                                                       |
| --------------- | ------------------------------------------------------------- |
| Outline / ink   | `border-iso-ink`, `text-iso-ink`                              |
| Faces           | `--iso-face` set from `iso-primary`, `iso-paper`, `iso-muted` |
| Extrusion color | `--iso-side` set from `iso-primary-side`, `iso-paper-side`    |
| Depth           | `shadow-iso` (rest), `shadow-iso-raised` (hover)              |
| Press distance  | `translate-x-iso-dx`, `translate-y-iso-dy`                    |
| Corners         | `rounded-iso` (4px; isometric blocks are nearly square)       |
| Type            | `font-iso` (Space Grotesk 500–700)                            |
| Focus           | `outline-iso-focus`                                           |

## Signature moves

- **Extrusion:** set `--iso-face` and `--iso-side` on the element, then apply `shadow-iso`. The shadow is seven 30° layers: six in `--iso-side`, then one in `--iso-ink` that outlines the silhouette.
- **Lift on hover:** translate by one layer up-left (`-0.87px, -0.5px`) and switch to `shadow-iso-raised`, so the base of the block stays planted.
- **Press:** `translate-x-iso-dx translate-y-iso-dy shadow-none`.
- **Disabled:** rendered already pressed (flush, no extrusion) at 60% opacity, so it reads as "can't be pushed".

## Translation rules (for components without an obvious 3D form)

- Containers (cards, dialogs, sidebars) are blocks: the extrusion goes on the outer container. Inner content stays flat.
- Inputs are recessed: an inset shadow at the same angle, the inverse of a button.
- Text-heavy surfaces (tables, tooltips) get a thin extrusion of 2–3 layers so readability wins over depth.

## Anti-patterns

- Blurred `box-shadow` or `drop-shadow`. This breaks the style.
- Real 3D transforms (`rotateX` or `skew`) on anything that holds text.
- Gradients on faces. Faces are flat colors, and the light source is implied by the side color.
- More than one extrusion direction on the same screen.
- Large `border-radius` (above 6px). Blocks read as pills, not solids.
