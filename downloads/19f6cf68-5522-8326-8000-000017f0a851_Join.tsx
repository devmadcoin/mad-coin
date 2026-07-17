import Reveal from "@/components/Reveal";
import CaPill from "@/components/CaPill";
import EmberCanvas from "@/components/EmberCanvas";
import { LINKS } from "@/lib/data";

export default function Join() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_60%,rgba(234,32,34,0.13),transparent_70%)]" />
      <EmberCanvas density={36} />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <img
            src="/assets/mad-face.png"
            alt=""
            className="mx-auto mb-8 h-20 w-20 animate-floaty drop-shadow-[0_0_25px_rgba(234,32,34,0.5)]"
          />
          <h2 className="font-display text-5xl uppercase leading-[0.95] text-bone sm:text-7xl">
            Join the
            <br />
            <span className="text-mad drop-shadow-[0_0_35px_rgba(234,32,34,0.5)]">MAD FAM</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ash">
            The world is full of opportunities, but the world runs on MAD — Motivation, Alignment,
            and Discipline. We are building something that will last.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={LINKS.youtube}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-mad px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            ▶ Subscribe on YouTube
          </a>
          <a
            href={LINKS.x}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-bone transition-all duration-300 hover:border-mad/60 hover:text-mad-bright"
          >
            𝕏 Follow on X
          </a>
        </Reveal>

        <Reveal delay={0.25} className="mt-8 flex justify-center">
          <CaPill />
        </Reveal>
      </div>
    </section>
  );
}
