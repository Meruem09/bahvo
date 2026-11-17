import { Fraunces, Fredoka, Geist, Nunito, Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";

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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plus-jakarta-sans",
  preload: false,
});

// Floral sets titles in Fraunces and everything else in Nunito Sans.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  preload: false,
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans",
  preload: false,
});

// Gamified sets titles, buttons and numbers in Fredoka and body text in Nunito.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fredoka",
  preload: false,
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  preload: false,
});

export const previewFonts: Record<string, string> = {
  minimalist: geist.variable,
  glassmorphism: plusJakarta.variable,
  floral: `${fraunces.variable} ${nunitoSans.variable}`,
  gamified: `${fredoka.variable} ${nunito.variable}`,
};
