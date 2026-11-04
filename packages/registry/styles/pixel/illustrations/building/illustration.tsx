import { Canvas, type IllustrationProps, Pixels, rect } from "../../kit/pixel";

const COLUMNS = [21, 25, 29, 33];
const FLOORS = [14, 18, 22];

const c = new Canvas(56, 40).shadow(29, 36.5, 21);
// The plaza, then the tower standing on its top face.
c.block(10, 30, 36, 6, { top: 3 }).block(18, 6, 20, 27, { top: 5 });
for (const y of FLOORS) for (const x of COLUMNS) c.fill(rect(x, y, 2, 2), "mid");
c.shape(rect(26, 27, 4, 5), { fill: "shade", bevel: false });
// A unit on the roof and an antenna.
c.block(21, 3, 8, 6, { top: 3 }).line(33, 1, 33, 6);
// One lit window.
c.layer("pulse", (l) => l.fill(rect(29, 18, 2, 2), "accent"));

export function BuildingIllustration(props: IllustrationProps) {
  return <Pixels title="Office building" canvas={c} {...props} />;
}

export default BuildingIllustration;
