import { Canvas, type IllustrationProps, Pixels, rect } from "../../kit/pixel";

const PLATE = { top: 5 };

const c = new Canvas(56, 40).shadow(29, 34.5, 21);
c.block(11, 26, 34, 8, PLATE).block(11, 16, 34, 8, PLATE);
// The top plate floats, with the orange mark on it.
c.layer("float", (l) => {
  l.block(11, 5, 34, 8, PLATE);
  l.fill(rect(24, 7, 8, 2), "accent");
});

export function LayersIllustration(props: IllustrationProps) {
  return <Pixels title="Stacked layers" canvas={c} {...props} />;
}

export default LayersIllustration;
