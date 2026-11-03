import { Geist } from "next/font/google";

/**
 * Fonts for hosted styles, keyed by style slug. Imported only by the preview
 * route, so the site shell never ships them. `preload: false` means a font
 * downloads only when a preview actually uses it. Variables must match each
 * style.json `fonts` entry. Isometric uses the system mono stack for labels,
 * so it needs no web font.
 */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-sans",
  preload: false,
});

export const previewFonts: Record<string, string> = {
  minimalist: geist.variable,
};
