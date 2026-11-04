# Pixel composition recipes

Patterns taken from the published set. Each line names the example that shows it.

## Objects

- **Devices and slabs:** `block()` with a top face 4–7 cells deep. Split the front into units with one `line` across it, then put a slot (`shade` line) and a row of LEDs in each (`server`).
- **Stacks:** repeat thin blocks (`top: 5`, 8 tall) with 2–3 empty rows between them; the top one floats (`layers`). Paper is one white block with `mid` lines across its front (`documents`).
- **Cylinders:** the union of a top ellipse, a rect and a bottom ellipse, with a white top ellipse over it and tier rims as the lower arcs of ellipses, via `edge(mask, "line", (_, y) => y >= rimY)` (`database`).
- **Buildings:** a tall block on a low plaza block, a grid of 2×2 windows, a door, and a unit and antenna on the roof (`building`).
- **Screens:** a window or phone faces the viewer: `shape()` with a one-cell `ground` drop shadow behind it, a title bar from `intersect(inset(window), rect(...))`, then text lines, one accent button and a side card (`browser`, `phone`).
- **Thickness for flat shapes:** paint a `move(mask, 2, 0)` copy in `mid` first, then the shape (`shield`).
- **Clouds:** the union of three circles on a rounded base rect (`cloud`).
- **People:** a white head, a one-row neck gap, then shoulders: `intersect(rect(..., radius 5), rect(0, 0, 56, ground))` so they stand flat. Two behind, one in front, overlapping (`team`).

## Accents

- **Primary button:** `shape(rect, { fill: "accent", line: "accentDark" })`: the bevel gives it an `accentLight` highlight (`browser`, `phone`).
- **Current bar:** a block with `fill: "accent", topFill: "accentLight", line: "accentDark"` (`chart`).
- **Live LED or node:** `shade` on the base, `accent` on a `blink` layer (`server`, `database`, `hub`).
- **Glyphs:** sprites in `a` with a `p` core: sparkles (`hub`, `chip`), arrows (`cloud`, `chart`), braces and code (`api`, `browser`).

## Connections

- **Cables:** one-cell `line`s between objects, drawn before the objects so their ends tuck under; the active one is `accent` (`hub`, `chip`).
- **Steps:** arrows with two-cell chevron heads; the one into the running step is on a `pulse` layer. A skipped branch is a dashed `line` down to a block filled with `ground` (`workflow`).

## Floating parts

- Chips, badges, bubbles and lifted sheets go on a `float` layer, one or two cells clear of what's below, and overlap a corner rather than the middle (`browser`, `phone`, `api`, `team`).
