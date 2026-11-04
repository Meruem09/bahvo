/**
 * bahvo pixel kit: crisp pixel-art illustrations on a small grid.
 *
 * Draw on a Canvas. Every primitive paints a color role into whole cells, in
 * order, so later paint wins. Shapes are masks tested at cell centers, and
 * `shape()` gives any mask the house look: a one-cell outline in `line`, a
 * fill, a highlight just inside the top and left edges and a shade just inside
 * the bottom and right, because light comes from the top-left.
 *
 * <Pixels> renders each role as one path of horizontal runs with crisp edges.
 * Every color is a CSS variable with a light-theme fallback, so a drawing
 * renders as-is and switches to dark when the pixel tokens define `.dark`.
 */
import type { CSSProperties, SVGProps } from "react";

/* ---------- Palette ---------------------------------------------------- */

export type Role =
  | "line"
  | "shade"
  | "mid"
  | "light"
  | "white"
  | "ground"
  | "accent"
  | "accentDark"
  | "accentLight";

export const ink: Record<Role, string> = {
  /** Outlines and dark details. */
  line: "var(--px-line, #7d766f)",
  /** The darkest fill: shaded sides, slots, idle LEDs. */
  shade: "var(--px-shade, #b5aea7)",
  mid: "var(--px-mid, #d6d1cb)",
  /** Front faces. */
  light: "var(--px-light, #ece9e5)",
  /** Top faces and highlights. */
  white: "var(--px-white, #ffffff)",
  /** Ground shadows. */
  ground: "var(--px-ground, #efece8)",
  accent: "var(--px-accent, #f76b15)",
  accentDark: "var(--px-accent-dark, #c2410c)",
  accentLight: "var(--px-accent-light, #fdba8c)",
};

/** One step lighter and darker, for bevels. */
const LIGHTER: Partial<Record<Role, Role>> = {
  shade: "mid",
  mid: "light",
  light: "white",
  accentDark: "accent",
  accent: "accentLight",
};
const DARKER: Partial<Record<Role, Role>> = {
  white: "light",
  light: "mid",
  mid: "shade",
  accentLight: "accent",
  accent: "accentDark",
};

/** Sprite characters: `.` (or any other) leaves a cell alone. */
export const KEY: Record<string, Role> = {
  o: "line",
  s: "shade",
  m: "mid",
  l: "light",
  w: "white",
  g: "ground",
  a: "accent",
  d: "accentDark",
  p: "accentLight",
};

/* ---------- Masks ------------------------------------------------------ */

/** Which cells a shape covers, tested at each cell's center. */
export type Mask = (x: number, y: number) => boolean;

/** Cells x..x+w-1 by y..y+h-1, with `radius` cells rounded off each corner. */
export function rect(x: number, y: number, w: number, h: number, radius = 0): Mask {
  return (cx, cy) => {
    if (cx < x || cy < y || cx >= x + w || cy >= y + h) return false;
    if (radius <= 0) return true;
    const [px, py] = [cx + 0.5, cy + 0.5];
    const nx = Math.min(Math.max(px, x + radius), x + w - radius);
    const ny = Math.min(Math.max(py, y + radius), y + h - radius);
    return Math.hypot(px - nx, py - ny) <= radius - 0.5;
  };
}

/** A disc around (cx, cy) in cell units: circle(8, 8, 4) covers cells 4..11. */
export function circle(cx: number, cy: number, r: number): Mask {
  return (x, y) => Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r - 0.3;
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): Mask {
  return (x, y) => ((x + 0.5 - cx) / (rx - 0.3)) ** 2 + ((y + 0.5 - cy) / (ry - 0.3)) ** 2 <= 1;
}

export const union =
  (...masks: Mask[]): Mask =>
  (x, y) =>
    masks.some((m) => m(x, y));

export const minus =
  (a: Mask, b: Mask): Mask =>
  (x, y) =>
    a(x, y) && !b(x, y);

export const intersect =
  (...masks: Mask[]): Mask =>
  (x, y) =>
    masks.every((m) => m(x, y));

/** The same shape shifted by whole cells, e.g. a back copy for thickness. */
export const move =
  (mask: Mask, dx: number, dy: number): Mask =>
  (x, y) =>
    mask(x - dx, y - dy);

