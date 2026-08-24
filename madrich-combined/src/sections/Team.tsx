import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/TiltCard";
import { TEAM } from "@/lib/data";

export default function Team() {
  return (
    <section id="team" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The people"
          title={
            <>
              The <span className="text-mad">Architects</span>
            </>
          }
          sub="Public. Real. Building in the open."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <TiltCard className="rounded-3xl" max={10}>
                <div className="group flex h-full flex-col items-center rounded-3xl border border-white/8 bg-panel p-8 text-center transition-all duration-500 hover:border-mad/45 hover:shadow-glow-sm">
                  <div className="relative">
                    <div className="absolute inset-0 -z-0 scale-110 rounded-full bg-mad/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <img
                      src={m.img}
                      alt={m.name}
                      loading="lazy"
                      className="relative h-24 w-24 rounded-full border-2 border-mad/30 object-cover transition-all duration-500 group-hover:border-mad group-hover:shadow-glow-sm"
                    />
                  </div>
                  <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mad">
                    {m.role}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-bone">{m.name}</h3>
                  <p className="font-mono text-xs text-ash">{m.sub}</p>
                  <div className="mt-5 flex gap-2">
                    {m.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ash transition-all duration-300 hover:border-mad/50 hover:text-mad-bright"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          <Reveal delay={0.35}>
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-mad/30 bg-mad/[0.03] p-8 text-center">
              <span className="text-4xl">😡</span>
              <h3 className="mt-4 font-display text-xl uppercase text-bone">You?</h3>
              <p className="mt-2 max-w-[220px] text-sm text-ash">
                The FAM is built by people who show up. Get MAD. Get involved.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
