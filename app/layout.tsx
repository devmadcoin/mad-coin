import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const linkBase =
    "px-4 py-2 rounded-full text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 transition";

  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* NAV BAR (shows on every page) */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-3 flex flex-wrap items-center justify-center gap-2">
            <Link className={linkBase} href="/">
              Home
            </Link>
            <Link className={linkBase} href="/roadmap">
              Roadmap
            </Link>
            <Link className={linkBase} href="/forge">
              Forge
            </Link>
            <Link className={linkBase} href="/memes">
              Memes
            </Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
