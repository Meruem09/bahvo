// Fixture: a deliberately off-style answer, to prove the scoring catches it.
import { Box, type IllustrationProps, Iso } from "@/lib/isometric";

export default function Bad(props: IllustrationProps) {
  return (
    <Iso title="Bad" canvas={[200, 160]} origin={[100, 100]} {...props}>
      <g transform="rotate(12)">
        <Box at={[-40, -40, 0]} size={[80, 80, 30]} />
        <rect x={-20} y={-60} width={40} height={20} fill="#3b82f6" strokeWidth={3} />
      </g>
    </Iso>
  );
}
