"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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
      // fallback (rare)
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
      const size = 16 + ((seed % 7) * 6); // 16–52
      const dur = 14 + (seed % 12); // 14–25s
      const delay = seed % 10; // 0–9s
      const drift = ((seed % 9) - 4) * 10; // -40..40px
      const opacity = 0.10 + ((seed % 7) * 0.04); // 0.10–0.34
      return { i, x, size, dur, delay, drift, opacity };
    });
  }, []);

  const btnBase =
    "rounded-full px-7 py-3 font-extrabold transition border border-white/15 backdrop-blur hover:scale-[1.02] active:scale-[0.98]";
  const btnPrimary = `${btnBase} bg-red-500 hover:bg-red-600 text-white`;
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;
  const btnWhite = `${btnBase} bg-white text-black hover:opacity-90`;
  const btnBlue = `${btnBase} bg-blue-500 hover:bg-blue-600 text-white`;

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Inline keyframes for floating 😡 */}
      <style jsx global>{`
        @keyframes madFloatUp {
          from {
            transform: translate3d(var(--drift), 20vh, 0) rotate(0deg);
          }
          to {
            transform: translate3d(calc(var(--drift) * -1), -140vh, 0)
              rotate(18deg);
          }
        }
        .mad-emoji {
          bottom: -30vh;
          animation-name: madFloatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 18px rgba(255, 0, 0, 0.18));
        }
      `}</style>

      {/* RED CLOUD BACKGROUND */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/publicred-clouds.png.png"
          alt="Red storm background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
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

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="rounded-2xl bg-white/10 p-4 border border-white/10 shadow-[0_0_80px_rgba(255,0,0,0.15)]">
            <Image
              src="/mad.png"
              alt="$MAD logo"
              width={140}
              height={140}
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-5xl sm:text-6xl font-black tracking-tight">
            BTC: <span className="text-white">Digital gold.</span>
          </h1>
          <h2 className="mt-3 text-5xl sm:text-6xl font-black text-red-500">
            $MAD: Digital emotion.
          </h2>

          {/* CA */}
          <p className="mt-8 text-white/70 uppercase tracking-[0.35em] text-xs">
            Solana Contract
          </p>

          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
            <div className="max-w-[90vw] sm:max-w-[680px] rounded-2xl bg-white/10 border border-white/10 px-4 py-3 font-mono text-sm break-all">
              {addr}
            </div>

            <button onClick={copyCA} className={btnGhost}>
              {copied ? "✅ Copied" : "Copy CA"}
            </button>
          </div>

          {/* CTA ROW */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={links.buy}
              target="_blank"
              rel="noreferrer"
              className={btnPrimary}
            >
              Buy on Jupiter
            </a>
            <a
              href={links.chart}
              target="_blank"
              rel="noreferrer"
              className={btnGhost}
            >
              View Chart
            </a>
            <a href={links.x} target="_blank" rel="noreferrer" className={btnWhite}>
              Join X Community
            </a>
            <a href={links.tg} target="_blank" rel="noreferrer" className={btnBlue}>
              Join Telegram
            </a>
          </div>

          <p className="mt-10 text-white/40 text-sm tracking-wide">
            Built from cycles. Forged by volatility.
          </p>

          {/* Lore */}
          <div className="mt-10 space-y-2 text-base sm:text-lg text-white/60">
            <p>$HAPPY farmed me.</p>
            <p>$SAD farmed me.</p>
            <p className="text-red-500 font-black text-lg sm:text-xl">$MAD made me.</p>
          </div>

          {/* Scroll hint */}
          <div className="mt-12 flex flex-col items-center gap-2 text-white/50">
            <div className="h-10 w-px bg-white/30" />
            <p className="text-xs uppercase tracking-[0.35em]">Scroll</p>
          </div>
        </section>

        {/* MEMES */}
        <section className="py-20 w-full">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-12">
            The $MAD Lore
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:scale-[1.01] transition">
              <Image
                src="/meme1.jpg"
                alt="Posting my entry"
                width={900}
                height={900}
                className="rounded-2xl"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:scale-[1.01] transition">
              <Image
                src="/meme3.jpg"
                alt="After I finally sold"
                width={900}
                height={900}
                className="rounded-2xl"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2 hover:scale-[1.01] transition">
              <Image
                src="/meme2.jpg"
                alt="Checked chart before bed"
                width={1600}
                height={900}
                className="rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* ROADMAP DIVIDER VIDEO */}
        <section className="relative w-full my-8 sm:my-12 overflow-hidden rounded-3xl border border-white/10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/roadmap-divider.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 py-16 px-6 text-center">
            <p className="text-white/70 uppercase tracking-[0.35em] text-xs">
              Next Chapter
            </p>
            <h2 className="mt-3 text-5xl font-black">Roadmap</h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              Bond first. Then we climb.
            </p>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="py-16 w-full max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-black">Roadmap</h2>
            <p className="mt-3 text-white/60">
              Simple. Clean. Violent upside energy.
            </p>
          </div>

          <div className="grid gap-5 text-left">
            {[
              {
                phase: "Phase 1",
                title: "Bond",
                desc: "Establish the foundation. Lock in the vibe. Build the core.",
              },
              {
                phase: "Phase 2",
                title: "$1M",
                desc: "First major milestone. Momentum becomes undeniable.",
              },
              {
                phase: "Phase 3",
                title: "$10M",
                desc: "Scale the energy. More eyes. More memes. More movement.",
              },
              {
                phase: "Phase 4",
                title: "$50M",
                desc: "Serious territory. The timeline feels it.",
              },
              {
                phase: "Phase 5",
                title: "$100M",
                desc: "Full send. Legendary status. Digital emotion completed.",
              },
            ].map((item) => (
              <div
                key={item.phase}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  {item.phase}
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black">{item.title}</h3>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <p className="text-white/60 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center text-white/40 text-sm">
          $MAD — Digital emotion. Not financial advice.
        </footer>
      </div>
    </main>
  );
}


