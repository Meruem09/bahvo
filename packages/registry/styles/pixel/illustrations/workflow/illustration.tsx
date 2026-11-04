import { Canvas, type IllustrationProps, Pixels, type Role, rect } from "../../kit/pixel";

const TILE = { top: 5 };
const XS = [3, 22, 41];
// biome-ignore format: one sprite row per line, so the glyph shows in the source.
const CHECK = [
  ".....o",
  "o...o.",
  ".o.o..",
  "..o...",
];

const c = new Canvas(56, 40);
for (const x of XS) c.shadow(x + 6.5, 20, 8, 1.4);
// The skipped branch: a dashed drop to a ghost tile.
c.line(27, 20, 27, 25, "line", 1);
c.block(22, 26, 12, 9, { top: 4, fill: "ground", topFill: "ground" });
for (const x of XS) c.block(x, 9, 12, 11, TILE);
// Done, running, pending.
c.sprite(6, 10, CHECK);
c.edge(rect(25, 10, 6, 4, 1), "mid").fill(rect(27, 11, 2, 2), "accent");
c.edge(rect(45, 10, 4, 4), "mid");
/** An arrow along row 16 ending at `tip`, with a two-cell chevron head. */
function arrow(canvas: Canvas, from: number, tip: number, role: Role) {
  canvas.line(from, 16, tip, 16, role);
  canvas.line(tip - 2, 14, tip - 1, 15, role).line(tip - 2, 18, tip - 1, 17, role);
}

// Arrows between steps: the one into the running step pulses orange.
arrow(c, 15, 21, "line");
arrow(c, 34, 40, "line");
c.layer("pulse", (l) => arrow(l, 15, 21, "accent"));

export function WorkflowIllustration(props: IllustrationProps) {
  return <Pixels title="Workflow" canvas={c} {...props} />;
}

export default WorkflowIllustration;
