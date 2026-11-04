import { Canvas, circle, type IllustrationProps, Pixels, rect, union } from "../../kit/pixel";

/** Three lobes on a flat base. */
const CLOUD = union(
  circle(20, 16.5, 5.5),
  circle(28.5, 12.5, 8),
  circle(37, 15.5, 6.5),
  rect(14, 15, 30, 8, 4),
);
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const ARROW = [
  "..a..",
  ".aaa.",
  "a.a.a",
  "..a..",
  "..a..",
];

const c = new Canvas(56, 40).shadow(28, 36.5, 15);
// The storage unit, with a dashed sync line up to the cloud.
c.block(16, 27, 24, 9, { top: 4 }).line(28, 23, 28, 26, "line", 1);
for (const x of [19, 21, 23]) c.set(x, 33, "shade");
c.layer("blink", (l) => l.set(19, 33, "accent"));
c.layer("float", (l) => {
  l.shape(CLOUD, { fill: "white" });
  l.sprite(26, 11, ARROW);
});

export function CloudIllustration(props: IllustrationProps) {
  return <Pixels title="Cloud storage" canvas={c} {...props} />;
}

export default CloudIllustration;
