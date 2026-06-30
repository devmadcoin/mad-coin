"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

/* ═══════════════════════════════════════════════════════════
   ANIMATION UTILITIES
   ═══════════════════════════════════════════════════════════ */

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return { ref, isInView };
}

function FadeIn({
  children, className = "", delay = 0, direction = "up", duration = 0.5, distance = 24,
}: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right"; duration?: number; distance?: number }) {
  const { ref, isInView } = useInView();
  const transforms = {
    up: `translateY(${distance}px)`, down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`, right: `translateX(-${distance}px)`,
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: isInView ? 1 : 0,
      transform: isInView ? "translate(0)" : transforms[direction],
      transition: `opacity ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      willChange: "opacity, transform",
    }}>
      {children}
    </div>
  );
}

function StaggerGrid({ children, className = "", staggerDelay = 0.08, baseDelay = 0 }: { children: React.ReactNode; className?: string; staggerDelay?: number; baseDelay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerDelay}s, transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerDelay}s`,
          willChange: "opacity, transform",
        }}>{child}</div>
      )) : children}
    </div>
  );
}

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
        <div key={i} className="absolute rounded-full bg-[#FF2D2D]/10 blur-sm"
          style={{
            width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animation: `floatUp ${Math.random() * 4 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const links = [
    { label: "Home", href: "/" },
    { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art", active: true },
    { label: "Rewards", href: "/rewards" },
    { label: "Merch", href: "/merch" },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-white font-black text-sm tracking-tight">$MAD</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.label} href={l.href}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                l.active ? "bg-[#FF2D2D]/10 text-[#FF2D2D]" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >{l.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE STAGE — Full-viewport video hero (already dark)
   ═══════════════════════════════════════════════════════════ */
function TheStage() {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 sm:py-28 overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">[ MAD ART ]</p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-4">
          THE <span className="text-[#FF2D2D]">MOVEMENT</span>
        </h1>
        <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed mb-8">
          Visual culture for the already-rich. Every frame is a frequency.
        </p>
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
   THE GALLERY — Dark mode
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
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/30 mb-3">Visual Archive</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            THE <span className="text-[#FF2D2D]">GALLERY</span>
          </h2>
          <p className="text-sm text-white/40 mt-3">{artworks.length} pieces. Click to view. Tap the download arrow to save.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {artworks.map((art, i) => (
            <div key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121212] aspect-square cursor-pointer hover:border-[#FF2D2D]/20 transition-all duration-300"
              onClick={() => setLightbox(art.src)}
            >
              {art.src.endsWith('.mp4') ? (
                <video autoPlay muted loop playsInline preload="auto"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
                  <source src={art.src} type="video/mp4" />
                </video>
              ) : (
                <Image src={art.src} alt={art.title} fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{art.title}</p>
                  <p className="text-[9px] text-white/60 uppercase tracking-wider">{art.type}</p>
                </div>
                <a href={art.src} download onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-[#FF2D2D] transition-colors"
                  title="Download">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#FF2D2D] transition-colors" onClick={() => setLightbox(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          {lightbox.endsWith('.mp4') ? (
            <video autoPlay muted loop playsInline controls className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg" onClick={(e) => e.stopPropagation()}>
              <source src={lightbox} type="video/mp4" />
            </video>
          ) : (
            <Image src={lightbox} alt="Full size" width={1200} height={1200}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg" onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURED BANNER — Dark mode
   ═══════════════════════════════════════════════════════════ */
function FeaturedBanner() {
  return (
    <section className="relative w-full bg-[#080808] overflow-hidden">
      <div className="relative w-full aspect-[3/1] sm:aspect-[4/1] max-h-[500px]">
        <Image src="/mad-art/mad-banner-everyone-getting-mad.png" alt="Everyone Getting MAD — MAD Rich Club" fill
          className="object-cover object-center" priority sizes="100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080808] to-transparent" />
      </div>
      <div className="bg-[#080808] px-4 sm:px-6 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/30 mb-1">Featured Art</p>
            <p className="text-lg font-black text-white">
              EVERYONE GETTING <span className="text-[#FF2D2D]">MAD</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/40">By the <span className="font-bold text-white/70">$MAD Artist</span></p>
            <span className="text-white/20">|</span>
            <p className="text-xs text-white/40">Banner vibe: <span className="font-bold text-[#FF2D2D]">9</span> (Completion)</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAD STORIES — Cinematic moments with sound (dark mode)
   ═══════════════════════════════════════════════════════════ */
function MadStories() {
  const [active, setActive] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const stories = [
    { src: "/mad-art/stories/mad-dancing.mp4", title: "MAD Dancing", desc: "The rhythm of conviction. When the beat drops, you hold." },
    { src: "/mad-art/stories/mad-winning.mp4", title: "MAD Winning", desc: "Victory is a mindset. The bag is already yours." },
    { src: "/mad-art/stories/bullish-mad.mp4", title: "Bullish MAD", desc: "The charts don't lie. The community doesn't fold." },
    { src: "/mad-art/stories/matrix-mad.mp4", title: "MATRIX MAD", desc: "Wake up. The system is the simulation. $MAD is the red pill." },
    { src: "/mad-art/stories/im-mad-getting-rugged.mp4", title: "I'M MAD GETTING RUGGED", desc: "They rugged you. You're still here. That's not failure — that's initiation." },
  ];

  const handleToggle = (i: number) => {
    if (active === i) { setActive(null); } else { setActive(i); setMuted(false); }
  };

  useEffect(() => {
    stories.forEach((_, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      if (active === i) { el.muted = muted; el.play().catch(() => {}); }
      else { el.pause(); el.currentTime = 0; el.muted = true; }
    });
  }, [active, muted]);

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#080808] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/30 mb-3">Sound On 🔊</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            MAD <span className="text-[#FF2D2D]">STORIES</span>
          </h2>
          <p className="text-sm text-white/40 mt-3 max-w-md mx-auto">Cinematic moments. Tap to play. Turn up the volume.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {stories.map((story, i) => (
            <div key={i}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121212] cursor-pointer ${
                i === 1 || i === 2 ? 'aspect-[9/16] md:aspect-[16/9] md:col-span-2' : 'aspect-[9/16]'
              }`}
              onClick={() => handleToggle(i)}
            >
              <video ref={(el) => { videoRefs.current[i] = el; }} src={story.src} loop playsInline muted={active !== i} preload="metadata"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              {active !== i && (
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <p className="text-white font-black text-lg">{story.title}</p>
                  <p className="text-white/60 text-xs mt-1 max-w-[80%] text-center">{story.desc}</p>
                </div>
              )}
              {active === i && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                      <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  </div>
                </div>
              )}
              {active === i && !muted && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2 py-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
                  </svg>
                  <span className="text-[9px] font-bold text-white">ON</span>
                </div>
              )}
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
   ANIMATED GALLERY — Looping MAD moments (dark mode)
   ═══════════════════════════════════════════════════════════ */
function AnimatedGallery() {
  const loops = [
    { src: "/mad-art/loops/mad-thinking.mp4", title: "MAD Thinking" },
    { src: "/mad-art/loops/hahaha.mp4", title: "HAHAHA" },
    { src: "/mad-art/loops/mad-excited.mp4", title: "MAD Excited" },
    { src: "/mad-art/loops/mad-planning.mp4", title: "MAD Planning" },
    { src: "/mad-art/mad-wealthy.mp4", title: "MAD Wealthy" },
    { src: "/mad-art/very-mad.mp4", title: "Very MAD" },
  ];

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/30 mb-3">Always Moving</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            MAD <span className="text-[#FF2D2D]">MOMENTS</span>
          </h2>
          <p className="text-sm text-white/40 mt-3">The energy. The emotion. The frequency. Loop it.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loops.map((loop, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121212] aspect-square">
              <video autoPlay muted loop playsInline preload="auto"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300">
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
   CTA SECTION — Dark mode
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-[#080808] border-b border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-3xl sm:text-5xl font-black text-white mb-4">
          CREATE. SHARE. <span className="text-[#FF2D2D]">GET $MAD.</span>
        </p>
        <p className="text-sm text-white/40 max-w-md mx-auto mb-8">
          Have MAD art? Tag @madrichclub_ on X. The best pieces get featured.
        </p>
        <a href="https://x.com/madrichclub_" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] text-white text-base font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,45,45,0.25)]"
        >
          Submit Art →
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function MadArtPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
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
      <Navbar />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.03),transparent_50%)]" />

      <main>
        <TheStage />
        <FeaturedBanner />
        <MadStories />
        <AnimatedGallery />
        <TheGallery />
        <CTASection />
      </main>
    </div>
  );
}
