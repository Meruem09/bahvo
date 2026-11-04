import {
  Canvas,
  circle,
  type IllustrationProps,
  intersect,
  Pixels,
  type Role,
  rect,
} from "../../kit/pixel";

const GROUND = 35;

const c = new Canvas(56, 40).shadow(28, 35, 24);

/** A head, a one-row neck gap, then rounded shoulders cut flat at the ground. */
function person(cx: number, top: number, shirt: Role = "light") {
  c.shape(intersect(rect(cx - 7, top + 10, 14, 30, 5), rect(0, 0, 56, GROUND)), { fill: shirt });
  c.shape(circle(cx, top + 4.5, 4.5), { fill: "white" });
}

// Two behind, the one on the right speaking, then one in front.
person(16, 8);
person(40, 8, "accent");
person(28, 13);
c.layer("float", (l) => {
  l.shape(rect(42, 1, 13, 6, 2), { fill: "white" });
  l.sprite(44, 6, [".wo", "oo."]);
  l.set(46, 3, "accent").set(48, 3, "mid").set(50, 3, "mid");
});

export function TeamIllustration(props: IllustrationProps) {
  return <Pixels title="Team" canvas={c} {...props} />;
}

export default TeamIllustration;
