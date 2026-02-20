/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// =====================
// Types
// =====================
type Rarity = "common" | "rare" | "legendary";
type Style = "cartoon" | "pixel";

type EyeItem = {
  id: string;
  primary: string;
  fallbacks: string[];
  label: string;
  rarity: Rarity;
  style: Style;
};

type DrawTransform = { x?: number; y?: number; scale?: number };

type AccessoryItem = {
  id: string;
  primary: string;
  fallbacks: string[];
  label: string;
  rarity: Rarity;
  style: Style;
  cssTransform?: string;
  draw?: DrawTransform;
};

// ====== Confessions types/helpers ======
type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: { same: number; lol: number; handshake: number };
};

const LS_REACTED_KEY = "mad_confessions_reacted_v1";
const LS_SITE_UNLOCK_KEY = "mad_site_unlocked_v1";

// =====================
// Utilities
// =====================
function ensureLeadingSlash(p: string) {
  if (!p) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

/**
 * Builds a safe list of candidate paths for <img src="...">.
 * ✅ Next.js serves /public/* at ROOT ("/")
 * Also tries legacy "/public" prefixes and ".png.png" mistakes.
 */
function buildCandidates(originalPath: string): string[] {
  const raw = ensureLeadingSlash(originalPath);
  const prefixes = ["", "/public", "/public/public"];
  const out: string[] = [];

  const pushUnique = (v: string) => {
    const cleaned = v.replace(/\/{2,}/g, "/");
    if (!out.includes(cleaned)) out.push(cleaned);
  };

  for (const pre of prefixes) {
    const p = `${pre}${raw}`.replace(/\/{2,}/g, "/");
    pushUnique(p);

    if (p.endsWith(".png.png")) pushUnique(p.replace(/\.png\.png$/, ".png"));
    if (p.endsWith(".png")) pushUnique(`${p}.png`);
  }

  return out;
}

function makeItem<
  T extends {
    id: string;
    primary: string;
    fallbacks: string[];
    label: string;
    rarity: Rarity;
    style: Style;
  }
>(id: string, path: string, label: string, rarity: Rarity, style: Style, extra?: Partial<T>): T {
  const candidates = buildCandidates(path);
  return {
    id,
    primary: candidates[0],
    fallbacks: candidates.slice(1),
    label,
    rarity,
    style,
    ...(extra || {}),
  } as T;
}

/** Weighted: 75% common, 20% rare, 5% legendary */
function pickWeightedAccessory(all: AccessoryItem[]) {
  const commons = all.filter((a) => a.rarity === "common");
  const rares = all.filter((a) => a.rarity === "rare");
  const legs = all.filter((a) => a.rarity === "legendary");

  const safeCommons = commons.length ? commons : all;
  const safeRares = rares.length ? rares : safeCommons;
  const safeLegs = legs.length ? legs : safeRares;

  const roll = Math.random();
  if (roll < 0.75) return safeCommons[Math.floor(Math.random() * safeCommons.length)];
  if (roll < 0.95) return safeRares[Math.floor(Math.random() * safeRares.length)];
  return safeLegs[Math.floor(Math.random() * safeLegs.length)];
}

function cycleFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbacks: string[]) {
  const img = e.currentTarget;
  if (!fallbacks?.length) return;

  const current = img.getAttribute("src") || img.currentSrc || "";

  if (img.dataset.lastTried !== current) {
    img.dataset.fallbackIndex = "0";
    img.dataset.lastTried = current;
  }

  const idx = Number(img.dataset.fallbackIndex || "0");
  if (idx >= fallbacks.length) return;

  img.dataset.fallbackIndex = String(idx + 1);
  img.setAttribute("src", fallbacks[idx]);
}

function resetFallbackIndex(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  img.dataset.fallbackIndex = "0";
  img.dataset.lastTried = img.getAttribute("src") || img.currentSrc || "";
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function clampText(s: string, max = 240) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trim() : t;
}

