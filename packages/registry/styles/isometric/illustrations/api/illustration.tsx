import {
  Box,
  Face,
  FaceBar,
  FaceCircle,
  FacePath,
  FaceRect,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
} from "../../kit/isometric";

const X0 = -80;
const Y0 = -60;
const W = 160;
const D = 120;
const H = 26;
/** Three endpoint rows; the first one is the request in flight. */
const ROWS = [
  { y: 30, path: 64 },
  { y: 58, path: 46 },
  { y: 86, path: 56 },
];
const PORTS = [12, 30, 48];
/** The floating braces chip, just behind the panel's back-right edge. */
const CHIP = [20, -104, H + 44] as const;
const CHIP_S = 44;

/** Curly braces drawn as curves: a mono glyph skews badly on a face. */
const BRACES = [
  "M19 12 Q15 12 15 16 V19 Q15 22 12 22 Q15 22 15 25 V28 Q15 32 19 32",
  "M25 12 Q29 12 29 16 V19 Q29 22 32 22 Q29 22 29 25 V28 Q29 32 25 32",
];

export function ApiIllustration(props: IllustrationProps) {
  return (
    <Iso title="API" canvas={[340, 256]} origin={[170, 146]} {...props}>
      <Grid from={[-90, -90]} to={[90, 90]} step={18} />
      <Box at={[X0, Y0, 0]} size={[W, D, H]} radius={10} />
      <Face plane="top" at={[X0, Y0, H]}>
        <FaceBar x={14} y={14} width={44} color={ink.detail} />
        {ROWS.map((row, i) => (
          <g key={row.y}>
            <FaceRect x={12} y={row.y} width={W - 24} height={22} radius={5} />
            <FaceRect
              x={18}
              y={row.y + 6}
              width={24}
              height={10}
              radius={5}
              fill={i === 0 ? ink.accent : ink.fill}
              color="none"
            />
            <FaceBar x={50} y={row.y + 9.5} width={row.path} />
            <FaceCircle cx={W - 22} cy={row.y + 11} r={2} fill={ink.detail} color="none" />
          </g>
        ))}
      </Face>
      <Face plane="left" at={[X0, Y0 + D, H]}>
        {PORTS.map((x) => (
          <FaceRect key={x} x={x} y={9} width={12} height={8} radius={2} />
        ))}
        <Motion kind="blink">
          <FaceCircle cx={W - 12} cy={13} r={1.8} fill={ink.accent} color="none" />
        </Motion>
      </Face>
      <Motion kind="float">
        <Box at={CHIP} size={[CHIP_S, CHIP_S, 8]} radius={6} />
        <Face plane="top" at={[CHIP[0], CHIP[1], CHIP[2] + 8]}>
          {BRACES.map((d) => (
            <FacePath key={d} d={d} color={ink.accent} />
          ))}
        </Face>
      </Motion>
    </Iso>
  );
}

export default ApiIllustration;
