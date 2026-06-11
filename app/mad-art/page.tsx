"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

/* ─── Scanlines ─── */
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.02]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#FF2D2D]/10 blur-sm"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatUp ${Math.random() * 4 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE STAGE — Full-viewport video hero
   ═══════════════════════════════════════════════════════════ */
function TheStage() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-end overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/loops/mad-dancing.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(8,8,8,0.5)_50%,rgba(8,8,8,0.92)_75%,#080808_100%)]" />
      </div>

      {/* Content overlay at bottom */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">
          [ MAD ART ]
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-4">
          THE <span className="text-[#FF2D2D]">MOVEMENT</span>
        </h1>
        <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed mb-8">
          Visual culture for the already-rich. Every frame is a frequency.
        </p>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-1 text-white/15">
          <span className="text-[9px] font-bold uppercase tracking-[0.34em]">Gallery Below</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE GALLERY — Full art collection with lightbox + download
   ═══════════════════════════════════════════════════════════ */
function TheGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const artworks = [
    { src: "/mad-art/mad-cyber-troll-v2.jpg", title: "Cyber Troll", type: "Character" },
    { src: "/mad-art/mad-jungle-pill.jpg", title: "Jungle Pill", type: "Scene" },
    { src: "/mad-art/mad-morning-cereal.jpg", title: "Morning Cereal", type: "Character" },
    { src: "/memes/MAD-2-MONTHS.png", title: "2 Months", type: "Milestone" },
    { src: "/memes/MAD-3-MONTHS.png", title: "3 Months", type: "Milestone" },
    { src: "/memes/MAD-ARMY.png", title: "MAD Army", type: "Community" },
    { src: "/memes/MAD-ART-1.png", title: "MAD Art #1", type: "Digital" },
    { src: "/memes/MAD-ART-2.png", title: "MAD Art #2", type: "Digital" },
    { src: "/memes/MAD-ART-3.png", title: "MAD Art #3", type: "Digital" },
    { src: "/memes/MAD-ART-4.png", title: "MAD Art #4", type: "Digital" },
    { src: "/memes/MAD-AT-BEARS.png", title: "At Bears", type: "Meme" },
    { src: "/memes/MAD-BELIEVE.png", title: "Believe", type: "Meme" },
    { src: "/memes/MAD-BELIEVING.png", title: "Believing", type: "Meme" },
    { src: "/memes/MAD-COMMUNITY.png", title: "Community", type: "Community" },
    { src: "/memes/MAD-DOCTOR.png", title: "Doctor", type: "Meme" },
    { src: "/memes/MAD-DOLLAR.png", title: "MAD Dollar", type: "Meme" },
    { src: "/memes/MAD-HOLD-ON-DEAR-LIFE.png", title: "HODL", type: "Meme" },
    { src: "/memes/MAD-KINGS-ONLY.png", title: "Kings Only", type: "Meme" },
    { src: "/memes/MAD-LAST-FARM.png", title: "Last Farm", type: "Meme" },
    { src: "/memes/MAD-NEPTUNE.png", title: "Neptune", type: "Digital" },
    { src: "/memes/MAD-RED-EYE.png", title: "Red Eye", type: "Meme" },
    { src: "/memes/MAD-RICH-BATH.png", title: "Rich Bath", type: "Digital" },
    { src: "/memes/MAD-RICH-IN-THE-TUB.png", title: "Rich in Tub", type: "Digital" },
    { src: "/memes/MAD-RICH-OR-BROKE.png", title: "Rich or Broke", type: "Meme" },
    { src: "/memes/MAD-ROLLERCOASTER.png", title: "Rollercoaster", type: "Meme" },
    { src: "/memes/MAD-SCAM-CALL.png", title: "Scam Call", type: "Meme" },
    { src: "/memes/MAD-SCHOOL.png", title: "MAD School", type: "Meme" },
    { src: "/memes/MAD-YOU-SIDELINED.png", title: "Sidelined", type: "Meme" },
    { src: "/memes/MAKE-MAD-GREAT-AGAIN.png", title: "Make MAD Great", type: "Meme" },
    { src: "/memes/WE-MAD-ZOOMIN.png", title: "We MAD Zoomin'", type: "Meme" },
    { src: "/memes/YOU-MAKE-ME-MAD.png", title: "You Make Me MAD", type: "Meme" },
    { src: "/memes/YOU-WILL-BE-MAD.png", title: "You Will Be MAD", type: "Meme" },
    { src: "/mad-art/mad-attitude.png", title: "MAD Attitude", type: "Character" },
    { src: "/mad-art/mad-this-is-fine.png", title: "This Is Fine", type: "Meme" },
    { src: "/mad-art/mad-donut-temptation.png", title: "Donut Temptation", type: "Meme" },
    { src: "/mad-art/mad-stay-mad-soldier.png", title: "STAY $MAD Soldier", type: "Character" },
    { src: "/mad-art/mad-car-wash-rain.png", title: "Car Wash Curse", type: "Meme" },
  ];

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#1a1a1a]/40 mb-3">
            Visual Archive
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a]">
            THE <span className="text-[#FF2D2D]">GALLERY</span>
          </h2>
          <p className="text-sm text-[#1a1a1a]/50 mt-3">
            {artworks.length} pieces. Click to view. Tap the download arrow to save.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {artworks.map((art, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] aspect-square cursor-pointer hover:border-[#FF2D2D]/20 transition-all duration-300"
              onClick={() => setLightbox(art.src)}
            >
              <Image
                src={art.src}
                alt={art.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{art.title}</p>
                  <p className="text-[9px] text-white/60 uppercase tracking-wider">{art.type}</p>
                </div>
                <a
                  href={art.src}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-[#FF2D2D] transition-colors"
                  title="Download"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#FF2D2D] transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <Image
            src={lightbox}
            alt="Full size"
            width={1200}
            height={1200}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAD STORIES — Cinematic moments with sound
   ═══════════════════════════════════════════════════════════ */
function MadStories() {
  const [active, setActive] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const stories = [
    {
      src: "/mad-art/stories/mad-dancing.mp4",
      title: "MAD Dancing",
      desc: "The rhythm of conviction. When the beat drops, you hold.",
    },
    {
      src: "/mad-art/stories/mad-winning.mp4",
      title: "MAD Winning",
      desc: "Victory is a mindset. The bag is already yours.",
    },
    {
      src: "/mad-art/stories/bullish-mad.mp4",
      title: "Bullish MAD",
      desc: "The charts don't lie. The community doesn't fold.",
    },
  ];

  useEffect(() => {
    stories.forEach((_, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      if (active === i) {
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }, [active]);

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#F5F1E8] border-b border-[#1a1a1a]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#1a1a1a]/40 mb-3">
            Sound On 🔊
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a]">
            MAD <span className="text-[#FF2D2D]">STORIES</span>
          </h2>
          <p className="text-sm text-[#1a1a1a]/50 mt-3 max-w-md mx-auto">
            Cinematic moments. Tap to play. Turn up the volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {stories.map((story, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] aspect-[9/16] cursor-pointer"
              onClick={() => setActive(active === i ? null : i)}
            >
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={story.src}
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Overlay when not playing */}
              {active !== i && (
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-white font-black text-lg">{story.title}</p>
                  <p className="text-white/60 text-xs mt-1 max-w-[80%] text-center">{story.desc}</p>
                </div>
              )}

              {/* Pause button when playing */}
              {active === i && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Title bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.7)_100%)]">
                <p className="text-xs font-bold text-white/80">{story.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED GALLERY — Looping MAD moments (GIF-style videos)
   ═══════════════════════════════════════════════════════════ */
function AnimatedGallery() {
  const loops = [
    { src: "/mad-art/loops/mad-thinking.mp4", title: "MAD Thinking" },
    { src: "/mad-art/loops/hahaha.mp4", title: "HAHAHA" },
    { src: "/mad-art/loops/mad-excited.mp4", title: "MAD Excited" },
    { src: "/mad-art/loops/mad-planning.mp4", title: "MAD Planning" },
  ];

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#F5F1E8] border-t border-[#1a1a1a]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#1a1a1a]/40 mb-3">
            Always Moving
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a]">
            MAD <span className="text-[#FF2D2D]">MOMENTS</span>
          </h2>
          <p className="text-sm text-[#1a1a1a]/50 mt-3">
            The energy. The emotion. The frequency. Loop it.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loops.map((loop, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] aspect-square"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              >
                <source src={loop.src} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs font-bold text-white">{loop.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-[#F5F1E8] border-t border-[#1a1a1a]/10">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-4">
          CREATE. SHARE. <span className="text-[#FF2D2D]">GET $MAD.</span>
        </p>
        <p className="text-sm text-[#1a1a1a]/50 max-w-md mx-auto mb-8">
          Have MAD art? Tag @madrichclub_ on X. The best pieces get featured.
        </p>
        <a
          href="https://x.com/madrichclub_"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF2D2D] hover:bg-[#FF6B00] text-white text-base font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,45,45,0.25)]"
        >
          Submit Art →
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a]/10 px-4 sm:px-6 py-10 bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
          <div>
            <span className="text-[#1a1a1a] font-black text-sm">$MAD</span>
            <span className="block text-[#1a1a1a]/40 text-[9px] tracking-[0.3em] uppercase">MAD Art</span>
          </div>
        </div>
        <p className="text-[#1a1a1a]/35 text-[10px] font-medium">
          Visual culture for the already-rich.
        </p>
        <a href="/" className="text-[#1a1a1a]/40 text-[10px] font-bold hover:text-[#FF2D2D] transition-colors">
          ← Back to Home
        </a>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function MadArtPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>
      <Scanlines />
      <FloatingParticles />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.03),transparent_50%)]" />

      <main>
        <TheStage />
        <MadStories />
        <AnimatedGallery />
        <TheGallery />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
