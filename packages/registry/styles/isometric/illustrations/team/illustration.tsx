import {
  Box,
  Cylinder,
  Extrusion,
  Face,
  FaceCircle,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
  type ProfilePiece,
  Sphere,
  type Vec2,
} from "../../kit/isometric";

const BASE = 12;
const BODY_R = 14;
const BODY_H = 26;
const HEAD_R = 10;
/** Back, front-left and front-right, drawn back to front. The last one is speaking. */
const PEOPLE: Vec2[] = [
  [-30, -30],
  [-20, 40],
  [40, -20],
];
const SPEAKER = PEOPLE[2] as Vec2;

/** A speech bubble in its own face coordinates (y down), with its tail at the bottom left. */
const BUBBLE: ProfilePiece[] = [
  { center: [8, 8], r: 8, from: 180, to: 270 },
  { to: [36, 0] },
  { center: [36, 8], r: 8, from: 270, to: 360 },
  { to: [44, 20] },
  { center: [36, 20], r: 8, from: 0, to: 90 },
  { to: [20, 28] },
  { to: [10, 36] },
  { to: [12, 28] },
  { to: [8, 28] },
  { center: [8, 20], r: 8, from: 90, to: 180 },
];
/** In the right plane just in front of the speaker, its tail above their head. */
const BUBBLE_AT = [SPEAKER[0] + 6, SPEAKER[1] + 6, BASE + BODY_H + 66] as const;

export function TeamIllustration(props: IllustrationProps) {
  return (
    <Iso title="Team" canvas={[340, 248]} origin={[170, 136]} {...props}>
      <Grid from={[-90, -90]} to={[90, 90]} step={18} />
      <Box at={[-72, -72, 0]} size={[144, 144, BASE]} radius={16} />
      <Face plane="top" at={[-72, -72, BASE]}>
        <FaceCircle cx={SPEAKER[0] + 72} cy={SPEAKER[1] + 72} r={22} color={ink.accent} />
      </Face>
      {PEOPLE.map(([x, y]) => (
        <g key={`${x}${y}`}>
          <Cylinder center={[x, y, BASE]} radius={BODY_R} height={BODY_H} />
          <Sphere center={[x, y, BASE + BODY_H + HEAD_R + 3]} r={HEAD_R} />
        </g>
      ))}
      <Motion kind="float">
        <Extrusion plane="right" at={BUBBLE_AT} outline={BUBBLE} depth={6} />
        <Face plane="right" at={BUBBLE_AT}>
          {[14, 22, 30].map((x) => (
            <FaceCircle
              key={x}
              cx={x}
              cy={14}
              r={2.2}
              fill={x === 14 ? ink.accent : ink.detail}
              color="none"
            />
          ))}
        </Face>
      </Motion>
    </Iso>
  );
}

export default TeamIllustration;
