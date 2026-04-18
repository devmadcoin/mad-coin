"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  buy: "#",
  chart: "#",
  dexscreener: "#",
  birdeye: "#",
  coingecko: "#",
  jupiter: "#",
  solscan: "#",
} as const;

function Btn({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300 ${
        primary
          ? "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-400"
          : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      {children}
    </a>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
      {children}
    </span>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-2xl font-black text-white">{number}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">
        {label}
      </p>
    </div>
  );
}

function Platform({
  src,
  alt,
  label,
  href,
}: {
  src: string;
  alt: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:scale-[1.01] hover:border-white/20"
    >
      <Image src={src} alt={alt} width={28} height={28} className="h-7 w-7" />
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
          Live On
        </p>
        <p className="text-sm font-black text-white/90">{label}</p>
      </div>
    </a>
  );
}

function Step({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-sm font-black">
        {n}
      </div>
      <p className="mt-4 text-lg font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-white/62">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#040404] text-white overflow-x-hidden">
      {/* background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.06),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="rounded-[42px] border border-white/10 bg-black/40 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">
                CONTROL YOURSELF
              </p>

              <h1 className="mt-6 text-[3.2rem] font-black leading-[0.88] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.4rem]">
                <span className="text-red-500">STOP</span>
                <br />
                PANICKING.
                <br />
                GET
                <br />
                <span className="text-red-500">$MAD</span>{" "}
                <span className="text-green-400">RICH.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Most people lose because of emotion. $MAD was built around
                discipline, identity, community, and controlled chaos.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href="/mad-mind" primary>
                  Enter MAD Mind
                </Btn>
                <Btn href="/roadmap">See Why It’s Real</Btn>
                <Btn href={LINKS.buy}>Buy $MAD</Btn>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Badge>Real Project</Badge>
                <Badge>Live Tech</Badge>
                <Badge>Public Build</Badge>
                <Badge>Meme Coin</Badge>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-4">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-[16/10] w-full object-cover"
                >
                  <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Stat number="LIVE" label="website" />
                <Stat number="AI" label="mad mind" />
                <Stat number="BUILD" label="daily" />
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-red-500/[0.08] p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-red-300">
              Why $MAD Exists
            </p>
            <p className="mt-4 text-xl font-black leading-tight">
              Most people panic.
              <br />
              $MAD builds.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/45">
              Identity
            </p>
            <p className="mt-4 text-white/75 leading-7">
              Stay $MAD means feel pressure, but move with discipline.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-green-500/[0.08] p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-green-300">
              Wealth Mindset
            </p>
            <p className="mt-4 text-white/75 leading-7">
              Rich starts in the mind before it hits the wallet.
            </p>
          </div>
        </section>

        {/* LIVE ECOSYSTEM */}
        <section className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/40">
                Already Live
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">
                Tracked. Visible. Building.
              </h2>
              <p className="mt-4 max-w-2xl text-white/62 leading-7">
                Even if someone hates reading, they can instantly see this is
                more than just a meme page.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge>Tracked</Badge>
              <Badge>Public</Badge>
              <Badge>Growing</Badge>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Platform
              src="/logos/DEX-screener.png"
              alt="DEX"
              label="DEX Screener"
              href={LINKS.dexscreener}
            />
            <Platform
              src="/logos/birdeye.png"
              alt="Birdeye"
              label="Birdeye"
              href={LINKS.birdeye}
            />
            <Platform
              src="/logos/coingecko.png"
              alt="Coingecko"
              label="CoinGecko"
              href={LINKS.coingecko}
            />
            <Platform
              src="/logos/jupiter.png"
              alt="Jupiter"
              label="Jupiter"
              href={LINKS.jupiter}
            />
            <Platform
              src="/logos/solscan.png"
              alt="Solscan"
              label="Solscan"
              href={LINKS.solscan}
            />
          </div>
        </section>

        {/* MAD AI */}
        <section className="mt-10 rounded-[38px] border border-white/10 bg-gradient-to-br from-red-500/[0.08] to-black p-8">
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/40">
            Technology Layer
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">
            MAD AI Is Here.
          </h2>

          <p className="mt-4 max-w-3xl text-white/65 leading-8">
            While most meme coins stop at a mascot, $MAD is building live
            interactive tech: MAD Mind, viral content engines, engagement loops,
            roast systems, and future autonomous community tools.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>AI Identity</Badge>
            <Badge>Interactive</Badge>
            <Badge>Scalable</Badge>
            <Badge>Future Utility</Badge>
          </div>
        </section>

        {/* HOW TO BUY */}
        <section className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 sm:p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/40">
            Easy Entry
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">
            How To Join $MAD
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Step n="1" title="Get Wallet" text="Download Phantom wallet." />
            <Step n="2" title="Buy SOL" text="Add Solana to your wallet." />
            <Step n="3" title="Swap" text="Use Jupiter or supported DEX." />
            <Step n="4" title="Stay $MAD" text="Join the movement." />
          </div>
        </section>

        {/* CONFESSIONS */}
        <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,0,0,0.9),rgba(6,0,0,0.96))] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/40">
                Community Signal
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">
                See What People Really Think.
              </h2>
              <p className="mt-4 text-white/62">
                Real thoughts. Real reactions. Real signal.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge>Trending</Badge>
              <Badge>Live</Badge>
              <Badge>Top</Badge>
            </div>
          </div>

          <div className="mt-8">
            <MadConfessions />
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="mt-8 rounded-[26px] border border-yellow-400/15 bg-yellow-500/[0.07] px-5 py-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-yellow-200/80">
            Risk Notice
          </p>

          <p className="mt-3 text-sm leading-7 text-yellow-100/85">
            $MAD is a meme coin and speculative digital asset. Nothing on this
            website is financial advice or a guarantee of returns. Crypto is
            risky and volatile. Never risk money you cannot afford to lose.
            Always do your own research.
          </p>
        </section>
      </main>
    </div>
  );
}
