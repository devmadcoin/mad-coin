"use client";

import Link from "next/link";
import MadClawIdentity from "./components/MadClawIdentity";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const LINKS = {
  telegram: "https://t.me/MadRichClub",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
};

/* ─── Scanlines (subtle on crème) ─── */
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

/* ─── Floating Particles (ambient) ─── */
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
   MAD MIND — The Frequency Gate
   You are either $MAD or you are waiting.

   V5: Cinematic hero with MAD Claw background. Deployed 2026-05-23.
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <Scanlines />
      <FloatingParticles />

      <main>
        <MadClawIdentity />
      </main>

      <Disclaimer />
      <Footer />
    </div>
  );
}

/* ─── Disclaimer ─── */
function Disclaimer() {
  return (
    <section className="px-4 sm:px-6 py-10 bg-[#F5F1E8] border-t border-[#1a1a1a]/10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-[#FF2D2D]/50">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p className="text-[11px] leading-relaxed text-[#1a1a1a]/50 text-center">
            <span className="font-bold text-[#1a1a1a]/70">$MAD is a memecoin for entertainment purposes only.</span> Not financial advice. 
            Cryptocurrency may lose value. DYOR. <span className="text-[#FF2D2D]/70 font-bold">No guarantees. No refunds. No hand-holding.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const nav = [
    { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art" },
    { label: "Rewards", href: "/rewards" },
    { label: "Merch", href: "/merch" },
  ];

  const socials = [
    { icon: "tg", label: "Telegram", href: LINKS.telegram },
    { icon: "x", label: "X", href: LINKS.x },
    { icon: "ig", label: "Instagram", href: LINKS.instagram },
    { icon: "tt", label: "TikTok", href: LINKS.tiktok },
  ];

  return (
    <footer className="border-t border-[#1a1a1a]/10 px-4 sm:px-6 py-12 sm:py-16 bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Left — Brand + tagline + socials */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-xl shrink-0">
              M
            </div>
            <div>
              <span className="text-[#1a1a1a] font-black text-xl tracking-tight">$MAD</span>
              <span className="block text-[#1a1a1a]/40 text-[10px] tracking-[0.3em] uppercase font-bold">STAY $MAD</span>
            </div>
          </div>
          <p className="text-sm text-[#1a1a1a]/50 leading-relaxed max-w-xs mb-6">
            The Supreme of Solana. Limited. Exclusive. Cult.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-full border border-[#1a1a1a]/15 bg-transparent flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#FF2D2D] hover:border-[#FF2D2D]/30 transition-all duration-300"
              >
                {s.icon === "tg" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                )}
                {s.icon === "x" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )}
                {s.icon === "ig" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                )}
                {s.icon === "tt" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right — Navigation */}
        <div className="md:text-right">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-5">NAVIGATION</p>
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm font-bold text-[#1a1a1a]/60 hover:text-[#FF2D2D] transition-colors duration-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#1a1a1a]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-[#1a1a1a]/30">
          Doxxed. Building. Not asking permission.
        </p>
        <p className="text-[10px] text-[#1a1a1a]/30 font-mono">
          {CA.slice(0, 12)}...{CA.slice(-4)}
        </p>
      </div>
    </footer>
  );
}
