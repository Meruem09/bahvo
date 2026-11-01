import {
  Box,
  Dot,
  Face,
  FaceRect,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Line,
  Motion,
} from "../../kit/isometric";

const BASE = 12;
const X0 = -40;
const Y0 = -40;
const W = 80;
const D = 80;
const H = 120;
const ROOF = BASE + H;
const ANTENNA = [24, -30] as const;

/** Window grid on a side face: 4 columns by 6 rows, in face-local units. */
const WINDOWS = [8, 26, 44, 62].flatMap((x) =>
  [10, 25, 40, 55, 70, 85].map((y) => [x, y] as const),
);

function Windows({ lit }: { lit?: readonly [number, number] }) {
  return WINDOWS.map(([x, y]) => {
    const on = lit?.[0] === x && lit?.[1] === y;
    const window = (
      <FaceRect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width={10}
        height={8}
        radius={1}
        fill={on ? ink.accent : "none"}
        color={on ? ink.accent : ink.detail}
      />
    );
    return on ? (
      <Motion key={`${x}-${y}`} kind="pulse">
        {window}
      </Motion>
    ) : (
      window
    );
  });
}

export function BuildingIllustration(props: IllustrationProps) {
  return (
    <Iso title="Building" canvas={[380, 320]} origin={[190, 196]} {...props}>
      <Grid from={[-100, -100]} to={[100, 100]} step={20} />
      <Box at={[-85, -85, 0]} size={[170, 170, BASE]} radius={16} />
      <Box at={[X0, Y0, BASE]} size={[W, D, H]} />
      <Face plane="left" at={[X0, Y0 + D, ROOF]}>
        <Windows lit={[44, 25]} />
        <FaceRect x={30} y={100} width={20} height={20} color={ink.line} />
      </Face>
      <Face plane="right" at={[X0 + W, Y0 + D, ROOF]}>
        <Windows />
      </Face>
      <Box at={[-26, -28, ROOF]} size={[30, 26, 10]} />
      <Line
        from={[ANTENNA[0], ANTENNA[1], ROOF]}
        to={[ANTENNA[0], ANTENNA[1], ROOF + 26]}
        color={ink.line}
        dashed={false}
      />
      <Motion kind="blink" delay={1.6}>
        <Dot at={[ANTENNA[0], ANTENNA[1], ROOF + 28]} r={2.4} />
      </Motion>
    </Iso>
  );
}

export default BuildingIllustration;
