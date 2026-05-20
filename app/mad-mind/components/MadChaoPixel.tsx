"use client";

import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO PIXEL — The $MAD Character
   Pixel-art aesthetic SVG character matching MAD_CHAO_SPEC.md
   
   Colors (LOCKED):
   MAD Red:      #FF2D2D
   Flame Orange: #FF6B00
   Dark Ash:     #0A0A0A
   Ember Yellow: #FFD700
   Bone White:   #F5F5F5
   Shadow Black: #1A1A1A
   ═══════════════════════════════════════════════════════════ */

const COLORS = {
  red: "#FF2D2D",
  redDark: "#CC1A1A",
  redLight: "#FF5555",
  flame: "#FF6B00",
  flameCore: "#FFD700",
  ash: "#0A0A0A",
  white: "#F5F5F5",
  black: "#1A1A1A",
  pupil: "#000000",
} as const;

type EmotionalState = "defiant" | "raging" | "focused" | "chill" | "berserk";

interface MadChaoPixelProps {
  state?: EmotionalState;
  size?: number;
  animated?: boolean;
  glowIntensity?: number;
}

/* ─── Pixel grid helpers ─── */
function P({ x, y, w = 1, h = 1, color, opacity }: { x: number; y: number; w?: number; h?: number; color: string; opacity?: string }) {
  const PX = 8; // pixel size in SVG units
  return (
    <rect
      x={x * PX}
      y={y * PX}
      width={w * PX}
      height={h * PX}
      fill={color}
      opacity={opacity}
      shapeRendering="crispEdges"
    />
  );
}

