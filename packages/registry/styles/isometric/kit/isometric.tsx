/**
 * bahvo isometric kit: primitives for line-art isometric illustrations.
 *
 * World space: x runs down-right, y runs down-left, z runs up. One world unit
 * is one SVG unit. `project` maps a world point to the screen with a true
 * 30° isometric projection. Light comes from the top-left: top faces are the
 * lightest, left faces mid, right faces darkest.
 *
 * Every color is a CSS variable with a light-theme fallback, so illustrations
 * render as-is and switch to dark when the isometric tokens define `.dark`.
 *
 * Line weight: every stroke is exactly one screen pixel, at any size. Each
 * stroked element sets `vector-effect: non-scaling-stroke` itself, because the
 * property is not inherited: set on a <g>, its children would scale.
 */
import type { CSSProperties, ReactNode, SVGProps } from "react";

export type Vec3 = readonly [x: number, y: number, z: number];
export type Vec2 = readonly [x: number, y: number];

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

export function project([x, y, z]: Vec3): Vec2 {
  return [(x - y) * COS30, (x + y) * SIN30 - z];
}

const round = (n: number) => Math.round(n * 100) / 100;
const toPoints = (pts: readonly Vec2[]) => pts.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");

/* ---------- Palette ---------------------------------------------------- */

export const ink = {
  /** Default outline for every solid. */
  line: "var(--iso-line, #aca59e)",
  /** Stronger outline for the subject's key edges. */
  edge: "var(--iso-edge, #857e77)",
  top: "var(--iso-top, #ffffff)",
  left: "var(--iso-left, #faf9f7)",
  right: "var(--iso-right, #f2f0ec)",
  /** Translucent plates. */
  glass: "var(--iso-glass, #ffffffeb)",
  /** Construction, hidden and guide lines. */
  dash: "var(--iso-dash, #d3cec8)",
  grid: "var(--iso-grid, #f0eeeb)",
  /** Outlines of small details drawn on faces: frames, vents, icons. */
  detail: "var(--iso-detail, #cbc5be)",
  /** Soft fills on faces: text bars, blocks, inactive LEDs. */
  fill: "var(--iso-fill, #ece9e5)",
  text: "var(--iso-text, #a39c95)",
  accent: "var(--iso-accent, #f76b15)",
  accentSoft: "var(--iso-accent-soft, #feeadb)",
} as const;

export type Tone = "solid" | "glass" | "outline" | "accent";

const DASH = "2 3";
const hairline = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 1 };

/* ---------- Canvas ----------------------------------------------------- */

/**
 * Props every illustration accepts and spreads onto <Iso>: any SVG attribute
 * except its geometry, plus `animated` to switch its motion off.
 */
export type IllustrationProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "origin" | "children"> & {
  /** Run the illustration's small ambient motion. Defaults to true. */
  animated?: boolean;
};

export interface IsoProps extends IllustrationProps {
  /** Accessible name, rendered as <title>. */
  title: string;
  /** Drawing size in SVG units: [width, height]. Size it on the page with CSS or width/height. */
  canvas: Vec2;
  /** Screen position of the world origin inside the canvas. */
  origin: Vec2;
  children: ReactNode;
}

