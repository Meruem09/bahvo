import {
  Box,
  Face,
  FaceCircle,
  FaceLine,
  FacePath,
  FaceRect,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
  type Vec2,
} from "../../kit/isometric";

const BOARD = 160;
const BOARD_H = 8;
const CHIP = 76;
const CHIP_H = 16;
/** The chip's edges in board coordinates, and its six pins per side, 12 apart. */
const LO = (BOARD - CHIP) / 2;
const HI = LO + CHIP;
const PINS = [0, 1, 2, 3, 4, 5].map((k) => LO + (CHIP - 60) / 2 + 12 * k);
const PIN = 8;

/** Traces from a pin out to a via: [pin end, via]. The accent one is live. */
const TRACES: [Vec2, Vec2][] = [
  [
    [PINS[2] as number, LO - PIN],
    [PINS[2] as number, 16],
  ],
  [
    [LO - PIN, PINS[4] as number],
    [16, PINS[4] as number],
  ],
  [
    [PINS[1] as number, HI + PIN],
    [PINS[1] as number, 144],
  ],
  [
    [PINS[4] as number, HI + PIN],
    [PINS[4] as number, 136],
  ],
  [
    [HI + PIN, PINS[1] as number],
    [144, PINS[1] as number],
  ],
];
const LIVE: [Vec2, Vec2] = [
  [HI + PIN, PINS[3] as number],
  [148, PINS[3] as number],
];

/** Four-point sparkle centered on the chip: tips 14 out, waist 3.5 off-center. */
const C = CHIP / 2;
const T = 14;
const K = 3.5;
const SPARKLE = [
  `M${C} ${C - T}`,
  `Q${C + K} ${C - K} ${C + T} ${C}`,
  `Q${C + K} ${C + K} ${C} ${C + T}`,
  `Q${C - K} ${C + K} ${C - T} ${C}`,
  `Q${C - K} ${C - K} ${C} ${C - T}`,
  "Z",
].join(" ");

export function ChipIllustration(props: IllustrationProps) {
  const half = BOARD / 2;
  return (
    <Iso title="AI chip" canvas={[360, 236]} origin={[180, 120]} {...props}>
      <Grid from={[-96, -96]} to={[96, 96]} step={24} />
      <Box at={[-half, -half, 0]} size={[BOARD, BOARD, BOARD_H]} radius={10} />
      <Face plane="top" at={[-half, -half, BOARD_H]}>
        {PINS.flatMap((p) => [
          <FaceLine key={`b${p}`} from={[p, LO]} to={[p, LO - PIN]} />,
          <FaceLine key={`f${p}`} from={[p, HI]} to={[p, HI + PIN]} />,
          <FaceLine key={`l${p}`} from={[LO, p]} to={[LO - PIN, p]} />,
          <FaceLine key={`r${p}`} from={[HI, p]} to={[HI + PIN, p]} />,
        ])}
        {TRACES.map(([from, via]) => (
          <g key={`${via[0]}-${via[1]}`}>
            <FaceLine from={from} to={via} />
            <FaceCircle cx={via[0]} cy={via[1]} r={2.4} />
          </g>
        ))}
        <FaceLine from={LIVE[0]} to={LIVE[1]} color={ink.accent} />
        {/* Motion-only: light ticks travel along the live trace. */}
        <Motion kind="flow">
          <FaceLine from={LIVE[0]} to={LIVE[1]} color={ink.top} />
        </Motion>
        <FaceCircle cx={LIVE[1][0]} cy={LIVE[1][1]} r={2.4} color={ink.accent} />
      </Face>
      <Box at={[LO - half, LO - half, BOARD_H]} size={[CHIP, CHIP, CHIP_H]} radius={6} />
      <Face plane="top" at={[LO - half, LO - half, BOARD_H + CHIP_H]}>
        <FaceRect x={12} y={12} width={CHIP - 24} height={CHIP - 24} radius={3} />
        <FaceCircle cx={7} cy={7} r={1.8} fill={ink.detail} color="none" />
        <Motion kind="spin">
          <FaceCircle cx={C} cy={C} r={20} color={ink.dash} dashed />
        </Motion>
        <FacePath d={SPARKLE} color={ink.accent} fill={ink.accentSoft} />
      </Face>
    </Iso>
  );
}

export default ChipIllustration;
