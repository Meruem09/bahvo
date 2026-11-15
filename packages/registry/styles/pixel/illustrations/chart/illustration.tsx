import { Canvas, type IllustrationProps, Pixels } from "../../kit/pixel";

/** Five bars standing on the panel's top face; only the latest one's top is orange. */
const HEIGHTS = [9, 13, 11, 17, 22];
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const ARROW = [
  "..o..",
  ".ooo.",
  "ooooo",
  "..o..",
  "..o..",
];

const c = new Canvas(56, 40).shadow(28, 37.5, 23).block(6, 28, 44, 9, { top: 5 });
HEIGHTS.forEach((h, i) => {
  const current = i === HEIGHTS.length - 1;
  c.block(10 + 8 * i, 31 - h, 6, h + 1, current ? { top: 3, topFill: "accent" } : { top: 3 });
});
c.layer("float", (l) => l.sprite(42, 2, ARROW));

export function ChartIllustration(props: IllustrationProps) {
  return <Pixels title="Analytics chart" canvas={c} {...props} />;
}

export default ChartIllustration;
