export default function Home() {
  const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      
      <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
        BTC: Digital gold.
      </h1>

      <h2 className="text-5xl sm:text-6xl font-black text-red-500 mt-4">
        $MAD: Digital emotion.
      </h2>

      <p className="mt-8 text-white/70 uppercase tracking-widest text-sm">
        Solana Contract
      </p>

      <code className="mt-2 max-w-3xl break-all rounded-xl bg-white/10 px-4 py-3 font-mono text-sm">
        {addr}
      </code>

      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <a
          href={`https://jup.ag/swap/SOL-${addr}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-red-500 px-8 py-3 font-extrabold hover:bg-red-600 transition"
        >
          Buy on Jupiter
        </a>

        <a
          href={`https://dexscreener.com/solana/${addr}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/30 px-8 py-3 font-bold hover:bg-white/10 transition"
        >
          View Chart
        </a>
      </div>

      <p className="mt-16 text-white/40 text-sm">
        No promises. Just vibes.
      </p>

    </main>
  );
}
