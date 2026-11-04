import { Canvas, ellipse, type IllustrationProps, Pixels, rect, union } from "../../kit/pixel";

/** Three tiers, 7 cells apart: each rim is the lower arc of an ellipse. */
const TOP = 10;
const RIMS = [17, 24];
const BOTTOM = 31;
const rim = (y: number) => ellipse(28, y, 14, 4.5);

const c = new Canvas(56, 40).shadow(29, 35.5, 18);
c.shape(union(rim(TOP), rect(14, TOP, 28, BOTTOM - TOP), rim(BOTTOM)), { fill: "light" });
c.shape(rim(TOP), { fill: "white" });
for (const y of RIMS) c.edge(rim(y), "line", (_, cy) => cy >= y);
// The lid: a small ring around an orange core.
c.edge(ellipse(28, TOP, 9, 3), "mid").fill(rect(27, 9, 2, 2), "accent");
// Two LEDs per tier; the bottom tier's first one is live.
for (const y of [17, 24, 31]) c.set(34, y, "shade").set(37, y, "shade");
c.layer("blink", (l) => l.set(34, 31, "accent"));

export function DatabaseIllustration(props: IllustrationProps) {
  return <Pixels title="Database" canvas={c} {...props} />;
}

export default DatabaseIllustration;
