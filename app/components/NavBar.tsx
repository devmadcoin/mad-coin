/* app/components/NavBar.tsx */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
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
            <div className="text-[11px] text-white/50">Digital emotion — refined</div>
          </div>
        </Link>

        {/* Right nav pills (mobile: swipeable) */}
        <div
          className="
            flex-1
            overflow-x-auto
            no-scrollbar ios-momentum touch-pan-x
          "
        >
          <div className="flex w-max items-center gap-2 whitespace-nowrap pl-1 pr-6">
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
            <NavPill href="/game" pathname={pathname}>
              Game
            </NavPill>
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
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "shrink-0 select-none rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(255,0,0,0.5)]"
          : "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
