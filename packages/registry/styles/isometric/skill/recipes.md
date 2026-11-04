# Isometric composition recipes

Patterns taken from the published set. Each line names the example that shows it.

## Grounding

- **Ground grid:** a `Grid` slightly larger than the footprint, fully inside the canvas: half-size `g` needs `canvas width / 2 ≥ 1.732 × g + 12` (`server`: `±96`, step 24, canvas 360).
- **Dashed footprint:** a `Footprint` at z=0, 10–14 units outside the solid's base, with a radius that matches it (`server`, `browser`, `phone`).
- **Base plate:** a wide, low, rounded `Box` (height 10–14, radius 14–16) that lifts a subject off the ground (`building`).
- **Accent pad:** `Footprint` with `color={ink.accent}`, `fill={ink.accentSoft}` and `dashed={false}` under the subject, used once (`layers`). Not a `Plate`: its two orange outlines would double up.

## Floating parts

- Raise the part on z and drop dashed `Line`s from three visible corners (front-left, front, front-right) down to what's below (`browser`, `documents`).
- Place floating parts so their guides land on a top face or on open ground, never across a side face (`documents`: the sheet sits over the stack, so two guides land on its top and one drops behind it).
- Small satellites (chips, badges, notifications) float 40–50 units above with a `float` motion and **no guide line**: a guide would land on the content below or end in mid-air, and the motion already shows they're detached (`browser`, `phone`).

## Stacks

- **Layers:** `Plate tone="glass"` 6 units thick, every 26 units over a solid base, with dashed lines tracing the corners (`layers`).
- **Tiers:** repeated `Cylinder`s or `Box`es with a 14-unit gap, so each rim reads as its own line, with details on the front-right faces (`database`).
- **Paper:** one sharp `Box` with 4 `FaceLine`s in `ink.dash` on both side faces, and one sheet lifted off the top (`documents`).

## Faces

- **UI on a screen:** a `FaceRect` inset 6 units with a concentric radius (outer − 6), a header `FaceBar` in `ink.detail`, body bars in the default `ink.fill`, all on one left and right margin, and one accent element: the primary button (`browser`, `phone`).
- **Hardware:** vents as 5–6 short vertical `FaceLine`s, screws as `FaceCircle r=1.6` in the corners, LEDs as a row with one accent dot and the rest in `ink.detail` (`server`).
- **Windows:** a grid of small `FaceRect`s on both side faces, with exactly one lit in accent (`building`).
- **Emblems:** concentric `FaceCircle`s (one dashed) with a `FacePath` mark in accent, filled with `ink.accentSoft` (`hub`, `server`).
- **Icons and glyphs:** draw them with `FaceLine`s, not `FaceText`. Mono glyphs like `</>` get letter-spaced and skewed on a face and read poorly (`browser`).

## Connections

- **Cables:** solid `Path3` lines (`dashed={false}`) along x or y on the ground, from the subject's base to small `Cylinder` nodes (radius 14, height 8) placed on the axes. Draw cables that pass behind the subject before it, the rest after (`hub`).
- Exactly one connection is active: its cable is `ink.accent` and its node has an accent dot. The others are `ink.line` with `ink.detail` dots (`hub`).
- Never use free-floating markers or lines that end in empty space.

## Proportions

- Main solid: 120–200 units wide. Slabs: 20–40 tall. Towers: up to 1.5× their width.
- Canvas: 280–360 wide. Keep about 20 units of margin and nothing clipped.

## Upright shapes

- **Clouds:** lobes (circles) on a flat base, as one `Extrusion` outline in the left plane, 16 deep. Compute where lobes meet instead of guessing angles, so arcs join exactly (`cloud`). An icon on it goes on its front `Face`, in accent (`cloud`: the upload arrow).
- **Shields and badges:** straight sides into two arcs that meet at a tip, each arc tangent to its side. Inset the same outline by 7 with concentric arcs for the bevel, drawn with `FacePath d={profilePath(...)}` (`shield`).
- **Speech bubbles:** a rounded rectangle with a 3-point tail, in the right plane, 6 deep, floating near the speaker with a `float` motion (`team`).

## People

- A `Cylinder` body (radius 14, height 26) with a `Sphere` head (radius 10) 3 units above it, on a shared base plate. Draw them back to front. Mark the active person with an accent ring on the floor around their feet, not by coloring them (`team`).

## Charts and pipelines

- **Bar charts:** rounded `Box` bars (radius 3) in one row along x, drawn back to front; only the current bar uses `tone="accent"` (`chart`).
- **Pipelines:** step tiles along x joined by ground cables. The cable into the running step is accent with a `flow` overlay, the running step carries a spinning dashed ring, a skipped step is `tone="outline"` with a dashed `Line` (`workflow`).
