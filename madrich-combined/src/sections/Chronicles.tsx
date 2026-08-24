import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/TiltCard";
import { EPISODES } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Chronicles() {
  return (
    <section id="chronicles" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How I got MAD 😡"
          title={
            <>
              MAD <span className="text-mad">Chronicles</span>
            </>
          }
          sub="The animated story of how regular people got MAD. New episodes drop weekly."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {EPISODES.map((ep, i) => (
            <Reveal key={ep.n} delay={i * 0.1}>
              <TiltCard className="rounded-3xl" max={6}>
                <div
                  className={cn(
                    "group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-3xl border p-7 transition-all duration-500",
                    ep.videoId
                      ? "border-white/10 bg-panel hover:border-mad/50 hover:shadow-glow-sm"
                      : "border-dashed border-white/12 bg-panel/50",
                  )}
                >
                  <span className="pointer-events-none absolute -top-6 right-2 select-none font-display text-[11rem] leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-mad/10">
                    {ep.n}
                  </span>

                  {ep.videoId ? (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(234,32,34,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">
                          Episode {ep.n}
                        </span>
                        <h3 className="mt-2 font-display text-3xl uppercase text-bone">{ep.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-ash">{ep.copy}</p>
                        <a
                          href={`https://youtube.com/shorts/${ep.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center gap-2 rounded-full bg-mad px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 group-hover:shadow-glow"
                        >
                          ▶ Watch Now
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
                        Episode {ep.n} · Coming Soon
                      </span>
                      <h3 className="mt-2 font-display text-3xl uppercase text-ash">{ep.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ash/70">{ep.copy}</p>
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-ash">
                        ⏳ In Production
                      </div>
                    </div>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
