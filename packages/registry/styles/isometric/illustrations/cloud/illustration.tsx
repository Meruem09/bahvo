import {
  Box,
  Extrusion,
  Face,
  FaceCircle,
  FaceLine,
  FaceRect,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
  type ProfilePiece,
  type Vec2,
} from "../../kit/isometric";

interface Lobe {
  c: Vec2;
  r: number;
}

/** The cloud's lobes in its own face coordinates (y down), sitting on a flat base. */
const LEFT: Lobe = { c: [22, 50], r: 20 };
const MIDDLE: Lobe = { c: [58, 36], r: 30 };
const RIGHT: Lobe = { c: [96, 46], r: 24 };
const BASE = 70;
const DEPTH = 16;

const deg = (radians: number) => (radians * 180) / Math.PI;

/** Where lobe a meets lobe b along the top, as an angle on a (degrees), at or after `after`. */
function meet(a: Lobe, b: Lobe, after: number) {
  const [dx, dy] = [b.c[0] - a.c[0], b.c[1] - a.c[1]];
  const d = Math.hypot(dx, dy);
  const base = deg(Math.atan2(dy, dx));
  const spread = deg(Math.acos((a.r ** 2 + d ** 2 - b.r ** 2) / (2 * a.r * d)));
  // Of the two crossings, the upper one has the smaller y.
  const y = (angle: number) => Math.sin((angle * Math.PI) / 180);
  const upper = y(base - spread) < y(base + spread) ? base - spread : base + spread;
  return upper + 360 * Math.ceil((after - upper) / 360);
}

const middleFrom = meet(MIDDLE, LEFT, 0);
const rightFrom = meet(RIGHT, MIDDLE, 0);
const CLOUD: ProfilePiece[] = [
  { center: LEFT.c, r: LEFT.r, from: 90, to: meet(LEFT, MIDDLE, 90) },
  { center: MIDDLE.c, r: MIDDLE.r, from: middleFrom, to: meet(MIDDLE, RIGHT, middleFrom) },
  { center: RIGHT.c, r: RIGHT.r, from: rightFrom, to: 450 },
  { to: [LEFT.c[0], BASE] },
];

/** Two storage tiers, 14 apart, and the cloud 36 above the top one. */
const TIERS = [0, 36];
const TIER_H = 22;
const TOP = 36 + TIER_H;
const CLOUD_AT = [-61, DEPTH / 2, TOP + 36 + BASE] as const;
const LEDS = [92, 100, 108];
const VENTS = [12, 16, 20, 24, 28];

export function CloudIllustration(props: IllustrationProps) {
  return (
    <Iso title="Cloud storage" canvas={[340, 290]} origin={[170, 184]} {...props}>
      <Grid from={[-90, -90]} to={[90, 90]} step={18} />
      {TIERS.map((z, tier) => (
        <g key={z}>
          <Box at={[-60, -60, z]} size={[120, 120, TIER_H]} radius={8} />
          <Face plane="left" at={[-60, 60, z + TIER_H]}>
            <FaceRect x={12} y={7} width={56} height={8} radius={4} />
            {LEDS.map((x, i) =>
              tier === 1 && i === 0 ? (
                <Motion key={x} kind="blink">
                  <FaceCircle cx={x} cy={11} r={1.8} fill={ink.accent} color="none" />
                </Motion>
              ) : (
                <FaceCircle key={x} cx={x} cy={11} r={1.8} fill={ink.detail} color="none" />
              ),
            )}
          </Face>
          <Face plane="right" at={[60, 60, z + TIER_H]}>
            {VENTS.map((x) => (
              <FaceLine key={x} from={[x, 6]} to={[x, 16]} />
            ))}
          </Face>
        </g>
      ))}
      <Motion kind="float">
        <Extrusion plane="left" at={CLOUD_AT} outline={CLOUD} depth={DEPTH} />
        <Face plane="left" at={CLOUD_AT}>
          <FaceLine from={[60, 56]} to={[60, 34]} color={ink.accent} />
          <FaceLine from={[52, 42]} to={[60, 34]} color={ink.accent} />
          <FaceLine from={[68, 42]} to={[60, 34]} color={ink.accent} />
        </Face>
      </Motion>
    </Iso>
  );
}

export default CloudIllustration;
