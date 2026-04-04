/* app/forge/page.tsx */
"use client";

import Image from "next/image";
import IdentityForge from "../components/IdentityForge";

export default function ForgePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.16),transparent_40%),radial-gradient(circle_at_82%_22%,rgba(255,90,0,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,60,0,0.08),transparent_25%)]" />

          <div className="relative mx-auto max-w-5xl">
            <div className="relative animate-fadeUp text-center">
              {/* sticker */}
              <div className="pointer-events-none absolute right-[-6px] top-[-18px] hidden lg:block">
                <div className="relative h-[155px] w-[155px] rotate-[6deg] opacity-95 drop-shadow-[0_22px_45px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/stickers/he-sold-pump-it.webp"
                    alt="He Sold Pump It"
                    fill
                    sizes="155px"
                    className="object-contain"
                    priority={false}
                  />
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
                IDENTITY LAB
              </p>

              <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Identity{" "}
                <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.55)]">
                  Forge
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
                Prototype your <span className="text-white/90">$MAD identity</span>.
                Mix traits, explore collectible directions, randomize builds, and
                export your PNG.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                  NFT Prototype
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  Collectible Identity System
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  No Live Mint
                </div>
              </div>
            </div>

            {/* explainer strip */}
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                  WHAT IT IS
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/68">
                  Forge is an experimental builder for shaping possible{" "}
                  <span className="text-white/90">$MAD</span> character identities
                  and collectible directions.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                  CURRENT STATUS
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/68">
                  This is a <span className="text-red-300">prototype only</span>.
                  It is not a live mint, not a final NFT collection, and not a
                  finished release.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                  WHY IT MATTERS
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/68">
                  It gives the community an early look at how{" "}
                  <span className="text-white/90">$MAD</span> identity,
                  traits, and collectible expansion could evolve over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Builder */}
        <section className="mt-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-4">
            <IdentityForge />
          </div>
        </section>

        {/* bottom note */}
        <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            FORGE NOTICE
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
            The Forge exists to explore visual identity and collectible potential
            inside the <span className="font-semibold text-white/90">$MAD</span>{" "}
            universe. Today it is a concept lab. Tomorrow it could become
            something bigger.
          </p>
        </section>
      </div>
    </div>
  );
}
