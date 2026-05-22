"use client";

import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MAD CLAW CHARACTER — The $MAD Mascot (V2 / SVG + CSS)
   Refined 2D animated character replacing 3D canvas.

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
  wing: "#FF4444",
  wingInner: "#CC2222",
} as const;

export type EmotionalState = "neutral" | "happy" | "focused" | "surprised" | "sleepy";

interface MadClawCharacterProps {
  state?: EmotionalState;
  size?: number;
  glowIntensity?: number;
}

/* ─── CSS Animations (injected via style tag) ─── */
const ANIMATION_CSS = `
  @keyframes clawBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes clawBreathe {
    0%, 100% { transform: scale(1, 1); }
    50% { transform: scale(1.02, 0.98); }
  }
  @keyframes wingFlapLeft {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-8deg); }
  }
  @keyframes wingFlapRight {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(8deg); }
  }
  @keyframes flameFlicker {
    0%, 100% { transform: translateY(0) scale(1, 1); opacity: 1; }
    25% { transform: translateY(-2px) scale(1.05, 0.95); opacity: 0.9; }
    50% { transform: translateY(1px) scale(0.95, 1.05); opacity: 1; }
    75% { transform: translateY(-1px) scale(1.02, 0.98); opacity: 0.95; }
  }
  @keyframes blink {
    0%, 48%, 52%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.1); }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes haloSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes floatParticle {
    0% { transform: translateY(0) scale(1); opacity: 0.6; }
    100% { transform: translateY(-20px) scale(0); opacity: 0; }
  }
`;

/* ─── Eye Component with blink ─── */
function Eye({
  cx,
  cy,
  state,
  side,
}: {
  cx: number;
  cy: number;
  state: EmotionalState;
  side: "left" | "right";
}) {
  // Eye shape changes by state
  const isBlinking = state === "sleepy";
  const isSurprised = state === "surprised";
  const isFocused = state === "focused";

  const eyeScale = isSurprised ? 1.15 : isFocused ? 0.85 : 1;
  const pupilY = isSurprised ? -2 : isFocused ? 1 : 0;
  const browY = isSurprised ? -4 : isFocused ? -2 : 0;

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* Sclera */}
      <ellipse
        rx="14"
        ry={isBlinking ? 2 : 14 * eyeScale}
        fill={COLORS.white}
        style={{
          animation: isBlinking ? "blink 2s ease-in-out infinite" : "blink 4s ease-in-out infinite",
          transformOrigin: "center",
        }}
      />
      {/* Pupil */}
      {!isBlinking && (
        <circle r="6" fill={COLORS.pupil} cy={pupilY}>
          {/* Catch light */}
          <circle r="2.5" fill={COLORS.white} cx="2" cy="-2" opacity="0.8" />
          <circle r="1" fill={COLORS.white} cx="-2" cy="2" opacity="0.5" />
        </circle>
      )}
      {/* Eyebrow */}
      {state === "focused" && (
        <path
          d={`M${side === "left" ? -10 : 10},${-16 + browY} Q${side === "left" ? -3 : 3},${-18 + browY} ${side === "left" ? 4 : -4},${-14 + browY}`}
          stroke={COLORS.black}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      )}
      {state === "happy" && (
        <path
          d={`M${-10},${-14 + browY} Q${0},${-17 + browY} ${10},${-14 + browY}`}
          stroke={COLORS.black}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      )}
      {state === "surprised" && (
        <ellipse
          rx="16"
          ry="4"
          cy={-18 + browY}
          fill="none"
          stroke={COLORS.black}
          strokeWidth="2"
          opacity="0.6"
        />
      )}
    </g>
  );
}

/* ─── Flame Halo above head ─── */
function FlameHalo() {
  return (
    <g style={{ animation: "flameFlicker 0.8s ease-in-out infinite" }}>
      {/* Outer flame shape */}
      <path
        d="M-20,-45 Q-25,-55 -15,-62 Q-5,-68 0,-75 Q5,-68 15,-62 Q25,-55 20,-45 Q15,-38 0,-35 Q-15,-38 -20,-45Z"
        fill={COLORS.flame}
        opacity="0.85"
      />
      {/* Inner bright core */}
      <path
        d="M-12,-48 Q-15,-55 -8,-60 Q0,-64 0,-70 Q0,-64 8,-60 Q15,-55 12,-48 Q8,-43 0,-40 Q-8,-43 -12,-48Z"
        fill={COLORS.flameCore}
        opacity="0.9"
      />
      {/* Core highlight */}
      <ellipse cx="0" cy="-55" rx="4" ry="8" fill="#FFF" opacity="0.4" />
      {/* Floating spark particles */}
      <circle cx="-8" cy="-50" r="1.5" fill={COLORS.flameCore} opacity="0.6">
        <animate attributeName="cy" values="-50;-60;-70" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="6" cy="-48" r="1" fill={COLORS.flame} opacity="0.5">
        <animate attributeName="cy" values="-48;-58;-68" dur="1s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="1s" repeatCount="indefinite" begin="0.4s" />
      </circle>
    </g>
  );
}

