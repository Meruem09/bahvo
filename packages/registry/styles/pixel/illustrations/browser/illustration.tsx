import { Canvas, type IllustrationProps, inset, intersect, Pixels, rect } from "../../kit/pixel";

const WINDOW = rect(8, 6, 40, 28, 2);
/** "</>" drawn cell by cell. */
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const CODE = [
  "..a...a.a..",
  ".a....a..a.",
  "a....a....a",
  ".a..a....a.",
  "..a.a...a..",
];

const c = new Canvas(56, 40).shadow(29, 36, 21);
// A one-cell drop shadow, then the window.
c.fill(rect(9, 7, 40, 28, 2), "ground").shape(WINDOW, { fill: "white" });
// Title bar: three dots and the address pill.
c.fill(intersect(inset(WINDOW), rect(0, 7, 56, 4)), "light");
c.fill(intersect(inset(WINDOW), rect(0, 11, 56, 1)), "line");
for (const x of [11, 13, 15]) c.set(x, 9, "shade");
c.shape(rect(19, 8, 25, 3, 1), { fill: "white", line: "mid", bevel: false });
// The page: a heading, text, the primary button and a side card.
c.line(12, 15, 27, 15, "shade").line(12, 18, 30, 18, "mid").line(12, 20, 26, 20, "mid");
c.shape(rect(12, 24, 10, 4, 1), { fill: "accent", line: "accentDark" });
c.shape(rect(33, 14, 11, 16, 1), { fill: "light", line: "mid", bevel: false });
c.line(35, 17, 41, 17, "shade").line(35, 20, 40, 20, "mid").line(35, 22, 41, 22, "mid");
c.fill(rect(35, 25, 7, 3), "mid");
// A code chip floats off the top-right corner.
c.layer("float", (l) => {
  l.shape(rect(38, 1, 16, 9, 2), { fill: "white" });
  l.sprite(40, 3, CODE);
});

export function BrowserIllustration(props: IllustrationProps) {
  return <Pixels title="Browser window" canvas={c} {...props} />;
}

export default BrowserIllustration;
