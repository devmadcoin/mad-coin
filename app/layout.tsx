/* app/layout.tsx */
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "$MAD",
  description: "Digital emotion — refined.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased">
        {/* ONE NAV BAR (global) */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6">
            <nav className="flex items-center justify-between py-4">
              {/* Left brand */}
              <Link href="/" className="group flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5">
                  <span className="text-sm font-black tracking-tight">$</span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-black tracking-tight">$MAD</div>
                  <div className="text-[11px] text-white/50">Digital emotion — refined</div>
                </div>
              </Link>

              {/* Center pills */}
              <div className="hidden items-center justify-center gap-3 md:flex">
                <NavPill href="/">Home</NavPill>
                <NavPill href="/roadmap">Roadmap</NavPill>
                <NavPill href="/forge">Forge</NavPill>
                <NavPill href="/memes">Memes</NavPill>
              </div>

              {/* Right (mobile pills) */}
              <div className="flex items-center gap-2 md:hidden">
                <NavPillSmall href="/">Home</NavPillSmall>
                <NavPillSmall href="/roadmap">Roadmap</NavPillSmall>
                <NavPillSmall href="/forge">Forge</NavPillSmall>
                <NavPillSmall href="/memes">Memes</NavPillSmall>
              </div>
            </nav>
          </div>
        </header>

        {/* Page content */}
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

function NavPillSmall({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
