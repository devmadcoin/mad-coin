import { useRef } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { TALKS } from "@/lib/data";

export default function CommandCenter() {
  const dragRef = useRef<HTMLDivElement>(null);

  return (
    <section id="command" className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Voice"
          title={
            <>
              MAD <span className="text-mad">Talks</span>
            </>
          }
          sub="Raw conversations. No scripts. Just the FAM telling their truth."
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
            <div className="flex h-[340px] w-[560px] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/8 bg-panel">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${TALKS.videoId}?rel=0&modestbranding=1`}
                  title={TALKS.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Latest Talk</p>
                <h4 className="mt-2 font-display text-xl uppercase text-bone">{TALKS.title}</h4>
                <p className="mt-2 text-sm text-ash">{TALKS.copy}</p>
              </div>
            </div>

            <div className="flex h-[340px] w-[400px] shrink-0 flex-col justify-center rounded-3xl border border-dashed border-white/12 bg-panel/50 p-8 text-center">
              <span className="text-4xl">🎙️</span>
              <h4 className="mt-4 font-display text-xl uppercase text-bone">Your Story Here?</h4>
              <p className="mt-2 text-sm text-ash">
                Want to share your MAD journey? DM @madrichclub_ and let's talk.
              </p>
            </div>
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
