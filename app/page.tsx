import Image from "next/image";

export default function Home() {
  const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* RED CLOUD BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/publicred-clouds.png.png"
          alt="Red storm background"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center">
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

          {/* BUTTONS */}
          <div className="mt-10 flex gap-4 flex-wrap justify-center">
            {/* Buy */}
            <a
              href={`https://jup.ag/swap/SOL-${addr}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-red-500 px-8 py-3 font-extrabold hover:bg-red-600 transition"
            >
              Buy on Jupiter
            </a>

            {/* Chart */}
            <a
              href={`https://dexscreener.com/solana/${addr}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 px-8 py-3 font-bold hover:bg-white/10 transition"
            >
              View Chart
            </a>

            {/* X */}
            <a
              href="https://x.com/i/communities/2019256566248312879/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white text-black px-8 py-3 font-bold hover:opacity-80 transition"
            >
              Join X Community
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/madcoinofficial001"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-blue-500 px-8 py-3 font-bold hover:bg-blue-600 transition"
            >
              Join Telegram
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
        </section>

        {/* MEME SECTION */}
        <section className="py-24 max-w-6xl w-full">
          <h2 className="text-4xl font-black text-center mb-16">
            The $MAD Lore
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:scale-[1.02] transition">
              <Image
                src="/meme1.jpg"
                alt="Posting my entry"
                width={800}
                height={800}
                className="rounded-xl"
              />
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:scale-[1.02] transition">
              <Image
                src="/meme3.jpg"
                alt="After I finally sold"
                width={800}
                height={800}
                className="rounded-xl"
              />
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 md:col-span-2 hover:scale-[1.02] transition">
              <Image
                src="/meme2.jpg"
                alt="Checked chart before bed"
                width={1600}
                height={800}
                className="rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* ===================== */}
        {/* ROADMAP SECTION */}
        {/* ===================== */}
        <section className="py-24 max-w-4xl w-full">
          <h2 className="text-4xl font-black text-center mb-12">Roadmap</h2>

          <div className="grid gap-6 text-left">
            {/* Step 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Phase 1
              </p>
              <h3 className="text-2xl font-black mt-2">Bond</h3>
              <p className="text-white/60 mt-2">
                Establish the foundation. Lock in the vibe. Build the core.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Phase 2
              </p>
              <h3 className="text-2xl font-black mt-2">$1M</h3>
              <p className="text-white/60 mt-2">
                First major milestone. Momentum becomes undeniable.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Phase 3
              </p>
              <h3 className="text-2xl font-black mt-2">$10M</h3>
              <p className="text-white/60 mt-2">
                Scale the energy. More eyes. More memes. More movement.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Phase 4
              </p>
              <h3 className="text-2xl font-black mt-2">$50M</h3>
              <p className="text-white/60 mt-2">
                Serious territory. The timeline feels it.
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Phase 5
              </p>
              <h3 className="text-2xl font-black mt-2">$100M</h3>
              <p className="text-white/60 mt-2">
                Full send. Legendary status. Digital emotion completed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


