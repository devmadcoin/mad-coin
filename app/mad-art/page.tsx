"use client";

import Image from "next/image";

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
          <source src="/art/mad-dancing.mp4" type="video/mp4" />
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
   THE GALLERY — Art collection grid
   ═══════════════════════════════════════════════════════════ */
function TheGallery() {
  const artworks = [
    { src: "/memes/MAD-ART-1.png", title: "MAD Art #1", type: "Digital" },
    { src: "/memes/MAD-ART-2.png", title: "MAD Art #2", type: "Pixel" },
    { src: "/memes/MAD-ART-3.png", title: "MAD Art #3", type: "3D Render" },
    { src: "/memes/MAD-ART-4.png", title: "MAD Art #4", type: "Meme" },
    { src: "/memes/MAD-RICH-IN-THE-TUB.png", title: "Mad Rich in the Tub", type: "Lifestyle" },
    { src: "/memes/MAD-RICH-BATH.png", title: "The Bath", type: "Digital" },
  ];

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#1a1a1a]/40 mb-3">
            Visual Archive
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a]">
            THE <span className="text-[#FF2D2D]">GALLERY</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {artworks.map((art, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] aspect-square cursor-pointer hover:border-[#FF2D2D]/20 transition-all duration-300"
            >
              <Image
                src={art.src}
                alt={art.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs font-bold text-white">{art.title}</p>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">{art.type}</p>
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
        <TheGallery />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
