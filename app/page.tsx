"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Rarity = "common" | "rare" | "legendary";
type Style = "cartoon" | "pixel";

type EyeItem = {
  id: string;
  primary: string;
  fallback?: string;
  label: string;
  rarity: Rarity;
  style: Style;
};

type AccessoryItem = {
  id: string;
  primary: string;
  fallback?: string;
  label: string;
  rarity: Rarity;
  style: Style;
};

function normalizePath(p: string) {
  if (!p) return p;
  if (p.startsWith("/")) return p;
  return `/${p}`;
}

/**
 * Handles accidental ".png.png" or missing extension mismatches.
 * - if path ends with ".png.png" => fallback to ".png"
 * - if path ends with ".png" => fallback to ".png.png"
 */
function withOptionalDoublePng(path: string) {
  const p = normalizePath(path);

  if (p.endsWith(".png.png")) {
    return { primary: p, fallback: p.replace(/\.png\.png$/, ".png") };
  }
  if (p.endsWith(".png")) {
    return { primary: p, fallback: `${p}.png` };
  }
  return { primary: p, fallback: undefined as string | undefined };
}

/** Preload helper for download */
function loadImg(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

/** Try primary then fallback */
async function loadImgWithFallback(primary: string, fallback?: string) {
  try {
    return await loadImg(primary);
  } catch {
    if (!fallback) throw new Error(`Failed to load primary and no fallback: ${primary}`);
    return await loadImg(fallback);
  }
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
  let pool: AccessoryItem[];

  if (roll < 0.75) pool = safeCommons;
  else if (roll < 0.95) pool = safeRares;
  else pool = safeLegs;

  return pool[Math.floor(Math.random() * pool.length)];
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
  const bg = useMemo(() => withOptionalDoublePng("/pfp/bg/bg-redclouds.png"), []);

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

  // ====== Meme Vault (keep your existing list) ======
  const freshMemes = useMemo(
    () => [{ src: "/mad-meme-01.png", tag: "Too Hot Coffee" }],
    []
  );

  // ====== MAD COUNTER ======
  const [rageIndex, setRageIndex] = useState<number>(847_291);
  const [myMad, setMyMad] = useState<number>(0);

  const increaseMad = () => {
    setRageIndex((v) => v + 1);
    setMyMad((v) => v + 1);
  };

  const leaderboard = useMemo(
    () => [
      { name: "PaperHandsPete", score: 9021 },
      { name: "RugProofRita", score: 8501 },
      { name: "DipBuyerDan", score: 7777 },
      { name: "GasFeeGary", score: 6666 },
      { name: "FOMOFranny", score: 5555 },
    ],
    []
  );

  // ====== Roadmap ======
  const roadmap = useMemo(
    () => [
      {
        phase: "Phase 1",
        title: "Bond",
        desc: "Establish the foundation. Lock in the vibe. Build the core.",
        done: true,
      },
      { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes undeniable." },
      { phase: "Phase 3", title: "$10M", desc: "Scale the energy. More eyes. More memes. More movement." },
      { phase: "Phase 4", title: "$50M", desc: "Serious territory. The timeline feels it." },
    ],
    []
  );

  // ====== PFP data ======
  const ALL_EYES: EyeItem[] = useMemo(() => {
    const add = (id: string, path: string, label: string, rarity: Rarity, style: Style): EyeItem => {
      const { primary, fallback } = withOptionalDoublePng(path);
      return { id, primary, fallback, label, rarity, style };
    };

    return [
      // CARTOON / COMMON
      add("c-common-black", "/pfp/eyes/cartoon/common/cartoon-common-black.png", "Cartoon Common Black", "common", "cartoon"),
      add("c-common-blue", "/pfp/eyes/cartoon/common/cartoon-common-blue.png", "Cartoon Common Blue", "common", "cartoon"),
      add("c-common-green", "/pfp/eyes/cartoon/common/cartoon-common-green.png", "Cartoon Common Green", "common", "cartoon"),
      add("c-common-orange", "/pfp/eyes/cartoon/common/cartoon-common-orange.png", "Cartoon Common Orange", "common", "cartoon"),
      add("c-common-purple", "/pfp/eyes/cartoon/common/cartoon-common-purple.png", "Cartoon Common Purple", "common", "cartoon"),
      add("c-common-red", "/pfp/eyes/cartoon/common/cartoon-common-red.png", "Cartoon Common Red", "common", "cartoon"),

      // CARTOON / RARE
      add("c-rare-neon-black", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-black.png", "Cartoon Rare Neon Black", "rare", "cartoon"),
      add("c-rare-neon-blue", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-blue.png", "Cartoon Rare Neon Blue", "rare", "cartoon"),
      add("c-rare-neon-green", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-green.png", "Cartoon Rare Neon Green", "rare", "cartoon"),
      add("c-rare-neon-orange", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-orange.png", "Cartoon Rare Neon Orange", "rare", "cartoon"),
      add("c-rare-neon-purple", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-purple.png", "Cartoon Rare Neon Purple", "rare", "cartoon"),
      add("c-rare-neon-red", "/pfp/eyes/cartoon/rare/cartoon-rare-neon-red.png", "Cartoon Rare Neon Red", "rare", "cartoon"),

      // CARTOON / LEGENDARY
      add("c-leg-fire-red", "/pfp/eyes/cartoon/legendary/cartoon-legendary-fire-red.png", "Cartoon Legendary Fire (Red)", "legendary", "cartoon"),
      add("c-leg-fruity-orange", "/pfp/eyes/cartoon/legendary/cartoon-legendary-fruity-orange.png", "Cartoon Legendary Fruity (Orange)", "legendary", "cartoon"),
      add("c-leg-hearts-pink", "/pfp/eyes/cartoon/legendary/cartoon-legendary-hearts-pink.png", "Cartoon Legendary Hearts (Pink)", "legendary", "cartoon"),
      add("c-leg-ice-blue", "/pfp/eyes/cartoon/legendary/cartoon-legendary-ice-blue.png", "Cartoon Legendary Ice (Blue)", "legendary", "cartoon"),
      add("c-leg-poison-green", "/pfp/eyes/cartoon/legendary/cartoon-legendary-poison-green.png", "Cartoon Legendary Poison (Green)", "legendary", "cartoon"),
      add("c-leg-void-black", "/pfp/eyes/cartoon/legendary/cartoon-legendary-void-black.png", "Cartoon Legendary Void (Black)", "legendary", "cartoon"),

      // PIXEL / COMMON
      add("p-common-black", "/pfp/eyes/pixel/common/pixel-common-black.png", "Pixel Common Black", "common", "pixel"),
      add("p-common-blue", "/pfp/eyes/pixel/common/pixel-common-blue.png", "Pixel Common Blue", "common", "pixel"),
      add("p-common-green", "/pfp/eyes/pixel/common/pixel-common-green.png", "Pixel Common Green", "common", "pixel"),
      add("p-common-orange", "/pfp/eyes/pixel/common/pixel-common-orange.png", "Pixel Common Orange", "common", "pixel"),
      add("p-common-pink", "/pfp/eyes/pixel/common/pixel-common-pink.png", "Pixel Common Pink", "common", "pixel"),
      add("p-common-purple", "/pfp/eyes/pixel/common/pixel-common-purple.png", "Pixel Common Purple", "common", "pixel"),

      // PIXEL / RARE
      add("p-rare-crystal-black", "/pfp/eyes/pixel/rare/pixel-rare-crystal-black.png", "Pixel Rare Crystal Black", "rare", "pixel"),
      add("p-rare-crystal-blue", "/pfp/eyes/pixel/rare/pixel-rare-crystal-blue.png", "Pixel Rare Crystal Blue", "rare", "pixel"),
      add("p-rare-crystal-green", "/pfp/eyes/pixel/rare/pixel-rare-crystal-green.png", "Pixel Rare Crystal Green", "rare", "pixel"),
      add("p-rare-crystal-orange", "/pfp/eyes/pixel/rare/pixel-rare-crystal-orange.png", "Pixel Rare Crystal Orange", "rare", "pixel"),
      add("p-rare-crystal-pink", "/pfp/eyes/pixel/rare/pixel-rare-crystal-pink.png", "Pixel Rare Crystal Pink", "rare", "pixel"),
      add("p-rare-crystal-red", "/pfp/eyes/pixel/rare/pixel-rare-crystal-red.png", "Pixel Rare Crystal Red", "rare", "pixel"),

      // PIXEL / LEGENDARY
      add("p-leg-robot-black", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-black.png", "Pixel Legendary Robot Black", "legendary", "pixel"),
      add("p-leg-robot-blue", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-blue.png", "Pixel Legendary Robot Blue", "legendary", "pixel"),
      add("p-leg-robot-green", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-green.png", "Pixel Legendary Robot Green", "legendary", "pixel"),
      add("p-leg-robot-orange", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-orange.png", "Pixel Legendary Robot Orange", "legendary", "pixel"),
      add("p-leg-robot-pink", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-pink.png", "Pixel Legendary Robot Pink", "legendary", "pixel"),
      add("p-leg-robot-yellow", "/pfp/eyes/pixel/legendary/pixel-legendary-robot-yellow.png", "Pixel Legendary Robot Yellow", "legendary", "pixel"),
    ];
  }, []);

  const ALL_ACCESSORIES: AccessoryItem[] = useMemo(() => {
    const add = (id: string, path: string, label: string, rarity: Rarity, style: Style): AccessoryItem => {
      const { primary, fallback } = withOptionalDoublePng(path);
      return { id, primary, fallback, label, rarity, style };
    };

    return [
      // CARTOON / COMMON
      add("a-c-common-bandaid", "/pfp/accessories/cartoon/common/cartoon-common-bandaid.png", "Bandage", "common", "cartoon"),
      add("a-c-common-baseballcap", "/pfp/accessories/cartoon/common/cartoon-common-baseballcap.png", "Baseball Cap", "common", "cartoon"),
      add("a-c-common-beanie", "/pfp/accessories/cartoon/common/cartoon-common-beanie.png", "Beanie", "common", "cartoon"),
      add("a-c-common-chain", "/pfp/accessories/cartoon/common/cartoon-common-chain.png", "Chain", "common", "cartoon"),
      add("a-c-common-coffeemug", "/pfp/accessories/cartoon/common/cartoon-common-coffeemug.png", "Coffee Mug", "common", "cartoon"),
      add("a-c-common-hoodiecollar", "/pfp/accessories/cartoon/common/cartoon-common-hoodiecollar.png", "Hoodie Collar", "common", "cartoon"),
      add("a-c-common-lanyardbadge", "/pfp/accessories/cartoon/common/cartoon-common-lanyardbadge.png", "Lanyard Badge", "common", "cartoon"),
      add("a-c-common-paperreceipt", "/pfp/accessories/cartoon/common/cartoon-common-paperreceipt.png", "Paper Receipt", "common", "cartoon"),
      add("a-c-common-simpleblackshades", "/pfp/accessories/cartoon/common/cartoon-common-simpleblackshades.png", "Shades", "common", "cartoon"),
      add("a-c-common-smallgoldhoopearing", "/pfp/accessories/cartoon/common/cartoon-common-smallgoldhoopearing.png", "Gold Hoop", "common", "cartoon"),
      add("a-c-common-headband", "/pfp/accessories/cartoon/common/cartoon-common-headband.png", "Headband", "common", "cartoon"),

      // CARTOON / RARE
      add("a-c-rare-icedchain", "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png", "Iced $MAD Chain", "rare", "cartoon"),
      add("a-c-rare-cowboyhat", "/pfp/accessories/cartoon/rare/cartoon-rare-cowboyhat.png", "Cowboy Hat", "rare", "cartoon"),
      add("a-c-rare-energydrink", "/pfp/accessories/cartoon/rare/cartoon-rare-energydrink.png", "Energy Drink", "rare", "cartoon"),
      add("a-c-rare-fierysunglasses", "/pfp/accessories/cartoon/rare/cartoon-rare-fierysunglasses.png", "Flame Shades", "rare", "cartoon"),
      add("a-c-rare-greencandle", "/pfp/accessories/cartoon/rare/cartoon-rare-greencandle.png", "Crypto Candle Badge", "rare", "cartoon"),
      add("a-c-rare-madmeter", "/pfp/accessories/cartoon/rare/cartoon-rare-madmeter.png", "$MAD Meter Pin", "rare", "cartoon"),
      add("a-c-rare-ragekeyboard", "/pfp/accessories/cartoon/rare/cartoon-rare-ragekeyboard.png", "Broken Keyboard Necklace", "rare", "cartoon"),
      add("a-c-rare-scarf", "/pfp/accessories/cartoon/rare/cartoon-rare-scarf.png", "Thick MAD Scarf", "rare", "cartoon"),
      add("a-c-rare-warningtape", "/pfp/accessories/cartoon/rare/cartoon-rare-warningtape.png", "Warning Tape", "rare", "cartoon"),

      // CARTOON / LEGENDARY (your exact filenames)
      add("a-c-leg-cigar", "/pfp/accessories/cartoon/legendary/cartoon-legendary-cigar.png", "Cigar", "legendary", "cartoon"),
      add("a-c-leg-crown", "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png", "Crown", "legendary", "cartoon"),
      add("a-c-leg-fieryaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fieryaura.png", "Fiery Aura", "legendary", "cartoon"),
      add("a-c-leg-fireaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fireaura.png", "Fire Aura", "legendary", "cartoon"),
      add("a-c-leg-firegrills", "/pfp/accessories/cartoon/legendary/cartoon-legendary-firegrills.png", "Fire Grills", "legendary", "cartoon"),
      add("a-c-leg-halo", "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png", "Halo", "legendary", "cartoon"),
      add("a-c-leg-jetpack", "/pfp/accessories/cartoon/legendary/cartoon-legendary-jetpack.png", "Jetpack", "legendary", "cartoon"),
      add("a-c-leg-lightninghorns", "/pfp/accessories/cartoon/legendary/cartoon-legendary-lightninghorns.png", "Lightning Horns", "legendary", "cartoon"),
      add("a-c-leg-madchaininfinity", "/pfp/accessories/cartoon/legendary/cartoon-legendary-madchaininfinity.png", "Infinity Chain", "legendary", "cartoon"),
      add("a-c-leg-moneybag", "/pfp/accessories/cartoon/legendary/cartoon-legendary-moneybag.png", "Money Bag", "legendary", "cartoon"),
      add("a-c-leg-pinkgrill", "/pfp/accessories/cartoon/legendary/cartoon-legendary-pinkgrill.png", "Pink Grill", "legendary", "cartoon"),
      add("a-c-leg-rugproofshield", "/pfp/accessories/cartoon/legendary/cartoon-legendary-rugproofshield.png", "Rugproof Shield", "legendary", "cartoon"),
      add("a-c-leg-sash", "/pfp/accessories/cartoon/legendary/cartoon-legendary-sash.png", "Sash", "legendary", "cartoon"),
      add("a-c-leg-void", "/pfp/accessories/cartoon/legendary/cartoon-legendary-void.png", "Void", "legendary", "cartoon"),
    ];
  }, []);

  const BASE = useMemo(() => withOptionalDoublePng("/pfp/base/base-01.png"), []);
  const MOUTH = useMemo(() => withOptionalDoublePng("/pfp/mouth/mouth-01.png"), []);

  // ====== toggles ======
  const [showBase, setShowBase] = useState(true);
  const [showMouth, setShowMouth] = useState(true);
  const [showAcc, setShowAcc] = useState(true);

  // ====== safe initial picks ======
  const firstEye = ALL_EYES[0] ?? {
    id: "default-eye",
    primary: "/pfp/eyes/eyes-01.png",
    fallback: undefined,
    label: "Eyes",
    rarity: "common" as Rarity,
    style: "cartoon" as Style,
  };

  const firstAcc = ALL_ACCESSORIES[0] ?? {
    id: "default-acc",
    primary: "/pfp/accessories/acc-01.png",
    fallback: undefined,
    label: "Accessory",
    rarity: "common" as Rarity,
    style: "cartoon" as Style,
  };

  const [eyeSrc, setEyeSrc] = useState(firstEye.primary);
  const [eyeFallback, setEyeFallback] = useState<string | undefined>(firstEye.fallback);
  const [eyeLabel, setEyeLabel] = useState(`${firstEye.label} • ${firstEye.rarity.toUpperCase()}`);

  const [accSrc, setAccSrc] = useState(firstAcc.primary);
  const [accFallback, setAccFallback] = useState<string | undefined>(firstAcc.fallback);
  const [accLabel, setAccLabel] = useState(`${firstAcc.label} • ${firstAcc.rarity.toUpperCase()}`);

  const [forgeCount, setForgeCount] = useState(0);
  const [powerIndex, setPowerIndex] = useState(50);
  const [revealing, setRevealing] = useState(false);

  // force remount of layered imgs when forging
  const [renderNonce, setRenderNonce] = useState(0);

  const forgeIdentity = () => {
    if (!ALL_EYES.length) return;

    setRevealing(true);
    setTimeout(() => {
      const pickEye = ALL_EYES[Math.floor(Math.random() * ALL_EYES.length)];
      setEyeSrc(pickEye.primary);
      setEyeFallback(pickEye.fallback);
      setEyeLabel(`${pickEye.label} • ${pickEye.rarity.toUpperCase()}`);

      if (ALL_ACCESSORIES.length) {
        const pickAcc = pickWeightedAccessory(ALL_ACCESSORIES);
        setAccSrc(pickAcc.primary);
        setAccFallback(pickAcc.fallback);
        setAccLabel(`${pickAcc.label} • ${pickAcc.rarity.toUpperCase()}`);
      }

      setForgeCount((v) => v + 1);
      setRenderNonce((n) => n + 1);
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  // ====== Download ======
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const downloadPNG = async () => {
    try {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const [baseImg, eyesImg, mouthImg, accessoryImg] = await Promise.all([
        showBase ? loadImgWithFallback(BASE.primary, BASE.fallback) : Promise.resolve<HTMLImageElement | null>(null),
        loadImgWithFallback(eyeSrc, eyeFallback),
        showMouth ? loadImgWithFallback(MOUTH.primary, MOUTH.fallback) : Promise.resolve<HTMLImageElement | null>(null),
        showAcc ? loadImgWithFallback(accSrc, accFallback) : Promise.resolve<HTMLImageElement | null>(null),
      ]);

      ctx.clearRect(0, 0, size, size);
      if (showBase && baseImg) ctx.drawImage(baseImg, 0, 0, size, size);
      ctx.drawImage(eyesImg, 0, 0, size, size);
      if (showMouth && mouthImg) ctx.drawImage(mouthImg, 0, 0, size, size);
      if (showAcc && accessoryImg) ctx.drawImage(accessoryImg, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = downloadLinkRef.current;
        if (!a) return;
        a.href = url;
        a.download = `$MAD_PFP_${forgeCount + 1}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2500);
      }, "image/png");
    } catch (e) {
      console.error(e);
      alert("Download failed — this usually means one image path is wrong or an image is missing.");
    }
  };

  // ====== Image error handlers (single fallback swap) ======
  const swapToFallbackOnce = (fallback?: string) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!fallback) return;
    const img = e.currentTarget;
    if (img.src !== fallback) img.src = fallback;
  };

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
        @keyframes madWiggle {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-1px);
          }
          60% {
            transform: translateY(1px);
          }
          100% {
            transform: translateY(0);
          }
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
      `}</style>

      {/* ✅ RED CLOUD BACKGROUND */}
      <div className="fixed inset-0 -z-20">
        <img
          key={`bg-${renderNonce}`}
          src={bg.primary}
          alt="Red storm background"
          className="h-full w-full object-cover"
          onError={swapToFallbackOnce(bg.fallback)}
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
        {/* HERO */}
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
            <button onClick={copyCA} className={btnGhost}>
              {copied ? "✅ Copied" : "Copy CA"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={links.buy} target="_blank" rel="noreferrer" className={btnPrimary}>
              Buy on Jupiter
            </a>
            <a href={links.chart} target="_blank" rel="noreferrer" className={btnGhost}>
              View Chart
            </a>
            <a href={links.x} target="_blank" rel="noreferrer" className={btnWhite}>
              Join X Community
            </a>
            <a href={links.tg} target="_blank" rel="noreferrer" className={btnBlue}>
              Join Telegram
            </a>
          </div>

          {/* ✅ PFP GENERATOR */}
          <section className="mt-14 w-full max-w-xl mx-auto text-center">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Tool</p>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black">$MAD PFP Generator</h3>
            <p className="mt-3 text-white/60">Free for the community. Forge a look that sticks.</p>

            {/* Layer toggles */}
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
                  key={`base-${renderNonce}`}
                  src={BASE.primary}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="base"
                  onError={swapToFallbackOnce(BASE.fallback)}
                />
              )}

              <img
                key={`eyes-${eyeSrc}-${renderNonce}`}
                src={eyeSrc}
                className="absolute inset-0 w-full h-full object-cover"
                alt="eyes"
                onError={swapToFallbackOnce(eyeFallback)}
              />

              {showMouth && (
                <img
                  key={`mouth-${renderNonce}`}
                  src={MOUTH.primary}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="mouth"
                  onError={swapToFallbackOnce(MOUTH.fallback)}
                />
              )}

              {showAcc && (
                <img
                  key={`acc-${accSrc}-${renderNonce}`}
                  src={accSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="accessory"
                  onError={swapToFallbackOnce(accFallback)}
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
              <button className={btnGhost} onClick={downloadPNG}>
                Download PNG
              </button>
              <a ref={downloadLinkRef} className="hidden" />
            </div>

            <p className="mt-4 text-xs text-white/40">
              Eyes loaded: {ALL_EYES.length}. Accessories loaded: {ALL_ACCESSORIES.length}. Legendary accessories loaded:{" "}
              {ALL_ACCESSORIES.filter((a) => a.rarity === "legendary").length}.
            </p>
          </section>

          <p className="mt-10 text-white/40 text-sm tracking-wide">Built from cycles. Forged by volatility.</p>

          <div className="mt-10 space-y-2 text-base sm:text-lg text-white/60">
            <p>$HAPPY farmed me.</p>
            <p>$SAD farmed me.</p>
            <p className="text-red-500 font-black text-lg sm:text-xl">$MAD made me.</p>
          </div>
        </section>

        {/* 😡 MAD COUNTER */}
        <section className="py-20 w-full">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 text-center">
            <p className="text-white/70 uppercase tracking-[0.35em] text-xs">Global Utility</p>

            <h2 className="mt-3 text-4xl sm:text-5xl font-black">
              $MAD Rage Index™ <span className="text-red-500">😡</span>
            </h2>

            <div
              className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-8"
              style={{ animation: "madWiggle 2.8s ease-in-out infinite" }}
            >
              <div className="text-5xl sm:text-6xl font-black tabular-nums">{rageIndex.toLocaleString()}</div>
              <div className="mt-2 text-white/55 text-sm">Emotional damage per second (scientifically unverified)</div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button onClick={increaseMad} className={btnPrimary}>
                  Increase Global Anger 😡 +1
                </button>

                <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold">
                  Your clicks: <span className="text-white">{myMad}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/40">Tip: spam it when the chart does that thing.</p>
            </div>

            <div className="mt-10 text-left max-w-3xl mx-auto">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-black">Most MAD Today</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-white/50">totally real</span>
              </div>

              <div className="mt-4 grid gap-3">
                {leaderboard.map((row, idx) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/10 grid place-items-center font-black">
                        {idx + 1}
                      </div>
                      <div className="font-bold text-white/85">{row.name}</div>
                    </div>
                    <div className="font-mono text-white/70 tabular-nums">{row.score.toLocaleString()} MAD</div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-white/40">Wallets ranked by emotional damage. Not financial advice. Obviously.</p>
            </div>
          </div>
        </section>

        {/* 🧠 MEME VAULT */}
        <section className="py-20 w-full">
          <div className="text-center mb-14">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Culture</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black">$MAD Meme Vault</h2>
            <p className="mt-3 text-white/60">Relatable pain. Tokenized.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {freshMemes.map((m) => (
              <div
                key={m.src}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">{m.tag}</span>
                  <span className="text-xs font-black text-red-400">$MAD</span>
                </div>

                <Image src={m.src} alt={m.tag} width={1200} height={1200} className="rounded-2xl w-full h-auto" />
                <div className="mt-4 h-px w-full bg-white/10" />
                <div className="mt-3 text-xs text-white/40 group-hover:text-white/70 transition">Post this. Tag it. Start fights.</div>
              </div>
            ))}
          </div>
        </section>

        {/* ROADMAP */}
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
                  key={item.phase}
                  className={[
                    "rounded-3xl border border-white/10 bg-white/5 p-6 transition",
                    done ? "opacity-70" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={[
                        "text-xs uppercase tracking-[0.35em] text-white/50",
                        done ? "line-through decoration-white/40" : "",
                      ].join(" ")}
                    >
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

                  <p className={["text-white/60 mt-2", done ? "line-through decoration-white/20" : ""].join(" ")}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="py-12 text-center text-white/40 text-sm">$MAD — Digital emotion. Not financial advice.</footer>
      </div>
    </main>
  );
}


