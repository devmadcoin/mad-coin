import Reveal from "@/components/Reveal";
import { LINKS } from "@/lib/data";

export default function Join() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(234,32,34,0.14),transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-mad">
            Ready?
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-bone sm:text-7xl">
            Get <span className="text-mad">$MAD</span> Rich.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash">
            The FAM is building. The games are live. The dev is doxxed. The only question left is:
            are you in, or are you watching?
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-mad px-9 py-4 text-base font-bold uppercase tracking-wider text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-lg"
          >
            Buy $MAD →
          </a>
          <a
            href={LINKS.x}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-9 py-4 text-sm font-bold uppercase tracking-wider text-bone transition-all duration-300 hover:border-mad/50 hover:text-mad-bright"
          >
            𝕏 Follow @madrichclub_
          </a>
        </Reveal>
      </div>
    </section>
  );
}
