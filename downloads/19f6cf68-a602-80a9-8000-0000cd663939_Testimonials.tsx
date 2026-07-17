import { useRef } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { TESTIMONIALS, type Testimonial } from "@/lib/data";

function Card({ t }: { t: Testimonial }) {
  const inner = (
    <div className="flex h-full w-[320px] shrink-0 flex-col rounded-3xl border border-white/8 bg-panel p-6 transition-colors duration-300 hover:border-mad/40 sm:w-[360px]">
      <div className="mb-4 flex items-center gap-3">
        <img
          src={t.pfp}
          alt={t.name}
          className="h-11 w-11 rounded-full border border-white/10 object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-bone">{t.name}</p>
          <p className="truncate font-mono text-xs text-ash">{t.handle}</p>
        </div>
        <span className="ml-auto text-lg text-ash">𝕏</span>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-bone/85">“{t.quote}”</p>
      {t.proof && (
        <img
          src={t.proof}
          alt={`${t.name} proof`}
          loading="lazy"
          className="mt-4 h-36 w-full rounded-2xl border border-white/8 object-cover"
        />
      )}
      <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-mad">
        Verified FAM ↗
      </span>
    </div>
  );
  return t.url ? (
    <a href={t.url} target="_blank" rel="noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default function Testimonials() {
  const dragRef = useRef<HTMLDivElement>(null);

  return (
    <section id="fam" className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What the MAD FAM says"
          title={
            <>
              Real People. <span className="text-mad">Real Conviction.</span>
            </>
          }
          sub="Drag through the voices of the FAM — campus meetups, sticker drops, promo videos, and holders who made it personal."
        />
      </div>

      <Reveal>
        <div ref={dragRef} className="cursor-grab overflow-hidden pl-4 active:cursor-grabbing sm:pl-[max(1rem,calc((100vw-72rem)/2))]">
          <motion.div
            drag="x"
            dragConstraints={dragRef}
            dragElastic={0.08}
            className="flex w-max gap-5 pr-8"
          >
            {TESTIMONIALS.map((t) => (
              <Card key={t.handle} t={t} />
            ))}
          </motion.div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ash">
          ⟵ drag to explore ⟶
        </span>
      </Reveal>
    </section>
  );
}
