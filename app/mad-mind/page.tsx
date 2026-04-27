"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MAD DEN — Chao Garden Style Interface
   A pixel-art room where the MAD creature walks around.
   Chat bubble appears above its head when responding.
   ═══════════════════════════════════════════════════════════ */

type StyleMode = "safe" | "savage" | "crashout";
type Mood = "idle" | "walking" | "talking" | "thinking" | "reacting";

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

/* ─── UTILS ─── */
function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ═══════════════════════════════════════════════════════════
   THE CREATURE — CSS Pixel-Art Flame Character
   ═══════════════════════════════════════════════════════════ */

function Creature({ mood, style }: { mood: Mood; style: StyleMode }) {
  const flameColor =
    style === "crashout"
      ? "#ff4500"
      : style === "safe"
        ? "#ff8c42"
        : "#ff2200";

  const eyeExpression =
    mood === "thinking"
      ? "thinking"
      : mood === "reacting"
        ? "angry"
        : mood === "talking"
          ? "open"
          : "normal";

  return (
    <div
      className={`creature ${mood === "walking" ? "walking" : ""} ${mood === "talking" ? "talking" : ""}`}
      style={{
        width: "64px",
        height: "80px",
        position: "relative",
        transition: "transform 0.3s ease",
      }}
    >
      {/* Body */}
      <div
        style={{
          width: "48px",
          height: "48px",
          background: flameColor,
          borderRadius: "50% 50% 45% 45%",
          position: "absolute",
          bottom: "16px",
          left: "8px",
          boxShadow: `0 0 20px ${flameColor}80, 0 0 40px ${flameColor}40`,
          animation:
            mood === "walking"
              ? "creatureBounce 0.4s ease-in-out infinite"
              : mood === "thinking"
                ? "creaturePulse 2s ease-in-out infinite"
                : "creatureIdle 3s ease-in-out infinite",
        }}
      >
        {/* Eyes */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            position: "absolute",
            top: "14px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* Left Eye */}
          <div
            style={{
              width: "10px",
              height: eyeExpression === "open" ? "12px" : eyeExpression === "thinking" ? "3px" : "10px",
              background: "#fff",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                background: "#000",
                borderRadius: "50%",
                position: "absolute",
                top: eyeExpression === "thinking" ? "0" : "3px",
                left: "2px",
              }}
            />
          </div>
          {/* Right Eye */}
          <div
            style={{
              width: "10px",
              height: eyeExpression === "open" ? "12px" : eyeExpression === "thinking" ? "3px" : "10px",
              background: "#fff",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                background: "#000",
                borderRadius: "50%",
                position: "absolute",
                top: eyeExpression === "thinking" ? "0" : "3px",
                left: "2px",
              }}
            />
          </div>
        </div>

        {/* Mouth */}
        <div
          style={{
            width: mood === "talking" ? "16px" : "12px",
            height: mood === "talking" ? "10px" : "4px",
            background: mood === "talking" ? "#000" : "none",
            borderBottom: mood === "talking" ? "none" : "2px solid #000",
            borderRadius: mood === "talking" ? "0 0 50% 50%" : "0",
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "all 0.2s ease",
          }}
        />
      </div>

      {/* Flame tip / hair */}
      <div
        style={{
          width: "16px",
          height: "24px",
          background: "#ff6600",
          borderRadius: "50% 50% 20% 20%",
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 0 15px #ff660060",
          animation: "flameFlicker 0.8s ease-in-out infinite alternate",
        }}
      />

      {/* Arms */}
      <div
        style={{
          width: "14px",
          height: "8px",
          background: flameColor,
          borderRadius: "4px",
          position: "absolute",
          bottom: "24px",
          left: "-2px",
          transform: mood === "walking" ? "rotate(-20deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}
      />
      <div
        style={{
          width: "14px",
          height: "8px",
          background: flameColor,
          borderRadius: "4px",
          position: "absolute",
          bottom: "24px",
          right: "-2px",
          transform: mood === "walking" ? "rotate(20deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}
      />

      {/* Feet */}
      <div
        style={{
          width: "12px",
          height: "6px",
          background: "#cc1100",
          borderRadius: "50%",
          position: "absolute",
          bottom: "10px",
          left: "12px",
        }}
      />
      <div
        style={{
          width: "12px",
          height: "6px",
          background: "#cc1100",
          borderRadius: "50%",
          position: "absolute",
          bottom: "10px",
          right: "12px",
        }}
      />

      <style jsx>{`
        @keyframes creatureIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes creatureBounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-6px) scaleY(0.95); }
        }
        @keyframes creaturePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes flameFlicker {
          0% { transform: translateX(-50%) scaleY(1); }
          100% { transform: translateX(-50%) scaleY(1.2) scaleX(0.9); }
        }
        .walking {
          animation: creatureWalk 3s linear infinite;
        }
        @keyframes creatureWalk {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
      `}</style>
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
    }, 30);
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
        marginBottom: "12px",
        zIndex: 50,
        minWidth: "200px",
        maxWidth: "320px",
      }}
    >
      {/* Bubble tail */}
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: isUser
            ? "8px solid rgba(255,255,255,0.1)"
            : "8px solid rgba(255,30,30,0.25)",
        }}
      />
      {/* Bubble body */}
      <div
        style={{
          background: isUser
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,30,30,0.15)",
          border: isUser
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(255,50,50,0.3)",
          borderRadius: "16px",
          padding: "12px 16px",
          backdropFilter: "blur(8px)",
          boxShadow: isUser
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(255,0,0,0.15)",
        }}
      >
        <p
          style={{
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            lineHeight: 1.5,
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {displayed}
          {!done && (
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "12px",
                background: "#ff4444",
                marginLeft: "2px",
                animation: "blink 0.8s infinite",
              }}
            />
          )}
        </p>
      </div>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE ROOM — Pixel Art Garden / Den Background
   ═══════════════════════════════════════════════════════════ */

