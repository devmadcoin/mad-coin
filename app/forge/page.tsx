"use client";

import Image from "next/image";

export default function ForgePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background FX */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.2),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(255,120,0,0.18),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            PHASE 2 INITIATED.
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            Identity <span className="text-red-500">Forge</span>
          </h1>

          <p className="mt-6 text-white/70 max-w-xl leading-relaxed">
            Create your official $MAD identity. 
            Digital emotion, refined into form.
          </p>
        </div>

        {/* Forge Card */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            
            {/* Preview */}
            <div className="relative h-64 w-64 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
              <Image
                src="/mad.png"
                alt="Base $MAD"
                width={220}
                height={220}
                className="object-contain"
              />
            </div>

            {/* Controls Placeholder */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Forge Your Avatar</h2>

              <p className="mt-3 text-white/60">
                Accessories, emotions, evolutions.  
                Build your digital signal.
              </p>

              <button className="mt-6 rounded-full bg-red-600 px-6 py-3 font-semibold hover:bg-red-500 transition">
                Open Forge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
