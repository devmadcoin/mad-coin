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
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", mobileLabel: "Home" },
  {
    href: "/mad-mind",
    label: "MAD AI",
    mobileLabel: "AI",
    variant: "ai",
  },
  {
    href: "/roadmap",
    label: "The Mad Path",
    mobileLabel: "Path",
    variant: "primary",
  },
  { href: "/game", label: "Game", mobileLabel: "Game" },
  { href: "/memes", label: "$MAD Art", mobileLabel: "Art" },
  { href: "/merch", label: "Merch", mobileLabel: "Merch", variant: "cta" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavPill({
  href,
  pathname,
  variant = "default",
  mobile = false,
  children,
}: {
  href: string;
  pathname: string;
  variant?: NavVariant;
  mobile?: boolean;
  children: ReactNode;
}) {
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold transition duration-300",
        mobile ? "min-w-0 px-2 py-2 text-xs" : "px-4 py-2 text-sm",
        active
          ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.08)]"
          : variant === "cta"
            ? "border border-red-500/30 bg-red-500 text-white hover:scale-105 hover:bg-red-400 hover:shadow-[0_0_20px_rgba(255,0,0,0.25)]"
            : variant === "ai"
              ? "border border-red-500/20 bg-red-500/8 text-red-100 hover:border-red-400/35 hover:bg-red-500/12 hover:text-white"
              : variant === "primary"
                ? "border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                : "text-white/72 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className={cn("truncate", mobile && "max-w-full")}>{children}</span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  return (
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
              <div className="text-lg font-black tracking-wide text-white">
                $MAD
              </div>

              <div className="text-[10px] uppercase tracking-[0.34em] text-white/40">
                Stay $MAD
              </div>
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

        <div className="grid grid-cols-6 gap-2 pb-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavPill
              key={item.href}
              href={item.href}
              pathname={pathname}
              variant={item.variant}
              mobile
            >
              {item.mobileLabel ?? item.label}
            </NavPill>
          ))}
        </div>
      </div>
    </header>
  );
}