// =====================
// Shared constants
// =====================
export const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

export const links = {
  buy: `https://jup.ag/swap/SOL-${addr}`,
  chart: `https://dexscreener.com/solana/${addr}`,
  x: "https://x.com/i/communities/2019256566248312879/",
  tg: "https://t.me/MadOfficalChannel", // ✅ UPDATED
  game: "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD",
};

// Token Stats
export const BURNED = 350_000_000;
export const BURN_RATE = 35;
export const LOCKED = 111_000_000;
export const LOCK_UNTIL = "6/1/2026";

// =====================
// Shared Shell (Nav + BG + Gate)
// =====================
export function MadShell({ children }: { children: React.ReactNode }) {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [gateTaps, setGateTaps] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_SITE_UNLOCK_KEY);
      const isUnlocked = saved === "1";
      setGateUnlocked(isUnlocked);
      setGateTaps(isUnlocked ? 10 : 0);
    } catch {
      setGateUnlocked(false);
      setGateTaps(0);
    }
  }, []);

  const unlockGate = () => {
    setGateUnlocked(true);
    setGateTaps(10);
    try {
      localStorage.setItem(LS_SITE_UNLOCK_KEY, "1");
    } catch {}
  };

  const tapGate = () => {
    setGateTaps((prev) => {
      const next = Math.min(10, prev + 1);
      if (next >= 10) unlockGate();
      return next;
    });
  };

  const gateLine = useMemo(() => {
    if (gateTaps <= 0) return "Tap to enter. Emotion requires commitment.";
    if (gateTaps <= 3) return "Warming up.";
    if (gateTaps <= 6) return "Now we’re moving.";
    if (gateTaps <= 9) return "Last one.";
    return "Unlocked.";
  }, [gateTaps]);

  const bg = useMemo(() => {
    const c = buildCandidates("/pfp/bg/bg-redclouds.png");
    return { primary: c[0], fallbacks: c.slice(1) };
  }, []);

  const [scrollGlow, setScrollGlow] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const max = Math.max(600, document.body.scrollHeight - window.innerHeight);
        const t = Math.min(1, y / max);
        setScrollGlow(t);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {!gateUnlocked && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-8 shadow-[0_30px_120px_rgba(255,120,80,0.18)]">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <Image src="/mad.png" alt="$MAD" width={44} height={44} priority />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">Entry</div>
                <div className="text-2xl sm:text-3xl font-black leading-tight">Tap to Enter</div>
              </div>
            </div>

            <p className="mt-4 text-white/70 leading-[1.75]">
              Tap the 😡 <span className="font-black text-white">10x</span> to unlock.
              <br />
              Or skip if you’re calm.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-black text-white/85">{gateLine}</div>
                <div className="text-xs text-white/60 tabular-nums">{gateTaps}/10</div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                  style={{ width: `${(gateTaps / 10) * 100}%` }}
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500 text-white shadow-[0_18px_70px_rgba(255,120,80,0.18)]"
                  onClick={tapGate}
                >
                  😡 Tap ({gateTaps}/10)
                </button>

                <button
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 bg-white/10 hover:bg-white/15 text-white"
                  onClick={unlockGate}
                >
                  Skip →
                </button>
              </div>

              <div className="mt-3 text-xs text-white/45 leading-[1.75]">You only do this once. Your rage is remembered.</div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes forgePulse {
          0% { transform: scale(1); filter: saturate(1); }
          50% { transform: scale(1.02); filter: saturate(1.2); }
          100% { transform: scale(1); filter: saturate(1); }
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 -z-20">
        <img
          src={bg.primary}
          alt="Red storm background"
          className="h-full w-full object-cover"
          onLoad={resetFallbackIndex}
          onError={(e) => cycleFallback(e, bg.fallbacks)}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/45" />
      </div>

      {/* Side glows */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: -15 }}>
        <div
          className="absolute left-0 top-0 h-full w-[22vw] max-w-[360px] blur-3xl"
          style={{
            opacity: 0.08 + scrollGlow * 0.22,
            background:
              "radial-gradient(circle at 30% 50%, rgba(255,110,60,0.55), transparent 62%)," +
              "radial-gradient(circle at 10% 70%, rgba(255,40,40,0.35), transparent 60%)",
          }}
        />
        <div
          className="absolute right-0 top-0 h-full w-[22vw] max-w-[360px] blur-3xl"
          style={{
            opacity: 0.08 + scrollGlow * 0.22,
            background:
              "radial-gradient(circle at 70% 50%, rgba(255,110,60,0.55), transparent 62%)," +
              "radial-gradient(circle at 90% 70%, rgba(255,40,40,0.35), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" style={{ opacity: 0.35 }} />
      </div>

      {/* Top Nav */}
      <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-3">
          <Link className="flex items-center gap-2" href="/" aria-label="Go home">
            <Image src="/mad.png" alt="$MAD" width={28} height={28} />
            <span className="text-sm font-black tracking-tight">$MAD</span>
          </Link>

          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
            <NavPill href="/">Home</NavPill>
            <NavPill href="/forge">Forge</NavPill>
            <NavPill href="/confessions">Confessions</NavPill>
            <NavPill href="/roadmap">Roadmap</NavPill>
            <NavPill href="/memes">Memes</NavPill>
          </div>
        </div>
      </div>

      {children}
    </main>
  );
}

function NavPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-xs font-black border transition whitespace-nowrap border-white/10 bg-white/5 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

// =====================
// Home Page (now includes Chart + Status + Socials)
// =====================
export function MadHomePage() {
  const [copied, setCopied] = useState(false);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Could not copy. Try manually selecting.");
    }
  };

  const btnBase =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/15";
  const btnPrimary = [
    btnBase,
    "text-white",
    "bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500",
    "shadow-[0_18px_70px_rgba(255,120,80,0.18)]",
  ].join(" ");
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;
  const btnWhite = `${btnBase} bg-white text-black hover:opacity-90`;
  const btnBlue = `${btnBase} bg-blue-500/90 hover:bg-blue-600 text-white`;

  const dexscreenerEmbedSrc = useMemo(() => {
    const base = `https://dexscreener.com/solana/${addr}`;
    return `${base}?embed=1&theme=dark&trades=0&info=0`;
  }, []);

  return (
    <MadShell>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        {/* HERO */}
        <section className="pt-16 pb-10 w-full">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3 border border-white/10 shadow-[0_0_80px_rgba(255,120,80,0.12)]">
                <Image src="/mad.png" alt="$MAD" width={52} height={52} priority />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">Solana</div>
                <div className="text-sm font-black text-white/80">Digital emotion — refined</div>
              </div>
            </div>

            <div className="mt-10">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95]">Welcome To $MAD</h1>

              <p className="mt-5 text-xl sm:text-2xl text-white/75 leading-[1.7] max-w-2xl">
                Emotion evolves.
                <br />
                Born in volatility.
                <br />
                Refined through discipline.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className={btnPrimary} href="/forge">
                  Forge Identity
                </Link>
                <a className={btnGhost} href={links.buy} target="_blank" rel="noreferrer">
                  Buy on Jupiter
                </a>
                <a className={btnGhost} href={links.chart} target="_blank" rel="noreferrer">
                  Track Momentum
                </a>
              </div>

              {/* Contract */}
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <div className="text-xs uppercase tracking-[0.35em] text-white/50">Contract</div>
                <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 font-mono text-sm break-all">
                    {addr}
                  </div>
                  <button onClick={copyCA} className={btnGhost}>
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Socials on home */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={links.x} target="_blank" rel="noreferrer" className={btnWhite}>
                  Join X Community
                </a>
                <a href={links.tg} target="_blank" rel="noreferrer" className={btnBlue}>
                  Join Telegram
                </a>
                <a href={links.game} target="_blank" rel="noreferrer" className={btnGhost}>
                  Play Roblox
                </a>
              </div>

              <p className="mt-5 text-xs text-white/40 leading-[1.8]">Not financial advice. Culture experiment. Wearable energy.</p>
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section className="pb-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Burned</p>
              <div className="mt-2 text-3xl sm:text-4xl font-black tabular-nums">{BURNED.toLocaleString()}</div>
              <p className="mt-2 text-white/70">
                Burn rate: <span className="font-black text-white tabular-nums">{BURN_RATE}%</span>
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Locked</p>
              <div className="mt-2 text-3xl sm:text-4xl font-black tabular-nums">{LOCKED.toLocaleString()}</div>
              <p className="mt-2 text-white/70">
                Locked until: <span className="font-black text-white">{LOCK_UNTIL}</span>
              </p>
            </div>
          </div>
        </section>

        {/* CHART */}
        <section className="pb-20">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-3xl sm:text-4xl font-black">Chart</h2>
            <a className="text-xs font-black text-white/60 hover:text-white" href={links.chart} target="_blank" rel="noreferrer">
              Open Dexscreener →
            </a>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                title="$MAD Dexscreener"
                src={dexscreenerEmbedSrc}
                className="absolute inset-0 h-full w-full"
                allow="clipboard-write; fullscreen"
              />
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD. Built by the community.</footer>
      </div>
    </MadShell>
  );
}

