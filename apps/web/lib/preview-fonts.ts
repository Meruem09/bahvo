import { Space_Grotesk } from "next/font/google";

/**
 * Fonts for hosted styles. Imported only by the preview route, so the site
 * shell never ships them. `preload: false` means a font downloads only when a
 * preview actually uses it. Variables must match each style.json `fonts` entry.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  preload: false,
});

export const previewFonts: Record<string, string> = {
  isometric: spaceGrotesk.variable,
};
