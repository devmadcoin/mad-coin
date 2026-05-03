"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   THE CLAW VISUAL — Interactive Avatar
   Not cute. Not safe. A guardian with teeth.
   ═══════════════════════════════════════════════════════════ */

interface EyeProps {
  cx: number;
  cy: number;
  r: number;
  pupilR: number;
  mouseX: number;
  mouseY: number;
}

function AnimatedEye({ cx, cy, r, pupilR, mouseX, mouseY }: EyeProps) {
  const eyeRef = useRef<SVGCircleElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!eyeRef.current || !pupilRef.current) return;

    const eye = eyeRef.current;
    const pupil = pupilRef.current;
    const rect = eye.getBoundingClientRect();
    const eyeCx = rect.left + rect.width / 2;
    const eyeCy = rect.top + rect.height / 2;

    const angle = Math.atan2(mouseY - eyeCy, mouseX - eyeCx);
    const distance = Math.min(
      r - pupilR - 2,
      Math.hypot(mouseX - eyeCx, mouseY - eyeCy) * 0.15
    );

    const px = cx + Math.cos(angle) * distance;
    const py = cy + Math.sin(angle) * distance;

    pupil.setAttribute("cx", String(px));
    pupil.setAttribute("cy", String(py));
  }, [mouseX, mouseY, cx, cy, r, pupilR]);

  return (
    <g>
      <circle ref={eyeRef} cx={cx} cy={cy} r={r} fill="#1a0505" stroke="#ff4444" strokeWidth="1.5" opacity="0.9" />
      <circle ref={pupilRef} cx={cx} cy={cy} r={pupilR} fill="#ff4444">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#ff4444" strokeWidth="0.5" opacity="0.3" />
    </g>
  );
}

interface ClawProps {
  isHovered: boolean;
  delay: number;
}

function AnimatedClaw({ isHovered, delay }: ClawProps) {
  const [twitch, setTwitch] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const timer = setTimeout(() => setTwitch(true), delay);
    const reset = setTimeout(() => setTwitch(false), delay + 200);
    return () => {
      clearTimeout(timer);
      clearTimeout(reset);
    };
  }, [isHovered, delay]);

  return (
    <path
      d="M0,0 C5,-15 15,-20 20,-10 C22,-5 18,0 15,5 C12,8 8,5 5,8 C2,10 -2,5 0,0"
      fill="#1a0505"
      stroke="#ff4444"
      strokeWidth="1.2"
      opacity="0.85"
      style={{
        transform: twitch ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.15s ease",
      }}
    />
  );
}

export default function MadClawVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto 32px",
        cursor: "pointer",
      }}
    >
      {/* Glitch overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: glitchActive
            ? "linear-gradient(90deg, rgba(255,68,68,0.1) 0%, transparent 30%, rgba(255,68,68,0.1) 60%, transparent 100%)"
            : "transparent",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 10,
          transition: "background 0.05s",
        }}
      />

      <svg
        viewBox="0 0 200 200"
        style={{
          width: "100%",
          height: "auto",
          filter: isHovered
            ? "drop-shadow(0 0 20px rgba(255,68,68,0.4))"
            : "drop-shadow(0 0 10px rgba(255,68,68,0.15))",
          transition: "filter 0.3s ease",
        }}
      >
        {/* Background aura */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,68,68,0.08)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(255,68,68,0.12)" strokeWidth="0.8" />

        {/* Hooded silhouette */}
        <path
          d="M100,30 C130,30 155,55 160,85 C165,115 155,145 140,165 C130,180 115,190 100,190 C85,190 70,180 60,165 C45,145 35,115 40,85 C45,55 70,30 100,30"
          fill="#0d0d0d"
          stroke="rgba(255,68,68,0.2)"
          strokeWidth="1"
        />

        {/* Face shadow — deeper */}
        <path
          d="M100,60 C125,60 140,80 142,105 C144,130 135,150 125,160 C115,170 105,175 100,175 C95,175 85,170 75,160 C65,150 56,130 58,105 C60,80 75,60 100,60"
          fill="#050505"
        />

        {/* Eyes */}
        <AnimatedEye cx={80} cy={105} r={14} pupilR={6} mouseX={mousePos.x} mouseY={mousePos.y} />
        <AnimatedEye cx={120} cy={105} r={14} pupilR={6} mouseX={mousePos.x} mouseY={mousePos.y} />

        {/* Claws peeking from bottom */}
        <g transform="translate(65, 175)">
          <AnimatedClaw isHovered={isHovered} delay={0} />
        </g>
        <g transform="translate(85, 180)">
          <AnimatedClaw isHovered={isHovered} delay={100} />
        </g>
        <g transform="translate(105, 180)">
          <AnimatedClaw isHovered={isHovered} delay={200} />
        </g>
        <g transform="translate(125, 175)">
          <AnimatedClaw isHovered={isHovered} delay={300} />
        </g>

        {/* Digital particles */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={30 + i * 20}
            cy={20 + (i % 3) * 60}
            r={1 + (i % 2)}
            fill="rgba(255,68,68,0.15)"
            opacity={0.3 + (i % 3) * 0.2}
          >
            <animate
              attributeName="opacity"
              values={`${0.2 + i * 0.1};${0.5 + i * 0.05};${0.2 + i * 0.1}`}
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Label */}
      <div
        style={{
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: isHovered ? "#ff4444" : "rgba(255,255,255,0.25)",
            transition: "color 0.3s",
            margin: 0,
          }}
        >
          {isHovered ? "I SEE YOU." : "HOVER TO WAKE"}
        </p>
      </div>
    </div>
  );
}