// =====================
// Forge Page
// =====================
export function MadForgePage() {
  const btnBase =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/15";
  const btnPrimary = [
    btnBase,
    "text-white",
    "bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500",
    "shadow-[0_18px_70px_rgba(255,120,80,0.18)]",
  ].join(" ");
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;

  const ALL_EYES: EyeItem[] = useMemo(() => {
    return [
      makeItem<EyeItem>("c-common-black", "/pfp/eyes/cartoon/common/cartoon-common-black.png", "Cartoon Common Black", "common", "cartoon"),
      makeItem<EyeItem>("c-common-blue", "/pfp/eyes/cartoon/common/cartoon-common-blue.png", "Cartoon Common Blue", "common", "cartoon"),
      makeItem<EyeItem>("c-common-green", "/pfp/eyes/cartoon/common/cartoon-common-green.png", "Cartoon Common Green", "common", "cartoon"),
      makeItem<EyeItem>("c-common-orange", "/pfp/eyes/cartoon/common/cartoon-common-orange.png", "Cartoon Common Orange", "common", "cartoon"),
      makeItem<EyeItem>("c-common-purple", "/pfp/eyes/cartoon/common/cartoon-common-purple.png", "Cartoon Common Purple", "common", "cartoon"),
      makeItem<EyeItem>("c-common-red", "/pfp/eyes/cartoon/common/cartoon-common-red.png", "Cartoon Common Red", "common", "cartoon"),
    ];
  }, []);

  const ALL_ACCESSORIES: AccessoryItem[] = useMemo(() => {
    const tall = (y: number, scale = 1) => ({
      cssTransform: `translateY(${y}px) scale(${scale})`,
      draw: { y, scale },
    });

    return [
      makeItem<AccessoryItem>("a-c-common-bandaid", "/pfp/accessories/cartoon/common/cartoon-common-bandaid.png", "Bandage", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-icedchain", "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png", "Iced $MAD Chain", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-crown", "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png", "Crown", "legendary", "cartoon", tall(18, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-halo", "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png", "Halo", "legendary", "cartoon", tall(28, 0.95)),
    ];
  }, []);

  const BASE = useMemo(
    () =>
      makeItem<{ id: string; primary: string; fallbacks: string[]; label: string; rarity: Rarity; style: Style }>(
        "base",
        "/pfp/base/base-01.png",
        "Base",
        "common",
        "cartoon"
      ),
    []
  );

  const [showBase, setShowBase] = useState(true);
  const [showAcc, setShowAcc] = useState(true);

  const initialEye = useMemo(
    () => ALL_EYES[0] ?? makeItem<EyeItem>("default-eye", "/pfp/eyes/eyes-01.png", "Eyes", "common", "cartoon"),
    [ALL_EYES]
  );
  const initialAcc = useMemo(
    () => ALL_ACCESSORIES[0] ?? makeItem<AccessoryItem>("default-acc", "/pfp/accessories/acc-01.png", "Accessory", "common", "cartoon"),
    [ALL_ACCESSORIES]
  );

  const [eyeId, setEyeId] = useState(initialEye.id);
  const [accId, setAccId] = useState(initialAcc.id);

  const selectedEye = useMemo(() => ALL_EYES.find((e) => e.id === eyeId) ?? initialEye, [eyeId, initialEye, ALL_EYES]);
  const selectedAcc = useMemo(() => ALL_ACCESSORIES.find((a) => a.id === accId) ?? initialAcc, [accId, initialAcc, ALL_ACCESSORIES]);

  const [eyeSrc, setEyeSrc] = useState(selectedEye.primary);
  const [eyeFallbacks, setEyeFallbacks] = useState<string[]>(selectedEye.fallbacks);
  const [eyeLabel, setEyeLabel] = useState(`${selectedEye.label} • ${selectedEye.rarity.toUpperCase()}`);

  const [accSrc, setAccSrc] = useState(selectedAcc.primary);
  const [accFallbacks, setAccFallbacks] = useState<string[]>(selectedAcc.fallbacks);
  const [accLabel, setAccLabel] = useState(`${selectedAcc.label} • ${selectedAcc.rarity.toUpperCase()}`);

  useEffect(() => {
    setEyeSrc(selectedEye.primary);
    setEyeFallbacks(selectedEye.fallbacks);
    setEyeLabel(`${selectedEye.label} • ${selectedEye.rarity.toUpperCase()}`);
  }, [selectedEye.id]);

  useEffect(() => {
    setAccSrc(selectedAcc.primary);
    setAccFallbacks(selectedAcc.fallbacks);
    setAccLabel(`${selectedAcc.label} • ${selectedAcc.rarity.toUpperCase()}`);
  }, [selectedAcc.id]);

  const [forgeCount, setForgeCount] = useState(0);
  const [powerIndex, setPowerIndex] = useState(50);
  const [revealing, setRevealing] = useState(false);
  const [renderNonce, setRenderNonce] = useState(0);

  const forgeIdentity = () => {
    if (!ALL_EYES.length) return;

    setRevealing(true);
    setTimeout(() => {
      const pickEye = ALL_EYES[Math.floor(Math.random() * ALL_EYES.length)];
      setEyeId(pickEye.id);

      if (ALL_ACCESSORIES.length) {
        const pickAcc = pickWeightedAccessory(ALL_ACCESSORIES);
        setAccId(pickAcc.id);
      }

      setForgeCount((v) => v + 1);
      setRenderNonce((n) => n + 1);
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  return (
    <MadShell>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        <section className="pt-16 pb-6 w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3 border border-white/10 shadow-[0_0_80px_rgba(255,120,80,0.12)]">
                <Image src="/mad.png" alt="$MAD logo" width={48} height={48} priority />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">Forge</div>
                <div className="text-2xl sm:text-3xl font-black leading-tight">Wear the mark.</div>
              </div>
            </div>

            <Link className={btnGhost} href="/">
              ← Back
            </Link>
          </div>

          <p className="mt-6 text-white/65 leading-[1.9] max-w-2xl">Free for the community. Clean looks. Strong signal.</p>
        </section>

        <section className="pb-20 w-full max-w-xl mx-auto text-center">
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button className={btnGhost} onClick={() => setShowBase((v) => !v)}>
              {showBase ? "Hide Base" : "Show Base"}
            </button>
            <button className={btnGhost} onClick={() => setShowAcc((v) => !v)}>
              {showAcc ? "Hide Accessory" : "Show Accessory"}
            </button>
          </div>

          <div
            className="mt-10 relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full overflow-hidden border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(255,120,80,0.10)]"
            style={revealing ? { animation: "forgePulse 0.55s ease-in-out" } : undefined}
          >
            {showBase && (
              <img
                key={`base-${renderNonce}`}
                src={BASE.primary}
                className="absolute inset-0 w-full h-full object-cover"
                alt="base"
                onLoad={resetFallbackIndex}
                onError={(e) => cycleFallback(e, BASE.fallbacks)}
              />
            )}

            <img
              key={`eyes-${eyeId}-${renderNonce}`}
              src={eyeSrc}
              className="absolute inset-0 w-full h-full object-cover"
              alt="eyes"
              onLoad={resetFallbackIndex}
              onError={(e) => cycleFallback(e, eyeFallbacks)}
            />

            {showAcc && (
              <img
                key={`acc-${accId}-${renderNonce}`}
                src={accSrc}
                className="absolute inset-0 w-full h-full object-cover"
                alt="accessory"
                style={selectedAcc?.cssTransform ? { transform: selectedAcc.cssTransform } : undefined}
                onLoad={resetFallbackIndex}
                onError={(e) => cycleFallback(e, accFallbacks)}
              />
            )}
          </div>

          <div className="mt-5 text-xs text-white/65">{eyeLabel}</div>
          <div className="mt-1 text-xs text-white/50">{accLabel}</div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black">
              Forge Count: <span className="text-white tabular-nums">{forgeCount}</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black">
              Power Index: <span className="text-white tabular-nums">{powerIndex}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className={btnPrimary} onClick={forgeIdentity}>
              Forge Identity
            </button>
          </div>
        </section>

        <footer className="py-10 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD.</footer>
      </div>
    </MadShell>
  );
}

// =====================
// Confessions Page
// =====================
export function MadConfessionsPage() {
  const btnBase =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/15";
  const btnPrimary = [
    btnBase,
    "text-white",
    "bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500",
    "shadow-[0_18px_70px_rgba(255,120,80,0.18)]",
  ].join(" ");
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;

  const ragePrompts = useMemo(
    () => [
      "What small thing ruined your mood instantly?",
      "What’s the most petty thing that made you mad today?",
      "What ‘minor inconvenience’ turned into a full villain arc?",
      "What was the last thing that made you whisper: ‘I’m so mad’?",
      "What’s something that should be illegal but isn’t?",
      "What’s a sound that instantly makes you rage?",
      "What’s a ‘helpful’ feature that always breaks everything?",
      "What’s a price that made you close the tab immediately?",
    ],
    []
  );

  const todayPrompt = useMemo(() => {
    const d = new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return ragePrompts[h % ragePrompts.length];
  }, [ragePrompts]);

  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [confessionText, setConfessionText] = useState("");
  const [confessionErr, setConfessionErr] = useState<string | null>(null);
  const [confessionBusy, setConfessionBusy] = useState(false);

  const [reactedMap, setReactedMap] = useState<Record<string, { same?: boolean; lol?: boolean; handshake?: boolean }>>({});
  const [apiOk, setApiOk] = useState(true);

  const persistReacted = (next: typeof reactedMap) => {
    setReactedMap(next);
    try {
      localStorage.setItem(LS_REACTED_KEY, JSON.stringify(next));
    } catch {}
  };

  const loadReacted = () => {
    const reacted = safeJsonParse<Record<string, { same?: boolean; lol?: boolean; handshake?: boolean }>>(
      typeof window !== "undefined" ? localStorage.getItem(LS_REACTED_KEY) : null,
      {}
    );
    setReactedMap(reacted || {});
  };

  const normalizeConfessions = useCallback((raw: any): Confession[] => {
    const list: any[] = Array.isArray(raw) ? raw : [];
    return list
      .filter((c) => c && typeof c.text === "string")
      .map((c) => ({
        id: String(c.id ?? ""),
        text: clampText(String(c.text ?? ""), 240),
        createdAt: typeof c.createdAt === "number" ? c.createdAt : Date.now(),
        reactions: {
          same: Number(c.reactions?.same ?? 0) || 0,
          lol: Number(c.reactions?.lol ?? 0) || 0,
          handshake: Number(c.reactions?.handshake ?? 0) || 0,
        },
      }))
      .filter((c) => c.id.length > 0)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 200);
  }, []);

  const fetchConfessions = useCallback(async () => {
    try {
      const res = await fetch("/api/confessions", { cache: "no-store" });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.error || "Fetch failed");
      const list = data?.confessions ?? data?.items ?? [];
      setConfessions(normalizeConfessions(list));
      setApiOk(true);
    } catch {
      setApiOk(false);
    }
  }, [normalizeConfessions]);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadReacted();
    fetchConfessions();

    pollRef.current = setInterval(fetchConfessions, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [fetchConfessions]);

  const submitConfession = async () => {
    setConfessionErr(null);
    const t = clampText(confessionText, 240);

    if (!t) return setConfessionErr("Type something first.");
    if (t.length < 4) return setConfessionErr("A little more detail.");

    setConfessionBusy(true);
    try {
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.error || "Failed to post");

      const item = data?.item;
      if (!item?.id) throw new Error("API returned no item");

      setConfessionText("");
      setConfessions((prev) => normalizeConfessions([item, ...prev]));
      setApiOk(true);
    } catch (err: any) {
      setApiOk(false);
      setConfessionErr(err?.message || "Post failed");
    } finally {
      setConfessionBusy(false);
    }
  };

  const react = async (id: string, kind: "same" | "lol" | "handshake") => {
    const already = !!reactedMap?.[id]?.[kind];

    // optimistic UI
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const delta = already ? -1 : 1;
        const nextCount = Math.max(0, (c.reactions?.[kind] ?? 0) + delta);
        return { ...c, reactions: { ...c.reactions, [kind]: nextCount } };
      })
    );

    const nextReacted = { ...reactedMap, [id]: { ...(reactedMap[id] || {}), [kind]: !already } };
    persistReacted(nextReacted);

    try {
      await fetch("/api/confessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reaction: kind, delta: already ? -1 : 1 }),
      });
      fetchConfessions();
    } catch {}
  };

  return (
    <MadShell>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        <section className="pt-16 pb-4 w-full">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Community</p>
              <h2 className="mt-2 text-4xl sm:text-5xl font-black">Mad Confessions</h2>
              <p className="mt-3 text-white/65 leading-[1.9]">Structured chaos. Anonymous truth.</p>
            </div>
            <Link className={btnGhost} href="/">
              ← Back
            </Link>
          </div>

          {!apiOk && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-200">
              Confessions API not reachable yet — add <span className="font-mono">/api/confessions</span> and refresh.
            </div>
          )}
        </section>

        <section className="py-10 w-full max-w-4xl mx-auto">
          <div className="mb-7 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
            <div className="text-xs uppercase tracking-[0.35em] text-white/50">Today’s prompt</div>
            <div className="mt-2 text-lg sm:text-xl font-black text-white/85">“{todayPrompt}”</div>
            <div className="mt-2 text-xs text-white/45">Anonymous. Public. Real.</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm font-black">Post a confession</div>
                <div className="text-xs text-white/55 mt-1">No names. No DMs. Just signal.</div>
              </div>
              <button className={btnPrimary} onClick={submitConfession} disabled={confessionBusy}>
                {confessionBusy ? "Posting..." : "Post"}
              </button>
            </div>

            <div className="mt-4">
              <textarea
                value={confessionText}
                onChange={(e) => setConfessionText(e.target.value)}
                placeholder="Example: I paid gas fees and the transaction still failed."
                className="w-full min-h-[110px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                maxLength={240}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <div className="text-red-300/90">{confessionErr ? `⚠️ ${confessionErr}` : ""}</div>
                <div className="text-white/40 tabular-nums">{confessionText.length}/240</div>
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-4">
            {confessions.length === 0 ? (
              <div className="text-center text-white/55 py-10">No confessions yet.</div>
            ) : (
              confessions.map((c) => {
                const reacted = reactedMap[c.id] || {};
                return (
                  <div key={c.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-white/85 leading-relaxed text-sm sm:text-base">{c.text}</div>
                      <div className="shrink-0 text-xs text-white/35">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        className={[
                          "rounded-full border px-4 py-2 text-xs font-black transition",
                          reacted.same ? "border-white/25 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10",
                        ].join(" ")}
                        onClick={() => react(c.id, "same")}
                      >
                        Same <span className="text-white/70 tabular-nums">{c.reactions.same}</span>
                      </button>

                      <button
                        className={[
                          "rounded-full border px-4 py-2 text-xs font-black transition",
                          reacted.lol ? "border-white/25 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10",
                        ].join(" ")}
                        onClick={() => react(c.id, "lol")}
                      >
                        LOL <span className="text-white/70 tabular-nums">{c.reactions.lol}</span>
                      </button>

                      <button
                        className={[
                          "rounded-full border px-4 py-2 text-xs font-black transition",
                          reacted.handshake ? "border-white/25 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10",
                        ].join(" ")}
                        onClick={() => react(c.id, "handshake")}
                      >
                        🤝 <span className="text-white/70 tabular-nums">{c.reactions.handshake}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <p className="mt-6 text-center text-xs text-white/35">Public feed. Anonymous voice.</p>
        </section>

        <footer className="py-10 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD.</footer>
      </div>
    </MadShell>
  );
}

// =====================
// Roadmap Page
// =====================
export function MadRoadmapPage() {
  const roadmap = useMemo(
    () => [
      { phase: "Phase 1", title: "Bond", desc: "Establish the foundation. Lock in the culture. Build the core.", done: true },
      { phase: "Phase 1.1", title: "300M Burn (30%)", desc: "Proof-of-signal. Big burn. Clear intent.", done: true },
      { phase: "Phase 1.2", title: "350M Burn (35%)", desc: "Phase 1.2 complete — 350,000,000 tokens burned.", done: true },
      { phase: "Phase 1.3", title: "40% Supply Burned", desc: "Target milestone — 40% of total supply burned.", done: false },
      { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes visible." },
      { phase: "Phase 3", title: "$10M", desc: "Scale the culture. Expand the orbit." },
      { phase: "Phase 4", title: "$50M", desc: "The line gets crowded. The fade gets expensive." },
    ],
    []
  );

  return (
    <MadShell>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-black">Roadmap</h1>
        <div className="mt-8 grid gap-5">
          {roadmap.map((item) => (
            <div key={item.phase + item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">{item.phase}</p>
                <span className="text-xs font-black text-white/55">{item.done ? "Completed" : "Not Completed"}</span>
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black">{item.title}</h3>
              <p className="mt-2 text-white/65 leading-[1.95]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MadShell>
  );
}

// =====================
// Memes Page
// =====================
export function MadMemesPage() {
  const freshMemes = useMemo(
    () => [
      { src: "/memes/mad-meme-trafficstuck.png", tag: "Traffic" },
      { src: "/memes/mad-meme-wifibuffer.png", tag: "Buffering" },
      { src: "/memes/mad-meme-scamcall.png", tag: "Scam Call" },
    ],
    []
  );

  return (
    <MadShell>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-black">Memes</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {freshMemes.map((m) => {
            const candidates = buildCandidates(m.src);
            const primary = candidates[0];
            const fallbacks = candidates.slice(1);

            return (
              <div key={m.src} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-black text-white/70 mb-3">{m.tag}</div>
                <img
                  src={primary}
                  alt={m.tag}
                  className="rounded-2xl w-full h-auto"
                  loading="lazy"
                  onLoad={resetFallbackIndex}
                  onError={(e) => cycleFallback(e, fallbacks)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </MadShell>
  );
}
