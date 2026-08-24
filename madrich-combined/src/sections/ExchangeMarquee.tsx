import { EXCHANGES } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function ExchangeMarquee() {
  return (
    <section className="relative border-b border-white/5 py-14">
      <Reveal>
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-ash">
          Listed &amp; verified on
        </p>
      </Reveal>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee-slow items-center gap-16 pr-16">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center gap-16">
              {EXCHANGES.map((ex) => (
                <a
                  key={`${half}-${ex.name}`}
                  href={ex.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-3 opacity-45 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                >
                  <img src={ex.img} alt={ex.name} className="h-8 w-auto object-contain" />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
