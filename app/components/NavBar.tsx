"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },

  // Primary story destination
  { href: "/roadmap", label: "The Mad Path", mobileLabel: "Mad Path", variant: "primary" as const },

  // Experience flow
  { href: "/game", label: "Game" },
  { href: "/memes", label: "$MAD Art", mobileLabel: "Art" },
  { href: "/forge", label: "Forge" },

  // Final conversion
  { href: "/merch", label: "Merch", variant: "cta" as const },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="py-3">
          {/* Desktop */}
          <div className="hidden items-center justify-between gap-4 md:flex">
            <Link href="/" className="flex shrink-0 items-center gap-3">
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

              <div className="text-sm font-black text-white">$MAD</div>
            </Link>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
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
            <Link href="/" className="flex items-center gap-3">
              <span className="relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image
                  src="/mad.png"
                  alt="$MAD logo"
                  fill
                  priority
                  sizes="40px"
                  className="object-cover"
                />
              </span>

              <div className="text-sm font-black text-white">$MAD</div>
            </Link>

            <div className="mt-3 flex flex-wrap gap-2">
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

  return (
    <Link
      href={href}
      className={[
        "relative select-none rounded-full border font-semibold transition-all duration-300",
        mobile ? "px-3 py-2 text-[13px]" : "px-4 py-2 text-sm",

        variant === "primary"
          ? active
            ? "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_18px_rgba(255,0,0,0.6)]"
            : "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          : "",

        variant === "cta"
          ? active
            ? "border-white bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.4)]"
            : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          : "",

        !variant &&
          (active
            ? "border-red-500/40 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.5)]"
            : "border-white/10 bg-white/5 text-white/90 hover:border-red-500/30 hover:bg-white/10 hover:text-white hover:shadow-[0_0_12px_rgba(255,0,0,0.35)]"),
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
