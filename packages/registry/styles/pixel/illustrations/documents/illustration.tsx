import { Canvas, type IllustrationProps, Pixels } from "../../kit/pixel";

const c = new Canvas(56, 40).shadow(28, 33.5, 19);
// The stack: paper edges show on its front.
c.block(12, 19, 30, 14, { top: 6, fill: "white" });
for (const y of [27, 29]) c.line(13, y, 40, y, "mid");
// One sheet lifted off the top, with a highlighted phrase.
c.layer("float", (l) => {
  l.block(16, 4, 26, 11, { top: 9 });
  l.line(19, 7, 34, 7, "mid").line(31, 9, 38, 9, "mid").line(19, 11, 30, 11, "mid");
  l.line(19, 9, 29, 9, "accent");
});

export function DocumentsIllustration(props: IllustrationProps) {
  return <Pixels title="Documents" canvas={c} {...props} />;
}

export default DocumentsIllustration;
