"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const ADDR = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  chartPage: `https://dexscreener.com/solana/${ADDR}`,
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/devmadcoin",
  tiktok: "https://www.tiktok.com/@devmadcoin",
  coingecko: "https://www.coingecko.com/en/coins/mad-coin",
  birdeye: `https://birdeye.so/token/${ADDR}?chain=solana`,
  jupiter: `https://jup.ag/swap/SOL-${ADDR}`,
  solscan: `https://solscan.io/token/${ADDR}`,
  retailSticker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker",
  premiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap",
  richPremiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap-copy",
  peeker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-peeker",
} as const;

const merchItems = [
  {
    name: "MAD Stickers",
    subtitle: "Retail classic",
    href: LINKS.retailSticker,
    src: "/stickers/Mad-Sticker-logo.png",
  },
  {
    name: "Card Wrap",
    subtitle: "Premium embossed",
    href: LINKS.premiumCard,
    src: "/stickers/Mad-Premium-Embossed-Card-Wrap.png",
  },
  {
    name: "Rich Wrap",
    subtitle: "Luxury variant",
    href: LINKS.richPremiumCard,
    src: "/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png",
  },
  {
    name: "Peeker",
    subtitle: "Window flex",
    href: LINKS.peeker,
    src: "/stickers/Mad-Peeker.png",
  },
] as const;

const ecosystemItems = [
  {
    name: "Dexscreener",
    href: LINKS.chartPage,
    src: "/logos/DEX-screener.png",
    alt: "Dexscreener",
    width: 160,
    height: 46,
    light: false,
  },
  {
    name: "CoinGecko",
    href: LINKS.coingecko,
    src: "/logos/coingecko.png",
    alt: "CoinGecko",
    width: 160,
    height: 46,
    light: true,
  },
  {
    name: "Birdeye",
    href: LINKS.birdeye,
    src: "/logos/birdeye.png",
    alt: "Birdeye",
    width: 145,
    height: 42,
    light: false,
  },
  {
    name: "Jupiter",
    href: LINKS.jupiter,
    src: "/logos/jupiter.png",
    alt: "Jupiter",
    width: 145,
    height: 42,
    light: false,
  },
  {
    name: "Solscan",
    href: LINKS.solscan,
    src: "/logos/solscan.png",
    alt: "Solscan",
    width: 145,
    height: 42,
    light: true,
  },
] as const;

function PillButton({ href, children, primary = false }: any) {
  const isHash = href.startsWith("#");

  return (
    <a
      href={href}
      target={isHash ? undefined : "_blank"}
      rel={isHash ? undefined : "noreferrer"}
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition",
        primary
          ? "bg-red-500 text-white hover:bg-red-400"
          : "border border-white/12 bg-white/[0.04] text-white hover:bg-white/[0.07]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

function SectionHeader({ eyebrow, title, body, align = "left" }: any) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-white/60 max-w-xl mx-auto">{body}</p>
      )}
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);

  async function copyAddr() {
    await navigator.clipboard.writeText(ADDR);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const marqueeItems = useMemo(() => [...ecosystemItems, ...ecosystemItems], []);

  return (
    <div className="bg-black text-white min-h-screen">

      {/* NAV */}
      <header className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/mad.png" width={28} height={28} alt="" />
          <span className="font-bold">$MAD</span>
        </div>

        <div className="flex gap-3">
          <PillButton href="#merch">Merch</PillButton>
          <PillButton href="#chart">Chart</PillButton>
          <PillButton href={LINKS.jupiter} primary>
            Buy
          </PillButton>
        </div>
      </header>

      {/* HERO */}
      <section className="grid lg:grid-cols-2 gap-10 p-10">
        <div>
          <h1 className="text-5xl font-black">
            STOP TRADING NOISE. <br /> START BEING{" "}
            <span className="text-red-500">$MAD</span>
          </h1>

          <div className="mt-6 flex gap-3">
            <PillButton href="#chart" primary>
              Track
            </PillButton>
            <PillButton href="#merch">Shop</PillButton>
          </div>

          <div className="mt-6">
            <p className="text-sm break-all">{ADDR}</p>
            <button onClick={copyAddr}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <Image src="/mad.png" width={120} height={120} alt="" />
        </div>
      </section>

      {/* MERCH */}
      <section id="merch" className="p-10">
        <SectionHeader title="Merch" eyebrow="Retail" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {merchItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <div className="border p-4 rounded-xl hover:scale-105 transition">
                <Image src={item.src} width={150} height={150} alt="" />
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
