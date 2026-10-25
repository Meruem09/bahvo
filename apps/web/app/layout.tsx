import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Root layout: deliberately bare. The site shell lives in (site)/layout and
 * previews live in preview/layout, so neither one's CSS or fonts leak into
 * the other.
 */

// Fail the build if any page would render at request time.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BAHVO_PUBLIC_URL ?? "http://localhost:3000"),
  title: { default: "bahvo", template: "%s · bahvo" },
  description:
    "Every UI style, every component. Copy the code, install it with the CLI, or give your agent the skill.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
