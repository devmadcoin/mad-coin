"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const ROBLOX_GAME_URL =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";

const MERCH_URL = "https://notaveragestickers.com/collections/mad";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left brand */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
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
              Swipe left to see more →
            </div>
          </div>
        </Link>

        {/* Right nav pills (mobile: swipeable) */}
        <div className="no-scrollbar flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
          <div className="flex w-max items-center gap-2 pl-1 pr-10">
            <NavPill href="/" pathname={pathname}>
              Home
            </NavPill>

            <NavPill href="/roadmap" pathname={pathname}>
              Roadmap
            </NavPill>

            <NavPill href="/forge" pathname={pathname}>
              Forge
            </NavPill>

            <ExternalPill href={MERCH_URL}>Merch</ExternalPill>

            <NavPill href="/memes" pathname={pathname}>
              $MAD Art
            </NavPill>

            <NavPill href="/lore" pathname={pathname}>
              Lore
            </NavPill>

            <ExternalPill href={ROBLOX_GAME_URL}>Game</ExternalPill>
          </div>
        </div>
      </nav>
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
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
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      className={[
        "shrink-0 select-none rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-red-500/40 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.5)]"
          : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function ExternalPill({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "shrink-0 select-none rounded-full border px-4 py-2 text-sm font-semibold transition",
        "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white",
        "hover:border-red-500/30 hover:shadow-[0_0_12px_rgba(255,0,0,0.35)]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}