/** The shape shrunk by `n` cells on every side: its inside, without the outline. */
export function inset(mask: Mask, n = 1): Mask {
  if (n <= 0) return mask;
  const inner = inset(mask, n - 1);
  return (x, y) =>
    inner(x, y) && inner(x - 1, y) && inner(x + 1, y) && inner(x, y - 1) && inner(x, y + 1);
}

/* ---------- Canvas ----------------------------------------------------- */

/**
 * Motion for one layer, snapped to whole cells and hard steps:
 * - float: lifts the layer one cell and back (floating parts)
 * - blink: shows the layer, then hides it briefly (an LED; draw the off
 *   state underneath on the base)
 * - pulse: dims the layer to half and back (a lit window, a live state)
 */
export type MotionKind = "float" | "blink" | "pulse";

export interface ShapeStyle {
  fill?: Role;
  /** The outline role, or false for none (the edge cells are beveled instead). */
  line?: Role | false;
  /** Highlight inside the top and left edges, shade inside the bottom and right. */
  bevel?: boolean;
}

export interface BlockStyle {
  /** How many cells deep the top face is, outline included. */
  top?: number;
  fill?: Role;
  topFill?: Role;
  radius?: number;
  /** Outline and separator role. */
  line?: Role;
}

export class Canvas {
  readonly cells: (Role | undefined)[];
  readonly layers: { id: number; kind: MotionKind; delay: number; canvas: Canvas }[] = [];

  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.cells = new Array(width * height);
  }

  get(x: number, y: number): Role | undefined {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return undefined;
    return this.cells[y * this.width + x];
  }

  set(x: number, y: number, role: Role | undefined) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return this;
    this.cells[Math.round(y) * this.width + Math.round(x)] = role;
    return this;
  }

  /** Paints every covered cell one role. */
  fill(mask: Mask, role: Role) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) if (mask(x, y)) this.set(x, y, role);
    }
    return this;
  }

  /** Paints a mask with the house look: outline, fill and bevel. */
  shape(mask: Mask, { fill = "white", line = "line", bevel = true }: ShapeStyle = {}) {
    const inside = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < this.width && y < this.height && mask(x, y);
    const edge = (x: number, y: number) =>
      inside(x, y) &&
      (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1));
    const lit = LIGHTER[fill] ?? fill;
    const dim = DARKER[fill] ?? fill;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!inside(x, y)) continue;
        let role: Role = fill;
        if (edge(x, y)) {
          if (line) role = line;
          else if (bevel) role = !inside(x, y - 1) || !inside(x - 1, y) ? lit : dim;
        } else if (bevel && line) {
          if (edge(x, y - 1) || edge(x - 1, y)) role = lit;
          else if (edge(x, y + 1) || edge(x + 1, y)) role = dim;
        }
        this.set(x, y, role);
      }
    }
    return this;
  }

  /** Paints only a mask's outline cells, where `where` holds (e.g. the lower half, for a rim). */
  edge(mask: Mask, role: Role = "line", where: Mask = () => true) {
    const inside = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < this.width && y < this.height && mask(x, y);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const outer =
          !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
        if (inside(x, y) && outer && where(x, y)) this.set(x, y, role);
      }
    }
    return this;
  }

  /**
   * A crate seen from the front and a little above: a white top face `top`
   * cells deep, a line, then the front face. The workhorse for devices,
   * slabs, tiles and buildings.
   */
  block(
    x: number,
    y: number,
    w: number,
    h: number,
    { top = 4, fill = "light", topFill = "white", radius = 1, line = "line" }: BlockStyle = {},
  ) {
    const body = rect(x, y, w, h, radius);
    this.shape(body, { fill, line });
    const interior = (cx: number, cy: number) =>
      body(cx, cy) && body(cx - 1, cy) && body(cx + 1, cy) && body(cx, cy - 1) && body(cx, cy + 1);
    for (let cy = y + 1; cy < y + top; cy++) {
      for (let cx = x; cx < x + w; cx++) if (interior(cx, cy)) this.set(cx, cy, topFill);
    }
    for (let cx = x; cx < x + w; cx++) if (interior(cx, y + top)) this.set(cx, y + top, line);
    return this;
  }

  /** A soft ground shadow: a flat ellipse in `ground`. Paint it before what stands on it. */
  shadow(cx: number, cy: number, rx: number, ry = 1.8) {
    return this.fill(ellipse(cx, cy, rx, ry), "ground");
  }

  /** A one-cell line between two cells. `dash` paints every other run of that many cells. */
  line(x0: number, y0: number, x1: number, y1: number, role: Role = "line", dash = 0) {
    const [dx, dy] = [Math.abs(x1 - x0), -Math.abs(y1 - y0)];
    const [sx, sy] = [x0 < x1 ? 1 : -1, y0 < y1 ? 1 : -1];
    let [x, y, err, i] = [x0, y0, dx + dy, 0];
    for (;;) {
      if (!dash || Math.floor(i / dash) % 2 === 0) this.set(x, y, role);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
      i++;
    }
    return this;
  }

  /** Paints rows of characters (see KEY) with the top-left cell at (x, y). */
  sprite(x: number, y: number, rows: string[], key: Record<string, Role> = KEY) {
    rows.forEach((row, dy) => {
      [...row].forEach((ch, dx) => {
        const role = key[ch];
        if (role) this.set(x + dx, y + dy, role);
      });
    });
    return this;
  }

  /** Draws onto a layer above everything else that moves as one: see MotionKind. */
  layer(kind: MotionKind, draw: (layer: Canvas) => void, delay = 0) {
    const canvas = new Canvas(this.width, this.height);
    draw(canvas);
    this.layers.push({ id: this.layers.length, kind, delay, canvas });
    return this;
  }
}

