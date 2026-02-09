"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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

  // 😡 deterministic "anger particles" (no hydration randomness)
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
  // 🧠 Meme Vault
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
  // 😡 MAD COUNTER + LEADERBOARD
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

  const btnBase =
    "rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98]";
  const btnPrimary = `${btnBase} bg-red-500 hover:bg-red-600 text-white`;
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;
  const btnWhite = `${btnBase} bg-white text-black hover:opacity-90`;
  const btnBlue = `${btnBase} bg-blue-500 hover:bg-blue-600 text-white`;

  // =========================
  // ✅ Roadmap (Phase 1 completed)
  // =========================
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
      { phase: "Phase 5", title: "$100M", desc: "Full send. Legendary status. Digital emotion completed." },
    ],
    []
  );

  // =========================
  // 🧩 PFP GENERATOR (EYES) — FIXED TO YOUR REAL FILENAMES
  // =========================
  const ALL_EYES = useMemo(
    () => [
      // ===== CARTOON / COMMON
      "/pfp/eyes/cartoon/common/cartoon-common-black.png",
      "/pfp/eyes/cartoon/common/cartoon-common-blue.png",
      "/pfp/eyes/cartoon/common/cartoon-common-green.png",
      "/pfp/eyes/cartoon/common/cartoon-common-orange.png",
      "/pfp/eyes/cartoon/common/cartoon-common-purple.png",
      "/pfp/eyes/cartoon/common/cartoon-common-red.png",

      // ===== CARTOON / RARE (neon)
      "/pfp/eyes/cartoon/rare/cartoon-rare-neon-black.png",
      "/pfp/eyes/cartoon/rare/cartoon-rare-neon-blue.png",
      "/pfp/eyes/cartoon/rare/cartoon-rare-neon-green.png",
      "/pfp/eyes/cartoon/rare/cartoon-rare-neon-orange.png",
      "/pfp/eyes/cartoon/rare/cartoon-rare-neon-purple.png",
      "/pfp/eyes/cartoon/rare/cartoon-rare-neon-red.png",

      // ===== CARTOON / LEGENDARY (themes)
      "/pfp/eyes/cartoon/legendary/cartoon-legendary-fire-red.png",
      "/pfp/eyes/cartoon/legendary/cartoon-legendary-fruity-orange.png",
      "/pfp/eyes/cartoon/legendary/cartoon-legendary-hearts-pink.png",
      "/pfp/eyes/cartoon/legendary/cartoon-legendary-ice-blue.png",
      "/pfp/eyes/cartoon/legendary/cartoon-legendary-poison-green.png",
      "/pfp/eyes/cartoon/legendary/cartoon-legendary-void-black.png",

      // ===== PIXEL / COMMON
      "/pfp/eyes/pixel/common/pixel-common-black.png",
      "/pfp/eyes/pixel/common/pixel-common-blue.png",
      "/pfp/eyes/pixel/common/pixel-common-green.png",
      "/pfp/eyes/pixel/common/pixel-common-orange.png",
      "/pfp/eyes/pixel/common/pixel-common-pink.png",
      "/pfp/eyes/pixel/common/pixel-common-purple.png",

      // ===== PIXEL / RARE (crystal)
      "/pfp/eyes/pixel/rare/pixel-rare-crystal-black.png",
      "/pfp/eyes/pixel/rare/pixel-rare-crystal-blue.png",
      "/pfp/eyes/pixel/rare/pixel-rare-crystal-green.png",
      "/pfp/eyes/pixel/rare/pixel-rare-crystal-orange.png",
      "/pfp/eyes/pixel/rare/pixel-rare-crystal-pink.png",
      "/pfp/eyes/pixel/rare/pixel-rare-crystal-red.png",

      // ===== PIXEL / LEGENDARY (robot)
      "/pfp/eyes/pixel/legendary/pixel-legendary-robot-black.png",
      "/pfp/eyes/pixel/legendary/pixel-legendary-robot-blue.png",
      "/pfp/eyes/pixel/legendary/pixel-legendary-robot-green.png",
      "/pfp/eyes/pixel/legendary/pixel-legendary-robot-orange.png",
      "/pfp/eyes/pixel/legendary/pixel-legendary-robot-pink.png",
      "/pfp/eyes/pixel/legendary/pixel-legendary-robot-yellow.png",
    ],
    []
  );

  const BASE_SRC = "/pfp/base/base-01.png";
  const MOUTH_SRC = "/pfp/mouth/mouth-01.png";
  const ACC_SRC = "/pfp/accessories/acc-01.png";

  const [eyeSrc, setEyeSrc] = useState<string>(() => ALL_EYES[0] || "/pfp/eyes/cartoon/common/cartoon-common-black.png");
  const [forgeCount, setForgeCount] = useState<number>(0);
  const [powerIndex, setPowerIndex] = useState<number>(50);
  const [revealing, setRevealing] = useState<boolean>(false);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const forgeIdentity = () => {
    if (!ALL_EYES.length) return;
    setRevealing(true);

    setTimeout(() => {
      const pick = ALL_EYES[Math.floor(Math.random() * ALL_EYES.length)];
      setEyeSrc(pick);
      setForgeCount((v) => v + 1);
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
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
        loadImg(eyeSrc),
        loadImg(MOUTH_SRC),
        loadImg(ACC_SRC),
      ]);

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(base, 0, 0, size, size);
      ctx.drawImage(eyes, 0, 0, size, size);
      ctx.drawImage(mouth, 0, 0, size, size);
      ctx.drawImage(acc, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);

        const a = downloadLinkRef.current || document.createElement("a");
        a.href = url;
        a.download = `$MAD-pfp-${Date.now()}.png`;

        // only append if it wasn't our ref element
        if (!downloadLinkRef.current) document.body.appendChild(a);
        a.click();
        if (!downloadLinkRef.current) a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }, "image/png");
    } catch (e) {
      console.error(e);
      alert(
        "Download failed — a file path is wrong. Open DevTools console to see which image failed to load."
      );
    }
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

      {/* CENTER SCROLL GUIDE LINE */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-px -translate-x-1/2 bg-white/20" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />

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
            <p className="mt-3 text-white/60">Free for the community. Identity, weaponized.</p>

            <div
              className="mt-8 relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full overflow-hidden border-4 border-red-500/80 shadow-[0_0_50px_rgba(255,0,0,0.35)]"
              style={revealing ? { animation: "forgePulse 0.55s ease-in-out" } : undefined}
            >
              <img src={BASE_SRC} className="absolute inset-0 w-full h-full object-cover" alt="base" />
              <img src={eyeSrc} className="absolute inset-0 w-full h-full object-cover" alt="eyes" />
              <img src={MOUTH_SRC} className="absolute inset-0 w-full h-full object-cover" alt="mouth" />
              <img src={ACC_SRC} className="absolute inset-0 w-full h-full object-cover" alt="accessory" />
            </div>

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
              <button className={btnWhite} onClick={downloadPNG}>
                Download PNG
              </button>
              <a ref={downloadLinkRef} className="hidden" />
            </div>

            <p className="mt-4 text-xs text-white/40">
              Eyes loaded: {ALL_EYES.length} total. (If download fails, one path is wrong.)
            </p>
          </section>

          <p className="mt-10 text-white/40 text-sm tracking-wide">Built from cycles. Forged by volatility.</p>

          <div className="mt-10 space-y-2 text-base sm:text-lg text-white/60">
            <p>$HAPPY farmed me.</p>
            <p>$SAD farmed me.</p>
            <p className="text-red-500 font-black text-lg sm:text-xl">$MAD made me.</p>
          </div>
        </section>

        {/* 😡 MAD COUNTER SECTION */}
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

        {/* 🧠 $MAD Meme Vault */}
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

        {/* ROADMAP DIVIDER VIDEO */}
        <section className="relative w-full my-8 sm:my-12 overflow-hidden rounded-3xl border border-white/10">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src="/roadmap-divider.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 py-16 px-6 text-center">
            <p className="text-white/70 uppercase tracking-[0.35em] text-xs">Next Chapter</p>
            <h2 className="mt-3 text-5xl font-black">Roadmap</h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">Bond first. Then we climb.</p>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="py-16 w-full max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-black">Roadmap</h2>
            <p className="mt-3 text-white/60">Simple. Clean. Violent upside energy.</p>
          </div>

          <div className="grid gap-5 text-left">
            {roadmap.map((item) => {
              const done = !!item.done;

              return (
                <div
                  key={item.phase}
                  className={[
                   

