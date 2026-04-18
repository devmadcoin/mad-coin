"use client";

import { useEffect, useMemo, useState } from "react";

type ReactionKey = "same" | "lol" | "handshake";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
};

function timeAgo(ms: number) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;

  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;

  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function MadConfessions() {
  const [items, setItems] = useState<Confession[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // LOAD
  // =========================
  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/confessions", { cache: "no-store" });
      const json = await res.json();

      setItems(Array.isArray(json?.confessions) ? json.confessions : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // =========================
  // SUBMIT
  // =========================
  async function submit() {
    if (posting) return; // prevent spam

    const clean = text.replace(/\s+/g, " ").trim();

    if (clean.length < 4) {
      setError("Too short (min 4 chars)");
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || "Failed to post");
        return;
      }

      // 🔥 instant insert (feels fast)
      if (json?.item) {
        setItems((prev) => [json.item, ...prev]);
        setText("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post failed");
    } finally {
      setPosting(false);
    }
  }

  // =========================
  // REACTIONS
  // =========================
  async function react(id: string, key: ReactionKey) {
    // ⚡ optimistic update
    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              reactions: {
                ...c.reactions,
                [key]: (c.reactions[key] ?? 0) + 1,
              },
            }
          : c
      )
    );

    try {
      const res = await fetch("/api/confessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reaction: key, delta: 1 }),
      });

      const json = await res.json();

      // fallback sync if mismatch
      if (res.ok && json?.item) {
        setItems((prev) =>
          prev.map((c) => (c.id === id ? json.item : c))
        );
      }
    } catch {
      // silently ignore (optimistic already handled)
    }
  }

  // =========================
  // HEADER CHIP
  // =========================
  const headerChip = useMemo(() => {
    if (loading) return "Loading…";
    return `${items.length} confessions`;
  }, [loading, items.length]);

  // =========================
  // UI
  // =========================
  return (
    <section className="mt-8 animate-fadeUp sm:mt-10">
      <div className="rounded-[28px] border border-white/10 bg-black/30 p-4 shadow-2xl backdrop-blur-xl sm:p-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              MAD CONFESSIONS
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Say it. Don’t hold it.
            </h2>

            <p className="mt-3 text-sm text-white/70">
              Short. Anonymous. Raw signal only.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            {headerChip}
          </div>
        </div>

        {/* INPUT */}
        <div className="mt-6 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Confess what made you $MAD today…"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 focus:border-white/20"
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <p className="text-xs text-white/40">
              {text.length}/240
            </p>

            <button
              onClick={submit}
              disabled={posting}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post"}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* LIST */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-white/60">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-white/60">
              No confessions yet. Be first 😤
            </div>
          ) : (
            items.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex justify-between text-sm gap-4">
                  <p className="break-words">{c.text}</p>
                  <span className="text-xs text-white/40 whitespace-nowrap">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <ReactionButton
                    label="Same"
                    count={c.reactions.same}
                    onClick={() => react(c.id, "same")}
                  />
                  <ReactionButton
                    label="LOL"
                    count={c.reactions.lol}
                    onClick={() => react(c.id, "lol")}
                  />
                  <ReactionButton
                    label="🤝"
                    count={c.reactions.handshake}
                    onClick={() => react(c.id, "handshake")}
                  />
                </div>
              </div>
            ))
          )}
        </div>
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
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10 transition"
    >
      {label}
      <span className="rounded bg-white/10 px-2">{count}</span>
    </button>
  );
}
