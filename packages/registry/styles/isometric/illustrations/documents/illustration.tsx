import {
  Box,
  Face,
  FaceBar,
  FaceLine,
  FaceRect,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Line,
  Motion,
  Plate,
} from "../../kit/isometric";

/** The paper stack. */
const X0 = -60;
const Y0 = -75;
const W = 120;
const D = 150;
const H = 40;
/** Page edges on the stack's sides. */
const PAGE_EDGES = [8, 15, 22, 29];

/** The sheet lifted off the stack. */
const SX = -50;
const SY = Y0 - 26;
const SW = 100;
const SD = 136;
const SZ = 92;

export function DocumentsIllustration(props: IllustrationProps) {
  return (
    <Iso title="Documents" canvas={[360, 300]} origin={[180, 192]} {...props}>
      <Grid from={[-84, -100]} to={[84, 100]} step={20} />
      {/* The sheet's back corner hangs past the stack, so it drops to the ground behind it. */}
      <Line from={[SX + SW, SY, 0]} to={[SX + SW, SY, SZ]} />
      <Box at={[X0, Y0, 0]} size={[W, D, H]} />
      <Face plane="left" at={[X0, Y0 + D, H]}>
        {PAGE_EDGES.map((y) => (
          <FaceLine key={y} from={[0, y]} to={[W, y]} color={ink.dash} />
        ))}
      </Face>
      <Face plane="right" at={[X0 + W, Y0 + D, H]}>
        {PAGE_EDGES.map((y) => (
          <FaceLine key={y} from={[0, y]} to={[D, y]} color={ink.dash} />
        ))}
      </Face>
      <Face plane="top" at={[X0, Y0, H]}>
        <FaceBar x={14} y={18} width={44} height={4} color={ink.detail} />
        {[34, 44, 54, 64, 74].map((y, i) => (
          <FaceBar key={y} x={14} y={y} width={i === 4 ? 52 : 90} />
        ))}
      </Face>
      {/* Front corners hang over the stack, so they land on its top face. */}
      <Line from={[SX, SY + SD, H]} to={[SX, SY + SD, SZ]} />
      <Line from={[SX + SW, SY + SD, H]} to={[SX + SW, SY + SD, SZ]} />
      <Motion kind="float">
        <Plate at={[SX, SY, SZ]} size={[SW, SD]} thickness={4} />
        <Face plane="top" at={[SX, SY, SZ + 4]}>
          <FaceRect
            x={12}
            y={14}
            width={22}
            height={22}
            radius={11}
            fill={ink.accentSoft}
            color={ink.accent}
          />
          <FaceBar x={44} y={18} width={44} height={4} color={ink.detail} />
          <FaceBar x={44} y={28} width={30} />
          {[50, 60, 70].map((y) => (
            <FaceBar key={y} x={12} y={y} width={86} />
          ))}
          <FaceBar x={12} y={80} width={60} color={ink.accent} />
          <FaceBar x={12} y={90} width={70} />
        </Face>
      </Motion>
    </Iso>
  );
}

export default DocumentsIllustration;
