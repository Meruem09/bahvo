import { Canvas, type IllustrationProps, Pixels } from "../../kit/pixel";

// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const SPARKLE = [
  "...a...",
  "...a...",
  "..aaa..",
  "aaapaaa",
  "..aaa..",
  "...a...",
  "...a...",
];
/** Traces from the side pins out to vias, on the board's top face: [row, from, to]. */
const LEFT: [number, number, number][] = [
  [20, 13, 8],
  [24, 13, 10],
];
const RIGHT: [number, number, number][] = [
  [20, 41, 45],
  [24, 41, 44],
];
const LIVE_ROW = 22;

const c = new Canvas(56, 40).shadow(28, 35.5, 25).block(4, 18, 48, 16, { top: 10 });
for (const [y, from, to] of LEFT) c.line(to, y, from, y, "mid").set(to - 1, y, "shade");
for (const [y, from, to] of RIGHT) c.line(from, y, to, y, "mid").set(to + 1, y, "shade");
c.line(41, LIVE_ROW, 47, LIVE_ROW, "accent").set(48, LIVE_ROW, "accentDark");
// The chip, with pins along its front and sides.
c.block(16, 7, 23, 20, { top: 10 });
for (let x = 18; x <= 36; x += 3) c.set(x, 27, "line");
for (const y of [20, 22, 24]) c.line(14, y, 15, y).line(39, y, 40, y);
c.layer("pulse", (l) => l.sprite(24, 9, SPARKLE));

export function ChipIllustration(props: IllustrationProps) {
  return <Pixels title="AI chip" canvas={c} {...props} />;
}

export default ChipIllustration;
