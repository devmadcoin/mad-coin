import Image from "next/image";

export default function Home() {
  const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/mad.mp4" type="video/mp4" />
      </video>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* MAD Logo */}
        <Image
          src="/mad.png"
          alt="$MAD logo"
          width={180}
          height={180}
          className="mb-8"
          priority
        />

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

        <p className="mt-16 text-white/40 text-sm tracking-wide">
          Built from cycles. Forged by volatility.
        </p>

        {/* Lore Section */}
        <div className="mt-10 space-y-2 text-lg text-white/60">
          <p>$HAPPY farmed me.</p>
          <p>$SAD farmed me.</p>
          <p className="text-red-500 font-bold text-xl">$MAD made me.</p>
        </div>

      </div>
    </main>
  );
}