function MadDen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        height: "320px",
        background: "#0a0a0a",
        borderRadius: "24px",
        border: "2px solid rgba(255,50,50,0.2)",
        overflow: "hidden",
        margin: "0 auto",
        boxShadow: "0 0 40px rgba(255,0,0,0.1), inset 0 0 60px rgba(255,0,0,0.05)",
      }}
    >
      {/* Floor grid — pixel art style */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(255,50,50,0.03) 39px,
              rgba(255,50,50,0.03) 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(255,50,50,0.03) 39px,
              rgba(255,50,50,0.03) 40px
            )
          `,
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          width: "24px",
          height: "24px",
          borderTop: "2px solid rgba(255,50,50,0.3)",
          borderLeft: "2px solid rgba(255,50,50,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          width: "24px",
          height: "24px",
          borderTop: "2px solid rgba(255,50,50,0.3)",
          borderRight: "2px solid rgba(255,50,50,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          width: "24px",
          height: "24px",
          borderBottom: "2px solid rgba(255,50,50,0.3)",
          borderLeft: "2px solid rgba(255,50,50,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          width: "24px",
          height: "24px",
          borderBottom: "2px solid rgba(255,50,50,0.3)",
          borderRight: "2px solid rgba(255,50,50,0.3)",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "100px",
          background: "radial-gradient(ellipse, rgba(255,50,50,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {children}
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
  const creatureRef = useRef<HTMLDivElement>(null);

  /* Creature walks around when idle */
  useEffect(() => {
    if (mood === "idle" || mood === "walking") {
      const interval = setInterval(() => {
        setMood((prev) => (prev === "walking" ? "idle" : "walking"));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [mood]);

  /* Send message */
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

      /* Hide user bubble after a moment, then show thinking */
      setTimeout(() => {
        setShowBubble(false);
        setMood("thinking");

        /* Queue to claw backend */
        queueMessage(text, style).then(async (queueData) => {
          if (!queueData.requestId) {
            setMood("idle");
            setIsProcessing(false);
            return;
          }

          /* Poll for response */
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

          /* After response finishes typing, go back to walking */
          const typeDuration = Math.min(madText.length * 30 + 1000, 8000);
          setTimeout(() => {
            setShowBubble(false);
            setMood("walking");
            setIsProcessing(false);
          }, typeDuration);
        });
      }, 1500);
    },
    [input, isProcessing, count, style]
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "rgba(255,50,50,0.6)",
            marginBottom: "8px",
          }}
        >
          [ MAD AI ]
        </p>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 900,
            lineHeight: 1,
            margin: 0,
          }}
        >
          The Truth{" "}
          <span style={{ color: "#ff4444" }}>Machine</span>
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "8px",
          }}
        >
          Talk to the creature. It sees your patterns.
        </p>
      </div>

      {/* Style Selector */}
      <StyleSelector style={style} onChange={setStyle} />

      {/* The Den — Chao Garden Style */}
      <MadDen>
        {/* Creature container */}
        <div
          ref={creatureRef}
          style={{
            position: "absolute",
            bottom: "60px",
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
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            zIndex: 5,
          }}
        >
          {mood === "thinking"
            ? "Processing..."
            : mood === "talking"
              ? "Responding..."
              : "Walking around..."}
        </div>
      </MadDen>

      {/* Input Area */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
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
              padding: "14px 18px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,50,50,0.4)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={isProcessing}
            style={{
              padding: "14px 24px",
              borderRadius: "16px",
              border: "none",
              background: "#ff4444",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: isProcessing ? "wait" : "pointer",
              opacity: isProcessing ? 0.6 : 1,
              transition: "opacity 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {isProcessing ? "..." : "Send"}
          </button>
        </div>

        {/* Suggested prompts */}
        {!isProcessing && messages.length < 2 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {PLACEHOLDERS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => void sendMessage(prompt)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,50,50,0.3)";
                  e.currentTarget.style.color = "#ff8888";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "24px",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        <span>Messages: {messages.length}</span>
        <span>Style: {style}</span>
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