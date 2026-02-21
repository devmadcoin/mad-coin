/* app/forge/page.tsx */
"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MadShell } from "@/app/_components/MadShell";
import {
  type EyeItem,
  type AccessoryItem,
  FORGE_EYES,
  FORGE_ACCESSORIES,
  FORGE_BASE,
  pickWeightedAccessory,
  cycleFallback,
  resetFallbackIndex,
} from "@/app/_lib/mad";

export default function Page() {
  const btnBase =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/15";
  const btnPrimary = [
    btnBase,
    "text-white",
    "bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500",
    "shadow-[0_18px_70px_rgba(255,120,80,0.18)]",
  ].join(" ");
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;

  // Pull lists from lib (keeps this file tiny)
  const ALL_EYES: EyeItem[] = useMemo(() => FORGE_EYES, []);
  const ALL_ACCESSORIES: AccessoryItem[] = useMemo(() => FORGE_ACCESSORIES, []);
  const BASE = useMemo(() => FORGE_BASE, []);

  const [showBase, setShowBase] = useState(true);
  const [showAcc, setShowAcc] = useState(true);

  const [eyeId, setEyeId] = useState("");
  const [accId, setAccId] = useState("");

  // Ensure we always have valid defaults (avoids undefined crashes)
  useEffect(() => {
    if (!eyeId && ALL_EYES.length) setEyeId(ALL_EYES[0].id);
    if (!accId && ALL_ACCESSORIES.length) setAccId(ALL_ACCESSORIES[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ALL_EYES.length, ALL_ACCESSORIES.length]);

  const selectedEye = useMemo(
    () => ALL_EYES.find((e) => e.id === eyeId) ?? ALL_EYES[0],
    [eyeId, ALL_EYES]
  );

  const selectedAcc = useMemo(
    () => ALL_ACCESSORIES.find((a) => a.id === accId) ?? ALL_ACCESSORIES[0],
    [accId, ALL_ACCESSORIES]
  );

  const [eyeSrc, setEyeSrc] = useState("");
  const [eyeFallbacks, setEyeFallbacks] = useState<string[]>([]);
  const [eyeLabel, setEyeLabel] = useState("");

  const [accSrc, setAccSrc] = useState("");
  const [accFallbacks, setAccFallbacks] = useState<string[]>([]);
  const [accLabel, setAccLabel] = useState("");

  useEffect(() => {
    if (!selectedEye) return;
    setEyeSrc(selectedEye.primary);
    setEyeFallbacks(selectedEye.fallbacks);
    setEyeLabel(`${selectedEye.label} • ${selectedEye.rarity.toUpperCase()}`);
  }, [selectedEye?.id]);

  useEffect(() => {
    if (!selectedAcc) return;
    setAccSrc(selectedAcc.primary);
    setAccFallbacks(selectedAcc.fallbacks);
    setAccLabel(`${selectedAcc.label} • ${selectedAcc.rarity.toUpperCase()}`);
  }, [selectedAcc?.id]);

  const [forgeCount, setForgeCount] = useState(0);
  const [powerIndex, setPowerIndex] = useState(50);
  const [revealing, setRevealing] = useState(false);
  const [renderNonce, setRenderNonce] = useState(0);

  const forgeIdentity = () => {
    if (!ALL_EYES.length) return;

    setRevealing(true);
    window.setTimeout(() => {
      const pickEye = ALL_EYES[Math.floor(Math.random() * ALL_EYES.length)];
      setEyeId(pickEye.id);

      if (ALL_ACCESSORIES.length) {
        const pickAcc = pickWeightedAccessory(ALL_ACCESSORIES);
        setAccId(pickAcc.id);
      }

      setForgeCount((v) => v + 1);
      setRenderNonce((n) => n + 1);
      setPowerIndex(1 + Math.floor(Math.random() * 100));
      setRevealing(false);
    }, 550);
  };

  return (
    <MadShell>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        <section className="pt-16 pb-6 w-full">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 border border-white/10 shadow-[0_0_80px_rgba(255,120,80,0.12)]">
              <Image src="/mad.png" alt="$MAD logo" width={48} height={48} priority />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-[0.35em] text-white/60">Forge</div>
              <div className="text-2xl sm:text-3xl font-black leading-tight">Wear the mark.</div>
            </div>
          </div>

          <p className="mt-6 text-white/65 leading-[1.9] max-w-2xl">
            Free for the community. Clean looks. Strong signal.
          </p>
        </section>

        <section className="pb-20 w-full max-w-xl mx-auto text-center">
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <button className={btnGhost} onClick={() => setShowBase((v) => !v)}>
              {showBase ? "Hide Base" : "Show Base"}
            </button>
            <button className={btnGhost} onClick={() => setShowAcc((v) => !v)}>
              {showAcc ? "Hide Accessory" : "Show Accessory"}
            </button>
          </div>

          <div
            className="mt-10 relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full overflow-hidden border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(255,120,80,0.10)]"
            style={revealing ? { animation: "forgePulse 0.55s ease-in-out" } : undefined}
          >
            {showBase && (
              <img
                key={`base-${renderNonce}`}
                src={BASE.primary}
                className="absolute inset-0 w-full h-full object-cover"
                alt="base"
                onLoad={resetFallbackIndex}
                onError={(e) => cycleFallback(e, BASE.fallbacks)}
              />
            )}

            {!!eyeSrc && (
              <img
                key={`eyes-${eyeId}-${renderNonce}`}
                src={eyeSrc}
                className="absolute inset-0 w-full h-full object-cover"
                alt="eyes"
                onLoad={resetFallbackIndex}
                onError={(e) => cycleFallback(e, eyeFallbacks)}
              />
            )}

            {showAcc && !!accSrc && (
              <img
                key={`acc-${accId}-${renderNonce}`}
                src={accSrc}
                className="absolute inset-0 w-full h-full object-cover"
                alt="accessory"
                style={selectedAcc?.cssTransform ? { transform: selectedAcc.cssTransform } : undefined}
                onLoad={resetFallbackIndex}
                onError={(e) => cycleFallback(e, accFallbacks)}
              />
            )}
          </div>

          <div className="mt-5 text-xs text-white/65">{eyeLabel}</div>
          <div className="mt-1 text-xs text-white/50">{accLabel}</div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black">
              Forge Count: <span className="text-white tabular-nums">{forgeCount}</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black">
              Power Index: <span className="text-white tabular-nums">{powerIndex}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className={btnPrimary} onClick={forgeIdentity}>
              Forge Identity
            </button>
          </div>
        </section>

        <footer className="py-10 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD.</footer>

        <style jsx global>{`
          @keyframes forgePulse {
            0% {
              transform: scale(1);
              filter: saturate(1);
            }
            50% {
              transform: scale(1.02);
              filter: saturate(1.2);
            }
            100% {
              transform: scale(1);
              filter: saturate(1);
            }
          }
        `}</style>
      </div>
    </MadShell>
  );
}
