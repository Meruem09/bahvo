import { Canvas, circle, type IllustrationProps, Pixels, rect } from "../../kit/pixel";

const c = new Canvas(56, 40).shadow(28.5, 37, 14);
// A one-cell drop shadow, then the phone, its speaker and home bar.
c.fill(rect(20, 4, 18, 32, 3), "ground").shape(rect(19, 3, 18, 32, 3), { fill: "white" });
c.line(26, 5, 29, 5, "mid").line(26, 32, 29, 32, "mid");
// The screen: a profile row, text and the primary button.
c.shape(rect(21, 7, 14, 24, 1), { fill: "light", line: "mid", bevel: false });
c.fill(circle(25, 11, 2.5), "mid");
c.line(28, 10, 32, 10, "shade").line(28, 12, 31, 12, "mid");
c.line(23, 16, 32, 16, "mid").line(23, 18, 30, 18, "mid").line(23, 20, 32, 20, "mid");
c.shape(rect(23, 25, 10, 3, 1), { fill: "accent", line: "accentDark" });
// A notification badge floats off the corner.
c.layer("float", (l) => {
  l.shape(circle(38, 5, 4), { fill: "white" });
  l.fill(rect(37, 4, 2, 2), "accent");
});

export function PhoneIllustration(props: IllustrationProps) {
  return <Pixels title="Phone" canvas={c} {...props} />;
}

export default PhoneIllustration;
