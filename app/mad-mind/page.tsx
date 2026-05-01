"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MAD DEN — Chao Garden Interface (v2: Live Chao Tracker)
   Now connected to mad_chao_api.py for real evolution state.
   ═══════════════════════════════════════════════════════════ */

type StyleMode = "safe" | "savage" | "crashout";
type Mood = "idle" | "walking" | "talking" | "thinking" | "reacting";
type ChaoPath = "abundance" | "chaos" | "dark" | "hero";

interface ChatMessage {
  id: string;
  role: "user" | "mad";
  text: string;
  style?: StyleMode;
}

interface ChaoState {
  ok: boolean;
  user_id?: string;
  name?: string;
  form?: string;
  phase?: string;
  age_days?: number;
  xp?: Record<ChaoPath, number>;
  distribution?: Record<ChaoPath, number>;
  balance?: number;
  rebirths?: number;
  traits?: string[];
  can_feed?: boolean;
  wait_seconds?: number | null;
}

interface GardenState {
  ok: boolean;
  form?: string;
  garden_mode?: string;
  total_chao?: number;
  active_chao?: number;
  path_distribution?: Record<ChaoPath, number>;
  balance_score?: number;
  mad_form_count?: number;
}

const PLACEHOLDERS = [
  "Why do I keep hesitating?",
  "Give me a caption.",
  "Call me out.",
  "I feel stuck.",
  "Roast my excuse.",
];

const CHAO_API = process.env.NEXT_PUBLIC_CHAO_API || "http://43.98.204.163:8742"; // Set via env in production
const PATH_META: Record<ChaoPath, { label: string; emoji: string; color: string }> = {
  abundance: { label: "Abundance", emoji: "🟡", color: "#ffd700" },
  chaos:     { label: "Chaos",     emoji: "🔴", color: "#ff2200" },
  dark:      { label: "Dark",      emoji: "⚫", color: "#1a1a2e" },
  hero:      { label: "Hero",      emoji: "⚪", color: "#e0e0e0" },
};

/* ─── UTILS ─── */
function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ═══════════════════════════════════════════════════════════
   THE CREATURE — Now accepts `form` for evolution visuals
   ═══════════════════════════════════════════════════════════ */

