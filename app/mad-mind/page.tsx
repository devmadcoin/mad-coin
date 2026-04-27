"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO GARDEN — Sonic Advance GBA Style
   Pixel-art checkerboard garden with a cute MAD creature.
   ═══════════════════════════════════════════════════════════ */

type StyleMode = "safe" | "savage" | "crashout";
type Mood = "idle" | "walking" | "talking" | "thinking";

interface ChatMessage {
  id: string;
  role: "user" | "mad";
  text: string;
  style?: StyleMode;
}

const PLACEHOLDERS = [
  "Why do I keep hesitating?",
  "Give me a caption.",
  "Call me out.",
  "I feel stuck.",
  "Roast my excuse.",
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ═══════════════════════════════════════════════════════════
   THE GARDEN — Authentic GBA Chao Garden Background
   ═══════════════════════════════════════════════════════════ */

function Garden() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "20px",
        background: "#4ba8e8",
      }}
    >
      {/* Sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #5eb8f0 0%, #7ec8f0 35%, #90d0f0 100%)",
        }}
      />

      {/* Diagonal cloud streaks */}
      <div style={{ position: "absolute", top: "8%", left: "10%", width: "60px", height: "3px", background: "rgba(255,255,255,0.6)", borderRadius: "2px" }} />
      <div style={{ position: "absolute", top: "12%", left: "50%", width: "40px", height: "2px", background: "rgba(255,255,255,0.5)", borderRadius: "2px" }} />
      <div style={{ position: "absolute", top: "6%", left: "75%", width: "50px", height: "3px", background: "rgba(255,255,255,0.4)", borderRadius: "2px" }} />

      {/* Fence across the top */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "10px",
          right: "10px",
          height: "24px",
          display: "flex",
          gap: "2px",
          zIndex: 2,
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              background: "linear-gradient(180deg, #c4953a 0%, #a0782c 100%)",
              borderRadius: "3px 3px 0 0",
              borderTop: "2px solid #d4a84a",
              borderLeft: "1px solid #8b6914",
              borderRight: "1px solid #8b6914",
            }}
          />
        ))}
      </div>

      {/* Top rail of fence */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "8px",
          right: "8px",
          height: "6px",
          background: "linear-gradient(180deg, #d4a84a 0%, #c4953a 100%)",
          borderRadius: "3px",
          zIndex: 3,
        }}
      />

      {/* Ground — checkerboard grass (GBA style) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "75%",
          background: `
            conic-gradient(
              #3cb843 0deg 90deg,
              #2da035 90deg 180deg,
              #3cb843 180deg 270deg,
              #2da035 270deg 360deg
            )
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Dirt / tree mound (top right) */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "-10px",
          width: "160px",
          height: "130px",
          background: "#8B6914",
          borderRadius: "60% 40% 50% 50%",
          boxShadow: "inset 4px 4px 12px rgba(0,0,0,0.2)",
        }}
      />
      {/* Tree trunk */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "50px",
          width: "20px",
          height: "50px",
          background: "#654321",
          borderRadius: "4px",
        }}
      />
      {/* Tree canopy layers */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          width: "80px",
          height: "40px",
          background: "#228B22",
          borderRadius: "50%",
          boxShadow: "-4px 4px 0 #1a6b1a",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "40px",
          width: "50px",
          height: "35px",
          background: "#2e8b2e",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "5px",
          width: "45px",
          height: "30px",
          background: "#1e7b1e",
          borderRadius: "50%",
        }}
      />

      {/* Bush clusters (top left) */}
      <div style={{ position: "absolute", top: "50px", left: "10px", width: "50px", height: "35px", background: "#1e7b1e", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "55px", left: "30px", width: "40px", height: "30px", background: "#228B22", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "45px", left: "-5px", width: "35px", height: "25px", background: "#1a6b1a", borderRadius: "50%" }} />

      {/* Water pond (large, bottom left) */}
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "-20px",
          width: "220px",
          height: "160px",
          background: "#1E90FF",
          borderRadius: "50%",
        }}
      >
        {/* Water surface lighter */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "20px",
            width: "60px",
            height: "20px",
            background: "rgba(255,255,255,0.25)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "80px",
            width: "40px",
            height: "12px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Gold/brown shoreline around water */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "130px",
          width: "20px",
          height: "10px",
          background: "#c4953a",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "115px",
          left: "155px",
          width: "15px",
          height: "8px",
          background: "#b08030",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "88px",
          left: "170px",
          width: "18px",
          height: "10px",
          background: "#c4953a",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "135px",
          left: "175px",
          width: "12px",
          height: "8px",
          background: "#d4a84a",
          borderRadius: "50%",
        }}
      />

      {/* Grass tufts */}
      {[
        { x: "35%", y: "58%" },
        { x: "55%", y: "55%" },
        { x: "75%", y: "60%" },
        { x: "85%", y: "52%" },
      ].map((pos, i) => (
        <div
          key={`tuft-${i}`}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: "10px",
            height: "12px",
            background: "#1e7b1e",
            borderRadius: "50% 50% 0 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "2px",
              top: "-3px",
              width: "3px",
              height: "6px",
              background: "#2e9b2e",
              borderRadius: "2px",
            }}
          />
        </div>
      ))}

      {/* Flower clusters */}
      {[
        { x: "28%", y: "62%", color: "#FF69B4" },
        { x: "30%", y: "65%", color: "#FF69B4" },
        { x: "26%", y: "65%", color: "#FFB6C1" },
        { x: "65%", y: "58%", color: "#FFD700" },
        { x: "67%", y: "61%", color: "#FFD700" },
        { x: "63%", y: "61%", color: "#FFA500" },
        { x: "82%", y: "68%", color: "#FF69B4" },
        { x: "84%", y: "71%", color: "#FFB6C1" },
      ].map((flower, i) => (
        <div
          key={`fl-${i}`}
          style={{
            position: "absolute",
            left: flower.x,
            top: flower.y,
            width: "6px",
            height: "6px",
            background: flower.color,
            borderRadius: "50%",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "1px",
              width: "3px",
              height: "6px",
              background: "#1e7b1e",
            }}
          />
        </div>
      ))}

      {/* Apple on ground */}
      <div
        style={{
          position: "absolute",
          bottom: "35%",
          left: "42%",
          width: "12px",
          height: "12px",
          background: "#FF4444",
          borderRadius: "50%",
          border: "1px solid #CC0000",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: "3px",
            width: "3px",
            height: "3px",
            background: "#32CD32",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Item box / toy (like the cube in screenshot) */}
      <div
        style={{
          position: "absolute",
          bottom: "38%",
          left: "58%",
          width: "16px",
          height: "14px",
          background: "#ddd",
          border: "2px solid #999",
          borderRadius: "2px",
        }}
      >
        <div style={{ position: "absolute", top: "2px", left: "2px", width: "5px", height: "5px", background: "#bbb" }} />
        <div style={{ position: "absolute", top: "2px", right: "2px", width: "5px", height: "5px", background: "#bbb" }} />
        <div style={{ position: "absolute", bottom: "2px", left: "2px", width: "5px", height: "5px", background: "#bbb" }} />
        <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "5px", height: "5px", background: "#bbb" }} />
      </div>

      {/* Shadow beneath creature area */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "36px",
          height: "8px",
          background: "rgba(0,0,0,0.12)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE CREATURE — $MAD Chao (Wider, Rounder, Eyes Lower)
   ═══════════════════════════════════════════════════════════ */

function Creature({ mood, style, xPos }: { mood: Mood; style: StyleMode; xPos: number }) {
  const bodyColor = "#ff2222";
  const bellyColor = "#ffaa44";

  const eyeState =
    mood === "thinking"
      ? "closed"
      : mood === "talking"
        ? "open"
        : "normal";

  return (
    <div
      style={{
        width: "48px",
        height: "40px",
        position: "relative",
        left: `${xPos}px`,
        bottom: "2px",
        transition: "left 0.6s ease-in-out",
        animation:
          mood === "walking"
            ? "chaoBounce 0.35s ease-in-out infinite"
            : mood === "thinking"
              ? "chaoThink 1.5s ease-in-out infinite"
              : "chaoIdle 2s ease-in-out infinite",
      }}
    >
      {/* Round body — wider than tall, like a ball */}
      <div
        style={{
          width: "40px",
          height: "30px",
          background: bodyColor,
          borderRadius: "50%",
          position: "absolute",
          bottom: "8px",
          left: "4px",
          zIndex: 2,
          boxShadow: `0 2px 6px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.2)`,
        }}
      >
        {/* Belly patch — lower on body */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "14px",
            height: "9px",
            background: bellyColor,
            borderRadius: "50%",
            opacity: 0.8,
          }}
        />

        {/* Eyes — LOWER on body, closer to center */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: eyeState === "closed" ? "9px" : "8px",
              height: eyeState === "closed" ? "2px" : "10px",
              background: eyeState === "closed" ? "#333" : "#fff",
              borderRadius: eyeState === "closed" ? "0" : "50%",
              position: "relative",
            }}
          >
            {eyeState !== "closed" && (
              <div
                style={{
                  width: "4px",
                  height: "5px",
                  background: "#111",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                }}
              />
            )}
          </div>
          <div
            style={{
              width: eyeState === "closed" ? "9px" : "8px",
              height: eyeState === "closed" ? "2px" : "10px",
              background: eyeState === "closed" ? "#333" : "#fff",
              borderRadius: eyeState === "closed" ? "0" : "50%",
              position: "relative",
            }}
          >
            {eyeState !== "closed" && (
              <div
                style={{
                  width: "4px",
                  height: "5px",
                  background: "#111",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                }}
              />
            )}
          </div>
        </div>

        {/* Tiny mouth — lower on body */}
        <div
          style={{
            width: mood === "talking" ? "6px" : "4px",
            height: mood === "talking" ? "3px" : "2px",
            background: mood === "talking" ? "#222" : "transparent",
            borderBottom: mood === "talking" ? "none" : "2px solid #333",
            borderRadius: mood === "talking" ? "0 0 50% 50%" : "0",
            position: "absolute",
            bottom: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "all 0.15s ease",
          }}
        />
      </div>

      {/* Small flame tuft — centered on top */}
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "16px",
          height: "10px",
          background: "#ff4444",
          borderRadius: "50% 50% 30% 30%",
          boxShadow: "0 0 6px #ff444480",
          animation: "flameWiggle 0.6s ease-in-out infinite alternate",
          zIndex: 3,
        }}
      />

      {/* Tiny feet — barely visible nubs */}
      <div
        style={{
          position: "absolute",
          bottom: "4px",
          left: "14px",
          width: "8px",
          height: "4px",
          background: "#cc1111",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "4px",
          right: "14px",
          width: "8px",
          height: "4px",
          background: "#cc1111",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function ChatBubble({
  text,
  visible,
  isUser,
}: {
  text: string;
  visible: boolean;
  isUser: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!visible) {
      setDisplayed("");
      setDone(false);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [visible, text]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: "10px",
        zIndex: 50,
        minWidth: "200px",
        maxWidth: "300px",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: isUser
            ? "6px solid rgba(255,255,255,0.12)"
            : "6px solid rgba(255,30,30,0.25)",
        }}
      />
      <div
        style={{
          background: isUser
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,30,30,0.15)",
          border: isUser
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(255,50,50,0.3)",
          borderRadius: "14px",
          padding: "10px 14px",
          backdropFilter: "blur(6px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        <p
          style={{
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: 1.4,
            margin: 0,
            whiteSpace: "pre-wrap",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {displayed}
          {!done && (
            <span
              style={{
                display: "inline-block",
                width: "5px",
                height: "10px",
                background: "#ff4444",
                marginLeft: "2px",
                animation: "blinkCursor 0.7s infinite",
              }}
            />
          )}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STYLE SELECTOR
   ═══════════════════════════════════════════════════════════ */

function StyleSelector({
  style,
  onChange,
}: {
  style: StyleMode;
  onChange: (s: StyleMode) => void;
}) {
  const modes: { key: StyleMode; label: string; color: string }[] = [
    { key: "safe", label: "Safe", color: "#4ade80" },
    { key: "savage", label: "Savage", color: "#ff4444" },
    { key: "crashout", label: "Crashout", color: "#ff6600" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          style={{
            padding: "8px 16px",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: style === m.key ? m.color : "rgba(255,255,255,0.1)",
            background: style === m.key ? `${m.color}15` : "rgba(255,255,255,0.03)",
            color: style === m.key ? m.color : "rgba(255,255,255,0.5)",
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<StyleMode>("savage");
  const [mood, setMood] = useState<Mood>("walking");
  const [creatureX, setCreatureX] = useState(0);
  const [creatureDirection, setCreatureDirection] = useState(1); // 1 = right, -1 = left
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleIsUser, setBubbleIsUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [count, setCount] = useState(0);

  /* Creature walks around when idle */
  useEffect(() => {
    if (mood === "idle" || mood === "walking") {
      const interval = setInterval(() => {
        setMood((prev) => (prev === "walking" ? "idle" : "walking"));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mood]);

  /* Creature wanders left and right */
  useEffect(() => {
    if (mood === "walking") {
      const interval = setInterval(() => {
        setCreatureX((prev) => {
          const next = prev + creatureDirection * 15;
          if (next > 120) {
            setCreatureDirection(-1);
            return 120;
          }
          if (next < -120) {
            setCreatureDirection(1);
            return -120;
          }
          return next;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [mood, creatureDirection]);

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim() || PLACEHOLDERS[count % PLACEHOLDERS.length];
      if (!text || isProcessing) return;

      const userMsg: ChatMessage = { id: uid(), role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsProcessing(true);
      setMood("thinking");
      setCurrentResponse(text);
      setBubbleIsUser(true);
      setShowBubble(true);

      setTimeout(() => {
        setShowBubble(false);
        setMood("thinking");

        queueMessage(text, style).then(async (queueData) => {
          if (!queueData.pollUrl) {
            setMood("idle");
            setIsProcessing(false);
            return;
          }
          
          // Timeout guard — never stay stuck longer than 45 seconds
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("timeout")), 45000)
          );
          
          try {
            const response = await Promise.race([
              pollForResponse(queueData.pollUrl),
              timeoutPromise,
            ]) as any;
            setMood("talking");

            const madText = response?.output || "Signal broke.";
            const madMsg: ChatMessage = {
              id: uid(),
              role: "mad",
              text: madText,
              style,
            };
            setMessages((prev) => [...prev, madMsg]);
            setCurrentResponse(madText);
            setBubbleIsUser(false);
            setShowBubble(true);

            const typeDuration = Math.min(madText.length * 25 + 1000, 8000);
            setTimeout(() => {
              setShowBubble(false);
              setMood("walking");
              setIsProcessing(false);
            }, typeDuration);
          } catch (err) {
            // Timeout or error — show fallback
            setMood("talking");
            const fallback = "Connection slow. Try again?";
            const madMsg: ChatMessage = {
              id: uid(),
              role: "mad",
              text: fallback,
              style,
            };
            setMessages((prev) => [...prev, madMsg]);
            setCurrentResponse(fallback);
            setBubbleIsUser(false);
            setShowBubble(true);
            setTimeout(() => {
              setShowBubble(false);
              setMood("walking");
              setIsProcessing(false);
            }, 3000);
          }
        });
      }, 1200);
    },
    [input, isProcessing, count, style]
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes chaoIdle {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
            @keyframes chaoBounce {
              0%, 100% { transform: translateY(0) scaleY(1); }
              50% { transform: translateY(-4px) scaleY(0.97); }
            }
            @keyframes chaoThink {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.03); }
            }
            @keyframes flameWiggle {
              0% { transform: translateX(-50%) rotate(-3deg); }
              100% { transform: translateX(-50%) rotate(3deg); }
            }
            @keyframes walkingChao {
              0% { transform: translateX(0); }
              50% { transform: translateX(30px); }
              100% { transform: translateX(0); }
            }
            @keyframes blinkCursor {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            .walking-chao {
              animation: walkingChao 3s linear infinite;
            }
          `,
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "rgba(255,50,50,0.6)",
            marginBottom: "6px",
          }}
        >
          [ MAD CHAO GARDEN ]
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 900,
            lineHeight: 1,
            margin: 0,
          }}
        >
          MAD{" "}
          <span style={{ color: "#ff4444" }}>DEN</span>
        </h1>
      </div>

      <StyleSelector style={style} onChange={setStyle} />

      {/* The Garden */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "520px",
          height: "360px",
          borderRadius: "4px",
          border: "4px solid #8B6914",
          overflow: "hidden",
          margin: "0 auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.1)",
        }}
      >
        <Garden />

        {/* Creature container */}
        <div
          style={{
            position: "absolute",
            bottom: "88px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <ChatBubble
            text={currentResponse}
            visible={showBubble}
            isUser={bubbleIsUser}
          />
          <Creature mood={mood} style={style} xPos={creatureX} />
        </div>

        {/* Status label */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            background: "rgba(0,0,0,0.65)",
            borderRadius: "12px",
            padding: "6px 14px",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: mood === "thinking" ? "#ffaa44" : mood === "talking" ? "#ff4444" : "#aaa",
            }}
          >
            {mood === "thinking"
              ? "$MAD Chao is thinking..."
              : mood === "talking"
                ? "$MAD Chao is talking..."
                : "$MAD Chao is exploring..."}
          </span>
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void sendMessage();
            }}
            placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              outline: "none",
            }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={isProcessing}
            style={{
              padding: "12px 20px",
              borderRadius: "14px",
              border: "none",
              background: "#ff4444",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: isProcessing ? "wait" : "pointer",
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            {isProcessing ? "..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   API HELPERS
   ═══════════════════════════════════════════════════════════ */

async function queueMessage(
  message: string,
  style: StyleMode
): Promise<{ requestId?: string; pollUrl?: string; error?: string }> {
  try {
    const res = await fetch("/api/mad-mind/claw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, style, sessionId: "mad-den" }),
    });
    return await res.json();
  } catch {
    return { error: "Failed to queue" };
  }
}

async function pollForResponse(
  pollUrl: string,
  maxAttempts = 60
): Promise<{ output?: string; meta?: unknown } | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const res = await fetch(pollUrl);
      const data = await res.json();
      if (data.status === "done") {
        return data;
      }
    } catch {
      /* continue polling */
    }
  }
  return null;
}