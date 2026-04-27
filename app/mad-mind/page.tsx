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
   THE GARDEN — GBA Chao Garden Background
   ═══════════════════════════════════════════════════════════ */

function Garden() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "20px",
      }}
    >
      {/* Sky — blue gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #5ca8e8 0%, #7ec8f0 40%, #a8d8f0 100%)",
        }}
      />

      {/* Clouds — pixelated blobs */}
      <div style={{ position: "absolute", top: "12%", left: "15%", width: "48px", height: "20px", background: "#fff", borderRadius: "10px", opacity: 0.7 }} />
      <div style={{ position: "absolute", top: "8%", left: "60%", width: "36px", height: "16px", background: "#fff", borderRadius: "8px", opacity: 0.6 }} />
      <div style={{ position: "absolute", top: "18%", left: "80%", width: "56px", height: "22px", background: "#fff", borderRadius: "12px", opacity: 0.5 }} />

      {/* Dirt / tree area (top right corner) */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "140px",
          height: "120px",
          background: "#8B6914",
          borderRadius: "50%",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "30px",
          width: "60px",
          height: "80px",
          background: "#228B22",
          borderRadius: "50% 50% 45% 45%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "50px",
          width: "40px",
          height: "50px",
          background: "#32CD32",
          borderRadius: "50%",
        }}
      />

      {/* Ground / grass — checkerboard */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
          background: `
            repeating-linear-gradient(
              0deg,
              #3cb043 0px,
              #3cb043 16px,
              #32a03d 16px,
              #32a03d 32px
            ),
            repeating-linear-gradient(
              90deg,
              #3cb043 0px,
              #3cb043 16px,
              #32a03d 16px,
              #32a03d 32px
            )
          `,
          backgroundBlendMode: "multiply",
        }}
      >
        {/* Grass top edge */}
        <div
          style={{
            position: "absolute",
            top: "-6px",
            left: 0,
            right: 0,
            height: "12px",
            background: "linear-gradient(180deg, #2d8a33 0%, #3cb043 100%)",
          }}
        />
      </div>

      {/* Water pond (bottom left) */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "3%",
          width: "100px",
          height: "70px",
          background: "#1E90FF",
          borderRadius: "50%",
          border: "3px solid #0066CC",
          boxShadow: "inset 0 0 10px rgba(0,100,200,0.3)",
        }}
      >
        {/* Water shine */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "25%",
            width: "30px",
            height: "8px",
            background: "rgba(255,255,255,0.4)",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Grass tufts scattered */}
      {[
        { x: "20%", y: "58%" },
        { x: "45%", y: "52%" },
        { x: "70%", y: "60%" },
        { x: "85%", y: "55%" },
        { x: "55%", y: "65%" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: "12px",
            height: "14px",
            background: "#228B22",
            borderRadius: "50% 50% 0 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "3px",
              top: "-4px",
              width: "4px",
              height: "8px",
              background: "#32CD32",
              borderRadius: "2px",
            }}
          />
        </div>
      ))}

      {/* Small flowers */}
      {[
        { x: "30%", y: "62%", color: "#FF69B4" },
        { x: "60%", y: "58%", color: "#FFD700" },
        { x: "75%", y: "68%", color: "#FF69B4" },
      ].map((flower, i) => (
        <div
          key={`f-${i}`}
          style={{
            position: "absolute",
            left: flower.x,
            top: flower.y,
            width: "8px",
            height: "8px",
            background: flower.color,
            borderRadius: "50%",
            boxShadow: "0 0 4px rgba(255,255,255,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "2px",
              width: "4px",
              height: "8px",
              background: "#228B22",
            }}
          />
        </div>
      ))}

      {/* Small apple / item on ground */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "40%",
          width: "14px",
          height: "14px",
          background: "#FF4444",
          borderRadius: "50%",
          border: "1px solid #CC0000",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: "4px",
            width: "4px",
            height: "4px",
            background: "#32CD32",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Shadow beneath where creature walks */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40px",
          height: "10px",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE CREATURE — Cute Chao-Style MAD Character
   ═══════════════════════════════════════════════════════════ */

function Creature({ mood, style }: { mood: Mood; style: StyleMode }) {
  const bodyColor =
    style === "crashout"
      ? "#ff3300"
      : style === "safe"
        ? "#ff8844"
        : "#ff2222";

  const haloColor =
    style === "crashout"
      ? "#ff6600"
      : style === "safe"
        ? "#ffaa44"
        : "#ff4444";

  const eyeState =
    mood === "thinking"
      ? "closed"
      : mood === "talking"
        ? "open"
        : "normal";

  return (
    <div
      className={mood === "walking" ? "walking-chao" : ""}
      style={{
        width: "52px",
        height: "58px",
        position: "relative",
        transition: "transform 0.2s ease",
        animation:
          mood === "walking"
            ? "chaoBounce 0.35s ease-in-out infinite"
            : mood === "thinking"
              ? "chaoThink 1.5s ease-in-out infinite"
              : "chaoIdle 2s ease-in-out infinite",
      }}
    >
      {/* Body — round, cute */}
      <div
        style={{
          width: "44px",
          height: "40px",
          background: bodyColor,
          borderRadius: "50% 50% 48% 48%",
          position: "absolute",
          bottom: "10px",
          left: "4px",
          boxShadow: `0 3px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(0,0,0,0.1), inset 4px 4px 8px rgba(255,255,255,0.2)`,
        }}
      >
        {/* Eyes */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: eyeState === "closed" ? "10px" : "8px",
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
              width: eyeState === "closed" ? "10px" : "8px",
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

        {/* Mouth */}
        <div
          style={{
            width: mood === "talking" ? "10px" : "6px",
            height: mood === "talking" ? "6px" : "3px",
            background: mood === "talking" ? "#222" : "transparent",
            borderBottom: mood === "talking" ? "none" : "2px solid #333",
            borderRadius: mood === "talking" ? "0 0 50% 50%" : "0",
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "all 0.15s ease",
          }}
        />
      </div>

      {/* Flame halo / tuft on head */}
      <div
        style={{
          position: "absolute",
          top: "-4px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "20px",
          height: "14px",
          background: haloColor,
          borderRadius: "50% 50% 30% 30%",
          boxShadow: `0 0 10px ${haloColor}80`,
          animation: "flameWiggle 0.6s ease-in-out infinite alternate",
        }}
      />

      {/* Tiny arms */}
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          left: "-2px",
          width: "10px",
          height: "6px",
          background: bodyColor,
          borderRadius: "50%",
          transform: mood === "walking" ? "rotate(-15deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          right: "-2px",
          width: "10px",
          height: "6px",
          background: bodyColor,
          borderRadius: "50%",
          transform: mood === "walking" ? "rotate(15deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}
      />

      {/* Tiny feet */}
      <div
        style={{
          position: "absolute",
          bottom: "6px",
          left: "14px",
          width: "10px",
          height: "6px",
          background: "#cc1111",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "6px",
          right: "14px",
          width: "10px",
          height: "6px",
          background: "#cc1111",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHAT BUBBLE — RPG Dialogue Style
   ═══════════════════════════════════════════════════════════ */

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleIsUser, setBubbleIsUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [count, setCount] = useState(0);

  /* Creature walks when idle */
  useEffect(() => {
    if (mood === "idle" || mood === "walking") {
      const interval = setInterval(() => {
        setMood((prev) => (prev === "walking" ? "idle" : "walking"));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mood]);

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
          const response = await pollForResponse(queueData.pollUrl);
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
          height: "340px",
          borderRadius: "20px",
          border: "3px solid #2d8a33",
          overflow: "hidden",
          margin: "0 auto",
          boxShadow: "0 0 30px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.1)",
        }}
      >
        <Garden />

        {/* Creature container */}
        <div
          style={{
            position: "absolute",
            bottom: "70px",
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
          <Creature mood={mood} style={style} />
        </div>

        {/* Status label */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "9px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.4)",
            zIndex: 5,
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {mood === "thinking"
            ? "Thinking..."
            : mood === "talking"
              ? "Talking..."
              : "Walking around..."}
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