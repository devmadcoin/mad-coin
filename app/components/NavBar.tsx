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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,5,5,0.78)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(5,5,5,0.68)]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="py-3">
          {/* Desktop */}
          <div className="hidden items-center justify-between gap-6 md:flex">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-transparent px-2 py-1 transition duration-300 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <span className="relative inline-flex h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_24px_rgba(255,0,0,0.12)]">
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
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38">
                  Controlled Chaos
                </span>
              </div>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-2">
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

          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-transparent px-1 py-1 transition duration-300 hover:border-white/10 hover:bg-white/[0.03]"
              >
                <span className="relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,0,0,0.12)]">
                  <Image
                    src="/mad.png"
                    alt="$MAD logo"
                    fill
                    priority
                    sizes="40px"
                    className="object-cover"
                  />
                </span>

                <div className="min-w-0 leading-none">
                  <div className="truncate text-sm font-black tracking-[0.16em] text-white">
                    $MAD
                  </div>
                  <div className="mt-1 truncate text-[9px] font-semibold uppercase tracking-[0.28em] text-white/38">
                    Controlled Chaos
                  </div>
                </div>
              </Link>

              <Link
                href="/mad-mind"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-red-500/35 bg-red-500/15 px-3 py-2 text-[12px] font-black text-red-400 shadow-[0_0_14px_rgba(255,0,0,0.35)] transition duration-300 hover:bg-red-500/20 hover:text-red-300"
              >
                MAD AI
              </Link>
            </div>

            <div className="mt-3 -mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
    "relative inline-flex items-center justify-center rounded-full border font-semibold transition-all duration-300 whitespace-nowrap";
  const size = mobile ? "px-3.5 py-2 text-[13px]" : "px-4 py-2 text-sm";

  const defaultStyle = active
    ? "border-red-500/40 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.45)]"
    : "border-white/10 bg-white/[0.04] text-white/88 hover:border-red-500/25 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_12px_rgba(255,0,0,0.20)]";

  const primaryStyle = active
    ? "border-red-500/45 bg-red-500/18 text-red-300 shadow-[0_0_16px_rgba(255,0,0,0.5)]"
    : "border-red-500/20 bg-[linear-gradient(180deg,rgba(90,12,12,0.55),rgba(45,6,6,0.72))] text-white hover:border-red-500/35 hover:bg-[linear-gradient(180deg,rgba(115,18,18,0.65),rgba(58,8,8,0.82))] hover:shadow-[0_0_16px_rgba(255,0,0,0.28)]";

  const ctaStyle = active
    ? "border-white bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.35)]"
    : "border-white/18 bg-white/[0.08] text-white hover:border-white/30 hover:bg-white hover:text-black hover:shadow-[0_0_18px_rgba(255,255,255,0.28)]";

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
