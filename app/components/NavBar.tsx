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

            <div className="no-scrollbar flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
              <div className="flex w-max items-center gap-2 pl-1">
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

            <div className="mt-3 overflow-x-auto [-webkit-overflow-scrolling:touch]">
              <div className="no-scrollbar flex min-w-max items-center gap-2 pb-1">
                {NAV_ITEMS.map((item) => (
                  <NavPill
                    key={item.href}
                    href={item.href}
                    pathname={pathname}
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
          : "border-white/10 bg-white/5 text-white/90 hover:border-red-500/30 hover:bg-white/10 hover:text-white hover:shadow-[0_0_12px_rgba(255,0,0,0.35)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
