import {
  Cylinder,
  Dot,
  Face,
  FaceCircle,
  Grid,
  type IllustrationProps,
  Iso,
  ink,
  Motion,
} from "../../kit/isometric";

const R = 60;
const H = 26;
/** Tier bases, 14 apart so each tier's rim reads as its own line. */
const TIERS = [0, 40, 80];
const TOP = 80 + H;
/** Indicator positions around the front of each tier, in degrees from +x. */
const INDICATORS = [20, 35, 50];

export function DatabaseIllustration(props: IllustrationProps) {
  return (
    <Iso title="Database" canvas={[300, 270]} origin={[150, 168]} {...props}>
      <Grid from={[-80, -80]} to={[80, 80]} step={20} />
      {TIERS.map((z, tier) => (
        <g key={z}>
          <Cylinder center={[0, 0, z]} radius={R} height={H} />
          {INDICATORS.map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            const dot = (
              <Dot
                key={deg}
                at={[R * Math.cos(a), R * Math.sin(a), z + H / 2]}
                r={1.8}
                color={tier === 0 && i === 0 ? ink.accent : ink.detail}
              />
            );
            return tier === 0 && i === 0 ? (
              <Motion key={deg} kind="blink">
                {dot}
              </Motion>
            ) : (
              dot
            );
          })}
        </g>
      ))}
      <Face plane="top" at={[-R, -R, TOP]}>
        <Motion kind="spin">
          <FaceCircle cx={R} cy={R} r={42} color={ink.dash} dashed />
        </Motion>
        <FaceCircle cx={R} cy={R} r={22} color={ink.line} />
        <FaceCircle cx={R} cy={R} r={6} fill={ink.accent} color="none" />
      </Face>
    </Iso>
  );
}

export default DatabaseIllustration;
