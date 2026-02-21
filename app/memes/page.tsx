import Link from "next/link";

export default function MemesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Culture</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-black">Meme Vault</h1>
      <p className="mt-4 text-white/65 leading-[1.9] max-w-2xl">
        This page exists so /memes works. Next step is moving your Meme Vault section here (or reusing it).
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="rounded-full px-5 py-3 text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
