/* app/forge/page.tsx */
"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import MadShell from "@/app/_components/MadShell";
import {
  AccessoryItem,
  EyeItem,
  makeItem,
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

  const ALL_EYES: EyeItem[] = useMemo(() => {
    return [
      makeItem<EyeItem>("c-common-black", "/pfp/eyes/cartoon/common/cartoon-common-black.png", "Cartoon Common Black", "common", "cartoon"),
      makeItem<EyeItem>("c-common-blue", "/pfp/eyes/cartoon/common/cartoon-common-blue.png", "Cartoon Common Blue", "common", "cartoon"),
      makeItem<EyeItem>("c-common-green", "/pfp/eyes/cartoon/common/cartoon-common-green.png", "Cartoon Common Green", "common", "cartoon"),
      makeItem<EyeItem>("c-common-orange", "/pfp/eyes/cartoon/common/cartoon-common-orange.png", "Cartoon Common Orange", "common", "cartoon"),
      makeItem<EyeItem>("c-common-pink", "/pfp/eyes/cartoon/common/cartoon-common-pink.png", "Cartoon Common Pink", "common", "cartoon"),
      makeItem<EyeItem>("c-common-red", "/pfp/eyes/cartoon/common/cartoon-common-red.png", "Cartoon Common Red", "common", "cartoon"),
    ];
  }, []);

  const ALL_ACCESSORIES: AccessoryItem[] = useMemo(() => {
    const tall = (y: number, scale = 1) => ({
      cssTransform: `translateY(${y}px) scale(${scale})`,
      draw: { y, scale },
    });

    return [
      makeItem<AccessoryItem>("a-c-common-bandaid", "/pfp/accessories/cartoon/common/cartoon-common-bandaid.png", "Bandage", "common", "cartoon"),
      makeItem<AccessoryItem>("a-c-rare-icedchain", "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png", "Iced $MAD Chain", "rare", "cartoon"),

      // Legendary (your real filenames)
      makeItem<AccessoryItem>("a-c-leg-cigar", "/pfp/accessories/cartoon/legendary/cartoon-legendary-cigar.png", "Cigar", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-crown", "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png", "Crown", "legendary", "cartoon", tall(18, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-halo", "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png", "Halo", "legendary", "cartoon", tall(28, 0.95)),
      makeItem<AccessoryItem>("a-c-leg-jetpack", "/pfp/accessories/cartoon/legendary/cartoon-legendary-jetpack.png", "Jetpack", "legendary", "cartoon", tall(18, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-lightninghorns", "/pfp/accessories/cartoon/legendary/cartoon-legendary-lightninghorns.png", "Lightning Horns", "legendary", "cartoon", tall(24, 0.96)),
      makeItem<AccessoryItem>("a-c-leg-void", "/pfp/accessories/cartoon/legendary/cartoon-legendary-void.png", "Void", "legendary", "cartoon", tall(20, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-rugproofshield", "/pfp/accessories/cartoon/legendary/cartoon-legendary-rugproofshield.png", "Rugproof Shield", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-sash", "/pfp/accessories/cartoon/legendary/cartoon-legendary-sash.png", "Sash", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-moneybag", "/pfp/accessories/cartoon/legendary/cartoon-legendary-moneybag.png", "Money Bag", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-pinkgrill", "/pfp/accessories/cartoon/legendary/cartoon-legendary-pinkgrill.png", "Pink Grill", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-firegrills", "/pfp/accessories/cartoon/legendary/cartoon-legendary-firegrills.png", "Fire Grills", "legendary", "cartoon"),
      makeItem<AccessoryItem>("a-c-leg-fieryaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fieryaura.png", "Fiery Aura", "legendary", "cartoon", tall(22, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-fireaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fireaura.png", "Fire Aura", "legendary", "cartoon", tall(22, 0.98)),
      makeItem<AccessoryItem>("a-c-leg-madchaininfinity", "/pfp/accessories/cartoon/legendary/cartoon-legendary-madchaininfinity.png", "Infinity Chain", "legendary", "cartoon"),
    ];
  }, []);

  const BASE = useMemo(
    () =>
      makeItem<{ id: string; primary: string; fallbacks: string[]; label: string; rarity: "common"; style: "cartoon" }>(
        "base",
        "/pfp/base/base-01.png",
        "Base",
        "common",
        "cartoon"
      ),
    []
  );

  const [showBase, setShowBase] = useState(true);
  const [showAcc, setShowAcc] = useState(true);

  const initialEye = useMemo(() => ALL_EYES[0], [ALL_EYES]);
  const initialAcc = useMemo(() => ALL_ACCESSORIES[0], [ALL_ACCESSORIES]);

  const [eyeId, setEyeId] = useState(initialEye?.id ?? "");
  const [accId, setAccId] = useState(initialAcc?.id ?? "");

  const selectedEye = useMemo(() => ALL_EYES.find((e) => e.id === eyeId) ?? initialEye, [eyeId, initialEye, ALL_EYES]);
  const selectedAcc = useMemo(
    () => ALL_ACCESSORIES.find((a) => a.id === accId) ?? initialAcc,
    [accId, initialAcc, ALL_ACCESSORIES]
  );

  const [eyeSrc, setEyeSrc] = useState(selectedEye?.primary ?? "");
  const [eyeFallbacks, setEyeFallbacks] = useState<string[]>(selectedEye?.fallbacks ?? []);
  const [eyeLabel, setEyeLabel] = useState(selectedEye ? `${selectedEye.label} • ${selectedEye.rarity.toUpperCase()}` : "");

  const [accSrc, setAccSrc] = useState(selectedAcc?.primary ?? "");
  const [accFallbacks, setAccFallbacks] = useState<string[]>(selectedAcc?.fallbacks ?? []);
  const [accLabel, setAccLabel] = useState(selectedAcc ? `${selectedAcc.label} • ${selectedAcc.rarity.toUpperCase()}` : "");

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
    setTimeout(() => {
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

          <p className="mt-6 text-white/65 leading-[1.9] max-w-2xl">Free for the community. Clean looks. Strong signal.</p>
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

            <img
              key={`eyes-${eyeId}-${renderNonce}`}
              src={eyeSrc}
              className="absolute inset-0 w-full h-full object-cover"
              alt="eyes"
              onLoad={resetFallbackIndex}
              onError={(e) => cycleFallback(e, eyeFallbacks)}
            />

            {showAcc && (
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

        {/* local animation used by forge */}
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
