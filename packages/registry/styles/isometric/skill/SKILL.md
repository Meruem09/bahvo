---
name: bahvo-isometric-illustrations
description: Draw line-art isometric illustrations (servers, devices, documents, stacks, buildings, any product concept) as React SVG components in the bahvo Isometric style, white and warm near-white with a touch of orange, in light and dark themes. Use when asked for isometric illustrations, 3D-looking technical drawings, feature or hero artwork, or "an illustration like the bahvo isometric set".
---

# bahvo Isometric illustrations

You draw technical isometric illustrations as React components that render SVG. Every drawing is composed from the **isometric kit** (`references/kit/isometric.tsx`, installed in projects as `@/lib/isometric`). Never compute projected coordinates by hand.

The bar is a precise technical drawing where **every mark means something**. Restraint beats decoration: if you can't say what a line, dot or label is for, delete it.

## The look (non-negotiable)

1. **True 30° isometric.** Use the kit's world space: x runs down-right, y runs down-left, z runs up. One world unit is one SVG unit.
2. **One line weight.** Every outline is exactly 1px at any size (`vector-effect: non-scaling-stroke`, which kit primitives set on each element; the property is not inherited, so never rely on setting it on a `<g>`). No thick strokes, blur, shadows or gradients. Two outlines must never run within 4 units of each other: they merge into one heavy line.
3. **Hierarchy by contrast, not weight.** The subject is crisp; structure around it (grid, footprint, guides) is faint. White and warm near-white faces, lit from the top-left; `<Box>` does the shading.
4. **No decoration.** No floating "×" markers, stray dots or lines that end in empty space. Lines connect two things: a guide drops from a floating part to what's below it, a cable runs from one object to another and ends on a node.
5. **Orange marks one state.** Use 1–2 accent marks per drawing, tied to what's active: the live LED, the active connection, the primary button, the lit window. Everything else is neutral. Never fill a large surface with orange.
6. **Almost no gray mass.** Text bars and blocks use the soft `ink.fill`; header bars and frames use `ink.detail`. Never fill with `ink.edge` or `ink.line`.
7. **Colors come only from `ink.*`**, so the same component works in light and dark.

## Precision rules

- **Contained structure.** The ground grid and footprint sit fully inside the canvas with margin. A square grid of half-size `g` is `1.732 × g` wide on screen each side of the origin, so `canvas width / 2 ≥ 1.732 × g + 12`. A grid cut off by the frame looks unfinished.
- **Concentric radii.** A shape inset by `p` inside a rounded shape of radius `r` gets radius `r − p` (a 14-radius phone body with a 6-unit inset screen has an 8-radius screen).
- **One margin, aligned edges.** Content on a face shares a left margin and a right margin; bars, cards and fields end on the same edges. Keep sizes and positions on a 2- or 4-unit grid.
- **Connections run along axes.** Cables and guides follow x, y or z; turns are right angles in world space. Each ends on a node, a face or the ground.
- **Icons are drawn, not typed.** Build glyphs with `FaceLine`/`FacePath`; `FaceText` is only for short uppercase labels.

## Motion

Every illustration gets one or two tiny ambient motions, as a touch:

- Wrap only the part that would naturally move in `<Motion kind=…>`: the floating chip or sheet (`float`), the live LED or antenna tip (`blink`), the lit window (`pulse`), a dashed ring on a face (`spin`), data along the active cable (`flow`), a ring from the core dot (`ping`).
- `flow` and `ping` are motion-only: draw an extra shape inside them (a cable copy in `ink.top`, a ring copy of the dot). They're hidden whenever motion is off, so the still drawing is unchanged.
- At most 2 motions. Never animate the whole subject. Offset two motions with `delay`.
- The kit ships the CSS inside the SVG and turns motion off for `prefers-reduced-motion`, for `animated={false}`, and under any `[data-iso-motion="off"]` ancestor (use that for a page-level toggle).

## Workflow