export function Iso({
  title,
  canvas,
  origin,
  children,
  animated = true,
  className,
  ...props
}: IsoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${canvas[0]} ${canvas[1]}`}
      role="img"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        [animated ? "iso-animated" : undefined, className].filter(Boolean).join(" ") || undefined
      }
      {...props}
    >
      <title>{title}</title>
      {animated && <style>{MOTION_CSS}</style>}
      <g transform={`translate(${origin[0]} ${origin[1]})`}>{children}</g>
    </svg>
  );
}

/* ---------- Motion ----------------------------------------------------- */

/**
 * Small ambient motion, shipped inside the SVG so components, copied code and
 * downloaded files all animate. Motion stops for `prefers-reduced-motion`, for
 * `animated={false}`, and anywhere under `[data-iso-motion="off"]` (how a page
 * offers a motion toggle). Keep it to one or two motions per drawing, on the
 * active or floating part, never on the whole subject.
 *
 * - float: drifts 3 units up and back (floating parts)
 * - pulse: breathes in opacity (a lit window, a live state)
 * - blink: mostly on, briefly off (an LED)
 * - spin:  very slow rotation, for dashed rings on a face
 * - flow:  dashes travel along a cable; draw it over the cable (motion-only)
 * - ping:  a ring expands and fades from a dot (motion-only)
 *
 * "Motion-only" content (flow, ping) is hidden whenever motion is off, so the
 * still drawing never shows it.
 */
export type MotionKind = "float" | "pulse" | "blink" | "spin" | "flow" | "ping";

const MOTION_CSS = `
.iso-m-flow,.iso-m-ping{display:none}
.iso-animated .iso-m-flow,.iso-animated .iso-m-ping{display:inline}
.iso-animated .iso-m-float{animation:iso-float 5s ease-in-out var(--iso-delay,0s) infinite}
.iso-animated .iso-m-pulse{animation:iso-pulse 3s ease-in-out var(--iso-delay,0s) infinite}
.iso-animated .iso-m-blink{animation:iso-blink 4s linear var(--iso-delay,0s) infinite}
.iso-animated .iso-m-spin>*{transform-box:fill-box;transform-origin:center;animation:iso-spin 48s linear var(--iso-delay,0s) infinite}
.iso-animated .iso-m-flow>*{stroke-dasharray:2 10;animation:iso-flow 1.4s linear var(--iso-delay,0s) infinite}
.iso-animated .iso-m-ping>*{transform-box:fill-box;transform-origin:center;animation:iso-ping 3s ease-out var(--iso-delay,0s) infinite}
@keyframes iso-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes iso-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes iso-blink{0%,88%,100%{opacity:1}92%,96%{opacity:.25}}
@keyframes iso-spin{to{transform:rotate(360deg)}}
@keyframes iso-flow{to{stroke-dashoffset:-12}}
@keyframes iso-ping{0%{transform:scale(1);opacity:.8}70%,100%{transform:scale(2.4);opacity:0}}
[data-iso-motion="off"] .iso-animated *{animation:none!important}
[data-iso-motion="off"] .iso-m-flow,[data-iso-motion="off"] .iso-m-ping{display:none!important}
@media (prefers-reduced-motion:reduce){.iso-animated *{animation:none!important}.iso-m-flow,.iso-m-ping{display:none!important}}
`;

export function Motion({
  kind,
  delay = 0,
  children,
}: {
  kind: MotionKind;
  /** Seconds before the first cycle, to offset motions from each other. */
  delay?: number;
  children: ReactNode;
}) {
  return (
    <g
      className={`iso-m-${kind}`}
      style={delay ? ({ "--iso-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </g>
  );
}

/* ---------- Solids ----------------------------------------------------- */

/** A rounded rectangle in the plane z, sampled clockwise as world points. */
function roundedRect(
  x: number,
  y: number,
  w: number,
  d: number,
  r: number,
  z: number,
  steps: number,
) {
  const radius = Math.min(r, w / 2, d / 2);
  if (radius <= 0) {
    return [
      [x, y, z],
      [x + w, y, z],
      [x + w, y + d, z],
      [x, y + d, z],
    ] as Vec3[];
  }
  const corners: [number, number, number][] = [
    [x + w - radius, y + radius, -90],
    [x + w - radius, y + d - radius, 0],
    [x + radius, y + d - radius, 90],
    [x + radius, y + radius, 180],
  ];
  const pts: Vec3[] = [];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = ((start + (90 * i) / steps) * Math.PI) / 180;
      pts.push([cx + radius * Math.cos(a), cy + radius * Math.sin(a), z]);
    }
  }
  return pts;
}

/** Indices from `a` to `b`, walking forward around a closed loop of length n. */
function walk(a: number, b: number, n: number) {
  const out = [a];
  for (let i = a; i !== b; ) {
    i = (i + 1) % n;
    out.push(i);
  }
  return out;
}

export interface BoxProps {
  /** The corner with the smallest x, y and z (back, bottom). */
  at: Vec3;
  /** [width along x, depth along y, height along z]. */
  size: Vec3;
  /** Corner radius in the top plane. Equal to half the side for a cylinder. */
  radius?: number;
  tone?: Tone;
  /** Draw the hidden back edges as dashed lines. */
  hidden?: boolean;
  stroke?: string;
  /** Arc smoothness: segments per rounded corner. */
  steps?: number;
}

/**
 * A box, slab or (with radius = side / 2) cylinder. Draws the three visible
 * faces with top-left lighting, then the outline.
 */
export function Box({
  at,
  size,
  radius = 0,
  tone = "solid",
  hidden = false,
  stroke = ink.line,
  steps,
}: BoxProps) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const segs = steps ?? (radius >= Math.min(w, d) / 2 - 0.01 ? 16 : 5);
  const top = roundedRect(x, y, w, d, radius, z + h, segs).map(project);
  const bottom = roundedRect(x, y, w, d, radius, z, segs).map(project);
  const n = top.length;

  let L = 0;
  let R = 0;
  let F = 0;
  let B = 0;
  top.forEach(([sx, sy], i) => {
    const [lx] = top[L] as Vec2;
    const [rx] = top[R] as Vec2;
    if (sx < lx - 1e-6) L = i;
    if (sx > rx + 1e-6) R = i;
    if (sy > (top[F] as Vec2)[1] + 1e-6) F = i;
    if (sy < (top[B] as Vec2)[1] - 1e-6) B = i;
  });
  // Walking R -> L must pass the front point; otherwise the loop runs the other way.
  const front = walk(R, L, n).includes(F) ? walk(R, L, n) : walk(L, R, n).reverse();
  const back = walk(L, R, n).includes(B) ? walk(L, R, n) : walk(R, L, n).reverse();
  const fIndex = front.indexOf(F);
  const rightIdx = front.slice(0, fIndex + 1);
  const leftIdx = front.slice(fIndex);

  const pick = (pts: Vec2[], idx: number[]) => idx.map((i) => pts[i] as Vec2);
  const face = (idx: number[]) => [...pick(top, idx), ...pick(bottom, idx).reverse()];

  const fills: Record<Tone, [string, string, string]> = {
    solid: [ink.top, ink.left, ink.right],
    glass: [ink.glass, ink.glass, ink.glass],
    outline: ["none", "none", "none"],
    accent: [ink.accentSoft, ink.accentSoft, ink.accentSoft],
  };
  // Round solids (cylinders) get one side tone: a hard light/dark split down a curve reads as a line.
  const cylinder = radius >= Math.min(w, d) / 2 - 0.01;
  const [topFill, sideFill, rightFill] = fills[tone];
  const leftFill = cylinder ? rightFill : sideFill;
  const lineColor = tone === "accent" ? ink.accent : stroke;
  const dash = tone === "outline" ? DASH : undefined;
  const sharp = radius <= 0.5;
  const opaque = tone === "solid" || tone === "accent";
  const at2 = (pts: Vec2[], i: number) => pts[i] as Vec2;

  return (
    <g>
      {hidden && (
        <g stroke={ink.dash} strokeDasharray={DASH}>
          <polyline points={toPoints(pick(bottom, back))} {...hairline} />
          {sharp && (
            <line
              x1={round(at2(bottom, B)[0])}
              y1={round(at2(bottom, B)[1])}
              x2={round(at2(top, B)[0])}
              y2={round(at2(top, B)[1])}
              {...hairline}
            />
          )}
        </g>
      )}
      {/* Opaque faces are stroked in their own color to seal the antialiasing seam between them. */}
      <polygon
        points={toPoints(face(leftIdx))}
        fill={leftFill}
        stroke={opaque ? leftFill : undefined}
        {...(opaque ? hairline : {})}
      />
      <polygon
        points={toPoints(face(rightIdx))}
        fill={rightFill}
        stroke={opaque ? rightFill : undefined}
        {...(opaque ? hairline : {})}
      />
      <polygon
        points={toPoints(top)}
        fill={topFill}
        stroke={lineColor}
        strokeDasharray={dash}
        {...hairline}
      />
      <g stroke={lineColor} strokeDasharray={dash}>
        <polyline points={toPoints(pick(bottom, front))} {...hairline} />
        {[L, R, ...(sharp ? [F] : [])].map((i) => (
          <line
            key={i}
            x1={round(at2(top, i)[0])}
            y1={round(at2(top, i)[1])}
            x2={round(at2(bottom, i)[0])}
            y2={round(at2(bottom, i)[1])}
            {...hairline}
          />
        ))}
      </g>
    </g>
  );
}

/**
 * A thin flat plate, e.g. a layer, card, sheet or screen. Keep it at least 4
 * units thick: thinner, its top and bottom outlines merge into one heavy line.
 */
export function Plate({
  thickness = 4,
  ...props
}: Omit<BoxProps, "size"> & { size: Vec2; thickness?: number }) {
  return <Box {...props} size={[props.size[0], props.size[1], thickness]} />;
}

/** A vertical cylinder centered on `center` (its base). */
export function Cylinder({
  center,
  radius,
  height,
  ...props
}: Omit<BoxProps, "at" | "size" | "radius"> & { center: Vec3; radius: number; height: number }) {
  const [cx, cy, cz] = center;
  return (
    <Box
      {...props}
      at={[cx - radius, cy - radius, cz]}
      size={[radius * 2, radius * 2, height]}
      radius={radius}
    />
  );
}

/** A flat outline in the plane z: a footprint, pad or landing zone. One line, never doubled. */
export function Footprint({
  at,
  size,
  radius = 0,
  color = ink.dash,
  fill = "none",
  dashed = true,
}: {
  at: Vec3;
  size: Vec2;
  radius?: number;
  color?: string;
  fill?: string;
  dashed?: boolean;
}) {
  const [x, y, z] = at;
  const pts = roundedRect(x, y, size[0], size[1], radius, z, 5).map(project);
  return (
    <polygon
      points={toPoints(pts)}
      fill={fill}
      stroke={color}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

/* ---------- Lines ------------------------------------------------------ */

export interface LineProps {
  from: Vec3;
  to: Vec3;
  color?: string;
  dashed?: boolean;
}

export function Line({ from, to, color = ink.dash, dashed = true }: LineProps) {
  const [x1, y1] = project(from);
  const [x2, y2] = project(to);
  return (
    <line
      x1={round(x1)}
      y1={round(y1)}
      x2={round(x2)}
      y2={round(y2)}
      stroke={color}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

export function Path3({
  points: pts,
  closed = false,
  color = ink.dash,
  dashed = true,
  fill = "none",
}: {
  points: Vec3[];
  closed?: boolean;
  color?: string;
  dashed?: boolean;
  fill?: string;
}) {
  const Tag = closed ? "polygon" : "polyline";
  return (
    <Tag
      points={toPoints(pts.map(project))}
      stroke={color}
      fill={fill}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

/** Ground grid in the plane z, from (x0, y0) to (x1, y1). */
export function Grid({
  from,
  to,
  step = 20,
  z = 0,
  color = ink.grid,
}: {
  from: Vec2;
  to: Vec2;
  step?: number;
  z?: number;
  color?: string;
}) {
  const lines: [Vec3, Vec3][] = [];
  for (let x = from[0]; x <= to[0] + 1e-6; x += step)
    lines.push([
      [x, from[1], z],
      [x, to[1], z],
    ]);
  for (let y = from[1]; y <= to[1] + 1e-6; y += step)
    lines.push([
      [from[0], y, z],
      [to[0], y, z],
    ]);
  return (
    <g>
      {lines.map(([a, b]) => (
        <Line key={`${a.join()}-${b.join()}`} from={a} to={b} color={color} dashed={false} />
      ))}
    </g>
  );
}

/** A screen-space dot at a world point, e.g. an LED or a screw. */
export function Dot({ at, r = 2, color = ink.accent }: { at: Vec3; r?: number; color?: string }) {
  const [x, y] = project(at);
  return <circle cx={round(x)} cy={round(y)} r={r} fill={color} />;
}

/* ---------- Drawing on faces ------------------------------------------- */

export type Plane = "top" | "left" | "right";

/**
 * Draws 2D children onto a face. Local x runs left to right as seen on the
 * face, local y runs down. `at` is the face's top-left corner in world space:
 *
 * - top:   origin (x0, y0, z1); local x = +x, local y = +y
 * - left:  the +y face, origin (x0, y1, z1); local x = +x, local y = down
 * - right: the +x face, origin (x1, y1, z1); local x = -y, local y = down
 */
export function Face({ plane, at, children }: { plane: Plane; at: Vec3; children: ReactNode }) {
  const [ox, oy] = project(at);
  const m =
    plane === "top"
      ? [COS30, SIN30, -COS30, SIN30]
      : plane === "left"
        ? [COS30, SIN30, 0, 1]
        : [COS30, -SIN30, 0, 1];
  return (
    <g transform={`matrix(${m.map(round).join(" ")} ${round(ox)} ${round(oy)})`}>{children}</g>
  );
}

export function FaceRect({
  x,
  y,
  width,
  height,
  radius = 0,
  fill = "none",
  color = ink.detail,
  dashed = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  fill?: string;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius}
      fill={fill}
      stroke={color}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

/** A filled bar, e.g. a line of text in a document or a progress track. */
export function FaceBar({
  x,
  y,
  width,
  height = 3,
  color = ink.fill,
}: {
  x: number;
  y: number;
  width: number;
  height?: number;
  color?: string;
}) {
  return <rect x={x} y={y} width={width} height={height} rx={height / 2} fill={color} />;
}

export function FaceCircle({
  cx,
  cy,
  r,
  fill = "none",
  color = ink.detail,
  dashed = false,
}: {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      stroke={color}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

export function FaceLine({
  from,
  to,
  color = ink.detail,
  dashed = false,
}: {
  from: Vec2;
  to: Vec2;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

/** Any SVG path drawn on a face, e.g. an emblem or a curve. */
export function FacePath({
  d,
  fill = "none",
  color = ink.detail,
  dashed = false,
}: {
  d: string;
  fill?: string;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeDasharray={dashed ? DASH : undefined}
      {...hairline}
    />
  );
}

/** Small uppercase mono label lying on a face. */
export function FaceText({
  x,
  y,
  size = 7,
  color = ink.text,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      letterSpacing="0.12em"
    >
      {children.toUpperCase()}
    </text>
  );
}
