import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const nav = [
  { href: "/styles", label: "Styles" },
  { href: "/illustrations", label: "Illustrations" },
  { href: "/components", label: "Components" },
] as const;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${sans.variable} ${mono.variable} flex min-h-dvh flex-col font-sans`}>
      <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-4 text-sm sm:gap-6 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden="true" className="size-2.5 rotate-45 rounded-[2px] bg-accent" />
            bahvo
          </Link>
          <div className="flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap sm:gap-6">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted hover:text-fg">
                {item.label}
              </Link>
            ))}
          </div>
          <a
            href="https://github.com/Meruem09/bahvo"
            className="ml-auto hidden shrink-0 text-muted hover:text-fg sm:block"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
          bahvo is community-built and will be open source.
        </div>
      </footer>
    </div>
  );
}