/* ─── Wing Component ─── */
function Wing({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const scaleX = isLeft ? 1 : -1;
  const animName = isLeft ? "wingFlapLeft" : "wingFlapRight";

  return (
    <g transform={`scale(${scaleX}, 1)`} style={{ transformOrigin: "0 0" }}>
      <g style={{ animation: `${animName} 2s ease-in-out infinite`, transformOrigin: "20px 60px" }}>
        {/* Wing shape */}
        <path
          d="M20,55 Q5,45 -5,50 Q-12,55 -8,65 Q-5,72 5,68 Q15,62 20,55Z"
          fill={COLORS.wing}
          stroke={COLORS.redDark}
          strokeWidth="1"
        />
        {/* Wing inner detail */}
        <path
          d="M15,58 Q8,52 2,56 Q0,58 3,62 Q8,60 15,58Z"
          fill={COLORS.wingInner}
          opacity="0.6"
        />
        {/* Wing highlight */}
        <path
          d="M18,56 Q12,50 5,54"
          stroke={COLORS.redLight}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </g>
    </g>
  );
}

/* ─── Body Component ─── */
function Body({ state }: { state: EmotionalState }) {
  const breatheScale = state === "focused" ? 1.01 : 1;

  return (
    <g style={{ animation: "clawBreathe 3s ease-in-out infinite" }}>
      {/* Main body - round Chao-like shape */}
      <ellipse rx="48" ry="46" fill={COLORS.red} />
      {/* Body shading */}
      <ellipse rx="44" ry="42" cy="2" fill={COLORS.redDark} opacity="0.3" />
      {/* Body highlight (top-left sheen) */}
      <ellipse rx="28" ry="22" cx="-12" cy="-12" fill={COLORS.redLight} opacity="0.25" />
      <ellipse rx="12" ry="10" cx="-18" cy="-18" fill="#FF8888" opacity="0.2" />

      {/* Mouth - changes by state */}
      {state === "neutral" && (
        <path
          d="M-6,18 Q0,22 6,18"
          stroke={COLORS.black}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      )}
      {state === "happy" && (
        <>
          <path
            d="M-10,16 Q0,26 10,16Z"
            fill={COLORS.black}
            opacity="0.8"
          />
          {/* Tongue */}
          <path
            d="M-4,22 Q0,24 4,22"
            stroke={COLORS.redLight}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </>
      )}
      {state === "focused" && (
        <path
          d="M-5,20 Q0,19 5,20"
          stroke={COLORS.black}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      )}
      {state === "surprised" && (
        <ellipse cx="0" cy="20" rx="6" ry="8" fill={COLORS.black} opacity="0.8">
          <ellipse cx="0" cy="18" rx="3" ry="4" fill={COLORS.redLight} opacity="0.4" />
        </ellipse>
      )}
      {state === "sleepy" && (
        <path
          d="M-6,22 Q0,20 6,22"
          stroke={COLORS.black}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      )}

      {/* Cheeks (blush) */}
      <ellipse cx="-32" cy="8" rx="8" ry="5" fill={COLORS.redLight} opacity="0.25" />
      <ellipse cx="32" cy="8" rx="8" ry="5" fill={COLORS.redLight} opacity="0.25" />
    </g>
  );
}

/* ─── Legs ─── */
function Legs() {
  return (
    <g>
      {/* Left leg */}
      <ellipse cx="-22" cy="46" rx="14" ry="10" fill={COLORS.red} />
      <ellipse cx="-22" cy="48" rx="12" ry="7" fill={COLORS.redDark} opacity="0.4" />
      {/* Right leg */}
      <ellipse cx="22" cy="46" rx="14" ry="10" fill={COLORS.red} />
      <ellipse cx="22" cy="48" rx="12" ry="7" fill={COLORS.redDark} opacity="0.4" />
    </g>
  );
}

/* ─── Arms ─── */
function Arms({ state }: { state: EmotionalState }) {
  if (state === "happy") {
    return (
      <g>
        {/* Arms raised slightly */}
        <ellipse cx="-50" cy="-5" rx="14" ry="20" fill={COLORS.red} transform="rotate(-20, -50, -5)" />
        <ellipse cx="50" cy="-5" rx="14" ry="20" fill={COLORS.red} transform="rotate(20, 50, -5)" />
        {/* Hands */}
        <circle cx="-58" cy="-18" r="8" fill={COLORS.red} />
        <circle cx="58" cy="-18" r="8" fill={COLORS.red} />
      </g>
    );
  }

  if (state === "focused") {
    return (
      <g>
        {/* One arm forward, one back */}
        <ellipse cx="-52" cy="10" rx="14" ry="18" fill={COLORS.red} transform="rotate(-10, -52, 10)" />
        <ellipse cx="52" cy="15" rx="14" ry="16" fill={COLORS.red} transform="rotate(10, 52, 15)" />
        {/* Pointing hand */}
        <circle cx="-58" cy="-2" r="8" fill={COLORS.red} />
        <circle cx="58" cy="22" r="8" fill={COLORS.red} />
      </g>
    );
  }

  if (state === "surprised") {
    return (
      <g>
        {/* Arms up */}
        <ellipse cx="-45" cy="-15" rx="14" ry="20" fill={COLORS.red} transform="rotate(-35, -45, -15)" />
        <ellipse cx="45" cy="-15" rx="14" ry="20" fill={COLORS.red} transform="rotate(35, 45, -15)" />
        <circle cx="-52" cy="-32" r="8" fill={COLORS.red} />
        <circle cx="52" cy="-32" r="8" fill={COLORS.red} />
      </g>
    );
  }

  // neutral, sleepy - arms at sides
  return (
    <g>
      <ellipse cx="-52" cy="12" rx="14" ry="18" fill={COLORS.red} transform="rotate(-5, -52, 12)" />
      <ellipse cx="52" cy="12" rx="14" ry="18" fill={COLORS.red} transform="rotate(5, 52, 12)" />
      <circle cx="-56" cy="22" r="8" fill={COLORS.red} />
      <circle cx="56" cy="22" r="8" fill={COLORS.red} />
    </g>
  );
}

/* ─── Main Character SVG ─── */
function CharacterSVG({ state, size }: { state: EmotionalState; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-70 -90 140 180"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
      style={{ filter: "drop-shadow(0 8px 16px rgba(255,45,45,0.2))" }}
    >
      {/* Glow behind character */}
      <circle cx="0" cy="0" r="60" fill={COLORS.red} opacity="0.08">
        <animate attributeName="r" values="60;65;60" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.12;0.08" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Main bobbing group */}
      <g style={{ animation: "clawBob 3s ease-in-out infinite" }}>
        {/* Back wings (rendered behind body) */}
        <Wing side="left" />
        <Wing side="right" />

        {/* Arms (behind body slightly) */}
        <Arms state={state} />

        {/* Body */}
        <Body state={state} />

        {/* Legs */}
        <Legs />

        {/* Eyes */}
        <Eye cx={-20} cy={-8} state={state} side="left" />
        <Eye cx={20} cy={-8} state={state} side="right" />

        {/* Flame halo above head */}
        <FlameHalo />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function MadClawCharacter({
  state = "neutral",
  size = 280,
  glowIntensity = 0.15,
}: MadClawCharacterProps) {
  const [currentState, setCurrentState] = useState<EmotionalState>(state);
  const [hovered, setHovered] = useState(false);
  const [chatActive, setChatActive] = useState(false);

  /* Listen for chat activity events from parent */
  useEffect(() => {
    const handleChatStart = () => {
      setChatActive(true);
      setCurrentState("focused");
    };
    const handleChatEnd = () => {
      setChatActive(false);
      setCurrentState("neutral");
    };
    const handleChatTyping = () => {
      setCurrentState("surprised");
    };
    const handleReact = () => {
      setCurrentState("happy");
      setTimeout(() => setCurrentState(chatActive ? "focused" : "neutral"), 1500);
    };

    window.addEventListener("madclaw-chat-start", handleChatStart);
    window.addEventListener("madclaw-chat-end", handleChatEnd);
    window.addEventListener("madclaw-chat-typing", handleChatTyping);
    window.addEventListener("madclaw-react", handleReact);

    return () => {
      window.removeEventListener("madclaw-chat-start", handleChatStart);
      window.removeEventListener("madclaw-chat-end", handleChatEnd);
      window.removeEventListener("madclaw-chat-typing", handleChatTyping);
      window.removeEventListener("madclaw-react", handleReact);
    };
  }, [chatActive]);

  /* React to prop changes */
  useEffect(() => {
    if (!chatActive) setCurrentState(state);
  }, [state, chatActive]);

  /* Sleepy state after inactivity */
  useEffect(() => {
    if (chatActive || hovered) return;
    const timer = setTimeout(() => setCurrentState("sleepy"), 30000);
    return () => clearTimeout(timer);
  }, [chatActive, hovered, currentState]);

  /* Reset from sleepy on interaction */
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    setCurrentState("happy");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setCurrentState(chatActive ? "focused" : "neutral");
  }, [chatActive]);

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none cursor-pointer"
      style={{ width: size, height: size, margin: "0 auto" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inject CSS animations */}
      <style>{ANIMATION_CSS}</style>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,45,45,${hovered ? glowIntensity * 2.5 : glowIntensity}) 0%, transparent 70%)`,
          transform: "scale(1.4)",
        }}
      />

      {/* Flame glow above */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,107,0,${hovered ? 0.35 : 0.15}) 0%, transparent 70%)`,
        }}
      />

      {/* Character */}
      <div
        style={{
          transform: `scale(${hovered ? 1.06 : 1})`,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <CharacterSVG state={currentState} size={size} />
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <p
          className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300"
          style={{ color: hovered ? "#FF2D2D" : "rgba(26,26,26,0.3)" }}
        >
          {currentState === "sleepy"
            ? "Zzz... $MAD dreams"
            : hovered
              ? "MAD CHAO IS WATCHING"
              : "THE $MAD MASCOT"}
        </p>
      </div>
    </div>
  );
}
