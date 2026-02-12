"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

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

  // Helps tall legendaries (halo/horns/aura/jetpack) show inside the circle.
  cssTransform?: string;
  draw?: DrawTransform;
};

function ensureLeadingSlash(p: string) {
  if (!p) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

/**
 * Builds a safe list of candidate paths.
 * - Tries normal path
 * - Also tries accidental /public prefix
 * - Also tries .png vs .png.png variants
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

  const current = img.currentSrc || img.src || "";

  if (img.dataset.lastTried !== current) {
    img.dataset.fallbackIndex = "0";
    img.dataset.lastTried = current;
  }

  const idx = Number(img.dataset.fallbackIndex || "0");
  if (idx >= fallbacks.length) return;

  img.dataset.fallbackIndex = String(idx + 1);
  img.src = fallbacks[idx];
}

function resetFallbackIndex(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  img.dataset.fallbackIndex = "0";
  img.dataset.lastTried = img.currentSrc || img.src || "";
}

export default function Home() {
  // ====== Token / Links ======
  const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

  const links = useMemo(
    () => ({
      buy: `https://jup.ag/swap/SOL-${addr}`,
      chart: `https://dexscreener.com/solana/${addr}`,
      x: "https://x.com/i/communities/2019256566248312879/",
      tg: "https://t.me/madcoinofficial001",
    }),
    [addr]
  );

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

  // ====== UI buttons ======
  const btnBase =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition border border-white/10";
  const btnPrimary = `${btnBase} bg-red-600 hover:bg-red-500 text-white`;
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;
  const btnWhite = `${btnBase} bg-white text-black hover:opacity-90`;
  const btnBlue = `${btnBase} bg-blue-500 hover:bg-blue-600 text-white`;

  // ====== Background + particles ======
  const bg = useMemo(() => {
    const c = buildCandidates("/pfp/bg/bg-redclouds.png");
    return { primary: c[0], fallbacks: c.slice(1) };
  }, []);

  const angry = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const x = (i * 100) / count + (Math.random() * 6 - 3);
      const size = 18 + Math.floor(Math.random() * 26);
      const opacity = 0.12 + Math.random() * 0.22;
      const dur = 10 + Math.random() * 18;
      const delay = Math.random() * 6;
      const drift = Math.floor(Math.random() * 240 - 120);
      return { i, x, size, opacity, dur, delay, drift };
    });
  }, []);

  // ====== Meme Vault ======
  // Your repo shows: public/public/memes/*.png
  // Browser URL becomes: /public/memes/*.png
  const freshMemes = useMemo(
    () => [
      { src: "/public/memes/mad-meme-trafficstuck.png", tag: "Traffic Rage" },
      { src: "/public/memes/mad-meme-wifibuffer.png", tag: "Slow Internet" },
      { src: "/public/memes/mad-meme-scamcall.png", tag: "Scam Call" },
      { src: "/public/memes/mad-meme-forgotpassword.png", tag: "Locked Out" },
      { src: "/public/memes/mad-meme-batterylow.png", tag: "1% Battery" },
      { src: "/public/memes/mad-meme-groupmessage.png", tag: "Ghosted" },
      { src: "/public/memes/mad-meme-coffeehot.png", tag: "Coffee Too Hot" },
      { src: "/public/memes/mad-meme-lasttimebeingfarmed.png", tag: "Farmed Again" },
      { src: "/public/memes/mad-meme-lipbalm.png", tag: "Lip Balm" },
      { src: "/public/memes/mad-meme-toiletpaper.png", tag: "Toilet Paper" },
      { src: "/public/memes/mad-meme-whydidifade.png", tag: "CT Fade" },
    ],
    []
  );

  // ====== Roadmap ======
  const roadmap = useMemo(
    () => [
      { phase: "Phase 1", title: "Bond", desc: "Establish the foundation. Lock in the vibe. Build the core.", done: true },
      { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes undeniable." },
      { phase: "Phase 3", title: "$10M", desc: "Scale the energy. More eyes. More memes. More movement." },
      { phase: "Phase 4", title: "$50M", desc: "Serious territory. The timeline feels it." },
    ],
    []
  );

  // ====== PFP data ======
  const ALL_EYES: EyeItem[] = useMemo(() => {
    return [
      makeItem<EyeItem>("c-common-black", "/pfp/eyes/cartoon/common/cartoon-common-black.png", "Cartoon Common Black", "common", "cartoon"),
      makeItem<EyeItem>("c-common-blue", "/pfp/eyes/cartoon/common/cartoon-common-blue.png", "Cartoon Common Blue", "common", "cartoon"),
      makeItem<EyeItem>("c-common-green", "/pfp/eyes/cartoon/common/cartoon-common-green.png", "Cartoon Common Green", "common", "cartoon"),
      makeItem<EyeItem>("c-common-orange", "/pfp/eyes/cartoon/common/cartoon-common-orange.png", "Cartoon Common Orange", "common", "cartoon"),
      makeItem<EyeItem>("c-common-purple", "/pfp/eyes/cartoon/common/cartoon-common-purple.png", "Cartoon Common Purple", "common", "cartoon"),
      makeItem<EyeItem>("c-common-red", "/pfp/eyes/cartoon/common/cartoon-common-red.png", "Cartoon Common Red", "common", "cartoon"),

      makeItem<EyeItem>("c-rare-neon-black", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-black.png", "Cartoon Rare Neon Black", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-blue", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-blue.png", "Cartoon Rare Neon Blue", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-green", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-green.png", "Cartoon Rare Neon Green", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-orange", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-orange.png", "Cartoon Rare Neon Orange", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-purple", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-purple.png", "Cartoon Rare Neon Purple", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-red", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-red.png", "Cartoon Rare Neon Red", "rare", "cartoon"),

      makeItem<EyeItem>("c-leg-fire-red", "/pfp/eyes/cartoon/legendary/cartoon-legendary-fire-red.png", "Cartoon Legendary Fire (Red)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-fruity-orange", "/pfp/eyes/cartoon/legendary/cartoon-legendary-fruity-orange.png", "Cartoon Legendary Fruity (Orange)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-hearts-pink", "/pfp/eyes/cartoon/legendary/cartoon-legendary-hearts-pink.png", "Cartoon Legendary Hearts (Pink)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-ice-blue", "/pfp/eyes/cartoon/legendary/cartoon-legendary-ice-blue.png", "Cartoon Legendary Ice (Blue)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-poison-green", "/pfp/eyes/cartoon/legendary/cartoon-legendary-poison-green.png", "Cartoon Legendary Poison (Green)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-void-black", "/pfp/eyes/cartoon/legendary/cartoon-legendary-void-black.png", "Cartoon Legendary Void (Black)", "legendary", "cartoon"),

      makeItem<EyeItem>("p-common-black", "/pfp/eyes/pixel/common/pixel-common-black.png", "Pixel Common Black", "common", "pixel"),
      makeItem<EyeItem>("p-common-blue", "/pfp/eyes/pixel/common/pixel-common-blue.png", "Pixel Common Blue", "common", "pixel"),
      makeItem<EyeItem>("p-common-green", "/pfp/eyes/pixel/common/pixel-common-green.png", "Pixel Common Green", "common", "pixel"),
      makeItem<EyeItem>("p-common-orange", "/pfp/eyes/pixel/common/pixel-common-orange.png", "Pixel Common Orange", "common", "pixel"),
      makeItem<EyeItem>("p-common-pink", "/pfp/eyes/pixel/common/pixel-common-pink.png", "Pixel Common Pink", "common", "pixel"),
      makeItem<EyeItem>("p-common-purple", "/pfp/eyes/pixel/common/pixel-common-purple.png", "Pixel Common Purple", "common", "pixel"),

      makeItem<EyeItem>("p-rare-crystal-black", "/pfp/eyes/pixel/rare/pixel-rare-crystal-black.png", "Pixel Rare Crystal Black", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-blue", "/pfp/eyes/pixel/rare/pixel-rare-crystal-blue.png", "Pixel Rare Crystal Blue", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-green", "/pfp/eyes/pixel/rare/pixel-rare-crystal-green.png", "Pixel Rare Crystal Green", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-orange", "/pfp/eyes/pixel/rare/pixel-rare-crystal-orange.png", "Pixel Rare Crystal Orange", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-pink", "/pfp/eyes/pixel/rare/pixel-rare-crystal-pink.png", "Pixel Rare Crystal Pink", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-red", "/pfp/eyes/pixel/rare/pixel-rare-crystal-red.png", "Pixel Rare Crystal Red", "rare", "pixel"),

      makeItem<EyeItem>("p-leg-robot-black", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-black.png", "Pixel Legendary Robot Black", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-blue", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-blue.png", "Pixel Legendary Robot Blue", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-green", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-green.png", "Pixel Legendary Robot Green", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-orange", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-orange.png", "Pixel Legendary Robot Orange", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-pink", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-pink.png", "Pixel Legendary Robot Pink", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-yellow", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-yellow.png", "Pixel Legendary Robot Yellow", "legendary", "pixel"),
    ];
  }, []);

  const ALL_ACCESSORIES: AccessoryItem[] = useMemo(() => {
    const tall = (y: number, scale = 1) => ({
      cssTransform: `translateY(${y}px) scale(${scale})`,
      draw: { y, scale },
    });

    return [
      // ===== common =====
      makeItem<AccessoryItem>("a-c-common-bandaid", "/pfp/accessories/cartoon/common/cartoon-common-bandaid.png", "Bandage", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-baseballcap", "/pfp/accessories/cartoon/common/cartoon-common-baseballcap.png", "Baseball Cap", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-beanie", "/pfp/accessories/cartoon/common/cartoon-common-beanie.png", "Beanie", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-chain", "/pfp/accessories/cartoon/common/cartoon-common-chain.png", "Chain", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-coffeemug", "/pfp/accessories/cartoon/common/cartoon-common-coffeemug.png", "Coffee Mug", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-hoodiecollar", "/pfp/accessories/cartoon/common/cartoon-common-hoodiecollar.png", "Hoodie Collar", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-lanyardbadge", "/pfp/accessories/cartoon/common/cartoon-common-lanyardbadge.png", "Lanyard Badge", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-paperreceipt", "/pfp/accessories/cartoon/common/cartoon-common-paperreceipt.png", "Paper Receipt", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-simpleblackshades", "/pfp/accessories/cartoon/common/cartoon-common-simpleblackshades.png", "Shades", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-smallgoldhoopearing", "/pfp/accessories/cartoon/common/cartoon-common-smallgoldhoopearing.png", "Gold Hoop", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-common-headband", "/pfp/accessories/cartoon/common/cartoon-common-headband.png", "Headband", "common", "cartoon"),

      // ===== rare =====
      makeItem<AccessoryItem>("a-c-rare-icedchain", "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png", "Iced $MAD Chain", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-cowboyhat", "/pfp/accessories/cartoon/rare/cartoon-rare-cowboyhat.png", "Cowboy Hat", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-energydrink", "/pfp/accessories/cartoon/rare/cartoon-rare-energydrink.png", "Energy Drink", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-fierysunglasses", "/pfp/accessories/cartoon/rare/cartoon-rare-fierysunglasses.png", "Flame Shades", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-greencandle", "/pfp/accessories/cartoon/rare/cartoon-rare-greencandle.png", "Crypto Candle Badge", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-madmeter", "/pfp/accessories/cartoon/rare/cartoon-rare-madmeter.png", "$MAD Meter Pin", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-ragekeyboard", "/pfp/accessories/cartoon/rare/cartoon-rare-ragekeyboard.png", "Broken Keyboard Necklace", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-scarf", "/pfp/accessories/cartoon/rare/cartoon-rare-scarf.png", "Thick MAD Scarf", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-warningtape", "/pfp/accessories/cartoon/rare/cartoon-rare-warningtape.png", "Warning Tape", "rare", "cartoon"),

      // ✅ NEW rares you added
      makeItem<AccessoryItem>("a-c-rare-madsword", "/pfp/accessories/cartoon/rare/cartoon-rare-madsword.png", "MAD Sword", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-spatula", "/pfp/accessories/cartoon/rare/cartoon-rare-spatula.png", "Spatula", "rare", "cartoon"),

      // ===== legendary =====
      makeItem<AccessoryItem>("a-c-leg-cigar", "/pfp/accessories/cartoon/legendary/cartoon-legendary-cigar.png", "Cigar", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-crown", "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png", "Crown", "legendary", "cartoon", tall(18, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-fieryaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fieryaura.png", "Fiery Aura", "legendary", "cartoon", tall(22, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-fireaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fireaura.png", "Fire Aura", "legendary", "cartoon", tall(22, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-firegrills", "/pfp/accessories/cartoon/legendary/cartoon-legendary-firegrills.png", "Fire Grills", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-halo", "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png", "Halo", "legendary", "cartoon", tall(28, 0.95)),
      makeItem<AccessoryItem>("a-c-leg-jetpack", "/pfp/accessories/cartoon/legendary/cartoon-legendary-jetpack.png", "Jetpack", "legendary", "cartoon", tall(18, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-lightninghorns", "/pfp/accessories/cartoon/legendary/cartoon-legendary-lightninghorns.png", "Lightning Horns", "legendary", "cartoon", tall(24, 0.96)),
      makeItem<AccessoryItem>("a-c-leg-madchaininfinity", "/pfp/accessories/cartoon/legendary/cartoon-legendary-madchaininfinity.png", "Infinity Chain", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-moneybag", "/pfp/accessories/cartoon/legendary/cartoon-legendary-moneybag.png", "Money Bag", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-pinkgrill", "/pfp/accessories/cartoon/legendary/cartoon-legendary-pinkgrill.png", "Pink Grill", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-rugproofshield", "/pfp/accessories/cartoon/legendary/cartoon-legendary-rugproofshield.png", "Rugproof Shield", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-sash", "/pfp/accessories/cartoon/legendary/cartoon-legendary-sash.png", "Sash", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-void", "/pfp/accessories/cartoon/legendary/cartoon-legendary-void.png", "Void", "legendary", "cartoon", tall(20, 0.98)),

      // ✅ NEW legendary you added
      makeItem<AccessoryItem>("a-c-leg-madplush", "/pfp/accessories/cartoon/legendary/cartoon-legendary-madplush.png", "MAD Plush", "legendary", "cartoon"),
      makeItem<AccessoryItem>(
        "a-c-leg-halomadplush",
        "/pfp/accessories/cartoon/legendary/cartoon-legendary-halomadplush.png",
        "Pink Halo MAD Plush",
        "legendary",
        "cartoon",
        tall(26, 0.96)
      ),
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

  // ====== toggles ======
  const [showBase, setShowBase] = useState(true);
  const [showAcc, setShowAcc] = useState(true);

  // ====== safe initial picks ======
  const firstEye = ALL_EYES[0] ?? makeItem<EyeItem>("default-eye", "/pfp/eyes/eyes-01.png", "Eyes", "common", "cartoon");
  const firstAcc =
    ALL_ACCESSORIES[0] ?? makeItem<AccessoryItem>("default-acc", "/pfp/accessories/acc-01.png", "Accessory", "common", "cartoon");

  const [eyeSrc, setEyeSrc] = useState(firstEye.primary);
  const [eyeFallbacks, setEyeFallbacks] = useState<string[]>(firstEye.fallbacks);
  const [eyeLabel, setEyeLabel] = useState(`${firstEye.label} • ${firstEye.rarity.toUpperCase()}`);

  const [accSrc, setAccSrc] = useState(firstAcc.primary);
  const [accFallbacks, setAccFallbacks] = useState<string[]>(firstAcc.fallbacks);
  const [accLabel, setAccLabel] = useState(`${firstAcc.label} • ${firstAcc.rarity.toUpperCase()}`);

  const [forgeCount, setForgeCount] = useState(0);
  const [powerIndex, setPowerIndex] = useState(50);
  const [revealing, setRevealing] = useState(false);
  const [renderNonce, setRenderNonce] = useState(0);

  const selectedAcc = useMemo(() => ALL_ACCESSORIES.find((a) => a.primary === accSrc) ?? null, [ALL_ACCESSORIES, accSrc]);

  const forgeIdentity = () => {
    if (!ALL_EYES.length) return;

    setRevealing(true);
    setTimeout(() => {
      const pickEye = ALL_EYES[Math.floor(Math.random() * ALL_EYES.length)];
      setEyeSrc(pickEye.primary);
      setEyeFallbacks(pickEye.fallbacks);
      setEyeLabel(`${pickEye.label} • ${pickEye.rarity.toUpperCase()}`);

      if (ALL_ACCESSORIES.length) {
        const pickAcc = pickWeightedAccessory(ALL_ACCESSORIES);
        setAccSrc(pickAcc.primary);
        setAccFallbacks(pickAcc.fallbacks);
        setAccLabel(`${pickAcc.label} • ${pickAcc.rarity.toUpperCase()}`);
      }

      setForgeCount((v) => v + 1);
      setRenderNonce((n) => n + 1);
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  // ====== Token Stats ======
  const BURNED = 250_000_000; // ✅ updated
  const BURN_RATE = 23; // %
  const LOCKED = 111_000_000;
  const LOCK_UNTIL = "6/1/2026";

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <style jsx global>{`
        @keyframes madFloatUp {
          from {
            transform: translate3d(var(--drift), 20vh, 0) rotate(0deg);
          }
          to {
            transform: translate3d(calc(var(--drift) * -1), -140vh, 0) rotate(18deg);
          }
        }
        .mad-emoji {
          bottom: -30vh;
          animation-name: madFloatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 18px rgba(255, 0, 0, 0.18));
        }

        @keyframes forgePulse {
          0% {
            transform: scale(1);
            filter: saturate(1);
          }
          50% {
            transform: scale(1.02);
            filter: saturate(1.25);
          }
          100% {
            transform: scale(1);
            filter: saturate(1);
          }
        }

        /* 🔥 fire animations */
        @keyframes flameFlicker {
          0% {
            transform: translate3d(-6%, 2%, 0) scale(1);
            opacity: 0.65;
          }
          25% {
            transform: translate3d(4%, -2%, 0) scale(1.03);
            opacity: 0.78;
          }
          50% {
            transform: translate3d(-2%, -6%, 0) scale(1.06);
            opacity: 0.7;
          }
          75% {
            transform: translate3d(6%, 1%, 0) scale(1.02);
            opacity: 0.82;
          }
          100% {
            transform: translate3d(-6%, 2%, 0) scale(1);
            opacity: 0.65;
          }
        }
        @keyframes flameRise {
          0% {
            transform: translate3d(0, 18%, 0) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(0, -6%, 0) scale(1.05);
            opacity: 0.55;
          }
          100% {
            transform: translate3d(0, 18%, 0) scale(1);
            opacity: 0.35;
          }
        }

        /* 🧊 blue locked energy animations */
        @keyframes iceFlicker {
          0% {
            transform: translate3d(-5%, 2%, 0) scale(1);
            opacity: 0.62;
          }
          25% {
            transform: translate3d(4%, -2%, 0) scale(1.03);
            opacity: 0.78;
          }
          50% {
            transform: translate3d(-2%, -5%, 0) scale(1.06);
            opacity: 0.7;
          }
          75% {
            transform: translate3d(6%, 1%, 0) scale(1.02);
            opacity: 0.82;
          }
          100% {
            transform: translate3d(-5%, 2%, 0) scale(1);
            opacity: 0.62;
          }
        }
        @keyframes icePulse {
          0% {
            transform: translate3d(0, 14%, 0) scale(1);
            opacity: 0.32;
          }
          50% {
            transform: translate3d(0, -6%, 0) scale(1.06);
            opacity: 0.58;
          }
          100% {
            transform: translate3d(0, 14%, 0) scale(1);
            opacity: 0.32;
          }
        }
      `}</style>

      {/* ✅ RED CLOUD BACKGROUND */}
      <div className="fixed inset-0 -z-20">
        <img
          key={`bg-${renderNonce}`}
          src={bg.primary}
          alt="Red storm background"
          className="h-full w-full object-cover"
          onLoad={resetFallbackIndex}
          onError={(e) => cycleFallback(e, bg.fallbacks)}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* 😡 FLOATING BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {angry.map((a) => (
          <span
            key={a.i}
            className="mad-emoji absolute select-none"
            style={{
              left: `${a.x}%`,
              fontSize: `${a.size}px`,
              opacity: a.opacity,
              animationDuration: `${a.dur}s`,
              animationDelay: `${a.delay}s`,
              ["--drift" as any]: `${a.drift}px`,
            }}
          >
            😡
          </span>
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        {/* 1) DETAILS */}
        <section className="pt-20 pb-14 flex flex-col items-center text-center">
          <div className="rounded-2xl bg-white/10 p-4 border border-white/10 shadow-[0_0_80px_rgba(255,0,0,0.15)]">
            <Image src="/mad.png" alt="$MAD logo" width={140} height={140} priority />
          </div>

          <h1 className="mt-10 text-4xl sm:text-6xl font-black tracking-tight">
            $MAD <span className="text-white/80">— Digital emotion on Solana.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-white/70 leading-relaxed text-base sm:text-lg">
            $MAD is a digital emotion on Solana.
            <br />
            Forged by market cycles, born from volatility.
            <br />
            $HAPPY built us. $SAD tested us.
            <br />
            Now we move as $MAD 😡
            <br />
            A memecoin powered by community, chaos, and conviction.
          </p>

          <p className="mt-10 text-white/70 uppercase tracking-[0.35em] text-xs">Solana Contract</p>

          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
            <div className="max-w-[90vw] sm:max-w-[680px] rounded-2xl bg-white/10 border border-white/10 px-4 py-3 font-mono text-sm break-all">
              {addr}
            </div>
            <button onClick={copyCA} className={btnGhost}>
              {copied ? "✅ Copied" : "Copy CA"}
            </button>
          </div>

          {/* ✅ Only these 2 at the top */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={links.buy} target="_blank" rel="noreferrer" className={btnPrimary}>
              Buy on Jupiter
            </a>
            <a href={links.chart} target="_blank" rel="noreferrer" className={btnGhost}>
              View Chart
            </a>
          </div>
        </section>

        {/* 2) PFP GENERATOR */}
        <section className="py-16 w-full max-w-xl mx-auto text-center">
          <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Tool</p>
          <h3 className="mt-3 text-3xl sm:text-4xl font-black">$MAD PFP Generator</h3>
          <p className="mt-3 text-white/60">Free for the community. Forge a look that sticks.</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button className={btnGhost} onClick={() => setShowBase((v) => !v)}>
              {showBase ? "Hide Base" : "Show Base"}
            </button>
            <button className={btnGhost} onClick={() => setShowAcc((v) => !v)}>
              {showAcc ? "Hide Accessory" : "Show Accessory"}
            </button>
          </div>

          {/* ✅ PFP positions unchanged */}
          <div
            className="mt-8 relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full overflow-hidden"
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
              key={`eyes-${eyeSrc}-${renderNonce}`}
              src={eyeSrc}
              className="absolute inset-0 w-full h-full object-cover"
              alt="eyes"
              onLoad={resetFallbackIndex}
              onError={(e) => cycleFallback(e, eyeFallbacks)}
            />

            {showAcc && (
              <img
                key={`acc-${accSrc}-${renderNonce}`}
                src={accSrc}
                className="absolute inset-0 w-full h-full object-cover"
                alt="accessory"
                style={selectedAcc?.cssTransform ? { transform: selectedAcc.cssTransform } : undefined}
                onLoad={resetFallbackIndex}
                onError={(e) => cycleFallback(e, accFallbacks)}
              />
            )}
          </div>

          <div className="mt-4 text-xs text-white/60">{eyeLabel}</div>
          <div className="mt-1 text-xs text-white/50">{accLabel}</div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold">
              Forge Count: <span className="text-white">{forgeCount}</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold">
              Power Index: <span className="text-white">{powerIndex}</span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button className={btnPrimary} onClick={forgeIdentity}>
              Forge Identity
            </button>
          </div>

          <p className="mt-4 text-xs text-white/40">
            Eyes loaded: {ALL_EYES.length}. Accessories loaded: {ALL_ACCESSORIES.length}. Legendary accessories loaded:{" "}
            {ALL_ACCESSORIES.filter((a) => a.rarity === "legendary").length}.
          </p>
        </section>

        {/* 3) BURN + LOCK */}
        <section className="py-16 w-full">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 text-center overflow-hidden">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Token Status</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black">Burned & Locked</h2>
            <p className="mt-3 text-white/60">Simple stats for easy screenshots.</p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 text-left">
              {/* 🔥 Burned Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-6">
                <div className="absolute right-5 top-5 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-lg">🔥</div>

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 70%, rgba(255,120,0,.45), transparent 55%)," +
                      "radial-gradient(circle at 70% 70%, rgba(255,0,0,.35), transparent 60%)," +
                      "radial-gradient(circle at 50% 95%, rgba(255,200,0,.35), transparent 55%)",
                    filter: "blur(18px) saturate(1.2)",
                    animation: "flameFlicker 1.7s ease-in-out infinite",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at 50% 85%, rgba(255,160,0,.25), transparent 60%)",
                    filter: "blur(22px)",
                    animation: "flameRise 2.4s ease-in-out infinite",
                    mixBlendMode: "screen",
                  }}
                />

                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/50">Burned</p>
                  <div className="mt-2 text-3xl sm:text-4xl font-black tabular-nums">{BURNED.toLocaleString()}</div>
                  <p className="mt-2 text-white/70">
                    Burn rate: <span className="font-black text-white">{BURN_RATE}%</span>
                  </p>
                </div>
              </div>

              {/* 🔒 Locked Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-6">
                <div className="absolute right-5 top-5 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-lg">🔒</div>

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 70%, rgba(0,160,255,.40), transparent 55%)," +
                      "radial-gradient(circle at 70% 70%, rgba(0,90,255,.30), transparent 60%)," +
                      "radial-gradient(circle at 50% 95%, rgba(120,220,255,.28), transparent 55%)",
                    filter: "blur(18px) saturate(1.25)",
                    animation: "iceFlicker 1.8s ease-in-out infinite",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at 50% 85%, rgba(120,220,255,.22), transparent 60%)",
                    filter: "blur(22px)",
                    animation: "icePulse 2.6s ease-in-out infinite",
                    mixBlendMode: "screen",
                  }}
                />

                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/50">Locked</p>
                  <div className="mt-2 text-3xl sm:text-4xl font-black tabular-nums">{LOCKED.toLocaleString()}</div>
                  <p className="mt-2 text-white/70">
                    Locked until: <span className="font-black text-white">{LOCK_UNTIL}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4) ROADMAP */}
        <section className="py-16 w-full max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-black">Roadmap</h2>
            <p className="mt-3 text-white/60">Bond first. Then we climb.</p>
          </div>

          <div className="grid gap-5 text-left">
            {roadmap.map((item) => {
              const done = !!item.done;
              return (
                <div
                  key={item.phase + item.title}
                  className={[
                    "rounded-3xl border border-white/10 bg-white/5 p-6 transition",
                    done ? "opacity-70" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className={["text-xs uppercase tracking-[0.35em] text-white/50", done ? "line-through decoration-white/40" : ""].join(" ")}>
                      {item.phase}
                    </p>

                    {done && (
                      <span className="text-xs font-black text-white/60 border border-white/10 bg-white/10 px-3 py-1 rounded-full">
                        ✅ Completed
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-baseline gap-3">
                    <h3 className={["text-2xl sm:text-3xl font-black", done ? "line-through decoration-red-500/80" : ""].join(" ")}>
                      {item.title}
                    </h3>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <p className={["text-white/60 mt-2", done ? "line-through decoration-white/20" : ""].join(" ")}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5) MEME VAULT — SIDEWAYS SCROLL */}
        <section className="py-20 w-full">
          <div className="text-center mb-14">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Culture</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black">$MAD Meme Vault</h2>
            <p className="mt-3 text-white/60">Swipe the rage. Screenshot the best ones.</p>
          </div>

          {freshMemes.length === 0 ? (
            <div className="text-center text-white/60">No memes yet.</div>
          ) : (
            <div className="relative mx-auto w-full max-w-6xl">
              <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-red-500/10 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[0.35em] text-white/50">Swipe →</div>
                  <div className="text-xs text-white/40">({freshMemes.length} memes)</div>
                </div>

                <div
                  className={[
                    "flex gap-5 overflow-x-auto overflow-y-hidden pb-3",
                    "snap-x snap-mandatory",
                    "scroll-px-4",
                    "[scrollbar-width:thin]",
                  ].join(" ")}
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {freshMemes.map((m, idx) => (
                    <div
                      key={m.src}
                      className={[
                        "snap-start shrink-0",
                        "w-[85vw] sm:w-[520px] md:w-[560px] lg:w-[600px]",
                        "rounded-3xl border border-white/10 bg-black/40 p-4",
                        "transition hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs uppercase tracking-[0.35em] text-white/50">#{idx + 1}</div>
                        <div className="text-sm font-bold text-white/70">{m.tag}</div>
                      </div>

                      <img src={m.src} alt={m.tag} className="rounded-2xl w-full h-auto" loading="lazy" />

                      <div className="mt-3 text-xs text-white/40">Screenshot. Post. Tag $MAD.</div>
                    </div>
                  ))}
                </div>

                {/* edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black/35 to-transparent rounded-l-3xl" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black/35 to-transparent rounded-r-3xl" />
              </div>
            </div>
          )}
        </section>

        {/* 6) CONTACT / SOCIALS */}
        <section className="pb-20 w-full">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 text-center">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Contact</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black">Socials</h2>
            <p className="mt-3 text-white/60">Join the chaos. Bring conviction.</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={links.x} target="_blank" rel="noreferrer" className={btnWhite}>
                Join X Community
              </a>
              <a href={links.tg} target="_blank" rel="noreferrer" className={btnBlue}>
                Join Telegram
              </a>
              <a href={links.chart} target="_blank" rel="noreferrer" className={btnGhost}>
                View Chart
              </a>
              <a href={links.buy} target="_blank" rel="noreferrer" className={btnPrimary}>
                Buy on Jupiter
              </a>
            </div>

            <p className="mt-8 text-xs text-white/40">$MAD — Digital emotion. Not financial advice.</p>
          </div>
        </section>

        <footer className="py-10 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD. Built by the community.</footer>
      </div>
    </main>
  );
}
