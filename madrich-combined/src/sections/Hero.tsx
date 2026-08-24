import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import EmberCanvas from "@/components/EmberCanvas";
import CaPill from "@/components/CaPill";
import { useMadPrice, fmtPrice, fmtUsd } from "@/hooks/useMadPrice";
import { LINKS } from "@/lib/data";

const line = {
  hidden: { y: "110%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 0.9, delay: 0.55 + i * 0.14, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function Ticker() {
  const { price, change24h, mcap, volume24h, liquidity } = useMadPrice();
  const up = (change24h ?? 0) >= 0;

  const items = [
    `PRICE ${fmtPrice(price)}`,
    `24H ${up ? "▲" : "▼"} ${Math.abs(change24h ?? 0).toFixed(2)}%`,
    `MCAP ${fmtUsd(mcap)}`,
    `VOL ${fmtUsd(volume24h)}`,
    `LIQ ${fmtUsd(liquidity)}`,
    "DEV LOCKED 100M $MAD",
    "MOTIVATION · ALIGNMENT · DISCIPLINE",
    "STAY $MAD",
  ];

  const row = [...items, ...items];
  return (
    <div className="relative z-20 border-t border-white/5 bg-ink/80 py-3 backdrop-blur-sm">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((it, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ash"
              >
                <span className="text-mad">😡</span>
                <span className={it.startsWith("24H") ? (up ? "text-green-400" : "text-mad-bright") : ""}>
                  {it}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { price, change24h, direction, loading } = useMadPrice();
  const up = (change24h ?? 0) >= 0;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(234,32,34,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_110%,rgba(234,32,34,0.08),transparent_60%)]" />
      <EmberCanvas density={64} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
          style={{ perspective: 800 }}
        >
          <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-mad/25 blur-[70px] animate-pulse-glow" />
          <motion.img
            src="/mad-logo.png"
            alt="$MAD angry face"
            style={{ rotateX, rotateY }}
            className="h-32 w-32 animate-floaty drop-shadow-[0_0_35px_rgba(234,32,34,0.45)] sm:h-40 sm:w-40"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.4em] text-mad"
        >
          Solana · Est. 2026 · Doxxed Dev
        </motion.p>

        <h1 className="font-display uppercase leading-[0.92] tracking-wide">
          {[
            <span key="a" className="block text-5xl text-bone sm:text-7xl lg:text-8xl">
              Stop Panicking.
            </span>,
            <span key="b" className="block text-6xl sm:text-8xl lg:text-9xl">
              <span className="text-bone">Get </span>
              <span className="text-mad drop-shadow-[0_0_30px_rgba(234,32,34,0.5)]">$MAD</span>
            </span>,
            <span key="c" className="block text-6xl text-bone sm:text-8xl lg:text-9xl">
              Rich.
            </span>,
          ].map((el, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <motion.span custom={i} variants={line} initial="hidden" animate="show" className="block origin-left">
                {el}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7 }}
          className="mt-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mad opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mad" />
          </span>
          <span className="text-ash">$MAD</span>
          <span
            key={price ?? "x"}
            className={
              direction === "up"
                ? "animate-flash-up text-bone"
                : direction === "down"
                  ? "animate-flash-down text-bone"
                  : "text-bone"
            }
          >
            {fmtPrice(price)}
          </span>
          {!loading && change24h != null && (
            <span className={up ? "text-green-400" : "text-mad-bright"}>
              {up ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-full bg-mad px-9 py-4 text-base font-bold uppercase tracking-wider text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-lg"
          >
            <span className="relative z-10">Buy $MAD</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <CaPill />
        </motion.div>
      </div>

      <Ticker />
    </section>
  );
}
