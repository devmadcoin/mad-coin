/* app/layout.tsx */
import "./globals.css";

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "$MAD",
  description: "Digital emotion — refined",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* ONE NAV BAR (global) */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            {/* Left brand */}
            <Link href="/" className="flex items-center gap-3">
              <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image
                  src="/mad.png"
                  alt="$MAD logo"
                  fill
                  priority
                  sizes="36px"
                  className="object-cover"
                />
              </span>

              <div className="leading-tight">
                <div className="text-sm font-black">$MAD</div>
                <div className="text-[11px] text-white/50">
                  Digital emotion — refined
                </div>
              </div>
            </Link>

            {/* Right nav pills */}
            <div className="flex items-center gap-2">
              <NavPill href="/">Home</NavPill>
              <NavPill href="/roadmap">Roadmap</NavPill>
              <NavPill href="/forge">Forge</NavPill>
              <NavPill href="/memes">Memes</NavPill>
            </div>
          </nav>
        </header>

        {/* Add spacing so content isn't hidden behind the sticky header */}
        <main className="min-h-screen pt-6">{children}</main>
      </body>
    </html>
  );
}

function NavPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
