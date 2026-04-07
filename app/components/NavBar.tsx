"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/forge", label: "Forge" },
  { href: "/merch", label: "Merch" },
  { href: "/memes", label: "$MAD Art", mobileLabel: "Art" },
  { href: "/lore", label: "Lore" },
  { href: "/game", label: "Game" },
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

              <div className="leading-tight">
                <div className="text-sm font-black text-white">$MAD</div>
              </div>
            </Link>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              {NAV_ITEMS.map((item) => (
                <NavPill
                  key={item.href}
                  href={item.href}
                  pathname={pathname}
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

              <div className="leading-tight">
                <div className="text-sm font-black text-white">$MAD</div>
              </div>
            </Link>

            <div className="mt-3 flex flex-wrap gap-2">
              {NAV_ITEMS.map((item) => (
                <NavPill
                  key={item.href}
                  href={item.href}
                  pathname={pathname}
                  mobile
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
}: {
  href: string;
  children: ReactNode;
  pathname: string;
  mobile?: boolean;
}) {
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      className={[
        "select-none rounded-full border font-semibold transition",
        mobile
          ? "px-3 py-2 text-[13px]"
          : "px-4 py-2 text-sm",
        active
          ? "border-red-500/40 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.5)]"
          : "border-white/10 bg-white/5 text-white/90 hover:border-red-500/30 hover:bg-white/10 hover:text-white hover:shadow-[0_0_12px_rgba(255,0,0,0.35)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
