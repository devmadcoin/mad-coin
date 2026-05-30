"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavVariant = "default" | "primary" | "cta" | "ai";

type NavItem = {
  href: string;
  label: string;
  mobileLabel?: string;
  variant?: NavVariant;
  icon: (active: boolean) => ReactNode;
};

/* Simple inline SVG icons */
const Icons = {
  home: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" />
    </svg>
  ),
  ai: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a2 2 0 012 2 2 2 0 01-2 2h-1v1a7 7 0 01-7 7h-1v1a2 2 0 01-2 2 2 2 0 01-2-2v-1h-1a7 7 0 01-7-7v-1H2a2 2 0 01-2-2 2 2 0 012-2h1v-1a7 7 0 017-7h1V5.73a2 2 0 01-1-1.73 2 2 0 012-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  roadmap: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  game: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 11h4M8 9v4M12 13h2m-1-1v2M18 9h-2" /><rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  ),
  art: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
    </svg>
  ),
  rewards: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  ),
  merch: (a: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF2D2D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", mobileLabel: "Home", icon: Icons.home },
  { href: "/mad-mind", label: "MAD AI", mobileLabel: "AI", variant: "ai", icon: Icons.ai },
  { href: "/roadmap", label: "Roadmap", mobileLabel: "Path", variant: "primary", icon: Icons.roadmap },
  { href: "/game", label: "Game", mobileLabel: "Game", icon: Icons.game },
  { href: "/mad-art", label: "MAD Art", mobileLabel: "Art", icon: Icons.art },
  { href: "/rewards", label: "Rewards", mobileLabel: "Rewards", icon: Icons.rewards },
  { href: "/merch", label: "Merch", mobileLabel: "Merch", variant: "cta", icon: Icons.merch },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavPill({
  href,
  pathname,
  variant = "default",
  children,
}: {
  href: string;
  pathname: string;
  variant?: NavVariant;
  children: ReactNode;
}) {
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition duration-300",
        active
          ? href === "/rewards"
            ? "bg-[#FF2D2D] text-white shadow-[0_0_20px_rgba(255,45,45,0.5)] animate-pulse"
            : "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.08)]"
          : variant === "cta"
            ? "border border-red-500/30 bg-red-500 text-white hover:scale-105 hover:bg-red-400 hover:shadow-[0_0_20px_rgba(255,0,0,0.25)]"
            : variant === "ai"
              ? "border border-red-500/20 bg-red-500/8 text-red-100 hover:border-red-400/35 hover:bg-red-500/12 hover:text-white"
              : variant === "primary"
                ? "border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                : href === "/rewards"
                  ? "border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 text-[#FF4444] hover:bg-[#FF2D2D]/20 hover:text-[#FF6666] shadow-[0_0_15px_rgba(255,45,45,0.15)]"
                  : "text-white/72 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV — Chimpers-style icon + label bar
   ═══════════════════════════════════════════════════════════ */
function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-all duration-200",
                active
                  ? "text-[#FF2D2D]"
                  : item.href === "/rewards"
                    ? "text-[#FF4444] animate-pulse hover:text-[#FF6666]"
                    : "text-white/45 hover:text-white/70"
              )}
            >
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                active
                  ? "bg-[#FF2D2D]/15"
                  : item.href === "/rewards"
                    ? "bg-[#FF2D2D]/25 shadow-[0_0_12px_rgba(255,45,45,0.4)]"
                    : "bg-transparent"
              )}>
                {item.icon(active)}
              </div>
              <span className={cn(
                "text-[10px] font-bold leading-none",
                active
                  ? "text-[#FF2D2D]"
                  : item.href === "/rewards"
                    ? "text-[#FF4444] font-black"
                    : "text-white/50"
              )}>
                {item.mobileLabel ?? item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_0_18px_rgba(255,0,0,0.12)] transition duration-300 group-hover:scale-105">
                <Image
                  src="/mad.png"
                  alt="$MAD logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                  priority
                />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-black tracking-wide text-white">$MAD</div>
                <div className="text-[10px] uppercase tracking-[0.34em] text-white/40">Stay $MAD</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {NAV_ITEMS.map((item) => (
                <NavPill
                  key={item.href}
                  href={item.href}
                  pathname={pathname}
                  variant={item.variant}
                >
                  {item.label}
                </NavPill>
              ))}
            </nav>
          </div>

          {/* OLD mobile grid — REMOVED, replaced by bottom bar */}
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <MobileBottomNav pathname={pathname} />
    </>
  );
}
