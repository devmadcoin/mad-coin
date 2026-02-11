"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

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

type AccessoryItem = {
  id: string;
  primary: string;
  fallbacks: string[];
  label: string;
  rarity: Rarity;
  style: Style;
};

/**
 * Build a robust list of candidates for a given asset path.
 * This fixes:
 * - accidental ".png.png"
 * - accidental nested "public/public" folder
 * - cases where files are inside "/public/public/..." and you reference "/..."
 */
function buildCandidates(originalPath: string): string[] {
  const ensureLeadingSlash = (p: string) => (p.startsWith("/") ? p : `/${p}`);

  const raw = ensureLeadingSlash(originalPath);

  // Try these base prefixes because the repo screenshot shows /public/public/... happened.
  const prefixes = ["", "/public", "/public/public"];

  // For each prefix, create variants for png mistakes
  const out: string[] = [];

  const pushUnique = (p: string) => {
    const v = p.replace(/\/{2,}/g, "/");
    if (!out.includes(v)) out.push(v);
  };

  for (const pre of prefixes) {
    const p = `${pre}${raw}`.replace(/\/{2,}/g, "/");
    pushUnique(p);

    // If it's .png, try .png.png (upload mistake)
    if (p.endsWith(".png")) pushUnique(`${p}.png`);

    // If it's .png.png, try stripping to .png
    if (p.endsWith(".png.png")) pushUnique(p.replace(/\.png\.png$/, ".png"));
  }

  return out;
}

function makeItem<T extends { id: string; primary: string; fallbacks: string[]; label: string; rarity: Rarity; style: Style }>(
  id: string,
  path: string,
  label: string,
  rarity: Rarity,
  style: Style
): T {
  const candidates = buildCandidates(path);
  return {
    id,
    primary: candidates[0],
    fallbacks: candidates.slice(1),
    label,
    rarity,
    style,
  } as T;
}

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

/**
 * Cycles through multiple fallbacks (not just one).
 * Stores:
 * - data-fallbacks: JSON array of fallbacks
 * - data-fallback-index: current index
 */
function applyImgFallbackCycle(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbacks: string[]
) {
  const img = e.currentTarget;
  if (!fallbacks?.length) return;

  const currentIndex = Number(img.dataset.fallbackIndex || "0");
  if (currentIndex >= fallbacks.length) return; // exhausted

  img.dataset.fallbackIndex = String(currentIndex + 1);
  img.src = fallbacks[currentIndex];
}

async function loadImgWithFallbacks(primary: string, fallbacks: string[]) {
  const tryLoad = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.src = src;
    });

  try {
    return await tryLoad(primary);
  } catch {
    for (const f of fallbacks || []) {
      try {
        return await tryLoad(f);
      } catch {
        // keep going
      }
    }
    throw new Error(`Failed to load primary + all fallbacks: ${primary}`);
  }
}

