import { Canvas, type IllustrationProps, Pixels, rect } from "../../kit/pixel";

/** Three endpoint rows: method pill, path, status. The first request is in flight. */
const ROWS = [
  { y: 19, path: 16 },
  { y: 24, path: 11 },
  { y: 29, path: 14 },
];
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const BRACES = [
  ".aa...aa.",
  ".a.....a.",
  "a.......a",
  ".a.....a.",
  ".aa...aa.",
];

const c = new Canvas(56, 40).shadow(29, 35.5, 21);
c.block(9, 11, 38, 24, { top: 5 });
for (const [i, { y, path }] of ROWS.entries()) {
  c.fill(rect(12, y, 6, 3, 1), i === 0 ? "accent" : "mid");
  c.line(21, y + 1, 21 + path, y + 1, "mid").set(42, y + 1, "shade");
  if (i < ROWS.length - 1) c.line(11, y + 4, 44, y + 4, "mid");
}
c.set(42, 13, "shade");
c.layer("blink", (l) => l.set(42, 13, "accent"));
// A braces chip floats above the panel's back-right corner.
c.layer("float", (l) => {
  l.shape(rect(40, 1, 14, 8, 2), { fill: "white" });
  l.sprite(42, 2, BRACES);
});

export function ApiIllustration(props: IllustrationProps) {
  return <Pixels title="API" canvas={c} {...props} />;
}

export default ApiIllustration;