function Creature({ mood, style, form }: { mood: Mood; style: StyleMode; form?: string }) {
  // Derive visual from form + style
  const formBase = form?.split("_")[0] || "chaos";
  const isMad = form === "mad";
  const isEgg = form === "egg" || !form;

  const flameColor = isMad
    ? "#ff00ff"
    : formBase === "abundance"
      ? "#ffd700"
      : formBase === "dark"
        ? "#2d1b4e"
        : formBase === "hero"
          ? "#c0c0c0"
          : style === "crashout"
            ? "#ff4500"
            : style === "safe"
              ? "#ff8c42"
              : "#ff2200";

  const glowColor = isMad
    ? "rgba(255,0,255,0.4)"
    : formBase === "abundance"
      ? "rgba(255,215,0,0.3)"
      : formBase === "dark"
        ? "rgba(45,27,78,0.5)"
        : formBase === "hero"
          ? "rgba(192,192,192,0.3)"
          : "rgba(255,50,50,0.3)";

  const eyeExpression =
    mood === "thinking"
      ? "thinking"
      : mood === "reacting"
        ? "angry"
        : mood === "talking"
          ? "open"
          : "normal";

  if (isEgg) {
    return (
      <div
        style={{
          width: "64px",
          height: "80px",
          position: "relative",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "56px",
            background: "radial-gradient(ellipse, #444, #111)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            position: "absolute",
            bottom: "12px",
            left: "8px",
            boxShadow: `0 0 30px ${glowColor}, inset 0 0 20px rgba(255,255,255,0.05)`,
            animation: "creaturePulse 2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "20px",
              opacity: 0.3,
            }}
          >
            🥚
          </div>
        </div>
        <style jsx>{`
          @keyframes creaturePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

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
      {/* Aura ring for evolved/MAD forms */}
      {(form?.includes("evolved") || isMad) && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: `2px solid ${flameColor}40`,
            boxShadow: `0 0 30px ${glowColor}`,
            animation: "auraSpin 4s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}

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
          boxShadow: `0 0 20px ${flameColor}80, 0 0 40px ${glowColor}`,
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
          <div
            style={{
              width: "10px",
              height: eyeExpression === "open" ? "12px" : eyeExpression === "thinking" ? "3px" : "10px",
              background: isMad ? "#fff" : "#fff",
              borderRadius: "50%",
              position: "relative",
              boxShadow: isMad ? "0 0 8px #ff00ff" : "none",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                background: isMad ? "#ff00ff" : "#000",
                borderRadius: "50%",
                position: "absolute",
                top: eyeExpression === "thinking" ? "0" : "3px",
                left: "2px",
              }}
            />
          </div>
          <div
            style={{
              width: "10px",
              height: eyeExpression === "open" ? "12px" : eyeExpression === "thinking" ? "3px" : "10px",
              background: "#fff",
              borderRadius: "50%",
              position: "relative",
              boxShadow: isMad ? "0 0 8px #ff00ff" : "none",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                background: isMad ? "#ff00ff" : "#000",
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
          background: isMad ? "#ff00ff" : "#ff6600",
          borderRadius: "50% 50% 20% 20%",
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: isMad ? "0 0 20px #ff00ff80" : "0 0 15px #ff660060",
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
          background: isMad ? "#ff00ff" : "#cc1100",
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
          background: isMad ? "#ff00ff" : "#cc1100",
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
        @keyframes auraSpin {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
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
   CHAT BUBBLE
   ═══════════════════════════════════════════════════════════ */

function ChatBubble({ text, visible, isUser }: { text: string; visible: boolean; isUser: boolean }) {
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
          borderTop: isUser ? "8px solid rgba(255,255,255,0.1)" : "8px solid rgba(255,30,30,0.25)",
        }}
      />
      <div
        style={{
          background: isUser ? "rgba(255,255,255,0.08)" : "rgba(255,30,30,0.15)",
          border: isUser ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,50,50,0.3)",
          borderRadius: "16px",
          padding: "12px 16px",
          backdropFilter: "blur(8px)",
          boxShadow: isUser ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(255,0,0,0.15)",
        }}
      >
        <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
          {displayed}
          {!done && <span style={{ display: "inline-block", width: "6px", height: "12px", background: "#ff4444", marginLeft: "2px", animation: "blink 0.8s infinite" }} />}
        </p>
      </div>
      <style jsx>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE ROOM — Garden Background shifts with global mode
   ═══════════════════════════════════════════════════════════ */

function MadDen({ gardenMode, children }: { gardenMode?: string; children: React.ReactNode }) {
  const modeColors: Record<string, { bg: string; accent: string; glow: string }> = {
    neutral: { bg: "#0a0a0a", accent: "rgba(255,50,50,0.2)", glow: "rgba(255,0,0,0.1)" },
    hero:    { bg: "#1a1505", accent: "rgba(255,200,50,0.2)", glow: "rgba(255,200,0,0.1)" },
    dark:    { bg: "#050510", accent: "rgba(80,30,180,0.3)", glow: "rgba(80,30,180,0.15)" },
    chaos:   { bg: "#150505", accent: "rgba(255,60,0,0.3)", glow: "rgba(255,60,0,0.15)" },
  };
  const colors = modeColors[gardenMode || "neutral"];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        height: "320px",
        background: colors.bg,
        borderRadius: "24px",
        border: `2px solid ${colors.accent}`,
        overflow: "hidden",
        margin: "0 auto",
        boxShadow: `0 0 40px ${colors.glow}, inset 0 0 60px ${colors.glow}`,
        transition: "all 1s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px)
          `,
        }}
      />
      <div style={{ position: "absolute", top: "16px", left: "16px", width: "24px", height: "24px", borderTop: `2px solid ${colors.accent}`, borderLeft: `2px solid ${colors.accent}` }} />
      <div style={{ position: "absolute", top: "16px", right: "16px", width: "24px", height: "24px", borderTop: `2px solid ${colors.accent}`, borderRight: `2px solid ${colors.accent}` }} />
      <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "24px", height: "24px", borderBottom: `2px solid ${colors.accent}`, borderLeft: `2px solid ${colors.accent}` }} />
      <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "24px", height: "24px", borderBottom: `2px solid ${colors.accent}`, borderRight: `2px solid ${colors.accent}` }} />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "100px",
          background: `radial-gradient(ellipse, ${colors.glow}, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHAO STATS PANEL
   ═══════════════════════════════════════════════════════════ */

function ChaoPanel({ chao, onFeed, onAffirm, loading }: {
  chao: ChaoState | null;
  onFeed: (p: ChaoPath) => void;
  onAffirm: () => void;
  loading: boolean;
}) {
  if (!chao || !chao.ok) {
    return (
      <div style={{ textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
        {loading ? "Connecting to the Garden..." : "Garden dormant. Check back later."}
      </div>
    );
  }

  const formLabel = chao.form === "egg" ? "🥚 EGG"
    : chao.form === "mad" ? "🌈 MAD CHAO"
    : chao.form?.toUpperCase().replace("_", " ");

  const dist: Record<ChaoPath, number> = chao.distribution || {};
  const canFeed = chao.can_feed;

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "16px auto" }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>
            {chao.name || "Your"} Chao
          </span>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#ff4444" }}>
            {formLabel}
          </span>
        </div>

        {/* XP Bars */}
        {(Object.keys(PATH_META) as ChaoPath[]).map((p) => {
          const pct = dist[p] || 0;
          const meta = PATH_META[p];
          return (
            <div key={p} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>
                <span>{meta.emoji} {meta.label}</span>
                <span>{pct.toFixed(1)}% ({chao.xp?.[p] || 0} xp)</span>
              </div>
              <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: meta.color,
                  borderRadius: "2px",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
          {(Object.keys(PATH_META) as ChaoPath[]).map((p) => (
            <button
              key={p}
              onClick={() => onFeed(p)}
              disabled={!canFeed || loading}
              style={{
                flex: 1,
                minWidth: "80px",
                padding: "8px 0",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: canFeed ? `${PATH_META[p].color}15` : "rgba(255,255,255,0.02)",
                color: canFeed ? PATH_META[p].color : "rgba(255,255,255,0.2)",
                fontSize: "11px",
                fontWeight: 800,
                cursor: canFeed ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              {PATH_META[p].emoji} Feed
            </button>
          ))}
          <button
            onClick={onAffirm}
            disabled={loading}
            style={{
              flex: 1,
              minWidth: "80px",
              padding: "8px 0",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            🙏 Affirm
          </button>
        </div>

        {chao.wait_seconds && (
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "8px", textAlign: "center" }}>
            Next feed in {Math.ceil(chao.wait_seconds / 3600)}h
          </p>
        )}
      </div>
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

  // Chao state
  const [chao, setChao] = useState<ChaoState | null>(null);
  const [garden, setGarden] = useState<GardenState | null>(null);
  const [chaoLoading, setChaoLoading] = useState(false);
  const [userId] = useState(() => `web_${uid()}`); // In prod: wallet address or auth

  const creatureRef = useRef<HTMLDivElement>(null);

  /* ─── Fetch Chao on mount ─── */
  useEffect(() => {
    fetchChao();
    fetchGarden();
    const interval = setInterval(() => {
      fetchGarden();
    }, 30000); // Refresh garden every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchChao() {
    try {
      const res = await fetch(`${CHAO_API}/api/chao/${userId}`);
      const data = await res.json();
      setChao(data);
    } catch {
      setChao(null);
    }
  }

  async function fetchGarden() {
    try {
      const res = await fetch(`${CHAO_API}/api/garden`);
      const data = await res.json();
      setGarden(data);
    } catch {
      setGarden(null);
    }
  }

  async function handleFeed(path: ChaoPath) {
    setChaoLoading(true);
    try {
      const res = await fetch(`${CHAO_API}/api/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, path, name: "WebUser" }),
      });
      const data = await res.json();
      if (data.ok) {
        setChao((prev) => prev ? { ...prev, ...data, ok: true } : data);
        // Trigger celebration mood
        setMood("reacting");
        setTimeout(() => setMood("walking"), 2000);
      }
    } finally {
      setChaoLoading(false);
    }
  }

  async function handleAffirm() {
    setChaoLoading(true);
    try {
      const res = await fetch(`${CHAO_API}/api/affirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name: "WebUser" }),
      });
      const data = await res.json();
      if (data.ok) {
        setChao((prev) => prev ? { ...prev, ...data, ok: true } : data);
        setMood("thinking");
        setTimeout(() => setMood("walking"), 2000);
      }
    } finally {
      setChaoLoading(false);
    }
  }

  /* Creature walks when idle */
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

      setTimeout(() => {
        setShowBubble(false);
        setMood("thinking");

        queueMessage(text, style).then(async (queueData) => {
          if (!queueData.requestId) {
            setMood("idle");
            setIsProcessing(false);
            return;
          }
          const response = await pollForResponse(queueData.pollUrl);
          setMood("talking");

          const madText = response?.output || "Signal broke.";
          const madMsg: ChatMessage = { id: uid(), role: "mad", text: madText, style };
          setMessages((prev) => [...prev, madMsg]);
          setCurrentResponse(madText);
          setBubbleIsUser(false);
          setShowBubble(true);

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

  const creatureForm = chao?.form || "egg";
  const gardenMode = garden?.garden_mode || "neutral";

  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,50,50,0.6)", marginBottom: "8px" }}>
          [ MAD AI — CHAO GARDEN ]
        </p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1, margin: 0 }}>
          The Truth <span style={{ color: "#ff4444" }}>Machine</span>
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
          Talk to the creature. It grows with you.
        </p>
      </div>

      {/* Garden Mode Badge */}
      {garden?.ok && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          fontSize: "10px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "16px",
        }}>
          🌍 Garden: {garden.garden_mode} | {garden.total_chao} Chao | {garden.mad_form_count} 🌈
        </div>
      )}

      {/* Style Selector */}
      <StyleSelector style={style} onChange={setStyle} />

      {/* The Den */}
      <MadDen gardenMode={gardenMode}>
        <div ref={creatureRef} style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
          <ChatBubble text={currentResponse} visible={showBubble} isUser={bubbleIsUser} />
          <Creature mood={mood} style={style} form={creatureForm} />
        </div>
        <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", zIndex: 5 }}>
          {mood === "thinking" ? "Processing..." : mood === "talking" ? "Responding..." : "Walking around..."}
        </div>
      </MadDen>

      {/* Chao Stats Panel */}
      <ChaoPanel chao={chao} onFeed={handleFeed} onAffirm={handleAffirm} loading={chaoLoading} />

      {/* Chat Input */}
      <div style={{ width: "100%", maxWidth: "600px", marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void sendMessage(); }}
            placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
            disabled={isProcessing}
            style={{
              flex: 1, padding: "14px 18px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: "15px", fontWeight: 600, outline: "none",
            }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={isProcessing}
            style={{
              padding: "14px 24px", borderRadius: "16px", border: "none", background: "#ff4444", color: "#fff",
              fontSize: "14px", fontWeight: 800, textTransform: "uppercase", cursor: isProcessing ? "wait" : "pointer",
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            {isProcessing ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ marginTop: "20px", display: "flex", gap: "24px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>
        <span>Messages: {messages.length}</span>
        <span>Style: {style}</span>
        <span>Form: {creatureForm}</span>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   STYLE SELECTOR
   ═══════════════════════════════════════════════════════════ */

function StyleSelector({ style, onChange }: { style: StyleMode; onChange: (s: StyleMode) => void }) {
  const modes: { key: StyleMode; label: string; color: string }[] = [
    { key: "safe", label: "Safe", color: "#4ade80" },
    { key: "savage", label: "Savage", color: "#ff4444" },
    { key: "crashout", label: "Crashout", color: "#ff6600" },
  ];

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          style={{
            padding: "8px 16px", borderRadius: "12px", border: "1px solid",
            borderColor: style === m.key ? m.color : "rgba(255,255,255,0.1)",
            background: style === m.key ? `${m.color}15` : "rgba(255,255,255,0.03)",
            color: style === m.key ? m.color : "rgba(255,255,255,0.5)",
            fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
            cursor: "pointer", transition: "all 0.2s ease",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   API HELPERS
   ═══════════════════════════════════════════════════════════ */

async function queueMessage(message: string, style: StyleMode): Promise<{ requestId?: string; pollUrl?: string; error?: string }> {
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

async function pollForResponse(pollUrl: string, maxAttempts = 60): Promise<{ output?: string; meta?: unknown } | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const res = await fetch(pollUrl);
      const data = await res.json();
      if (data.status === "done") return data;
    } catch { /* continue */ }
  }
  return null;
}
