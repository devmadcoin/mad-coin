"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },

  {
    href: "/roadmap",
    label: "The Mad Path",
    mobileLabel: "Mad Path",
  },

  { href: "/game", label: "Game" },

  {
    href: "/mad-mind",
    label: "MAD AI",
    mobileLabel: "MAD AI",
    variant: "primary" as const,
  },

  { href: "/memes", label: "$MAD Art", mobileLabel: "Art" },

  { href: "/forge", label: "Forge" },

  {
    href: "/merch",
    label: "Merch",
    variant: "cta" as const,
  },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,5,5,0.78)] backdrop-blur-xl">
      {/* subtle red energy line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="py-3">
          {/* DESKTOP */}
          <div className="hidden items-center justify-between gap-6 md:flex">
            {/* LOGO */}
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-2xl px-2 py-1 transition hover:bg-white/[0.03]"
            >
              <span className="relative inline-flex h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
                <Image
                  src="/mad.png"
                  alt="$MAD logo"
                  fill
                  priority
                  sizes="44px"
                  className="object-cover"
                />
              </span>

              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-[0.18em] text-white">
                  $MAD
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Controlled Chaos
                </span>
              </div>
            </Link>

            {/* NAV */}
            <div className="flex flex-1 justify-end gap-2">
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
            </div>
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3">
                <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image
                    src="/mad.png"
                    alt="$MAD logo"
                    fill
                    priority
                    sizes="40px"
                    className="object-cover"
                  />
                </span>

                <span className="text-sm font-black text-white">$MAD</span>
              </Link>

              {/* QUICK MAD AI BUTTON */}
              <Link
                href="/mad-mind"
                className="rounded-full border border-red-500/40 bg-red-500/15 px-3 py-2 text-xs font-black text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.4)]"
              >
                MAD AI
              </Link>
            </div>

            {/* SCROLLABLE NAV */}
            <div className="mt-3 -mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max gap-2 px-1">
                {NAV_ITEMS.map((item) => (
                  <NavPill
                    key={item.href}
                    href={item.href}
                    pathname={pathname}
                    mobile
                    variant={item.variant}
                  >
                    {item.mobileLabel ?? item.label}
                  </NavPill>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
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
  mobile = false,
  variant,
}: {
  href: string;
  children: ReactNode;
  pathname: string;
  mobile?: boolean;
  variant?: "primary" | "cta";
}) {
  const active = isActive(pathname, href);

  const base =
    "inline-flex items-center justify-center rounded-full border font-semibold transition-all duration-300 whitespace-nowrap";
  const size = mobile ? "px-3.5 py-2 text-[13px]" : "px-4 py-2 text-sm";

  const defaultStyle = active
    ? "border-red-500/40 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.45)]"
    : "border-white/10 bg-white/[0.04] text-white/85 hover:border-red-500/25 hover:bg-white/[0.08]";

  const primaryStyle = active
    ? "border-red-500/50 bg-red-500/20 text-red-300 shadow-[0_0_16px_rgba(255,0,0,0.6)]"
    : "border-red-500/25 bg-[linear-gradient(180deg,rgba(90,12,12,0.5),rgba(45,6,6,0.7))] text-white hover:border-red-500/40";

  const ctaStyle = active
    ? "border-white bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.35)]"
    : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black";

  return (
    <Link
      href={href}
      className={[
        base,
        size,
        variant === "primary"
          ? primaryStyle
          : variant === "cta"
          ? ctaStyle
          : defaultStyle,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
