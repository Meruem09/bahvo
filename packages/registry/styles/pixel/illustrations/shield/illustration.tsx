import {
  Canvas,
  ellipse,
  type IllustrationProps,
  inset,
  type Mask,
  move,
  Pixels,
  rect,
} from "../../kit/pixel";

/** Straight sides down to row 15, then convex edges that meet at a point. */
const CX = 28;
const HALF = 10;
const TOP = 3;
const SIDE = 15;
const TIP = 30;
const SHIELD: Mask = (x, y) => {
  if (!rect(CX - HALF, TOP, 2 * HALF, TIP - TOP, 2)(x, y)) return false;
  const t = Math.max(0, (y + 0.5 - SIDE) / (TIP - SIDE));
  return Math.abs(x + 0.5 - CX) <= HALF * (1 - t * t);
};
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const SHACKLE = [
  ".dddd.",
  "d....d",
  "d....d",
  "d....d",
];

const c = new Canvas(56, 40).shadow(28, 38, 19);
c.block(10, 31, 36, 7, { top: 4 }).fill(ellipse(28, 33.5, 6, 1.6), "mid");
c.layer("float", (l) => {
  // A back copy two cells over gives the shield its thickness.
  l.shape(move(SHIELD, 2, 0), { fill: "mid", bevel: false });
  l.shape(SHIELD, { fill: "white" });
  l.edge(inset(SHIELD, 2), "mid");
  l.sprite(25, 10, SHACKLE);
  l.shape(rect(24, 14, 8, 6, 1), { fill: "accent", line: "accentDark" });
  l.fill(rect(27, 16, 2, 2), "accentDark");
});

export function ShieldIllustration(props: IllustrationProps) {
  return <Pixels title="Security shield" canvas={c} {...props} />;
}

export default ShieldIllustration;
