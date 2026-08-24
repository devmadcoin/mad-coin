import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { DROP, LINKS } from "@/lib/data";

export default function LatestDrop() {
  return (
    <section id="drop" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <TiltCard className="rounded-3xl">
            <div className="relative overflow-hidden rounded-3xl border border-mad/25 shadow-glow-sm">
              <div className="absolute -inset-10 -z-10 bg-mad/15 blur-[60px]" />
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${DROP.videoId}?rel=0&modestbranding=1`}
                  title="Latest Drop"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </TiltCard>
        </Reveal>

        <div>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-mad">
              Latest Drop
            </span>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-bone sm:text-5xl">
              Coffee Blox <span className="text-mad">x</span> SugarStar
              <span className="mt-1 block text-2xl text-ash sm:text-3xl">🧈😡 {DROP.tag}</span>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ash">{DROP.copy}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-mad px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all duration-300 hover:scale-105 hover:shadow-glow"
            >
              ▶ Watch the Drop
            </a>
            <div className="rounded-2xl border border-dashed border-white/15 px-5 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
                Next episode
              </span>
              <p className="text-sm font-semibold text-bone">Coming Soon — the story continues…</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
