"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type EyeStyle = "any" | "cartoon" | "pixel";
type EyeRarity = "any" | "common" | "rare" | "legendary";

type EyeItem = {
  src: string;
  style: "cartoon" | "pixel";
  rarity: "common" | "rare" | "legendary";
  label: string;
};

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

  // =========================
  // Clipboard
  // =========================
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

  // =========================
  // 😡 deterministic particles (no hydration randomness)
  // =========================
  const angry = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 9973) % 10000;
      const x = (seed % 1000) / 10; // 0–100
      const size = 16 + (seed % 7) * 6; // 16–52
      const dur = 14 + (seed % 12); // 14–25s
      const delay = seed % 10; // 0–9s
      const drift = ((seed % 9) - 4) * 10; // -40..40px
      const opacity = 0.1 + (seed % 7) * 0.04; // 0.10–0.34
      return { i, x, size, dur, delay, drift, opacity };
    });
  }, []);

  // =========================
  // Meme Vault
  // =========================
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

  // =========================
  // Rage Index (persisted)
  // =========================
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
    const bump = 7 + ((rageIndex + myMad) % 19); // 7..25
    setRageIndex((v) => v + bump);
    setMyMad((v) => v + 1);
  };

  // =========================
  // Buttons
  // =========================
  const btnBase =
    "rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98]";
  const btnPrimary = `${btnBase} bg-red-500 hover:bg-red-600 text-white`;
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;
  const btnWhite = `${btnBase} bg-white text-black hover:opacity-90`;
  const btnBlue = `${btnBase} bg-blue-500 hover:bg-blue-600 text-white`;

  // =========================
  // Roadmap
  // =========================
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

  // =========================
  // 🧩 PFP Generator Layers
  // =========================
  const BASE_SRC = "/pfp/base/base-01.png";
  const MOUTH_SRC = "/pfp/mouth/mouth-01.png";
  const ACC_SRC = "/pfp/accessories/acc-01.png";

  // IMPORTANT: Your real filenames (from your screenshots)
  const EYES: EyeItem[] = useMemo(
    () => [
      // CARTOON / COMMON
      { src: "/pfp/eyes/cartoon/common/cartoon-common-black.png", style: "cartoon", rarity: "common", label: "Cartoon Common Black" },
      { src: "/pfp/eyes/cartoon/common/cartoon-common-blue.png", style: "cartoon", rarity: "common", label: "Cartoon Common Blue" },
      { src: "/pfp/eyes/cartoon/common/cartoon-common-green.png", style: "cartoon", rarity: "common", label: "Cartoon Common Green" },
      { src: "/pfp/eyes/cartoon/common/cartoon-common-orange.png", style: "cartoon", rarity: "common", label: "Cartoon Common Orange" },
      { src: "/pfp/eyes/cartoon/common/cartoon-common-purple.png", style: "cartoon", rarity: "common", label: "Cartoon Common Purple" },
      { src: "/pfp/eyes/cartoon/common/cartoon-common-red.png", style: "cartoon", rarity: "common", label: "Cartoon Common Red" },

      // CARTOON / RARE (NEON)
      { src: "/pfp/eyes/cartoon/rare/cartoon-rare-neon-black.png", style: "cartoon", rarity: "rare", label: "Cartoon Rare Neon Black" },
      { src: "/pfp/eyes/cartoon/rare/cartoon-rare-neon-blue.png", style: "cartoon", rarity: "rare", label: "Cartoon Rare Neon Blue" },
      { src: "/pfp/eyes/cartoon/rare/cartoon-rare-neon-green.png", style: "cartoon", rarity: "rare", label: "Cartoon Rare Neon Green" },
      { src: "/pfp/eyes/cartoon/rare/cartoon-rare-neon-orange.png", style: "cartoon", rarity: "rare", label: "Cartoon Rare Neon Orange" },
      { src: "/pfp/eyes/cartoon/rare/cartoon-rare-neon-purple.png", style: "cartoon", rarity: "rare", label: "Cartoon Rare Neon Purple" },
      { src: "/pfp/eyes/cartoon/rare/cartoon-rare-neon-red.png", style: "cartoon", rarity: "rare", label: "Cartoon Rare Neon Red" },

      // CARTOON / LEGENDARY (THEMES)
      { src: "/pfp/eyes/cartoon/legendary/cartoon-legendary-fire-red.png", style: "cartoon", rarity: "legendary", label: "Cartoon Legendary Fire" },
      { src: "/pfp/eyes/cartoon/legendary/cartoon-legendary-fruity-orange.png", style: "cartoon", rarity: "legendary", label: "Cartoon Legendary Fruity" },
      { src: "/pfp/eyes/cartoon/legendary/cartoon-legendary-hearts-pink.png", style: "cartoon", rarity: "legendary", label: "Cartoon Legendary Hearts" },
      { src: "/pfp/eyes/cartoon/legendary/cartoon-legendary-ice-blue.png", style: "cartoon", rarity: "legendary", label: "Cartoon Legendary Ice" },
      { src: "/pfp/eyes/cartoon/legendary/cartoon-legendary-poison-green.png", style: "cartoon", rarity: "legendary", label: "Cartoon Legendary Poison" },
      { src: "/pfp/eyes/cartoon/legendary/cartoon-legendary-void-black.png", style: "cartoon", rarity: "legendary", label: "Cartoon Legendary Void" },

      // PIXEL / COMMON
      { src: "/pfp/eyes/pixel/common/pixel-common-black.png", style: "pixel", rarity: "common", label: "Pixel Common Black" },
      { src: "/pfp/eyes/pixel/common/pixel-common-blue.png", style: "pixel", rarity: "common", label: "Pixel Common Blue" },
      { src: "/pfp/eyes/pixel/common/pixel-common-green.png", style: "pixel", rarity: "common", label: "Pixel Common Green" },
      { src: "/pfp/eyes/pixel/common/pixel-common-orange.png", style: "pixel", rarity: "common", label: "Pixel Common Orange" },
      { src: "/pfp/eyes/pixel/common/pixel-common-pink.png", style: "pixel", rarity: "common", label: "Pixel Common Pink" },
      { src: "/pfp/eyes/pixel/common/pixel-common-purple.png", style: "pixel", rarity: "common", label: "Pixel Common Purple" },

      // PIXEL / RARE (CRYSTAL)
      { src: "/pfp/eyes/pixel/rare/pixel-rare-crystal-black.png", style: "pixel", rarity: "rare", label: "Pixel Rare Crystal Black" },
      { src: "/pfp/eyes/pixel/rare/pixel-rare-crystal-blue.png", style: "pixel", rarity: "rare", label: "Pixel Rare Crystal Blue" },
      { src: "/pfp/eyes/pixel/rare/pixel-rare-crystal-green.png", style: "pixel", rarity: "rare", label: "Pixel Rare Crystal Green" },
      { src: "/pfp/eyes/pixel/rare/pixel-rare-crystal-orange.png", style: "pixel", rarity: "rare", label: "Pixel Rare Crystal Orange" },
      { src: "/pfp/eyes/pixel/rare/pixel-rare-crystal-pink.png", style: "pixel", rarity: "rare", label: "Pixel Rare Crystal Pink" },
      { src: "/pfp/eyes/pixel/rare/pixel-rare-crystal-red.png", style: "pixel", rarity: "rare", label: "Pixel Rare Crystal Red" },

      // PIXEL / LEGENDARY (ROBOT)
      { src: "/pfp/eyes/pixel/legendary/pixel-legendary-robot-black.png", style: "pixel", rarity: "legendary", label: "Pixel Legendary Robot Black" },
      { src: "/pfp/eyes/pixel/legendary/pixel-legendary-robot-blue.png", style: "pixel", rarity: "legendary", label: "Pixel Legendary Robot Blue" },
      { src: "/pfp/eyes/pixel/legendary/pixel-legendary-robot-green.png", style: "pixel", rarity: "legendary", label: "Pixel Legendary Robot Green" },
      { src: "/pfp/eyes/pixel/legendary/pixel-legendary-robot-orange.png", style: "pixel", rarity: "legendary", label: "Pixel Legendary Robot Orange" },
      { src: "/pfp/eyes/pixel/legendary/pixel-legendary-robot-pink.png", style: "pixel", rarity: "legendary", label: "Pixel Legendary Robot Pink" },
      { src: "/pfp/eyes/pixel/legendary/pixel-legendary-robot-yellow.png", style: "pixel", rarity: "legendary", label: "Pixel Legendary Robot Yellow" },
    ],
    []
  );

  // Filters (keeps people hunting = longer sessions)
  const [styleFilter, setStyleFilter] = useState<EyeStyle>("any");
  const [rarityFilter, setRarityFilter] = useState<EyeRarity>("any");

  const filteredEyes = useMemo(() => {
    return EYES.filter((e) => {
      if (styleFilter !== "any" && e.style !== styleFilter) return false;
      if (rarityFilter !== "any" && e.rarity !== rarityFilter) return false;
      return true;
    });
  }, [EYES, styleFilter, rarityFilter]);

  // Weighted rarity (when rarityFilter === "any")
  // Common 78%, Rare 18%, Legendary 4%
  const pickWeighted = (pool: EyeItem[]) => {
    if (!pool.length) return null;

    // If user explicitly filtered rarity, just pick from pool.
    if (rarityFilter !== "any") {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const commons = pool.filter((x) => x.rarity === "common");
    const rares = pool.filter((x) => x.rarity === "rare");
    const leg = pool.filter((x) => x.rarity === "legendary");

    const r = Math.random();
    if (r < 0.78 && commons.length) return commons[Math.floor(Math.random() * commons.length)];
    if (r < 0.96 && rares.length) return rares[Math.floor(Math.random() * rares.length)];
    if (leg.length) return leg[Math.floor(Math.random() * leg.length)];

    // fallback
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const [eye, setEye] = useState<EyeItem>(() => filteredEyes[0] || EYES[0]);
  const [forgeCount, setForgeCount] = useState(0);
  const [powerIndex, setPowerIndex] = useState(50);
  const [revealing, setRevealing] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  // When filters change, ensure current eye is valid
  useEffect(() => {
    if (!filteredEyes.length) return;
    if (!eye) {
      setEye(filteredEyes[0]);
      return;
    }
    const stillValid = filteredEyes.some((x) => x.src === eye.src);
    if (!stillValid) setEye(filteredEyes[0]);
  }, [filteredEyes]); // eslint-disable-line react-hooks/exhaustive-deps

  const forgeIdentity = () => {
    const pool = filteredEyes;
    if (!pool.length) return;

    setRevealing(true);
    setTimeout(() => {
      const pick = pickWeighted(pool);
      if (!pick) return;
      setEye(pick);
      setForgeCount((v) => v + 1);
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.src = src;
    });

  const downloadPNG = async () => {
    try {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const [base, eyes, mouth, acc] = await Promise.all([
        loadImg(BASE_SRC),
        loadImg(eye.src),
        loadImg(MOUTH_SRC),
        loadImg(ACC_SRC),
      ]);

      ctx.clearRect(0, 0, size, size);

      // NOTE: If your base is a full PFP and eyes are just an overlay,
      // this order is correct: base -> eyes -> mouth -> accessories
      ctx.drawImage(base, 0, 0, size, size);
      ctx.drawImage(eyes, 0, 0, size, size);
      ctx.drawImage(mouth, 0, 0, size, size);
      ctx.drawImage(acc, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);

        const a = downloadRef.current || document.createElement("a");
        a.href = url;
        a.download = `$MAD-pfp-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }, "image/png");
    } catch (e) {
      console.error(e);
      alert("Download failed. One file path is wrong OR an image couldn't load.");
    }
  };

  // =========================
  // Styles
  // =========================
  const rarityPill = (r: EyeItem["rarity"]) => {
    if (r === "legendary") return "bg-yellow-500/20 border-yellow-400/30 text-yellow-200";
    if (r === "rare") return "bg-purple-500/20 border-purple-400/30 text-purple-200";
    return "bg-white/10 border-white/10 text-white/70";
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
      <div className="absolute inset-0 -z-20">
        <Image
          src="/pfp/bg/bg-redclouds.png.png"
          alt="Red storm background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* 😡 FLOATING BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-15 overflow-hidden">
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
          <section className="mt-14 w-full max-w-2xl mx-auto text-center">
            <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Tool</p>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black">$MAD PFP Generator</h3>
            <p className="mt-3 text-white/60">
              Forge. Filter. Hunt. Download. (This is how you burn it into the subconscious.)
            </p>

            {/* Controls */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value as EyeStyle)}
                className="rounded-2xl bg-black/40 border border-white/15 px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="any">Style: Any</option>
                <option value="cartoon">Style: Cartoon</option>
                <option value="pixel">Style: Pixel</option>
              </select>

              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as EyeRarity)}
                className="rounded-2xl bg-black/40 border border-white/15 px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="any">Rarity: Any (weighted)</option>
                <option value="common">Rarity: Common</option>
                <option value="rare">Rarity: Rare</option>
                <option value="legendary">Rarity: Legendary</option>
              </select>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold">
                Pool: <span className="text-white">{filteredEyes.length}</span>
              </div>
            </div>

            {/* Preview */}
            <div
              className="mt-8 relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-full overflow-hidden border-4 border-red-500/80 shadow-[0_0_50px_rgba(255,0,0,0.35)]"
              style={revealing ? { animation: "forgePulse 0.55s ease-in-out" } : undefined}
            >
              <img src={BASE_SRC} className="absolute inset-0 w-full h-full object-cover" alt="base" />
              <img src={eye?.src} className="absolute inset-0 w-full h-full object-cover" alt="eyes" />
              <img src={MOUTH_SRC} className="absolute inset-0 w-full h-full object-cover" alt="mouth" />
              <img src={ACC_SRC} className="absolute inset-0 w-full h-full object-cover" alt="accessory" />
            </div>

            {/* Current Pick */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className={`rounded-full border px-4 py-2 text-xs font-black ${rarityPill(eye?.rarity || "common")}`}>
                {eye?.rarity?.toUpperCase() || "COMMON"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white/70">
                {eye?.style?.toUpperCase() || "CARTOON"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white/70">
                {eye?.label || "—"}
              </span>
            </div>

            {/* Forge stats */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold">
                Forge Count: <span className="text-white">{forgeCount}</span>
              </div>
              <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold">
                Power Index: <span className="text-white">{powerIndex}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button className={btnPrimary} onClick={forgeIdentity} disabled={!filteredEyes.length}>
                Forge Identity
              </button>
              <button className={btnWhite} onClick={downloadPNG} disabled={!eye}>
                Download PNG
              </button>
              <a ref={downloadRef} className="hidden" />
            </div>

            {!filteredEyes.length && (
              <p className="mt-4 text-sm text-red-200/80">
                No eyes match your filters. Switch Style/Rarity back to Any.
              </p>
            )}

            <p className="mt-4 text-xs text-white/40">
              Tip: Leave Rarity on “Any (weighted)” and hunt. That loop keeps people forging.
            </p>
          </section>

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
            </div>
          </div>
        </section>

        {/* Meme Vault */}
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

        {/* Roadmap */}
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
                    <h3
                      className={[
                        "text-2xl sm:text-3xl font-black",
                        done ? "line-through decoration-red-500/80" : "",
                      ].join(" ")}
                    >
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

        <footer className="py-12 text-center text-white/40 text-sm">
          $MAD — Digital emotion. Not financial advice.
        </footer>
      </div>
    </main>
  );
}

