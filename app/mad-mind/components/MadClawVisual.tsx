"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════
   THE CLAW VISUAL — MAD Mind Head
   The fiery brain. The MAD Mind character.
   ═══════════════════════════════════════════════════════════ */

export default function MadClawVisual() {
  const [isHovered, setIsHovered] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity((prev) => {
        // Breathing cycle: slow pulse
        const time = Date.now() / 1000;
        return 0.92 + Math.sin(time * 1.5) * 0.08;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "320px",
        margin: "0 auto 32px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Glow ring behind */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "110%",
          height: "110%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,68,68,${isHovered ? 0.25 : 0.08}) 0%, transparent 70%)`,
          filter: `blur(${isHovered ? 30 : 20}px)`,
          transition: "all 0.5s ease",
          pointerEvents: "none",
        }}
      />

      {/* Image container with pulse */}
      <div
        style={{
          position: "relative",
          width: "280px",
          height: "280px",
          transform: `scale(${isHovered ? 1.05 : pulseIntensity})`,
          transition: isHovered
            ? "transform 0.3s ease, filter 0.4s ease"
            : "transform 0.1s linear, filter 0.4s ease",
          filter: isHovered
            ? "drop-shadow(0 0 30px rgba(255,68,68,0.5)) brightness(1.15)"
            : "drop-shadow(0 0 15px rgba(255,68,68,0.2))",
        }}
      >
        <Image
          src="/MAD-MIND-HEAD.png"
          alt="MAD Mind"
          fill
          style={{
            objectFit: "contain",
            borderRadius: "50%",
          }}
          priority
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#ff4444",
            opacity: 0.3 + Math.sin(Date.now() / 1000 + i) * 0.2,
            top: `${20 + i * 12}%`,
            left: `${15 + (i % 3) * 35}%`,
            animation: `float ${2 + i * 0.5}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Label */}
      <div style={{ textAlign: "center", marginTop: "12px" }}>
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
          {isHovered ? "MAD MIND IS WATCHING" : "THE TRUTH MACHINE"}
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          from {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          to {
            transform: translateY(-15px) scale(1.3);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
