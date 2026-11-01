import {
  Box,
  Face,
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

const BASE_TOP = 22;
const PLATES = [48, 74, 100];
const TOP = 126;
/** Visible corners of the stack (front-left, front, front-right). */
const CORNERS = [
  [-70, 70],
  [70, 70],
  [70, -70],
] as const;

export function LayersIllustration(props: IllustrationProps) {
  return (
    <Iso title="Stacked layers" canvas={[360, 340]} origin={[180, 222]} {...props}>
      <Grid from={[-96, -96]} to={[96, 96]} step={24} />
      <Footprint
        at={[-82, -82, 0]}
        size={[164, 164]}
        radius={10}
        color={ink.accent}
        fill={ink.accentSoft}
        dashed={false}
      />
      <Box at={[-70, -70, 0]} size={[140, 140, BASE_TOP]} radius={6} />
      {CORNERS.map(([x, y]) => (
        <Line key={`${x}${y}`} from={[x, y, BASE_TOP]} to={[x, y, TOP]} />
      ))}
      {PLATES.map((z) => (
        <Plate key={z} at={[-70, -70, z]} size={[140, 140]} thickness={6} radius={6} tone="glass" />
      ))}
      <Motion kind="float">
        <Plate at={[-70, -70, TOP]} size={[140, 140]} thickness={6} radius={6} />
        <Face plane="top" at={[-70, -70, TOP + 6]}>
          <FaceRect x={46} y={46} width={34} height={34} radius={3} color={ink.line} />
          <FaceRect x={60} y={60} width={34} height={34} radius={3} color={ink.accent} />
        </Face>
      </Motion>
    </Iso>
  );
}

export default LayersIllustration;
