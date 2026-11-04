import { Canvas, type IllustrationProps, Pixels, rect } from "../../kit/pixel";

/** A four-point sparkle, with a light core. */
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
const NODE = { top: 3 };

const c = new Canvas(56, 40).shadow(28, 29, 17);
// Cables first, so the hub and nodes cover their ends. The right one is active.
c.line(12, 25, 17, 25).line(39, 25, 43, 25, "accent").line(28, 28, 28, 32);
c.block(3, 21, 9, 8, NODE).block(44, 21, 9, 8, NODE).block(24, 33, 9, 6, NODE);
c.fill(rect(6, 22, 3, 2), "mid")
  .fill(rect(27, 34, 3, 2), "mid")
  .fill(rect(47, 22, 3, 2), "shade");
c.block(18, 8, 21, 20, { top: 10 }).sprite(25, 10, SPARKLE);
c.layer("blink", (l) => l.fill(rect(47, 22, 3, 2), "accent"));

export function HubIllustration(props: IllustrationProps) {
  return <Pixels title="Integration hub" canvas={c} {...props} />;
}

export default HubIllustration;
