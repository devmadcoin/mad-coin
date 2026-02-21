"use client";

import React, { useEffect, useMemo, useState } from "react";

type ReactionKey = "same" | "lol" | "handshake";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function clampText(s: string, max = 240) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trim() : t;
}

export default function MadConfessions() {
  const [items, setItems] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    try {
      const r = await fetch("/api/confessions", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to load confessions");
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load confessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit() {
    const clean = clampText(text, 240);
    if (!clean) return;

    setPosting(true);
    setErr(null);

    try {
      const r = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to post confession");
      setText("");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to post confession");
    } finally {
      setPosting(false);
    }
  }

  async function react(id: string, key: ReactionKey) {
    try {
      // optimistic update
      setItems((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, reactions: { ...c.reactions, [key]: (c.reactions?.[key] || 0) + 1 } }
            : c
        )
      );

      const r = await fetch("/api/confessions/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, key }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed reaction");
      // keep server truth
      if (j?.item) {
        setItems((prev) => prev.map((c) => (c.id === id ? j.item : c)));
      }
    } catch {
      // if it fails, just refresh to correct counts
      refresh();
    }
  }

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [items]);

  return (
    <section className="mt-8 animate-fadeUp">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              MAD CONFESSIONS
            </p>
            <h2 className="mt-3 text-3xl font-black">Say the quiet part out loud.</h2>
            <p className="mt-2 text-white/70 max-w-2xl">
              Drop a confession. Community reacts. Culture evolves.
            </p>
          </div>

          <button
            onClick={refresh}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I get $MAD when..."
            className="min-h-[92px] w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-white/20"
            maxLength={240}
          />

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-white/40">{text.trim().length}/240</div>

            <button
              onClick={submit}
              disabled={posting || !text.trim()}
              className={[
                "rounded-full px-5 py-2 text-sm font-semibold border transition",
                posting || !text.trim()
                  ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
                  : "border-white/10 bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              {posting ? "Posting..." : "Confess"}
            </button>
          </div>

          {err ? <p className="text-sm text-red-300/90">{err}</p> : null}
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-white/50">Loading confessions...</p>
          ) : sorted.length === 0 ? (
            <p className="text-white/50">No confessions yet. Be the first one 👀</p>
          ) : (
            sorted.slice(0, 12).map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-black/35 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-white/90 leading-relaxed">{c.text}</p>
                  <span className="shrink-0 text-xs text-white/40">{timeAgo(c.createdAt)}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <ReactionButton
                    label="Same"
                    count={c.reactions?.same || 0}
                    onClick={() => react(c.id, "same")}
                  />
                  <ReactionButton
                    label="LOL"
                    count={c.reactions?.lol || 0}
                    onClick={() => react(c.id, "lol")}
                  />
                  <ReactionButton
                    label="🤝"
                    count={c.reactions?.handshake || 0}
                    onClick={() => react(c.id, "handshake")}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-5 text-xs text-white/35">
          Keep it fun. No personal info. No doxxing. Just vibes.
        </p>
      </div>
    </section>
  );
}

function ReactionButton({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
    >
      {label} <span className="text-white/50">({count})</span>
    </button>
  );
}
