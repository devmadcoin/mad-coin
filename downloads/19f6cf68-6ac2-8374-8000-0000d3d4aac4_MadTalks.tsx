import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionHeading from "@/components/SectionHeading";
import { TALKS } from "@/lib/data";

export default function MadTalks() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Real conversations · Real conviction"
          title={
            <>
              MAD <span className="text-mad">Talks</span>
            </>
          }
        />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-mad">
                Featured Episode
              </span>
              <h3 className="mt-4 font-display text-3xl uppercase leading-tight text-bone sm:text-4xl">
                The <span className="text-mad">MAD Mind</span> Unfiltered
              </h3>
              <p className="mt-5 max-w-lg leading-relaxed text-ash">{TALKS.copy}</p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8">
              <a
                href={`https://www.youtube.com/watch?v=${TALKS.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-mad px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                Watch on YouTube ↗
              </a>
            </Reveal>
          </div>
          <Reveal className="order-1 lg:order-2">
            <TiltCard className="rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl border border-mad/25 shadow-glow-sm">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${TALKS.videoId}?rel=0&modestbranding=1`}
                    title="MAD Talks"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
