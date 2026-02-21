"use client";

import React, { useEffect, useMemo, useState } from "react";

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

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/confessions", { cache: "no-store" });
      const j = await r.json();
      setItems(Array.isArray(j?.confessions) ? j.confessions : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load confessions");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (clean.length < 4) {
      setError("Confession too short (min 4 chars).");
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const r = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean }),
      });

      const j = await r.json();

      if (!r.ok) {
        setError(j?.error || "Failed to post confession");
        return;
      }

      if (j?.item) {
        // Put the new confession at the top instantly
        setItems((prev) => [j.item as Confession, ...prev]);
        setText("");
      } else {
        // fallback: reload
        await load();
        setText("");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to post confession");
    } finally {
      setPosting(false);
    }
  }

  async function react(id: string, key: ReactionKey) {
    // optimistic UI
    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              reactions: {
                ...c.reactions,
                [key]: Math.max(0, (c.reactions?.[key] ?? 0) + 1),
              },
            }
          : c
      )
    );

    try {
      const r = await fetch("/api/confessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reaction: key, delta: 1 }),
      });

      const j = await r.json();

      if (!r.ok || !j?.item) {
        // if server rejected it, reload to be safe
        await load();
        return;
      }

      setItems((prev) => prev.map((c) => (c.id === id ? (j.item as Confession) : c)));
    } catch {
      await load();
    }
  }

  const count = items.length;

  const headerChip = useMemo(() => {
    if (loading) return "Loading…";
    return `${count} confessions`;
  }, [loading, count]);

  return (
    <section className="mt-10 animate-fadeUp">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              MAD CONFESSIONS
            </p>
            <h2 className="mt-3 text-3xl font-black">Say it. Don’t hold it.</h2>
            <p className="mt-3 text-white/70">
              Short. Anonymous vibe. Pure $MAD energy.
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            {headerChip}
          </div>
        </div>

        {/* Composer */}
        <div className="mt-6 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Confess what made you $MAD today…"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/20"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              Tip: keep it under 240 chars.
            </p>

            <button
              onClick={submit}
              disabled={posting}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15 disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post Confession"}
            </button>
          </div>

          {error ? (
            <div className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </div>

        {/* List */}
        <div className="mt-6 grid gap-4">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/60">
              Loading confessions…
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/60">
              No confessions yet. Be the first 😤
            </div>
          ) : (
            items.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-white/90 whitespace-pre-wrap">
                    {c.text}
                  </p>
                  <span className="shrink-0 text-xs text-white/40">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ReactionButton
                    label="Same"
                    count={c.reactions?.same ?? 0}
                    onClick={() => react(c.id, "same")}
                  />
                  <ReactionButton
                    label="LOL"
                    count={c.reactions?.lol ?? 0}
                    onClick={() => react(c.id, "lol")}
                  />
                  <ReactionButton
                    label="🤝"
                    count={c.reactions?.handshake ?? 0}
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
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
      type="button"
    >
      <span>{label}</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
        {count}
      </span>
    </button>
  );
}
