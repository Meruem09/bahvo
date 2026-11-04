import type { ReactNode } from "react";
import {
  Box,
  Face,
  FaceCircle,
  FaceLine,
  FacePath,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Line,
  Motion,
  Path3,
  type Vec3,
} from "../../kit/isometric";

const TILE = 50;
const TILE_H = 14;
const GAP = 74;
const HALF = TILE / 2;
const C = HALF;

function Tile({ x, y, outline = false }: { x: number; y: number; outline?: boolean }) {
  return (
    <Box
      at={[x - HALF, y - HALF, 0]}
      size={[TILE, TILE, TILE_H]}
      radius={10}
      tone={outline ? "outline" : "solid"}
    />
  );
}

/** A glyph lying on a tile's top face, in the tile's own coordinates. */
function Top({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <Face plane="top" at={[x - HALF, y - HALF, TILE_H]}>
      {children}
    </Face>
  );
}

/** A cable on the ground between two tile edges. */
const cable = (from: Vec3, to: Vec3, color: string) => (
  <Path3 points={[from, to]} color={color} dashed={false} />
);

export function WorkflowIllustration(props: IllustrationProps) {
  return (
    <Iso title="Workflow" canvas={[360, 236]} origin={[180, 116]} {...props}>
      <Grid from={[-96, -96]} to={[96, 96]} step={24} />
      {/* Step 1, done. */}
      <Tile x={-GAP} y={0} />
      <Top x={-GAP} y={0}>
        <FaceLine from={[C - 8, C]} to={[C - 3, C + 5]} />
        <FaceLine from={[C - 3, C + 5]} to={[C + 8, C - 6]} />
      </Top>
      {/* Into step 2, which is running. */}
      {cable([-GAP + HALF, 0, 0], [-HALF, 0, 0], ink.accent)}
      <Motion kind="flow">{cable([-GAP + HALF, 0, 0], [-HALF, 0, 0], ink.top)}</Motion>
      <Tile x={0} y={0} />
      <Top x={0} y={0}>
        <Motion kind="spin">
          <FaceCircle cx={C} cy={C} r={14} color={ink.dash} dashed />
        </Motion>
        <FaceCircle cx={C} cy={C} r={5} fill={ink.accent} color="none" />
      </Top>
      {/* Out to step 3, still pending, and to a branch that was skipped. */}
      {cable([HALF, 0, 0], [GAP - HALF, 0, 0], ink.line)}
      <Line from={[0, HALF, 0]} to={[0, GAP - HALF, 0]} />
      <Tile x={GAP} y={0} />
      <Top x={GAP} y={0}>
        <FaceCircle cx={C} cy={C} r={6} />
      </Top>
      <Tile x={0} y={GAP} outline />
      <Top x={0} y={GAP}>
        <FacePath
          d={`M${C} ${C - 7} L${C + 7} ${C} L${C} ${C + 7} L${C - 7} ${C} Z`}
          color={ink.dash}
        />
      </Top>
    </Iso>
  );
}

export default WorkflowIllustration;
