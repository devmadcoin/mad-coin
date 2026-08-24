import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { ARTWORKS, LOOPS } from "@/lib/pages-data";

export default function MadArt() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[3/1] w-full max-h-[500px]">
          <img
            src="/mad-art/mad-banner-everyone-getting-mad.png"
            alt="Everyone Getting MAD"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        </div>
        <div className="border-b border-white/5 bg-ink px-4 py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-ash">Featured Art</p>
              <p className="mt-1 font-display text-lg uppercase text-bone">
                EVERYONE GETTING <span className="text-mad">MAD</span>
              </p>
            </div>
            <p className="font-mono text-xs text-ash">
              By the <span className="font-bold text-bone">$MAD Artist</span> · Banner vibe: 9 (Completion)
            </p>
          </div>
        </div>
      </div>

      <PageShell
        eyebrow="[ MAD ART ]"
        title={
          <>
            THE <span className="text-mad">MOVEMENT</span>
          </>
        }
        sub="Visual culture for the already-rich. Every frame is a frequency."
      >
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-ash">Gallery Below</span>
        </div>

        <div className="mt-16">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ash">Always Moving</p>
            <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
              MAD <span className="text-mad">MOMENTS</span>
            </h2>
            <p className="mt-2 text-sm text-ash">The energy. The emotion. The frequency. Loop it.</p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LOOPS.map((loop, i) => (
              <Reveal key={loop.label} delay={i * 0.05}>
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-panel">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <source src={loop.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs font-bold text-bone">{loop.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-ash">Visual Archive</p>
            <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
              THE <span className="text-mad">GALLERY</span>
            </h2>
            <p className="mt-2 text-sm text-ash">
              {ARTWORKS.length} pieces. Click to view. Tap the download arrow to save.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ARTWORKS.map((art, i) => (
              <Reveal key={art.title} delay={i * 0.03}>
                <div
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-panel"
                  onClick={() => setLightbox(art.src)}
                >
                  <img
                    src={art.src}
                    alt={art.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.7)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 flex translate-y-full items-end justify-between p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <div>
                      <p className="text-xs font-bold text-bone">{art.title}</p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-ash">{art.tag}</p>
                    </div>
                    <a
                      href={art.src}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-bone backdrop-blur transition-colors hover:bg-mad"
                      title="Download"
                    >
                      ⬇
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Reveal>
            <div className="rounded-3xl border border-mad/20 bg-mad/[0.03] p-8 sm:p-12">
              <h2 className="font-display text-3xl uppercase text-bone sm:text-5xl">
                CREATE. SHARE. <span className="text-mad">GET $MAD.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-ash">
                Have MAD art? Tag @madrichclub_ on X. The best pieces get featured.
              </p>
              <a
                href="https://x.com/madrichclub_"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mad px-8 py-4 text-base font-bold text-white shadow-glow transition-all hover:scale-[1.02]"
              >
                Submit Art →
              </a>
            </div>
          </Reveal>
        </div>
      </PageShell>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-bone transition-colors hover:bg-mad"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            <img
              src={lightbox}
              alt="Full size"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
