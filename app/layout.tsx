import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* NAV BAR */}
        <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-4 px-6 py-4 border-b border-white/10 bg-black/70 backdrop-blur">
          <Link className="text-sm font-black hover:opacity-80" href="/">
            Home
          </Link>
          <Link className="text-sm font-black hover:opacity-80" href="/roadmap">
            Roadmap
          </Link>
          <Link className="text-sm font-black hover:opacity-80" href="/forge">
            Forge
          </Link>
          <Link className="text-sm font-black hover:opacity-80" href="/memes">
            Memes
          </Link>
        </nav>

        {/* PAGE CONTENT */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
