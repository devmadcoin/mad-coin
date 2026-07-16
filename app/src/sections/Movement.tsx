import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import SectionHeading from "@/components/SectionHeading";
import { STATS, LINKS } from "@/lib/data";

export default function Movement() {
  return (
    <section id="movement" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(234,32,34,0.06),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Movement"
          title={<>
            Welcome to the
            <br />
            <span className="text-mad">MAD FAM</span>
          </>
          }
          sub="We're regular people who got tired of empty promises. Creators, gamers, artists, and everyday people who chose Motivation, Alignment, and Discipline over excuses. We don't just dream — we GET MAD and make it real."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/8 bg-panel p-8 text-center transition-all duration-500 hover:border-mad/40 hover:shadow-glow-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mad/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="font-display text-5xl text-mad sm:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ash">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <a
            href={LINKS.xCommunity}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-mad/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-mad-bright transition-all duration-300 hover:bg-mad hover:text-white hover:shadow-glow"
          >
              𝕏 Join the X Community
            </a>
        </Reveal>
      </div>
    </section>
  );
}
