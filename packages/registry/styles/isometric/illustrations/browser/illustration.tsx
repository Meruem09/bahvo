import {
  Box,
  Face,
  FaceBar,
  FaceCircle,
  FaceLine,
  FaceRect,
  Footprint,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Line,
  Motion,
  Plate,
} from "../../kit/isometric";

const W = 200;
const D = 140;
const Z = 40;
const X0 = -W / 2;
const Y0 = -D / 2;
/** The floating code chip. */
const CX = 20;
const CY = -96;
const CZ = Z + 46;

export function BrowserIllustration(props: IllustrationProps) {
  return (
    <Iso title="Browser window" canvas={[360, 270]} origin={[180, 152]} {...props}>
      <Grid from={[-112, -82]} to={[112, 82]} step={16} />
      <Footprint at={[X0, Y0, 0]} size={[W, D]} radius={8} />
      {(
        [
          [X0, Y0 + D],
          [X0 + W, Y0 + D],
          [X0 + W, Y0],
        ] as const
      ).map(([x, y]) => (
        <Line key={`${x}${y}`} from={[x, y, 0]} to={[x, y, Z]} />
      ))}
      <Plate at={[X0, Y0, Z]} size={[W, D]} thickness={6} radius={8} />
      <Face plane="top" at={[X0, Y0, Z + 6]}>
        <FaceLine from={[0, 18]} to={[W, 18]} />
        <FaceCircle cx={10} cy={9} r={2.4} fill={ink.detail} color="none" />
        <FaceCircle cx={18} cy={9} r={2.4} fill={ink.fill} color="none" />
        <FaceCircle cx={26} cy={9} r={2.4} fill={ink.fill} color="none" />
        <FaceRect x={44} y={5} width={142} height={8} radius={4} />
        <FaceBar x={14} y={32} width={90} height={6} color={ink.detail} />
        {[46, 55, 64].map((y) => (
          <FaceBar key={y} x={14} y={y} width={y === 64 ? 60 : 100} />
        ))}
        <FaceRect
          x={14}
          y={80}
          width={36}
          height={11}
          radius={5.5}
          fill={ink.accent}
          color="none"
        />
        <FaceRect x={128} y={30} width={58} height={92} radius={4} />
        <FaceBar x={136} y={40} width={30} height={4} color={ink.detail} />
        {[52, 60, 68, 76].map((y) => (
          <FaceBar key={y} x={136} y={y} width={40} height={3} />
        ))}
        <FaceRect x={136} y={88} width={42} height={24} radius={2} dashed />
      </Face>
      <Motion kind="float">
        <Box at={[CX, CY, CZ]} size={[44, 44, 8]} radius={6} />
        {/* "</>" drawn as lines: a mono glyph, letter-spaced on a skewed plane, reads poorly. */}
        <Face plane="top" at={[CX, CY, CZ + 8]}>
          <FaceLine from={[17, 15]} to={[11, 22]} color={ink.accent} />
          <FaceLine from={[11, 22]} to={[17, 29]} color={ink.accent} />
          <FaceLine from={[25, 13]} to={[20, 31]} color={ink.accent} />
          <FaceLine from={[28, 15]} to={[34, 22]} color={ink.accent} />
          <FaceLine from={[34, 22]} to={[28, 29]} color={ink.accent} />
        </Face>
      </Motion>
    </Iso>
  );
}

export default BrowserIllustration;
