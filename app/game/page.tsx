export default function GamePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-24">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
        GAME
      </p>
      <h1 className="mt-4 text-5xl sm:text-6xl font-black">
        Will You Get <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">RICH</span> Or Stay{" "}
        <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">$MAD</span>
      </h1>

      <p className="mt-5 text-white/70 max-w-2xl">
        Prototype is live — we’ll revamp this page later with trailers, updates, and rewards.
      </p>

      <div className="mt-8">
        <a
          href="https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/20"
        >
          Play on Roblox →
        </a>
      </div>
    </div>
  );
}
