import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { MAP_BUSINESSES } from "@/lib/pages-data";

export default function MapPage() {
  return (
    <PageShell
      eyebrow="The $MAD Network"
      title={
        <>
          <span className="text-mad">MAD</span> WORLD
        </>
      }
      sub="Real businesses accepting $MAD. Click through to connect."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {MAP_BUSINESSES.map((biz, i) => (
          <Reveal key={biz.id} delay={i * 0.05}>
            <div className="flex h-full flex-col rounded-3xl border border-white/8 bg-panel p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mad">{biz.type}</p>
              <h3 className="mt-2 font-display text-2xl uppercase text-bone">{biz.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{biz.description}</p>
              <p className="mt-4 font-mono text-xs text-ash">{biz.address}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ash/70">{biz.hours}</p>
              <a
                href={biz.website}
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-bone transition-all hover:border-mad/50 hover:text-mad-bright"
              >
                Visit
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
