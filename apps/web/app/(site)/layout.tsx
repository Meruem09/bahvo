import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { Search } from "@/components/search";
import { SiteNav } from "@/components/site-nav";
import { manifest } from "@/lib/registry";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${sans.variable} ${mono.variable} flex min-h-dvh flex-col font-sans`}>
      {/* The hairline is an inset shadow, so the current link's underline can sit on it. */}
      <header className="sticky top-0 z-10 bg-bg/85 shadow-[inset_0_-1px_0_var(--line)] backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 text-sm sm:gap-5 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden="true" className="size-2.5 rotate-45 rounded-[2px] bg-accent" />
            bahvo
          </Link>
          <SiteNav kinds={Object.fromEntries(manifest.styles.map((s) => [s.slug, s.kind]))} />
          <Search url={manifest.searchUrl} />
          <a
            href="https://github.com/Meruem09/bahvo"
            className="hidden shrink-0 text-muted hover:text-fg sm:block"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-6 text-[13px] text-muted sm:px-6">
          bahvo is community-built and will be open source.
        </div>
      </footer>
    </div>
  );
}
