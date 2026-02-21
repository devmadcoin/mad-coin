/* app/components/NavBar.tsx */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const ROBLOX_GAME_URL =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Left brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
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
            <div className="text-[11px] text-white/50">Digital emotion — refined</div>
          </div>
        </Link>

        {/* Right nav pills (mobile scroll strip) */}
        <div className="relative flex-1">
          {/* fade edges so it’s obvious it scrolls */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/70 to-transparent" />

          <div
            className="
              flex items-center gap-2
              overflow-x-auto whitespace-nowrap
              [-webkit-overflow-scrolling:touch]
              scroll-smooth
              pr-6 pl-4
              no-scrollbar
              snap-x snap-mandatory
            "
          >
            <NavPill href="/" pathname={pathname}>
              Home
            </NavPill>
            <NavPill href="/roadmap" pathname={pathname}>
              Roadmap
            </NavPill>
            <NavPill href="/forge" pathname={pathname}>
              Forge
            </NavPill>
            <NavPill href="/memes" pathname={pathname}>
              Memes
            </NavPill>

            <ExternalPill href={ROBLOX_GAME_URL}>Game</ExternalPill>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavPill({
  href,
  children,
  pathname,
}: {
  href: string;
  children: ReactNode;
  pathname: string;
}) {
  const active = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={[
        "snap-start",
        "min-w-[92px] text-center", // ✅ bigger tap target on mobile
        "rounded-full px-5 py-2.5 text-sm font-semibold transition", // ✅ more padding
        active
          ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(255,0,0,0.5)]"
          : "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function ExternalPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "snap-start",
        "min-w-[92px] text-center",
        "rounded-full px-5 py-2.5 text-sm font-semibold transition",
        "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white",
        "hover:border-red-500/30 hover:shadow-[0_0_12px_rgba(255,0,0,0.35)]",
      ].join(" ")}
      title="Open Roblox game"
    >
      {children}
    </a>
  );
}
