import {
  Box,
  Cylinder,
  Face,
  FaceCircle,
  FacePath,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
  Path3,
  type Vec3,
} from "../../kit/isometric";

const S = 130;
const H = 24;
const C = S / 2;
/** Connected nodes sit on the axes, 150 out from the center. */
const REACH = 150;
const NODE_R = 14;
const NODE_H = 8;

/** Four-point sparkle: tips 30 out, waist 6 off-center so the arms stay full. */
const T = 30;
const K = 6;
const STAR = [
  `M${C} ${C - T}`,
  `Q${C + K} ${C - K} ${C + T} ${C}`,
  `Q${C + K} ${C + K} ${C} ${C + T}`,
  `Q${C - K} ${C + K} ${C - T} ${C}`,
  `Q${C - K} ${C - K} ${C} ${C - T}`,
  "Z",
].join(" ");

function Node({ center, active = false }: { center: Vec3; active?: boolean }) {
  const [x, y, z] = center;
  return (
    <>
      <Cylinder center={center} radius={NODE_R} height={NODE_H} />
      <Face plane="top" at={[x - NODE_R, y - NODE_R, z + NODE_H]}>
        <FaceCircle
          cx={NODE_R}
          cy={NODE_R}
          r={4}
          fill={active ? ink.accent : ink.detail}
          color="none"
        />
      </Face>
    </>
  );
}

export function HubIllustration(props: IllustrationProps) {
  return (
    <Iso title="Integration hub" canvas={[340, 250]} origin={[170, 130]} {...props}>
      <Grid from={[-90, -90]} to={[90, 90]} step={18} />
      {/* Behind the hub: the back-right connection. */}
      <Path3
        points={[
          [0, -C, 0],
          [0, -REACH + NODE_R, 0],
        ]}
        color={ink.line}
        dashed={false}
      />
      <Node center={[0, -REACH, 0]} />
      <Box at={[-C, -C, 0]} size={[S, S, H]} radius={24} />
      <Face plane="top" at={[-C, -C, H]}>
        <Motion kind="spin">
          <FaceCircle cx={C} cy={C} r={50} color={ink.dash} dashed />
        </Motion>
        <FaceCircle cx={C} cy={C} r={40} color={ink.line} />
        <FacePath d={STAR} color={ink.accent} fill={ink.accentSoft} />
      </Face>
      {/* In front: the front-left connection, and the active front-right one. */}
      <Path3
        points={[
          [0, C, 0],
          [0, REACH - NODE_R, 0],
        ]}
        color={ink.line}
        dashed={false}
      />
      <Node center={[0, REACH, 0]} />
      <Path3
        points={[
          [C, 0, 0],
          [REACH - NODE_R, 0, 0],
        ]}
        color={ink.accent}
        dashed={false}
      />
      {/* Motion-only: light ticks travel along the active cable toward its node. */}
      <Motion kind="flow">
        <Path3
          points={[
            [C, 0, 0],
            [REACH - NODE_R, 0, 0],
          ]}
          color={ink.top}
          dashed={false}
        />
      </Motion>
      <Node center={[REACH, 0, 0]} active />
    </Iso>
  );
}

export default HubIllustration;
