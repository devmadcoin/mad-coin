/* app/layout.tsx */
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* ONE NAV BAR (global). Do NOT add navs inside pages. */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-6 py-4">
            <NavPill href="/">Home</NavPill>
            <NavPill href="/roadmap">Roadmap</NavPill>
            <NavPill href="/forge">Forge</NavPill>
            <NavPill href="/memes">Memes</NavPill>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

function NavPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
