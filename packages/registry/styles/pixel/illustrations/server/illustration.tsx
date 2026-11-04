import { Canvas, type IllustrationProps, Pixels } from "../../kit/pixel";

const c = new Canvas(56, 40).shadow(30, 33, 20).block(12, 9, 32, 24, { top: 7 });
// Vent slots on top.
c.line(18, 12, 37, 12, "mid").line(18, 14, 37, 14, "mid");
// Two units on the front, each with a drive slot and three LEDs.
c.line(13, 24, 42, 24);
for (const y of [20, 28]) {
  c.line(16, y, 27, y, "shade");
  for (const x of [34, 37, 40]) c.set(x, y, "shade");
}
// The top unit's first LED is live.
c.layer("blink", (l) => l.set(34, 20, "accent"));

export function ServerIllustration(props: IllustrationProps) {
  return <Pixels title="Server" canvas={c} {...props} />;
}

export default ServerIllustration;
