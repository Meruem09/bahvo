import {
  Cylinder,
  Face,
  FaceBar,
  FaceCircle,
  FaceRect,
  Footprint,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
  Plate,
} from "../../kit/isometric";

const W = 90;
const D = 170;
const Z = 24;
const X0 = -W / 2;
const Y0 = -D / 2;
/** The floating notification badge. */
const BADGE = [30, -70] as const;
const BADGE_Z = 74;

export function PhoneIllustration(props: IllustrationProps) {
  return (
    <Iso title="Phone" canvas={[320, 240]} origin={[160, 128]} {...props}>
      <Grid from={[-64, -104]} to={[64, 104]} step={16} />
      <Footprint at={[X0, Y0, 0]} size={[W, D]} radius={14} />
      <Plate at={[X0, Y0, Z]} size={[W, D]} thickness={8} radius={14} />
      <Face plane="top" at={[X0, Y0, Z + 8]}>
        <FaceRect x={6} y={6} width={W - 12} height={D - 12} radius={8} />
        <FaceBar x={35} y={11} width={20} height={3} color={ink.detail} />
        <FaceCircle cx={20} cy={32} r={7} fill={ink.fill} color={ink.detail} />
        <FaceBar x={32} y={28} width={36} height={4} color={ink.detail} />
        <FaceBar x={32} y={36} width={24} height={3} />
        <FaceRect x={14} y={50} width={62} height={44} radius={4} />
        <FaceBar x={20} y={58} width={34} height={4} color={ink.detail} />
        {[68, 76, 84].map((y) => (
          <FaceBar key={y} x={20} y={y} width={48} height={3} />
        ))}
        {[104, 114, 124].map((y) => (
          <FaceBar key={y} x={14} y={y} width={y === 124 ? 40 : 62} height={3} />
        ))}
        <FaceRect
          x={20}
          y={140}
          width={50}
          height={9}
          radius={4.5}
          fill={ink.accent}
          color="none"
        />
      </Face>
      <Motion kind="float">
        <Cylinder center={[BADGE[0], BADGE[1], BADGE_Z]} radius={14} height={6} />
        <Face plane="top" at={[BADGE[0] - 14, BADGE[1] - 14, BADGE_Z + 6]}>
          <FaceCircle cx={14} cy={14} r={4} fill={ink.accent} color="none" />
        </Face>
      </Motion>
    </Iso>
  );
}

export default PhoneIllustration;