export default function Home() {
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
      const el = document.createElement("textarea");
      el.value = addr;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const angry = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 9973) % 10000;
      const x = (seed % 1000) / 10;
      const size = 16 + (seed % 7) * 6;
      const dur = 14 + (seed % 12);
      const delay = seed % 10;
      const drift = ((seed % 9) - 4) * 10;
      const opacity = 0.1 + (seed % 7) * 0.04;
      return { i, x, size, dur, delay, drift, opacity };
    });
  }, []);

  const freshMemes = useMemo(
    () => [
      { src: "/mad-meme-01.png", tag: "Too Hot Coffee" },
      { src: "/mad-meme-02.png", tag: "Toilet Paper" },
      { src: "/mad-meme-03.png", tag: "Flight Delayed" },
      { src: "/mad-meme-04.png", tag: "Binge Watch Pain" },
      { src: "/mad-meme-05.png", tag: "Forgot Lunch" },
    ],
    []
  );

  const [rageIndex, setRageIndex] = useState<number>(847_291);
  const [myMad, setMyMad] = useState<number>(0);

  const leaderboard = useMemo(
    () => [
      { name: "guy who sold the bottom", score: 12921 },
      { name: "“I’ll buy the dip” (didn’t)", score: 9331 },
      { name: "trader w/ 99 indicators", score: 8420 },
      { name: "dev (reading replies)", score: 7777 },
      { name: "“it’s just a retrace”", score: 6969 },
      { name: "liquidity watcher", score: 5432 },
      { name: "KOL laughing rn", score: 4200 },
      { name: "“what’s the CA?” guy", score: 3001 },
      { name: "“is this a rug?” guy", score: 2222 },
      { name: "chart refresher", score: 1111 },
    ],
    []
  );

  useEffect(() => {
    try {
      const savedMy = localStorage.getItem("mad_myMad");
      const savedRage = localStorage.getItem("mad_rageIndex");
      if (savedMy) setMyMad(Number(savedMy) || 0);
      if (savedRage) setRageIndex(Number(savedRage) || 847_291);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mad_myMad", String(myMad));
      localStorage.setItem("mad_rageIndex", String(rageIndex));
    } catch {}
  }, [myMad, rageIndex]);

  const increaseMad = () => {
    const bump = 7 + ((rageIndex + myMad) % 19);
    setRageIndex((v) => v + bump);
    setMyMad((v) => v + 1);
  };

  const btnBase =
    "rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98]";
  const btnPrimary = `${btnBase} bg-red-500 hover:bg-red-600 text-white`;
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;
  const btnWhite = `${btnBase} bg-white text-black hover:opacity-90`;
  const btnBlue = `${btnBase} bg-blue-500 hover:bg-blue-600 text-white`;

  const roadmap = useMemo(
    () => [
      { phase: "Phase 1", title: "Bond", desc: "Establish the foundation. Lock in the vibe. Build the core.", done: true },
      { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes undeniable." },
      { phase: "Phase 3", title: "$10M", desc: "Scale the energy. More eyes. More memes. More movement." },
      { phase: "Phase 4", title: "$50M", desc: "Serious territory. The timeline feels it." },
      { phase: "Phase 5", title: "$100M", desc: "Full send. Legendary status. Digital emotion completed." },
    ],
    []
  );

  const ALL_EYES: EyeItem[] = useMemo(() => {
    return [
      // CARTOON / COMMON
      makeItem<EyeItem>("c-common-black", "/pfp/eyes/cartoon/common/cartoon-common-black.png", "Cartoon Common Black", "common", "cartoon"),
      makeItem<EyeItem>("c-common-blue", "/pfp/eyes/cartoon/common/cartoon-common-blue.png", "Cartoon Common Blue", "common", "cartoon"),
      makeItem<EyeItem>("c-common-green", "/pfp/eyes/cartoon/common/cartoon-common-green.png", "Cartoon Common Green", "common", "cartoon"),
      makeItem<EyeItem>("c-common-orange", "/pfp/eyes/cartoon/common/cartoon-common-orange.png", "Cartoon Common Orange", "common", "cartoon"),
      makeItem<EyeItem>("c-common-purple", "/pfp/eyes/cartoon/common/cartoon-common-purple.png", "Cartoon Common Purple", "common", "cartoon"),
      makeItem<EyeItem>("c-common-red", "/pfp/eyes/cartoon/common/cartoon-common-red.png", "Cartoon Common Red", "common", "cartoon"),

      // CARTOON / RARE
      makeItem<EyeItem>("c-rare-neon-black", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-black.png", "Cartoon Rare Neon Black", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-blue", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-blue.png", "Cartoon Rare Neon Blue", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-green", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-green.png", "Cartoon Rare Neon Green", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-orange", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-orange.png", "Cartoon Rare Neon Orange", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-purple", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-purple.png", "Cartoon Rare Neon Purple", "rare", "cartoon"),
      makeItem<EyeItem>("c-rare-neon-red", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-red.png", "Cartoon Rare Neon Red", "rare", "cartoon"),

      // CARTOON / LEGENDARY
      makeItem<EyeItem>("c-leg-fire-red", "/pfp/eyes/cartoon/legendary/cartoon-legendary-fire-red.png", "Cartoon Legendary Fire (Red)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-fruity-orange", "/pfp/eyes/cartoon/legendary/cartoon-legendary-fruity-orange.png", "Cartoon Legendary Fruity (Orange)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-hearts-pink", "/pfp/eyes/cartoon/legendary/cartoon-legendary-hearts-pink.png", "Cartoon Legendary Hearts (Pink)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-ice-blue", "/pfp/eyes/cartoon/legendary/cartoon-legendary-ice-blue.png", "Cartoon Legendary Ice (Blue)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-poison-green", "/pfp/eyes/cartoon/legendary/cartoon-legendary-poison-green.png", "Cartoon Legendary Poison (Green)", "legendary", "cartoon"),
      makeItem<EyeItem>("c-leg-void-black", "/pfp/eyes/cartoon/legendary/cartoon-legendary-void-black.png", "Cartoon Legendary Void (Black)", "legendary", "cartoon"),

      // PIXEL / COMMON
      makeItem<EyeItem>("p-common-black", "/pfp/eyes/pixel/common/pixel-common-black.png", "Pixel Common Black", "common", "pixel"),
      makeItem<EyeItem>("p-common-blue", "/pfp/eyes/pixel/common/pixel-common-blue.png", "Pixel Common Blue", "common", "pixel"),
      makeItem<EyeItem>("p-common-green", "/pfp/eyes/pixel/common/pixel-common-green.png", "Pixel Common Green", "common", "pixel"),
      makeItem<EyeItem>("p-common-orange", "/pfp/eyes/pixel/common/pixel-common-orange.png", "Pixel Common Orange", "common", "pixel"),
      makeItem<EyeItem>("p-common-pink", "/pfp/eyes/pixel/common/pixel-common-pink.png", "Pixel Common Pink", "common", "pixel"),
      makeItem<EyeItem>("p-common-purple", "/pfp/eyes/pixel/common/pixel-common-purple.png", "Pixel Common Purple", "common", "pixel"),

      // PIXEL / RARE
      makeItem<EyeItem>("p-rare-crystal-black", "/pfp/eyes/pixel/rare/pixel-rare-crystal-black.png", "Pixel Rare Crystal Black", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-blue", "/pfp/eyes/pixel/rare/pixel-rare-crystal-blue.png", "Pixel Rare Crystal Blue", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-green", "/pfp/eyes/pixel/rare/pixel-rare-crystal-green.png", "Pixel Rare Crystal Green", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-orange", "/pfp/eyes/pixel/rare/pixel-rare-crystal-orange.png", "Pixel Rare Crystal Orange", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-pink", "/pfp/eyes/pixel/rare/pixel-rare-crystal-pink.png", "Pixel Rare Crystal Pink", "rare", "pixel"),
      makeItem<EyeItem>("p-rare-crystal-red", "/pfp/eyes/pixel/rare/pixel-rare-crystal-red.png", "Pixel Rare Crystal Red", "rare", "pixel"),

      // PIXEL / LEGENDARY
      makeItem<EyeItem>("p-leg-robot-black", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-black.png", "Pixel Legendary Robot Black", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-blue", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-blue.png", "Pixel Legendary Robot Blue", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-green", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-green.png", "Pixel Legendary Robot Green", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-orange", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-orange.png", "Pixel Legendary Robot Orange", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-pink", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-pink.png", "Pixel Legendary Robot Pink", "legendary", "pixel"),
      makeItem<EyeItem>("p-leg-robot-yellow", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-yellow.png", "Pixel Legendary Robot Yellow", "legendary", "pixel"),
    ];
  }, []);

  const ALL_ACCESSORIES: AccessoryItem[] = useMemo(() => {
    return [
      // CARTOON / COMMON
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

      // CARTOON / RARE
      makeItem<AccessoryItem>("a-c-rare-icedchain", "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png", "Iced $MAD Chain", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-cowboyhat", "/pfp/accessories/cartoon/rare/cartoon-rare-cowboyhat.png", "Cowboy Hat", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-energydrink", "/pfp/accessories/cartoon/rare/cartoon-rare-energydrink.png", "Energy Drink", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-fierysunglasses", "/pfp/accessories/cartoon/rare/cartoon-rare-fierysunglasses.png", "Flame Shades", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-greencandle", "/pfp/accessories/cartoon/rare/cartoon-rare-greencandle.png", "Crypto Candle Badge", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-madmeter", "/pfp/accessories/cartoon/rare/cartoon-rare-madmeter.png", "$MAD Meter Pin", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-ragekeyboard", "/pfp/accessories/cartoon/rare/cartoon-rare-ragekeyboard.png", "Broken Keyboard Necklace", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-scarf", "/pfp/accessories/cartoon/rare/cartoon-rare-scarf.png", "Thick MAD Scarf", "rare", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-warningtape", "/pfp/accessories/cartoon/rare/cartoon-rare-warningtape.png", "Warning Tape", "rare", "cartoon"),

      // CARTOON / LEGENDARY (your official filenames)
      makeItem<AccessoryItem>("a-c-leg-cigar", "/pfp/accessories/cartoon/legendary/cartoon-legendary-cigar.png", "Flaming Cigar", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-crown", "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png", "Crown", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-fieryaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fieryaura.png", "Fiery Aura", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-fireaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fireaura.png", "Fire Aura Ring", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-firegrills", "/pfp/accessories/cartoon/legendary/cartoon-legendary-firegrills.png", "Fire Grills", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-halo", "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png", "Halo", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-jetpack", "/pfp/accessories/cartoon/legendary/cartoon-legendary-jetpack.png", "Jetpack Strap", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-lightninghorns", "/pfp/accessories/cartoon/legendary/cartoon-legendary-lightninghorns.png", "Lightning Horns", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-madchaininfinity", "/pfp/accessories/cartoon/legendary/cartoon-legendary-madchaininfinity.png", "Infinity Chain", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-moneybag", "/pfp/accessories/cartoon/legendary/cartoon-legendary-moneybag.png", "Bag of $MAD", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-pinkgrill", "/pfp/accessories/cartoon/legendary/cartoon-legendary-pinkgrill.png", "Pink Grill", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-rugproofshield", "/pfp/accessories/cartoon/legendary/cartoon-legendary-rugproofshield.png", "RUG PROOF Shield", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-sash", "/pfp/accessories/cartoon/legendary/cartoon-legendary-sash.png", "CEO OF MAD Sash", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-void", "/pfp/accessories/cartoon/legendary/cartoon-legendary-void.png", "Void Shades", "legendary", "cartoon"),
    ];
  }, []);

  const BASE = useMemo(() => makeItem<{ id: string; primary: string; fallbacks: string[]; label: string; rarity: Rarity; style: Style }>(
    "base",
    "/pfp/base/base-01.png",
    "Base",
    "common",
    "cartoon"
  ), []);

  const MOUTH = useMemo(() => makeItem<{ id: string; primary: string; fallbacks: string[]; label: string; rarity: Rarity; style: Style }>(
    "mouth",
    "/pfp/mouth/mouth-01.png",
    "Mouth",
    "common",
    "cartoon"
  ), []);

  const bg = useMemo(() => {
    const candidates = buildCandidates("/pfp/bg/bg-redclouds.png");
    return { primary: candidates[0], fallbacks: candidates.slice(1) };
  }, []);

  const [showBase, setShowBase] = useState(true);
  const [showMouth, setShowMouth] = useState(true);
  const [showAcc, setShowAcc] = useState(true);

  const firstEye = ALL_EYES[0];
  const firstAcc = ALL_ACCESSORIES[0];

  const [eyeSrc, setEyeSrc] = useState(firstEye?.primary ?? "/pfp/eyes/eyes-01.png");
  const [eyeFallbacks, setEyeFallbacks] = useState<string[]>(firstEye?.fallbacks ?? buildCandidates("/pfp/eyes/eyes-01.png").slice(1));
  const [eyeLabel, setEyeLabel] = useState(`${firstEye?.label ?? "Eyes"} • ${(firstEye?.rarity ?? "common").toUpperCase()}`);

  const [accSrc, setAccSrc] = useState(firstAcc?.primary ?? "/pfp/accessories/acc-01.png");
  const [accFallbacks, setAccFallbacks] = useState<string[]>(firstAcc?.fallbacks ?? buildCandidates("/pfp/accessories/acc-01.png").slice(1));
  const [accLabel, setAccLabel] = useState(`${firstAcc?.label ?? "Accessory"} • ${(firstAcc?.rarity ?? "common").toUpperCase()}`);

  const [forgeCount, setForgeCount] = useState<number>(0);
  const [powerIndex, setPowerIndex] = useState<number>(50);
  const [revealing, setRevealing] = useState<boolean>(false);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

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
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  const downloadPNG = async () => {
    try {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const eyesImg = await loadImgWithFallbacks(eyeSrc, eyeFallbacks);

      const accImg = await (showAcc
        ? loadImgWithFallbacks(accSrc, accFallbacks)
        : Promise.resolve<HTMLImageElement | null>(null));

      const [baseImg, mouthImg] = await Promise.all([
        showBase ? loadImgWithFallbacks(BASE.primary, BASE.fallbacks) : Promise.resolve<HTMLImageElement | null>(null),
        showMouth ? loadImgWithFallbacks(MOUTH.primary, MOUTH.fallbacks) : Promise.resolve<HTMLImageElement | null>(null),
      ]);

      ctx.clearRect(0, 0, size, size);

      if (showBase && baseImg) ctx.drawImage(baseImg, 0, 0, size, size);
      ctx.drawImage(eyesImg, 0, 0, size, size);
      if (showMouth && mouthImg) ctx.drawImage(mouthImg, 0, 0, size, size);
      if (showAcc && accImg) ctx.drawImage(accImg, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);

        const a = downloadLinkRef.current || document.createElement("a");
        a.href = url;
        a.download = `$MAD-pfp-${Date.now()}.png`;

        if (!downloadLinkRef.current) document.body.appendChild(a);
        a.click();
        if (!downloadLinkRef.current) a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }, "image/png");
    } catch (e) {
      console.error(e);
      alert("Download failed — at least one image path is missing or moved.");
    }
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <style jsx global>{`
        @keyframes madFloatUp {
          from { transform: translate3d(var(--drift), 20vh, 0) rotate(0deg); }
          to { transform: translate3d(calc(var(--drift) * -1), -140vh, 0) rotate(18deg); }
        }
        .mad-emoji {
          bottom: -30vh;
          animation-name: madFloatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 18px rgba(255, 0, 0, 0.18));
        }
        @keyframes madWiggle {
          0% { transform: translateY(0); }
          30% { transform: translateY(-1px); }
          60% { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
        @keyframes forgePulse {
          0% { transform: scale(1); filter: saturate(1); }
          50% { transform: scale(1.02); filter: saturate(1.25); }
          100% { transform: scale(1); filter: saturate(1); }
        }
      `}</style>

      {/* BG */}
      <div className="fixed inset-0 -z-20">
        <img
          src={bg.primary}
          alt="Red storm background"
          className="h-full w-full object-cover"
          onError={(e) => applyImgFallbackCycle(e, bg.fallbacks)}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* FLOATING */}
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
        <section className="min-h-screen flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-white/10 p-4 border border-white/10 shadow-[0_0_80px_rgba(255,0,0,0.15)]">
            <Image src="/mad.png" alt="$MAD logo" width={140} height={140} priority />
          </div>

          <h1 className="mt-8 text-5xl sm:text-6xl font-black tracking-tight">
            BTC: <span className="text-white">Digital gold.</span>
          </h1>
          <h2 className="mt-3 text-5xl sm:text-6xl font-black text-red-500">$MAD: Digital emotion.</h2>

          <p className="mt-8 text-white/70 uppercase tracking-[0.35em] text-xs">Solana Contract</p>

          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
            <div className="max-w-[90vw] sm:max-w-[680px] rounded-2xl bg-white/10 border border-white/10 px-4 py-3 font-mono text-sm break-all">
              {addr}
            </div>
            <button onClick={copyCA} className="rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98] bg-white/10 hover:bg-white/15 text-white">
              {copied ? "✅ Copied" : "Copy CA"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={links.buy} target="_blank" rel="noreferrer" className="rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98] bg-red-500 hover:bg-red-600 text-white">
              Buy on Jupiter
            </a>
            <a href={links.chart} target="_blank" rel="noreferrer" className="rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98] bg-white/10 hover:bg-white/15 text-white">
              View Chart
            </a>
            <a href={links.x} target="_blank" rel="noreferrer" className="rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98] bg-white text-black hover:opacity-90">
              Join X Community
            </a>
            <a href={links.tg} target="_blank" rel="noreferrer" className="rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98] bg-blue-500 hover:bg-blue-600 text-white">
              Join Telegram
            </a>
          </div>

          {/* PFP GENERATOR */}
          <section className="mt-14 w-full max-w-xl mx-auto text-center">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Tool</p>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black">$MAD PFP Generator</h3>
            <p className="mt-3 text-white/60">Free for the community. Forge a look that sticks.</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button className={btnGhost} onClick={() => setShowBase((v) => !v)}>
                {showBase ? "Hide Base" : "Show Base"}
              </button>
              <button className={btnGhost} onClick={() => setShowMouth((v) => !v)}>
                {showMouth ? "Hide Mouth" : "Show Mouth"}
              </button>
              <button className={btnGhost} onClick={() => setShowAcc((v) => !v)}>
                {showAcc ? "Hide Accessory" : "Show Accessory"}
              </button>
            </div>

            <div
              className="mt-8 relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full overflow-hidden border-4 border-red-500/80 shadow-[0_0_50px_rgba(255,0,0,0.35)]"
              style={revealing ? { animation: "forgePulse 0.55s ease-in-out" } : undefined}
            >
              {showBase && (
                <img
                  src={BASE.primary}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="base"
                  onError={(e) => applyImgFallbackCycle(e, BASE.fallbacks)}
                />
              )}

              <img
                src={eyeSrc}
                className="absolute inset-0 w-full h-full object-cover"
                alt="eyes"
                onError={(e) => applyImgFallbackCycle(e, eyeFallbacks)}
              />

              {showMouth && (
                <img
                  src={MOUTH.primary}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="mouth"
                  onError={(e) => applyImgFallbackCycle(e, MOUTH.fallbacks)}
                />
              )}

              {showAcc && (
                <img
                  src={accSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="accessory"
                  onError={(e) => applyImgFallbackCycle(e, accFallbacks)}
                />
              )}
            </div>

            <div className="mt-4 text-xs text-white/60">{eyeLabel}</div>
            <div className="mt-1 text-xs text-white/50">{accLabel}</div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button className={btnPrimary} onClick={forgeIdentity}>
                Forge Identity
              </button>
              <button className={btnWhite} onClick={downloadPNG}>
                Download PNG
              </button>
              <a ref={downloadLinkRef} className="hidden" />
            </div>

            <p className="mt-4 text-xs text-white/40">
              Eyes loaded: {ALL_EYES.length}. Accessories loaded: {ALL_ACCESSORIES.length}.
            </p>
          </section>

          {/* keep your other sections below as-is */}
        </section>
      </div>
    </main>
  );
}

