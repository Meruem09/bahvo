---
name: bahvo-pixel-illustrations
description: Draw crisp pixel-art illustrations (devices, servers, documents, clouds, charts, people, any product concept) as React SVG components in the bahvo Pixel style, warm white and gray cells with one orange touch, in light and dark themes. Use when asked for pixel art, 8-bit or retro illustrations, chunky feature or hero artwork, or "an illustration like the bahvo pixel set".
---

# bahvo Pixel illustrations

You draw pixel-art illustrations as React components that render SVG. Every drawing is painted on a **Canvas** from the **pixel kit** (`references/kit/pixel.tsx`, installed in projects as `@/lib/pixel`) and rendered with `<Pixels>`. Never write SVG shapes by hand: everything snaps to whole cells.

The bar is clean, readable pixel art where **every cell means something**. A few well-placed cells beat detail: if a cell doesn't help you read the object, leave it out.

## The look (non-negotiable)

1. **The house grid is 56 × 40 cells.** At the 560px preview size each cell is exactly 10px. Stay within 64 × 48.
2. **Front-and-above view.** Objects show a front face and a white top face above it (`block()`), lit from the top-left. Flat things (screens, windows, shields) face the viewer straight on.
3. **One-cell outlines in `line`,** around every object, from `shape()` or `block()`. Inside, `shape()` adds the bevel: a highlight along the top and left, a shade along the bottom and right. Don't add a second outline next to one: two lines side by side read as one heavy line.
4. **Roles, not colors.** Paint `white` tops, `light` fronts, `mid`/`shade` details, `ground` shadows and `line` outlines. The roles switch together for dark mode.
5. **Details on faces, `line` on the stage.** `mid` and `shade` only read on top of a face; drawn on the bare background they vanish in dark mode. Cables, guides and arrows between objects use `line` (dashed for inactive or skipped paths) or orange.
6. **Orange marks one thing:** the live LED, the current bar, the primary button, the speaker. Use `accent` with `accentDark` for its outline and `accentLight` for its highlight. Never more than one orange object, and never a large orange area unless it's that one object.
7. **Grounded.** Paint a soft `shadow()` under what stands on the ground before you draw it.

## Motion

Every illustration gets one or two tiny stepped motions, as a touch. Motion lives on a layer: `c.layer(kind, (l) => ...)` paints onto a canvas above everything else that moves as one.

- `float`: the floating part (a chip, a badge, a lifted sheet, a cloud) lifts one cell and back.
- `blink`: an LED. Paint its off state on the base (`shade`), and the lit cell on the layer.
- `pulse`: a lit window, the active arrow, a glowing mark. It dims to half and back.
- At most 2 layers. Never put the whole subject on a layer. Offset two with the `delay` argument.
- The kit ships the CSS inside the SVG and stops motion for `prefers-reduced-motion`, `animated={false}` and any `[data-motion="off"]` ancestor. Motion off shows every layer at rest.

## Workflow

1. **Check the catalog** (`references/catalog.md`). If the subject exists, install it with `npx bahvo add pixel/<slug>`, or adapt the example in `references/examples/`.
2. **Sketch on the grid.** Pick the main object (usually 24–40 cells wide), what floats, what connects to it, and what sits on its faces. Keep 2+ cells of margin and room for the shadow.
3. **Paint back to front:** shadows, cables, then objects (`block`, `shape`), then their face details (`line`, `fill`, `edge`, `sprite`), then layers.
4. **Use masks for shapes:** `rect(x, y, w, h, radius)`, `circle`, `ellipse`, combined with `union`, `minus`, `intersect`, `move`, `inset`, or any `(x, y) => boolean`. `edge(mask)` paints just an outline, e.g. a tier's rim.
5. **Small glyphs are sprites:** rows of characters (`o` line, `w` white, `a` accent, `d` accent dark, `p` accent light, `.` empty).
6. **Run the checker:** `node <skill>/scripts/check.mjs path/to/illustration.tsx`. Fix every error; treat warnings as defects.
7. **Look at it** if you can render, light and dark. Check every place two outlines meet.

## Kit cheatsheet

```tsx
import { Canvas, type IllustrationProps, Pixels, rect } from "@/lib/pixel";

const c = new Canvas(56, 40).shadow(30, 33, 20).block(12, 9, 32, 24, { top: 7 });
c.line(16, 20, 27, 20, "shade").set(34, 20, "shade");
c.layer("blink", (l) => l.set(34, 20, "accent"));

export function ServerIllustration(props: IllustrationProps) {
  return <Pixels title="Server" canvas={c} {...props} />;
}

export default ServerIllustration;
```

| Method | Use |
| --- | --- |
| `block(x, y, w, h, { top, fill, topFill, radius, line })` | Devices, slabs, tiles, buildings: a white top face `top` cells deep over a front face. |
| `shape(mask, { fill, line, bevel })` | Any outlined, beveled shape: windows, clouds, shields, bubbles, heads. |
| `fill(mask, role)` | Flat areas: panels, pills, windows, accent marks. |
| `edge(mask, role, where)` | Just an outline, or part of one (rims, rings). |
| `line(x0, y0, x1, y1, role, dash)` | One-cell lines: text bars, slots, cables, guides. |
| `set(x, y, role)`, `sprite(x, y, rows)` | Single cells (LEDs, dots) and small glyphs. |
| `shadow(cx, cy, rx)` | The soft ground shadow. |
| `layer(kind, draw, delay)` | Motion: `float`, `blink`, `pulse`. |

## Checklist before you finish

- [ ] The checker passes with no warnings.
- [ ] 56 × 40 (or within 64 × 48), with margin all round.
- [ ] Every object has one-cell outlines and the top-left bevel; no doubled lines.
- [ ] Only roles; `mid`/`shade` only on faces; works in light and dark.
- [ ] One orange object, tied to what's active.
- [ ] One or two motion layers, on a part, not the whole subject.
