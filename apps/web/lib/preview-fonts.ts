/**
 * Fonts for hosted styles, keyed by style slug. Imported only by the preview
 * route, so the site shell never ships them. Declare each with next/font and
 * `preload: false` so a font downloads only when a preview uses it, e.g.:
 *
 *   const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", preload: false });
 *   export const previewFonts = { isometric: spaceGrotesk.variable };
 *
 * Variables must match each style.json `fonts` entry. Isometric uses the
 * system mono stack for its labels, so no style needs a web font yet.
 */
export const previewFonts: Record<string, string> = {};