/* ─── 32×32 pixel grid character ─── */
function PixelGrid({ state, frame }: { state: EmotionalState; frame: number }) {
  const flicker = frame % 4;
  const bob = Math.floor(frame / 8) % 2; // 0 or 1, subtle bob

  // Flame flicker offset
  const fY = flicker === 0 ? 0 : flicker === 1 ? -1 : flicker === 2 ? 0 : 1;

  return (
    <g transform={`translate(0, ${bob * 2})`}>
      {/* OUTLINE / Shadow layer (1px behind everything) */}
      <g opacity="0.3">
        <P x={10} y={8 + bob} w={12} h={14} color={COLORS.black} />
        <P x={12} y={6 + fY + bob} w={8} h={4} color={COLORS.black} />
      </g>

      {/* WINGS / TAIL (back layer) */}
      <P x={8} y={12} w={3} h={5} color={COLORS.redDark} />
      <P x={7} y={13} w={2} h={3} color={COLORS.redDark} />
      <P x={21} y={12} w={3} h={5} color={COLORS.redDark} />
      <P x={23} y={13} w={2} h={3} color={COLORS.redDark} />

      {/* BODY — perfectly round, Kirby/Chao style */}
      {/* Main body circle (composed of rects for pixel look) */}
      <P x={10} y={10} w={12} h={12} color={COLORS.red} />
      <P x={9} y={11} w={1} h={10} color={COLORS.red} />
      <P x={22} y={11} w={1} h={10} color={COLORS.red} />
      <P x={11} y={9} w={10} h={1} color={COLORS.red} />
      <P x={11} y={22} w={10} h={1} color={COLORS.red} />
      {/* Rounded corners */}
      <P x={10} y={10} w={1} h={1} color={COLORS.red} />
      <P x={21} y={10} w={1} h={1} color={COLORS.red} />
      <P x={10} y={21} w={1} h={1} color={COLORS.red} />
      <P x={21} y={21} w={1} h={1} color={COLORS.red} />

      {/* Body shading (subtle depth) */}
      <P x={11} y={20} w={10} h={2} color={COLORS.redDark} />
      <P x={10} y={19} w={1} h={3} color={COLORS.redDark} />
      <P x={21} y={19} w={1} h={3} color={COLORS.redDark} />

      {/* HEAD — same as body, no neck (Kirby rule) */}
      {/* Head is just the upper portion of the body circle */}
      <P x={11} y={9} w={10} h={8} color={COLORS.red} />
      <P x={10} y={10} w={1} h={6} color={COLORS.red} />
      <P x={21} y={10} w={1} h={6} color={COLORS.red} />
      <P x={11} y={8} w={10} h={1} color={COLORS.red} />
      {/* Head highlight */}
      <P x={12} y={10} w={3} h={2} color={COLORS.redLight} opacity="0.4" />

      {/* FLAME CROWN */}
      {/* Flame base (orange) */}
      <P x={13} y={5 + fY} w={6} h={3} color={COLORS.flame} />
      <P x={12} y={6 + fY} w={1} h={2} color={COLORS.flame} />
      <P x={19} y={6 + fY} w={1} h={2} color={COLORS.flame} />
      <P x={14} y={4 + fY} w={4} h={1} color={COLORS.flame} />
      {/* Flame core (yellow) */}
      <P x={14} y={6 + fY} w={4} h={1} color={COLORS.flameCore} />
      <P x={15} y={5 + fY} w={2} h={1} color={COLORS.flameCore} />
      {/* Flame tips */}
      <P x={15} y={3 + fY} w={1} h={1} color={COLORS.flame} />
      <P x={17} y={3 + fY} w={1} h={1} color={COLORS.flame} />
      {flicker === 1 && <P x={16} y={2 + fY} w={1} h={1} color={COLORS.flameCore} />}

      {/* ARMS — position changes by state */}
      {state === "defiant" && (
        <>
          {/* Crossed arms */}
          <P x={8} y={15} w={4} h={3} color={COLORS.red} />
          <P x={20} y={15} w={4} h={3} color={COLORS.red} />
          <P x={11} y={16} w={10} h={2} color={COLORS.red} />
          <P x={9} y={16} w={1} h={2} color={COLORS.redDark} />
          <P x={22} y={16} w={1} h={2} color={COLORS.redDark} />
        </>
      )}
      {state === "raging" && (
        <>
          {/* Arms raised */}
          <P x={7} y={11} w={3} h={6} color={COLORS.red} />
          <P x={22} y={11} w={3} h={6} color={COLORS.red} />
          <P x={6} y={9} w={2} h={4} color={COLORS.red} />
          <P x={24} y={9} w={2} h={4} color={COLORS.red} />
          <P x={6} y={8} w={1} h={2} color={COLORS.redLight} />
          <P x={25} y={8} w={1} h={2} color={COLORS.redLight} />
        </>
      )}
      {state === "focused" && (
        <>
          {/* One arm forward, one at side */}
          <P x={20} y={14} w={5} h={3} color={COLORS.red} />
          <P x={7} y={15} w={3} h={5} color={COLORS.red} />
        </>
      )}
      {state === "chill" && (
        <>
          {/* Arms at sides, relaxed */}
          <P x={7} y={15} w={3} h={5} color={COLORS.red} />
          <P x={22} y={15} w={3} h={5} color={COLORS.red} />
        </>
      )}
      {state === "berserk" && (
        <>
          {/* Arms flailing */}
          <P x={5} y={12 + flicker} w={4} h={3} color={COLORS.red} />
          <P x={23} y={10 + (flicker % 3)} w={4} h={3} color={COLORS.red} />
        </>
      )}

      {/* LEGS — stubby, rounded, no ankles */}
      <P x={12} y={22} w={3} h={3} color={COLORS.red} />
      <P x={17} y={22} w={3} h={3} color={COLORS.red} />
      <P x={12} y={24} w={3} h={1} color={COLORS.redDark} />
      <P x={17} y={24} w={3} h={1} color={COLORS.redDark} />
      <P x={13} y={23} w={1} h={1} color={COLORS.redLight} />
      <P x={18} y={23} w={1} h={1} color={COLORS.redLight} />

      {/* EYES — the soul of the character */}
      {/* Sclera (white) */}
      <P x={13} y={13} w={2} h={3} color={COLORS.white} />
      <P x={17} y={13} w={2} h={3} color={COLORS.white} />
      {/* Pupils (black, no iris = intensity) */}
      <P x={14} y={14} w={1} h={2} color={COLORS.pupil} />
      <P x={17} y={14} w={1} h={2} color={COLORS.pupil} />

      {/* EYEBROWS / EXPRESSION — changes by state */}
      {state === "defiant" && (
        <>
          {/* Angled down eyebrows = defiant */}
          <P x={12} y={12} w={4} h={1} color={COLORS.black} />
          <P x={16} y={12} w={4} h={1} color={COLORS.black} />
          <P x={12} y={11} w={1} h={1} color={COLORS.black} />
          <P x={19} y={11} w={1} h={1} color={COLORS.black} />
          {/* Frown */}
          <P x={14} y={17} w={4} h={1} color={COLORS.black} />
        </>
      )}
      {state === "raging" && (
        <>
          {/* Wide angry brows */}
          <P x={11} y={11} w={5} h={1} color={COLORS.black} />
          <P x={16} y={11} w={5} h={1} color={COLORS.black} />
          <P x={12} y={10} w={1} h={1} color={COLORS.black} />
          <P x={19} y={10} w={1} h={1} color={COLORS.black} />
          {/* Open mouth / teeth */}
          <P x={14} y={17} w={4} h={2} color={COLORS.black} />
          <P x={14} y={17} w={4} h={1} color={COLORS.white} />
        </>
      )}
      {state === "focused" && (
        <>
          {/* One eye squint */}
          <P x={12} y={12} w={4} h={1} color={COLORS.black} />
          <P x={17} y={13} w={3} h={1} color={COLORS.black} />
          {/* Smirk */}
          <P x={15} y={17} w={3} h={1} color={COLORS.black} />
          <P x={18} y={16} w={1} h={1} color={COLORS.black} />
        </>
      )}
      {state === "chill" && (
        <>
          {/* Relaxed small brows */}
          <P x={13} y={12} w={3} h={1} color={COLORS.redDark} />
          <P x={16} y={12} w={3} h={1} color={COLORS.redDark} />
          {/* Small smile */}
          <P x={14} y={17} w={4} h={1} color={COLORS.black} />
          <P x={13} y={16} w={1} h={1} color={COLORS.black} />
          <P x={18} y={16} w={1} h={1} color={COLORS.black} />
        </>
      )}
      {state === "berserk" && (
        <>
          {/* Swirl eyes */}
          <P x={13} y={13} w={2} h={3} color={COLORS.white} />
          <P x={17} y={13} w={2} h={3} color={COLORS.white} />
          <P x={13} y={14} w={1} h={1} color={COLORS.pupil} />
          <P x={14} y={15} w={1} h={1} color={COLORS.pupil} />
          <P x={17} y={15} w={1} h={1} color={COLORS.pupil} />
          <P x={18} y={14} w={1} h={1} color={COLORS.pupil} />
          {/* Tongue out */}
          <P x={14} y={17} w={2} h={2} color={COLORS.redLight} />
          <P x={14} y={19} w={2} h={1} color={COLORS.redDark} />
        </>
      )}
    </g>
  );
}

/* ─── Main Component ─── */
export default function MadChaoPixel({
  state = "defiant",
  size = 320,
  animated = true,
  glowIntensity = 0.15,
}: MadChaoPixelProps) {
  const [frame, setFrame] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => setFrame((f) => (f + 1) % 32), 120);
    return () => clearInterval(interval);
  }, [animated]);

  const scale = hovered ? 1.08 : 1;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size + 40, margin: "0 auto" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,45,45,${hovered ? glowIntensity * 2.5 : glowIntensity}) 0%, transparent 70%)`,
          transform: "scale(1.2)",
        }}
      />

      {/* Flame top glow (extra) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,107,0,${hovered ? 0.3 : 0.12}) 0%, transparent 70%)`,
        }}
      />

      {/* SVG Character */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        style={{
          imageRendering: "pixelated",
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="256" height="256" fill="transparent" />
        <PixelGrid state={state} frame={frame} />
      </svg>

      {/* Label */}
      <div className="mt-2 text-center">
        <p
          className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300"
          style={{ color: hovered ? "#FF2D2D" : "rgba(255,255,255,0.25)" }}
        >
          {hovered ? "MAD CHAO IS WATCHING" : "THE $MAD MASCOT"}
        </p>
      </div>
    </div>
  );
}