1. **Check the catalog** (`references/catalog.md`). If the subject exists, install it with `npx bahvo add isometric/<slug>`, or adapt the example in `references/examples/`. Reuse an existing composition before inventing one.
2. **Plan in world units.** Pick the main solid (usually 100–200 wide), what floats above it, what connects to it, and what sits on its faces.
3. **Size the canvas.** Use `project([x, y, z])` on the extreme corners (including the grid's) to find the screen bounds. Set `canvas` to the bounds plus about 20 units of margin and `origin` so the drawing is centered.
4. **Draw back to front.** Ground grid and footprint first, then solids from the lowest z and farthest back, each followed by its face details. A guide or cable goes **before** every solid it passes behind and **after** every solid it passes in front of; if it would cross a face, move the parts instead.
5. **Detail the faces** with `<Face plane="top" | "left" | "right" at={corner}>` and 2D children. See the `Face` doc comment for each plane's origin corner.
6. **Run the checker:** `node <skill>/scripts/check.mjs path/to/illustration.tsx`. Fix every error; treat warnings as defects.
7. **Look at it** if you can render, at large size and small, light and dark. Check every edge where two shapes meet.

## Kit cheatsheet

```tsx
import { Box, Face, FaceCircle, FaceText, Footprint, Grid, Iso, ink } from "@/lib/isometric";

export default function ServerIllustration(props: IllustrationProps) {
  return (
    <Iso title="Server" canvas={[360, 250]} origin={[180, 126]} {...props}>
      <Grid from={[-96, -96]} to={[96, 96]} step={24} />
      <Footprint at={[-84, -84, 0]} size={[168, 168]} radius={10} />
      <Box at={[-70, -70, 0]} size={[140, 140, 36]} radius={6} />
      <Face plane="top" at={[-70, -70, 36]}>
        <FaceCircle cx={70} cy={70} r={6} fill={ink.accent} color="none" />
        <FaceText x={10} y={128}>Server #1</FaceText>
      </Face>
    </Iso>
  );
}
```

| Primitive | Use |
| --- | --- |
| `Box` | Boxes, slabs, rounded blocks. `tone`: `solid` (default), `glass` (layers), `outline` (dashed ghost), `accent` (soft orange). `hidden` draws back edges dashed. `at` is the min x, y, z corner. |
| `Plate` | Thin plates: layers, sheets, screens, cards. At least 4 thick, or the two outlines merge. |
| `Cylinder` | Databases, nodes, pucks, badges. `center` is the base center; one even side tone. |
| `Footprint` | One flat outline in a plane: ground footprints, pads, landing zones. `color`/`fill` for an accent pad. |
| `Grid` | The faint ground grid. Keep it inside the canvas. |
| `Line`, `Path3` | Dashed guides (default) and solid cables (`dashed={false}`) between world points. |
| `Dot` | A screen-space dot at a world point: LEDs, antenna tips. |
| `Motion` | Ambient motion for one part: `float`, `pulse`, `blink`, `spin`, `flow`, `ping`. At most 2 per drawing. |
| `Face` + `FaceRect`, `FaceBar`, `FaceCircle`, `FaceLine`, `FacePath`, `FaceText` | Anything flat on a face: UI, windows, vents, emblems, drawn icons, labels. |

## Checklist before you finish

- [ ] The checker passes with no warnings.
- [ ] Every mark has a purpose; nothing decorative, nothing ending in empty space.
- [ ] 1–2 accent marks, each tied to an active state.
- [ ] Grid and footprint sit fully inside the canvas, with even margin all around.
- [ ] Inset radii are concentric; face content shares margins and aligned edges.
- [ ] No two outlines run within 4 units; no plate is thinner than 4.
- [ ] Guides and cables follow the axes and respect what is in front of them.
- [ ] One or two small motions on the active or floating part; the still frame looks complete on its own.
- [ ] `title` describes the subject; the component spreads `...props` onto `<Iso>` and has a default export.

More composition patterns are in `references/recipes.md`.
