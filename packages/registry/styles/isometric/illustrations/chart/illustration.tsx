import {
  Box,
  Cylinder,
  Face,
  FaceBar,
  FaceCircle,
  FaceLine,
  FacePath,
  FaceRect,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
} from "../../kit/isometric";

const X0 = -80;
const Y0 = -70;
const W = 160;
const D = 140;
const SLAB = 16;
/** Bars stand in a row along the back of the panel; the last one is the current period. */
const BAR = 18;
const BAR_Y = -40;
const HEIGHTS = [26, 40, 34, 56, 76];
const barX = (i: number) => -64 + 30 * i;
const LAST = HEIGHTS.length - 1;
/** The floating badge above the current bar. */
const BADGE = [barX(LAST) + BAR / 2, BAR_Y + BAR / 2, SLAB + (HEIGHTS[LAST] ?? 0) + 34] as const;

export function ChartIllustration(props: IllustrationProps) {
  return (
    <Iso title="Analytics chart" canvas={[360, 272]} origin={[180, 152]} {...props}>
      <Grid from={[-96, -96]} to={[96, 96]} step={24} />
      <Box at={[X0, Y0, 0]} size={[W, D, SLAB]} radius={10} />
      <Face plane="top" at={[X0, Y0, SLAB]}>
        <FaceLine from={[10, 54]} to={[W - 10, 54]} />
        {HEIGHTS.map((_, i) => (
          <FaceBar key={barX(i)} x={barX(i) - X0 + 3} y={58} width={12} />
        ))}
        {/* Two stat cards along the front edge. */}
        <FaceRect x={12} y={74} width={64} height={52} radius={4} />
        <FaceBar x={20} y={83} width={26} color={ink.detail} />
        <FaceBar x={20} y={93} width={40} height={6} />
        <FacePath d="M20 116 L30 110 L38 113 L48 104 L58 106 L68 98" />
        <FaceRect x={84} y={74} width={64} height={52} radius={4} />
        <FaceBar x={92} y={83} width={22} color={ink.detail} />
        <FaceBar x={92} y={93} width={32} height={6} />
        <FaceBar x={92} y={110} width={48} />
        <FaceBar x={92} y={110} width={30} color={ink.detail} />
      </Face>
      {HEIGHTS.map((h, i) => (
        <Box
          key={barX(i)}
          at={[barX(i), BAR_Y, SLAB]}
          size={[BAR, BAR, h]}
          radius={3}
          tone={i === LAST ? "accent" : "solid"}
        />
      ))}
      <Motion kind="float">
        <Cylinder center={BADGE} radius={12} height={6} />
        <Face plane="top" at={[BADGE[0] - 12, BADGE[1] - 12, BADGE[2] + 6]}>
          <FaceCircle cx={12} cy={12} r={3.5} fill={ink.accent} color="none" />
          <Motion kind="ping">
            <FaceCircle cx={12} cy={12} r={3.5} color={ink.accent} />
          </Motion>
        </Face>
      </Motion>
    </Iso>
  );
}

export default ChartIllustration;
