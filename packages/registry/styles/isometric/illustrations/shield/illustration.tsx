import {
  Cylinder,
  Extrusion,
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
  type ProfilePiece,
  profilePath,
} from "../../kit/isometric";

/** The shield in its own face coordinates (y down): straight sides, then two arcs to a point. */
const W = 88;
const SIDE = 50;
const H = 112;
const CORNER = 12;
const DEPTH = 14;
/** Each lower edge is one arc, tangent to its side, meeting the other at the tip. */
const R = ((W / 2) ** 2 + (H - SIDE) ** 2) / W;

/** The outline, or an inset of it (concentric corners and arcs) for the bevel. */
function shield(inset: number): ProfilePiece[] {
  const r = R - inset;
  const tip = (Math.acos((R - W / 2) / r) * 180) / Math.PI;
  return [
    { center: [CORNER, CORNER], r: CORNER - inset, from: 180, to: 270 },
    { to: [W - CORNER, inset] },
    { center: [W - CORNER, CORNER], r: CORNER - inset, from: 270, to: 360 },
    { to: [W - inset, SIDE] },
    { center: [W - R, SIDE], r, from: 0, to: tip },
    { center: [R, SIDE], r, from: 180 - tip, to: 180 },
    { to: [inset, CORNER] },
  ];
}

const BASE_R = 64;
const BASE_H = 14;
/** The tip hovers 22 above the base. */
const AT = [-W / 2, DEPTH / 2, BASE_H + 22 + H] as const;

export function ShieldIllustration(props: IllustrationProps) {
  return (
    <Iso title="Security shield" canvas={[320, 280]} origin={[160, 176]} {...props}>
      <Grid from={[-84, -84]} to={[84, 84]} step={21} />
      <Cylinder center={[0, 0, 0]} radius={BASE_R} height={BASE_H} />
      <Face plane="top" at={[-BASE_R, -BASE_R, BASE_H]}>
        <Motion kind="spin">
          <FaceCircle cx={BASE_R} cy={BASE_R} r={52} color={ink.dash} dashed />
        </Motion>
        <FaceCircle cx={BASE_R} cy={BASE_R} r={34} color={ink.line} />
        <FaceCircle cx={BASE_R} cy={BASE_R} r={3} fill={ink.accent} color="none" />
      </Face>
      <Motion kind="float">
        <Extrusion plane="left" at={AT} outline={shield(0)} depth={DEPTH} />
        <Face plane="left" at={AT}>
          <FacePath d={profilePath(shield(7))} />
          {/* The lock: shackle, body and keyhole. */}
          <FacePath d="M35 56 V48 A9 9 0 0 1 53 48 V56" color={ink.accent} />
          <FaceRect
            x={29}
            y={56}
            width={30}
            height={24}
            radius={4}
            fill={ink.accentSoft}
            color={ink.accent}
          />
          <FaceCircle cx={W / 2} cy={65} r={2.6} fill={ink.accent} color="none" />
          <FaceLine from={[W / 2, 67]} to={[W / 2, 72]} color={ink.accent} />
        </Face>
      </Motion>
    </Iso>
  );
}

export default ShieldIllustration;
