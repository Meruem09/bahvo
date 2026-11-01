import {
  Box,
  Face,
  FaceCircle,
  FaceLine,
  FaceText,
  Footprint,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
} from "../../kit/isometric";

const VENTS = [12, 16, 20, 24, 28, 32];
const SCREWS = [8, 132].flatMap((x) => [8, 132].map((y) => [x, y] as const));
/** Status LEDs on the front face: one live, the rest idle. */
const LIVE_LED = 100;
const IDLE_LEDS = [108, 116, 124, 132];

export function ServerIllustration(props: IllustrationProps) {
  return (
    <Iso title="Server" canvas={[360, 250]} origin={[180, 126]} {...props}>
      <Grid from={[-96, -96]} to={[96, 96]} step={24} />
      <Footprint at={[-84, -84, 0]} size={[168, 168]} radius={10} />
      <Box at={[-70, -70, 0]} size={[140, 140, 36]} radius={6} />
      <Face plane="top" at={[-70, -70, 36]}>
        {SCREWS.map(([x, y]) => (
          <FaceCircle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={ink.detail} color="none" />
        ))}
        <FaceCircle cx={70} cy={70} r={24} color={ink.dash} dashed />
        <FaceCircle cx={70} cy={70} r={6} fill={ink.accent} color="none" />
        <Motion kind="ping">
          <FaceCircle cx={70} cy={70} r={6} color={ink.accent} />
        </Motion>
        <FaceText x={10} y={128}>
          Server #1
        </FaceText>
      </Face>
      <Face plane="left" at={[-70, 70, 36]}>
        {VENTS.map((x) => (
          <FaceLine key={x} from={[x, 12]} to={[x, 24]} />
        ))}
        <Motion kind="blink">
          <FaceCircle cx={LIVE_LED} cy={18} r={1.8} fill={ink.accent} color="none" />
        </Motion>
        {IDLE_LEDS.map((x) => (
          <FaceCircle key={x} cx={x} cy={18} r={1.8} fill={ink.detail} color="none" />
        ))}
      </Face>
    </Iso>
  );
}

export default ServerIllustration;
