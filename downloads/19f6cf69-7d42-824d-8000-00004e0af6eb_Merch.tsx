import { useRef } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionHeading from "@/components/SectionHeading";
import { PRODUCTS, MERCH_VIDEOS, PROOF_PHOTOS } from "@/lib/pages-data";
import { cn } from "@/lib/utils";

function TickerBand() {
  const text = "NOT FOR EVERYONE • LIMITED DROP • WHILE SUPPLIES LAST • ";
  return (
    <div className="my-16 -rotate-1 overflow-hidden border-y border-mad/30 bg-mad py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((h) => (
          <div key={h} className="flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="px-2 font-display text-xl uppercase tracking-wider text-white">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Merch() {
  const proofRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* hero */}
      <div className="relative flex min-h-[70svh] items-center justify-center overflow-hidden">
        <img src="/assets/merch/merch-hero-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
        <div className="relative z-10 px-4 pb-10 pt-32 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-mad-bright"
          >
            Drop 001 — Limited
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-5xl uppercase leading-[0.92] text-bone sm:text-7xl"
          >
            Don't Just <span className="text-mad">Hold</span> $MAD.
            <span className="block">Wear It.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-5 max-w-lg text-ash"
          >
            Stickers, wraps, and signal pieces for the people carrying the brand into real life.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            href="#drop"
            className="mt-8 inline-block rounded-full bg-mad px-9 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg"
          >
            Shop the Drop
          </motion.a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* legacy drop */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-mad/30 bg-panel shadow-glow-sm">
            <div className="absolute right-4 top-4 z-10 rotate-6 rounded-xl border-2 border-mad bg-ink/80 px-4 py-2 font-display text-sm uppercase tracking-wider text-mad-bright">
              Sold Out Forever
            </div>
            <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2">
              <TiltCard className="rounded-3xl" max={7}>
                <img
                  src="/assets/merch/mad-limited-001-hat.png"
                  alt="MAD // LIMITED 001 — America Dad hat"
                  className="w-full rounded-2xl border border-white/10 object-cover"
                />
              </TiltCard>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Drop 001 — Legacy</p>
                <h2 className="mt-3 font-display text-3xl uppercase leading-tight text-bone sm:text-4xl">
                  MAD // <span className="text-mad">LIMITED 001</span>
                  <span className="block text-xl text-ash sm:text-2xl">$MAD America Dad Hat</span>
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-ash">
                  Only <span className="font-display text-2xl text-mad-bright">26</span> ever made. No
                  restocks. No reprints. Every buyer received{" "}
                  <span className="font-bold text-bone">1,000,000 $MAD</span> tokens each.{" "}
                  <span className="text-bone">This will never happen again.</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ash">
                  The hat that started the legend. If you own one, you are one of the 26. Next drops will
                  never carry the same token bonus — this was a one-time artifact of conviction.
                </p>
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/8 bg-black/30 p-4">
                  <span className="font-display text-4xl text-mad">26</span>
                  <p className="font-mono text-xs uppercase tracking-widest text-ash">
                    Owners worldwide · 1M $MAD each · verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <TickerBand />

        {/* products */}
        <SectionHeading
          eyebrow="The $MAD Drop"
          title={<>Current <span className="text-mad">Stock</span></>}
        />
        <div id="drop" className="grid scroll-mt-28 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.07}>
              <TiltCard className="h-full rounded-3xl" max={9}>
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-panel transition-all duration-500 hover:border-mad/45 hover:shadow-glow-sm">
                  <div className="relative bg-black/30 p-6">
                    <span className={cn(
                      "absolute left-3 top-3 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-widest",
                      p.stock === "Low Stock" ? "border-mad/50 text-mad-bright" : p.stock === "Selling Fast" ? "border-yellow-500/40 text-yellow-400" : "border-green-500/40 text-green-400",
                    )}>
                      {p.stock}
                    </span>
                    <img src={p.img} alt={p.name} loading="lazy" className="mx-auto h-40 w-auto object-contain transition-transform duration-500 group-hover/tilt:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mad">{p.tier}</p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <h3 className="font-display text-xl uppercase text-bone">{p.name}</h3>
                      <span className="font-mono text-lg font-bold text-mad-bright">{p.price}</span>
                    </div>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-ash">{p.desc}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 rounded-full bg-mad px-5 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.03] hover:shadow-glow"
                    >
                      Grab It →
                    </a>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* proof */}
        <SectionHeading
          eyebrow="Verified holders"
          title={<>Real People. Real <span className="text-mad">$MAD</span> Stickers.</>}
          sub="Community submitted proof. Not paid actors."
        />
        <Reveal>
          <div
            ref={proofRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          >
            {PROOF_PHOTOS.map((p, i) => (
              <div key={i} className="w-[300px] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/8 bg-panel sm:w-[340px]">
                <img src={p.img} alt={p.caption} loading="lazy" className="h-56 w-full object-cover" />
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mad">Proof #{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-sm font-semibold text-bone">“{p.caption}”</p>
                  <p className="mt-1 font-mono text-xs text-ash">{p.by}</p>
                </div>
              </div>
            ))}
            {MERCH_VIDEOS.map((v) => (
              <div key={v.id} className="w-[240px] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/8 bg-panel">
                <div className="aspect-[9/16] w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-bone">{v.title}</p>
                  <p className="font-mono text-xs text-mad-bright">{v.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* risk */}
        <Reveal className="my-14">
          <p className="mx-auto max-w-2xl rounded-2xl border border-white/8 bg-panel px-6 py-4 text-center text-xs leading-relaxed text-ash">
            ⚠️ <span className="font-semibold text-bone">Risk Notice.</span> $MAD is a meme coin and
            speculative digital asset. Nothing on this website is financial advice or a guarantee of
            returns. Crypto is risky and volatile — never risk money you cannot afford to lose.
          </p>
        </Reveal>
      </div>
    </>
  );
}
