"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import MadCommandCenter from "./components/MadCommandCenter";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  telegram: "https://t.me/MadRichClub",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  buy: "https://jup.ag/?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  chart: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  jupiter: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  solscan: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  birdeye: "https://birdeye.so/solana/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  okx: "https://web3.okx.com/dex-swap?chain=solana,solana&token=11111111111111111111111111111111,Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  gate: "https://www.gate.com/alpha/sol-Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dexscreener: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  mexc: "https://www.mexc.com/dex/trade?pair_ca=Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs&chain_id=100000&token_ca=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump&from=search",
  game: "https://www.roblox.com/games/123392566067659/Mad-Phonk-Awakening",
  youtube: "https://youtube.com/@coffeecollectshq",
} as const;

/* ═══════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════ */

function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), timeout); }
    catch { /* ignore */ }
  };
  return { copied, copy };
}

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

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: "World", href: "#world" },
    { label: "Chronicles", href: "#chronicles" },
    { label: "FAM", href: "#fam" },
    { label: "Proof", href: "#proof" },
    { label: "Team", href: "#team" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">
            M
          </div>
          <span className="text-white font-black text-sm tracking-tight">$MAD</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-[#FF2D2D] transition-colors">
              {n.label}
            </a>
          ))}
        </div>
        <a href={LINKS.buy} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-[#FF2D2D] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#FF2D2D]/80 transition-colors">
          Join FAM
        </a>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
/* ═══════════════════════════════════════════════════════════
   VIDEO BANNER — Full logo visible, no cropping
   ═══════════════════════════════════════════════════════════ */
function VideoBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-white flex items-center justify-center">
      <video
        autoPlay muted loop playsInline preload="auto"
        className="w-full h-auto object-contain"
      >
        <source src="/game/mad-banner.mp4" type="video/mp4" />
      </video>
      {/* Fade to black at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(180deg,transparent,#080808)]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STOP PANICKING — Bold statement between banner and hero
   ═══════════════════════════════════════════════════════════ */
function StopPanicking() {
  return (
    <section className="relative py-16 sm:py-20 bg-[#080808] overflow-hidden">
      {/* Subtle red glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,45,0.08),transparent_60%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-[-0.02em]">
          <span className="text-white">STOP</span>
          <br />
          <span className="text-[#FF2D2D]">PANICKING.</span>
          <br />
          <span className="text-white">GET </span>
          <span className="text-[#22c55e]">$MAD</span>
          <br />
          <span className="text-white">RICH.</span>
        </h2>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════ */
function CopyButtonInline({ text }: { text: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button onClick={() => copy(text)} className="text-white/30 hover:text-[#FF2D2D] transition-colors">
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAD FAM — Community Identity (like Pudgy's "The Huddle")
   ═══════════════════════════════════════════════════════════ */
function TheMADFAM() {
  const stats = [
    { value: "519+", label: "MAD FAM Members" },
    { value: "7", label: "Communities Locked" },
    { value: "1", label: "Live Roblox Game" },
    { value: "∞", label: "Vibes" },
  ];

  return (
    <section id="fam" className="relative py-24 sm:py-32 bg-[#080808] overflow-hidden">
      {/* Light red glow behind content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,45,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,45,45,0.06),transparent_50%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-4">
              The Movement
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1]">
              Welcome to the<br />
              <span className="text-[#FF2D2D]">MAD FAM</span>
            </h2>
            <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-8">
              We're regular people who got tired of empty promises. So we built something different. 
              The MAD FAM is a worldwide family of doers — creators, gamers, artists, and everyday people 
              who chose <span className="text-white font-bold">Motivation, Alignment, and Discipline</span> over excuses. 
              We don't just dream. We <span className="text-[#FF2D2D] font-black">GET MAD</span> and make it real.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <p className="text-2xl sm:text-3xl font-black text-[#FF2D2D]">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <a href="https://x.com/i/communities/2019256566248312879" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#FF2D2D]/20 text-[#FF2D2D] text-xs font-bold uppercase tracking-wider hover:bg-[#FF2D2D]/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Join the X Community
            </a>
          </div>

          {/* Right — Community grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              {[
                "/testimonials/dkwtt-chadwick-pfp.png",
                "/testimonials/kimdunk77-pfp.png",
                "/testimonials/mluffy-pfp.png",
                "/testimonials/sapient-pfp.png",
              ].map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5">
                  <Image src={src} alt="MAD FAM member" fill className="object-cover" sizes="200px" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
                </div>
              ))}
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 px-4 py-3 rounded-2xl bg-[#FF2D2D] text-white">
              <p className="text-xs font-black">MAD FAM</p>
              <p className="text-[9px] font-bold opacity-70">EST. 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENTER THE MAD WORLD — Ecosystem (Azuki-style multiple entry)
   ═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   MAD CHRONICLES — Episodic Content (Azuki anime model)
   ═══════════════════════════════════════════════════════════ */
function Chronicles() {
  return (
    <section id="chronicles" className="relative py-24 sm:py-32 bg-[#080808] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,45,45,0.05),transparent_50%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video — vertical/portrait orientation */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-[0_0_60px_rgba(255,45,45,0.1)]">
              <iframe
                src="https://www.youtube.com/embed/xXHGyQz0i5Y?autoplay=0&rel=0&modestbranding=1"
                title="MAD Chronicles: Episode 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ border: "none" }}
              />
            </div>
            {/* Glow behind video */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,45,0.12),transparent_60%)]" />
          </div>

          {/* Content */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-4">
              HOW I GOT MAD 😡
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Episode 1:<br />
              <span className="text-[#FF2D2D]">The Betrayal</span>
            </h2>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              They promised everything. They delivered nothing. But you didn't quit — you got MAD. 
              This is the origin story of every MAD FAM member. The moment that started it all.
            </p>

            <a href="https://youtube.com/shorts/xXHGyQz0i5Y?si=r0y8UzKDErqDW4qw" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF2D2D] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FF2D2D]/80 transition-colors"
            >
              Watch Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>

            {/* Coming next */}
            <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">Coming Next</p>
              <p className="text-sm font-bold text-white/60">Episode 2: Coming Soon</p>
              <p className="text-xs text-white/20 mt-1">The next chapter is loading...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   BUILT DIFFERENT — Trust signals (reframed as proof-of-work)
   ═══════════════════════════════════════════════════════════ */
function BuiltDifferent() {
  const proofs = [
    { icon: "👤", title: "Public Founder", desc: "Coffee Collects. Real face. Real name. No hiding." },
    { icon: "🎮", title: "Real Game", desc: "Mad Phonk Awakening on Roblox. Live. Playable. Crushing." },
    { icon: "🔐", title: "7 Communities", desc: "Tokens locked to 2060. Proof over promises." },
    { icon: "🚫", title: "No BS", desc: "No hidden fees. No insider deals. Fair for everyone." },
    { icon: "📺", title: "3 YouTube Channels", desc: "Coffee Collects HQ, VR, Blox. Content machine." },
    { icon: "🌎", title: "Global FAM", desc: "Indonesia, Nigeria, Russia, USA. The MAD FAM is everywhere." },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-4">
            Proof of Work
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Built <span className="text-[#FF2D2D]">Different</span>
          </h2>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            While others promise, we ship. Here's the receipt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proofs.map((p) => (
            <div key={p.title} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#FF2D2D]/20 transition-all duration-300">
              <span className="text-2xl mb-3 block">{p.icon}</span>
              <p className="text-sm font-black text-white mb-1">{p.title}</p>
              <p className="text-xs text-white/30 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROOF OF MAD — Testimonials (keep existing data)
   ═══════════════════════════════════════════════════════════ */
function StarRating() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FF2D2D" className="opacity-60">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ProofOfMAD() {
  const testimonials = [
    {
      name: "Abraxas",
      handle: "@abraxas",
      image: "/testimonials/abraxas-pfp.png",
      role: "$MAD Holder · Giveaway Winner",
      quote: "When I first encountered Mad Rich, I won a 200k MAD giveaway. The profits on holding the $120 worth of $MAD lasted me 2 months. $MAD relieved me of most my debts. $MAD saved me during the hard times.",
      date: "Shared via DM · With permission",
      link: "https://x.com/madrichclub_/status/2052836164311322949",
    },
    {
      name: "DKWTT",
      handle: "@lit_terrestrial",
      image: "/testimonials/dkwtt-chadwick-pfp.png",
      role: "$MAD Merch Buyer",
      quote: "Ordered the $MAD American Dad hat on the day that my Dad passed, he was an Army Veteran as well. This is not just a hat to me, $MAD is not just a meme coin to me, Its deeper than just a feeling... It's Motivation Alignment & Discipline.",
      date: "May 26, 2026 · 603 Views",
      link: "https://x.com/lit_terrestrial/status/2059486216567824581?s=20",
    },
    {
      name: "KIMDUNK77",
      handle: "@KIMDUNK77",
      image: "/testimonials/kimdunk77-pfp.png",
      role: "$MAD Community Builder",
      quote: "The long road to $MAD 😡 so that everyone knows $MAD 😡 Everyday, everywhere $MAD 😡 STAY $MAD 😡",
      date: "May 31, 2026 · Promoting $MAD in Indonesia",
      link: "https://x.com/KIMDUNK77/status/2061078380376936606?s=20",
    },
    {
      name: "Luffy",
      handle: "@mluffy_onsol",
      image: "/testimonials/mluffy-pfp.png",
      role: "$MAD Campus Ambassador",
      quote: "Today, a few friends and I organized a small Web3 meetup in school to introduce more people to $MAD Coin. It was great seeing students genuinely curious about blockchain, digital communities, and what @madrichclub_ is building.",
      date: "June 25, 2026 · 676 Views",
      link: "https://x.com/mluffy_onsol/status/2070074141906985200?s=20",
    },
    {
      name: "crypt0wiz",
      handle: "@crypt0wiz__",
      image: null,
      initial: "C",
      role: "$MAD Rich",
      quote: "The second you stop caring about the noise, you become unstoppable. Not because you're numb. Because you finally see the matrix for what it is. And once you see it, you can never unsee it. That quiet exhale. That moment you stop caring. That is where $MAD Rich begins.",
      date: "June 23, 2026 · 3.5K Likes",
      link: "https://x.com/crypt0wiz__/status/2069216610804486539?s=20",
    },
  ];

  return (
    <section id="proof" className="relative py-24 sm:py-32 bg-[#080808]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-4">
            From the FAM
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Proof of <span className="text-[#FF2D2D]">MAD</span>
          </h2>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            Real people. Real stories. Real impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                {t.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <Image src={t.image} alt={t.name} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center">
                    <span className="text-sm font-black text-[#FF2D2D]">{t.initial}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-black text-white">{t.name}</p>
                  <p className="text-[10px] text-white/30">{t.role}</p>
                </div>
              </div>
              <blockquote className="text-sm text-white/50 leading-relaxed italic mb-4">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <p className="text-[10px] text-white/20">{t.date}</p>
                <a href={t.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-white/30 hover:text-[#FF2D2D] transition-colors">
                  See on X →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE ARCHITECTS — Team
   ═══════════════════════════════════════════════════════════ */
function Architects() {
  const team = [
    { role: "Dev / Founder", name: "$MAD Dev", handle: "Coffee Collects", image: "/team/mad-dev-coffee-collects.png", links: [{ label: "X", href: "https://x.com/madrichclub_" }, { label: "YouTube", href: "https://www.youtube.com/@CoffeeCollectsHQ" }] },
    { role: "Community Builder", name: "crypto guru", handle: "@followdv80", image: "/rewards/crypto-guru-followdv80.png", links: [{ label: "X", href: "https://x.com/followdv80" }] },
    { role: "Community Builder", name: "Perspective 360", handle: "@Derrick152667", image: "/rewards/perspective-360-kakashi.png", links: [{ label: "X", href: "https://x.com/Derrick152667" }] },
    { role: "Community Builder", name: "Dino", handle: "@Iam__dino9", image: "/team/dino-moderator.png", links: [{ label: "X", href: "https://x.com/Iam__dino9" }] },
    { role: "Mad Artist", name: "Heydun", handle: "@Grpx_Heydun", image: "/team/mad-artist-heydun.png", links: [{ label: "X", href: "https://x.com/Grpx_Heydun" }] },
  ];

  return (
    <section id="team" className="relative py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-4">
            The People
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            The <span className="text-[#FF2D2D]">Architects</span>
          </h2>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            Public. Real. Building in the open.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <div key={member.name} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FF2D2D]/30 transition-colors">
                <Image src={member.image} alt={member.name} fill className="object-cover" sizes="80px" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF2D2D]/60 mb-1">{member.role}</p>
              <p className="text-base font-black text-white">{member.name}</p>
              <p className="text-xs text-white/30 mb-4">{member.handle}</p>
              <div className="flex items-center justify-center gap-2">
                {member.links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                    className="px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.03] text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white hover:border-white/10 transition-all"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   JOIN THE FAM — CTA Footer
   ═══════════════════════════════════════════════════════════ */
function JoinCTA() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#080808] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,45,0.08),transparent_50%)]" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[0.95]">
          Join the<br />
          <span className="text-[#FF2D2D]">MAD FAM</span>
        </h2>
        <p className="text-sm text-white/30 max-w-md mx-auto mb-8">
          The world is full of opportunities, but the world is run on MAD — Motivation, Alignment, and Discipline. 
          We are building something that will last.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={LINKS.telegram} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-8 py-4 bg-[#FF2D2D] text-white text-sm font-black rounded-full hover:bg-[#FF2D2D]/80 transition-colors shadow-[0_0_40px_rgba(255,45,45,0.3)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            Join Telegram
          </a>
          <a href={LINKS.x} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-8 py-4 border border-white/10 text-white/60 text-sm font-bold rounded-full hover:border-white/30 hover:text-white transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Follow on X
          </a>
        </div>

        {/* Contract */}
        <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/5 bg-white/[0.02]">
          <span className="text-[10px] font-mono text-white/20">{CA}</span>
          <CopyButtonInline text={CA} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
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
    { label: "Telegram", href: LINKS.telegram },
    { label: "X", href: LINKS.x },
    { label: "Instagram", href: LINKS.instagram },
    { label: "TikTok", href: LINKS.tiktok },
  ];

  return (
    <footer className="border-t border-white/5 px-4 sm:px-6 py-12 bg-[#080808]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
            <div>
              <span className="text-white font-black text-lg tracking-tight">$MAD</span>
              <span className="block text-white/20 text-[9px] tracking-[0.3em] uppercase font-bold">A Next-Gen Entertainment Company</span>
            </div>
          </div>
          <p className="text-xs text-white/30 leading-relaxed max-w-xs mb-6">
            The MAD FAM is a global community building the future of entertainment through games, animation, AI, and culture.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="px-3 py-1.5 rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-white hover:border-white/10 transition-all"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Navigation</p>
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-xs font-bold text-white/40 hover:text-[#FF2D2D] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-white/15">Public. Real. Building in the open.</p>
        <p className="text-[10px] text-white/15 font-mono">{CA.slice(0, 12)}...{CA.slice(-4)}</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <Scanlines />
      <Navbar />
      <VideoBanner />
      <StopPanicking />
      <TheMADFAM />
      <MadCommandCenter />
      <Chronicles />
      <BuiltDifferent />
      <ProofOfMAD />
      <Architects />
      <JoinCTA />
      <Footer />
    </div>
  );
}
