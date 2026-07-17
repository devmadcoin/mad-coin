import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { ART_LOOPS, GALLERY } from "@/lib/pages-data";
import { LINKS } from "@/lib/data";

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const art = GALLERY[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-lg"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl text-ash transition-colors hover:border-mad hover:text-mad-bright">
        ✕
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-ash transition-colors hover:border-mad hover:text-mad-bright sm:left-6"
      >
        ←
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-ash transition-colors hover:border-mad hover:text-mad-bright sm:right-6"
      >
        →
      </button>
      <motion.div
        key={index}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={art.src} alt={art.title} className="max-h-[72vh] w-auto rounded-2xl border border-mad/30 shadow-glow" />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-display text-xl uppercase text-bone">{art.title}</p>
            <p className="font-mono text-xs text-ash">{art.tag} · {index + 1}/{GALLERY.length}</p>
          </div>
          <a
            href={art.src}
            download
            className="rounded-full bg-mad px-5 py-2 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-glow"
          >
            ↓ Save
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MadArt() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <PageShell
      eyebrow="MAD Art"
      title={<>Everyone Getting <span className="text-mad">MAD</span></>}
      sub="Visual culture for the already-rich. Every frame is a frequency — by the $MAD Artist and the FAM."
    >
      {/* loops */}
      <Reveal>
        <h2 className="font-display text-2xl uppercase text-bone sm:text-3xl">
          MAD <span className="text-mad">Moments</span>
        </h2>
        <p className="mt-2 text-sm text-ash">The energy. The emotion. The frequency. Loop it.</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ART_LOOPS.map((l, i) => (
          <Reveal key={l.label} delay={i * 0.06}>
            <div className="group overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:border-mad/50 hover:shadow-glow-sm">
              <video
                src={l.src}
                autoPlay
                loop
                muted
                playsInline
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <p className="bg-panel px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-ash">
                {l.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* gallery */}
      <Reveal className="mt-16">
        <h2 className="font-display text-2xl uppercase text-bone sm:text-3xl">
          The <span className="text-mad">Gallery</span>
        </h2>
        <p className="mt-2 text-sm text-ash">{GALLERY.length} pieces. Click to view. Tap the arrow to save.</p>
      </Reveal>
      <div className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {GALLERY.map((g, i) => (
          <button
            key={g.src}
            onClick={() => setOpen(i)}
            className="group relative block w-full overflow-hidden rounded-2xl border border-white/8 transition-all duration-500 hover:border-mad/50 hover:shadow-glow-sm"
          >
            <img src={g.src} alt={g.title} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="p-3 text-left">
                <p className="text-sm font-bold text-bone">{g.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mad-bright">{g.tag}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* submit */}
      <Reveal className="mt-16 text-center">
        <h2 className="font-display text-3xl uppercase text-bone sm:text-4xl">
          Create. Share. <span className="text-mad">Get $MAD.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ash">
          Have MAD art? Tag @madrichclub_ on X. The best pieces get featured.
        </p>
        <a
          href={LINKS.x}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-mad px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg"
        >
          Submit Art →
        </a>
      </Reveal>

      <AnimatePresence>
        {open != null && (
          <Lightbox
            index={open}
            onClose={() => setOpen(null)}
            onNav={(d) => setOpen((o) => o == null ? o : (o + d + GALLERY.length) % GALLERY.length)}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}