/* ---------- Rendering -------------------------------------------------- */

/** Each role as one path of horizontal runs. */
function runs(canvas: Canvas) {
  const paths = new Map<Role, string>();
  for (let y = 0; y < canvas.height; y++) {
    let x = 0;
    while (x < canvas.width) {
      const role = canvas.get(x, y);
      let end = x + 1;
      while (end < canvas.width && canvas.get(end, y) === role) end++;
      if (role) paths.set(role, `${paths.get(role) ?? ""}M${x} ${y}h${end - x}v1h${x - end}z`);
      x = end;
    }
  }
  return [...paths];
}

function Cells({ canvas }: { canvas: Canvas }) {
  return (
    <>
      {runs(canvas).map(([role, d]) => (
        <path key={role} d={d} fill={ink[role]} />
      ))}
    </>
  );
}

const MOTION_CSS = `
.px-animated .px-m-float{animation:px-float 1.6s steps(1,end) var(--px-delay,0s) infinite}
.px-animated .px-m-blink{animation:px-blink 2.4s steps(1,end) var(--px-delay,0s) infinite}
.px-animated .px-m-pulse{animation:px-pulse 2s steps(1,end) var(--px-delay,0s) infinite}
@keyframes px-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
@keyframes px-blink{0%{opacity:1}80%,100%{opacity:0}}
@keyframes px-pulse{0%,100%{opacity:1}50%{opacity:.5}}
[data-motion="off"] .px-animated *{animation:none!important}
@media (prefers-reduced-motion:reduce){.px-animated *{animation:none!important}}
`;

/**
 * Props every illustration accepts and spreads onto <Pixels>: any SVG
 * attribute except its geometry, plus `animated` to switch its motion off.
 */
export type IllustrationProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Run the illustration's small motion. Defaults to true. */
  animated?: boolean;
};

export interface PixelsProps extends IllustrationProps {
  /** Accessible name, rendered as <title>. */
  title: string;
  canvas: Canvas;
}

/**
 * Renders a canvas as an SVG one unit per cell. Size it on the page with CSS;
 * whole multiples of the grid (10px a cell for a 56-wide canvas at 560px) stay sharpest.
 */
export function Pixels({ title, canvas, animated = true, className, ...props }: PixelsProps) {
  const moving = animated && canvas.layers.length > 0;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      role="img"
      shapeRendering="crispEdges"
      className={
        [moving ? "px-animated" : undefined, className].filter(Boolean).join(" ") || undefined
      }
      {...props}
    >
      <title>{title}</title>
      {moving && <style>{MOTION_CSS}</style>}
      <Cells canvas={canvas} />
      {canvas.layers.map((layer) => (
        <g
          key={layer.id}
          className={`px-m-${layer.kind}`}
          style={layer.delay ? ({ "--px-delay": `${layer.delay}s` } as CSSProperties) : undefined}
        >
          <Cells canvas={layer.canvas} />
        </g>
      ))}
    </svg>
  );
}
