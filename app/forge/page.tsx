/* app/forge/page.tsx */
"use client";

import Image from "next/image";
import IdentityForge from "../components/IdentityForge";

export default function ForgePage() {
  return (
    <div className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* Header */}
        <div className="relative mx-auto max-w-4xl animate-fadeUp text-center">
          {/* ✅ Sticker: He Sold Pump It (top-right of header) */}
          <div className="pointer-events-none absolute right-[-10px] top-[-10px] hidden sm:block">
            <div className="relative h-[160px] w-[160px] rotate-[6deg] opacity-95 drop-shadow-[0_22px_45px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.05]">
              <Image
                src="/stickers/he-sold-pump-it.webp"
                alt="He Sold Pump It"
                fill
                sizes="160px"
                className="object-contain"
                priority={false}
              />
            </div>
          </div>

          {/* ✅ Removed PHASE 2 line */}
          <h1 className="mt-2 text-6xl font-black tracking-tight sm:text-7xl">
            Identity{" "}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.65)]">
              Forge
            </span>
          </h1>

          <p className="mt-5 mx-auto max-w-2xl text-white/65 leading-relaxed">
            Build your $MAD identity. Mix traits, randomize, and download your PNG.
          </p>
        </div>

        {/* Forge component */}
        <div className="mt-10">
          <IdentityForge />
        </div>
      </div>
    </div>
  );
}
