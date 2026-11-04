import { Canvas, type IllustrationProps, Pixels } from "../../kit/pixel";

/** Five bars standing on the panel's top face; the latest is the current period. */
const HEIGHTS = [9, 13, 11, 17, 22];
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const ARROW = [
  "..a..",
  ".aaa.",
  "aaaaa",
  "..a..",
  "..a..",
];

const c = new Canvas(56, 40).shadow(28, 37.5, 23).block(6, 28, 44, 9, { top: 5 });
HEIGHTS.forEach((h, i) => {
  const current = i === HEIGHTS.length - 1;
  c.block(
    10 + 8 * i,
    31 - h,
    6,
    h + 1,
    current ? { top: 3, fill: "accent", topFill: "accentLight", line: "accentDark" } : { top: 3 },
  );
});
c.layer("float", (l) => l.sprite(42, 2, ARROW));

export function ChartIllustration(props: IllustrationProps) {
  return <Pixels title="Analytics chart" canvas={c} {...props} />;
}

export default ChartIllustration;
