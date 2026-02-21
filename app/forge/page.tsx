import Link from "next/link";

export default function ForgePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Forge</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-black">Forge Identity</h1>
      <p className="mt-4 text-white/65 leading-[1.9] max-w-2xl">
        This page exists so /forge works. Next step is moving your Forge section here (or reusing it).
      </p>

      <div className="mt-8 flex gap-3 flex-wrap">
        <Link
          href="/"
          className="rounded-full px-5 py-3 text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          ← Back to Home
        </Link>
        <Link
          href="/roadmap"
          className="rounded-full px-5 py-3 text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          Roadmap →
        </Link>
      </div>
    </div>
  );
}
