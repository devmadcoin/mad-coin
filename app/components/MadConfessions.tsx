"use client";

import { useEffect, useMemo, useState } from "react";

type ReactionKey = "same" | "lol" | "handshake";
type SortMode = "new" | "top";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
  score?: number;
};

type PostResponse = {
  item?: Confession;
  cooldownSeconds?: number;
  rating?: string;
  error?: string;
  retryAfterSeconds?: number;
};

type PatchResponse = {
  item?: Confession;
  reactionLocked?: boolean;
  retryAfterSeconds?: number;
  error?: string;
};

const PERSONA_POOL = [
  "Mad Trader",
  "Silent Bagholder",
  "Cold Strategist",
  "Chart Addict",
  "Chaos Monk",
  "Late Entry Legend",
  "Candle Chaser",
  "Signal Hunter",
  "Fear Eater",
  "Conviction Goblin",
] as const;

const POST_COOLDOWN_MS = 45_000;
const POST_COOLDOWN_KEY = "mad_confession_last_post_at";
const REACTED_KEY = "mad_confession_reacted_map";

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

function totalReactions(reactions: Record<ReactionKey, number>) {
  return (
    (reactions.same ?? 0) +
    (reactions.lol ?? 0) +
    (reactions.handshake ?? 0)
  );
}

function effectiveScore(confession: Confession) {
  const reactionScore =
    (confession.reactions.same ?? 0) * 2 +
    (confession.reactions.lol ?? 0) +
    (confession.reactions.handshake ?? 0) * 1.5;

  return (confession.score ?? 0) + reactionScore;
}

function personaForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PERSONA_POOL[hash % PERSONA_POOL.length];
}

function momentumForScore(score: number) {
  if (score >= 10) {
    return {
      label: "Dominating",
      cls: "border-yellow-500/25 bg-yellow-500/10 text-yellow-200",
    };
  }

  if (score >= 5) {
    return {
      label: "Exploding",
      cls: "border-red-500/25 bg-red-500/10 text-red-200",
    };
  }

  if (score >= 3) {
    return {
      label: "Heating Up",
      cls: "border-orange-500/25 bg-orange-500/10 text-orange-200",
    };
  }

  return null;
}

function getLastPostAt() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(POST_COOLDOWN_KEY);
  const value = Number(raw ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function setLastPostAt(value: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(POST_COOLDOWN_KEY, String(value));
}

function getReactionMap(): Record<string, true> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(REACTED_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const clean: Record<string, true> = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (value === true) {
        clean[key] = true;
      }
    }

    return clean;
  } catch {
    return {};
  }
}

function setReactionMap(map: Record<string, true>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REACTED_KEY, JSON.stringify(map));
}

function reactionStorageKey(confessionId: string, reaction: ReactionKey) {
  return `${confessionId}:${reaction}`;
}

function isToday(timestamp: number) {
  const now = new Date();
  const date = new Date(timestamp);

  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  );
}

function buildShareText(confession: Confession) {
  return `$MAD Confession:

${confession.text}

Most people panic. You don’t have to.
mad-coin.vercel.app`;
}

function buildShareUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}#confessions`;
}

export default function MadConfessions() {
  const [items, setItems] = useState<Confession[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("new");
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [reactedMap, setReactedMapState] = useState<Record<string, true>>({});
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [postRating, setPostRating] = useState<string | null>(null);

  async function load(silent = false) {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const res = await fetch("/api/confessions", {
        cache: "no-store",
      });
      const json = await res.json();

      setItems(Array.isArray(json?.confessions) ? json.confessions : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    setReactedMapState(getReactionMap());

    const syncCooldown = () => {
      const lastPostAt = getLastPostAt();
      const remaining = Math.max(
        0,
        POST_COOLDOWN_MS - (Date.now() - lastPostAt)
      );
      setCooldownLeft(remaining);
    };

    syncCooldown();
    void load();

    const refreshInterval = window.setInterval(() => {
      void load(true);
    }, 25000);

    const cooldownInterval = window.setInterval(() => {
      syncCooldown();
    }, 1000);

    return () => {
      window.clearInterval(refreshInterval);
      window.clearInterval(cooldownInterval);
    };
  }, []);

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  useEffect(() => {
    if (!postRating) return;
    const timer = window.setTimeout(() => setPostRating(null), 2200);
    return () => window.clearTimeout(timer);
  }, [postRating]);

  async function submit() {
    if (posting) return;

    const clean = text.replace(/\s+/g, " ").trim();

    if (clean.length < 4) {
      setError("Too short (min 4 chars)");
      return;
    }

    if (clean.length > 240) {
      setError("Too long (max 240 chars)");
      return;
    }

    const lastPostAt = getLastPostAt();
    const remaining = Math.max(0, POST_COOLDOWN_MS - (Date.now() - lastPostAt));

    if (remaining > 0) {
      setError(`Cooldown active. Wait ${Math.ceil(remaining / 1000)}s.`);
      setCooldownLeft(remaining);
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

      const json = (await res.json()) as PostResponse;

      if (!res.ok) {
        if (res.status === 429 && json.retryAfterSeconds) {
          const now = Date.now();
          const cooldownMs = json.retryAfterSeconds * 1000;
          setLastPostAt(now - POST_COOLDOWN_MS + cooldownMs);
          setCooldownLeft(cooldownMs);
          setError(`Cooldown active. Wait ${json.retryAfterSeconds}s.`);
        } else {
          setError(json.error || "Failed to post");
        }
        return;
      }

      if (json.item) {
        setItems((prev) => [json.item as Confession, ...prev]);
        setText("");
        setSortMode("new");
        setPostRating(json.rating ?? null);

        const cooldownSeconds = json.cooldownSeconds ?? 45;
        const now = Date.now();
        setLastPostAt(now);
        setCooldownLeft(cooldownSeconds * 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post failed");
    } finally {
      setPosting(false);
    }
  }

  async function react(id: string, key: ReactionKey) {
    const storageKey = reactionStorageKey(id, key);

    if (reactedMap[storageKey]) {
      setError("You already used that reaction on this confession.");
      return;
    }

    const nextReactionMap: Record<string, true> = {
      ...reactedMap,
      [storageKey]: true,
    };

    setReactedMapState(nextReactionMap);
    setReactionMap(nextReactionMap);
    setError(null);

    const optimisticBoost = key === "same" ? 2 : 1;

    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              reactions: {
                ...c.reactions,
                [key]: (c.reactions[key] ?? 0) + optimisticBoost,
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

      const json = (await res.json()) as PatchResponse;

      if (res.ok && json.item) {
        setItems((prev) => prev.map((c) => (c.id === id ? json.item! : c)));
        return;
      }

      if (res.status === 429) {
        setError(
          json.retryAfterSeconds
            ? `Reaction locked. Try again in ${json.retryAfterSeconds}s.`
            : json.error || "Reaction already used."
        );
        return;
      }

      setError(json.error || "Reaction failed. Try again.");
    } catch {
      setError("Reaction failed. Try again.");
    }
  }

  async function shareConfession(confession: Confession) {
    const shareText = buildShareText(confession);
    const shareUrl = buildShareUrl();
    const fullShare = `${shareText}\n\n${shareUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "$MAD Confession",
          text: shareText,
          url: shareUrl,
        });
        setShareMessage("Shared");
        return;
      } catch {
        // fall through
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullShare);
        setShareMessage("Copied. Now go post it.");
        return;
      } catch {
        // fall through
      }
    }

    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(fullShare)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
    setShareMessage("Opened X share");
  }

  const headerChip = useMemo(() => {
    if (loading) return "Loading…";
    return `${items.length} confessions`;
  }, [loading, items.length]);

  const sortedItems = useMemo(() => {
    const copy = [...items];

    if (sortMode === "top") {
      copy.sort((a, b) => {
        const scoreDiff = effectiveScore(b) - effectiveScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        return b.createdAt - a.createdAt;
      });
      return copy;
    }

    copy.sort((a, b) => b.createdAt - a.createdAt);
    return copy;
  }, [items, sortMode]);

  const trendingItems = useMemo(() => {
    return [...items]
      .filter((item) => effectiveScore(item) > 0)
      .sort((a, b) => effectiveScore(b) - effectiveScore(a))
      .slice(0, 3);
  }, [items]);

  const todaysItems = useMemo(() => {
    return items.filter((item) => isToday(item.createdAt));
  }, [items]);

  const todaysTop = useMemo(() => {
    const copy = [...todaysItems].sort(
      (a, b) => effectiveScore(b) - effectiveScore(a)
    );

    return copy[0] ?? null;
  }, [todaysItems]);

  const todaysReactionTotal = useMemo(() => {
    return todaysItems.reduce(
      (sum, item) => sum + totalReactions(item.reactions),
      0
    );
  }, [todaysItems]);

  const cooldownLabel =
    cooldownLeft > 0 ? `${Math.ceil(cooldownLeft / 1000)}s cooldown` : "Ready";

  return (
    <section className="mt-8 animate-fadeUp sm:mt-10">
      <div className="rounded-[28px] border border-white/10 bg-black/30 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              MAD CONFESSIONS
            </p>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Say what you’re really thinking.
            </h2>

            <p className="mt-3 text-sm text-white/70">
              People say what they really feel. Others react. The real ones rise to the top.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              {headerChip}
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Live
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              {cooldownLabel}
            </div>
          </div>
        </div>

        {shareMessage && (
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-200">
            {shareMessage}
          </div>
        )}

        {postRating && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {postRating}
          </div>
        )}

        {(todaysTop || todaysItems.length > 0) && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Top MAD Today
                </p>
                <p className="mt-1 text-sm text-white/65">
                  Today’s strongest confession by signal and reactions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                  {todaysItems.length} today
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                  {todaysReactionTotal} reactions
                </span>
              </div>
            </div>

            {todaysTop ? (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-yellow-200">
                    #1 Today
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                    {personaForId(todaysTop.id)}
                  </div>

                  {momentumForScore(effectiveScore(todaysTop)) && (
                    <div
                      className={[
                        "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]",
                        momentumForScore(effectiveScore(todaysTop))!.cls,
                      ].join(" ")}
                    >
                      {momentumForScore(effectiveScore(todaysTop))!.label}
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <p className="break-words text-sm text-white/90">
                    {todaysTop.text}
                  </p>

                  <div className="shrink-0 text-right">
                    <div className="whitespace-nowrap text-xs text-white/40">
                      {timeAgo(todaysTop.createdAt)}
                    </div>
                    <div className="mt-2 text-[11px] text-white/30">
                      {effectiveScore(todaysTop).toFixed(1)} score
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => shareConfession(todaysTop)}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold transition hover:bg-white/15"
                  >
                    Share Top MAD Today
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-white/60">
                No Top MAD yet today. Start the first one.
              </div>
            )}
          </div>
        )}

        {trendingItems.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                  Trending Now
                </p>
                <p className="mt-1 text-sm text-white/65">
                  Strongest confessions by signal and reaction weight.
                </p>
              </div>

              <div className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.75)]" />
            </div>

            <div className="space-y-3">
              {trendingItems.map((item, index) => (
                <div
                  key={`trending-${item.id}`}
                  className="rounded-xl border border-white/10 bg-black/25 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-yellow-200">
                      #{index + 1} Trending
                    </div>
                    <div className="text-[11px] text-white/35">
                      {effectiveScore(item).toFixed(1)} score
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm text-white/85">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={240}
            placeholder="What made you mad today?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/35 focus:border-white/20 focus:outline-none"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/40">{text.length}/240</p>

            <button
              type="button"
              onClick={submit}
              disabled={posting || cooldownLeft > 0}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm transition hover:bg-white/15 disabled:opacity-50"
            >
              {posting
                ? "Posting…"
                : cooldownLeft > 0
                  ? `Wait ${Math.ceil(cooldownLeft / 1000)}s`
                  : "Post"}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.24em] text-white/35">
            Feed
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setSortMode("new")}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                sortMode === "new"
                  ? "bg-white text-black"
                  : "text-white/75 hover:bg-white/10",
              ].join(" ")}
            >
              New
            </button>

            <button
              type="button"
              onClick={() => setSortMode("top")}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                sortMode === "top"
                  ? "bg-white text-black"
                  : "text-white/75 hover:bg-white/10",
              ].join(" ")}
            >
              Top
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-white/60">Loading…</div>
          ) : sortedItems.length === 0 ? (
            <div className="text-white/60">No confessions yet. Be first 😤</div>
          ) : (
            sortedItems.map((c, index) => {
              const reactionCount = totalReactions(c.reactions);
              const score = effectiveScore(c);
              const momentum = momentumForScore(score);
              const showRank = sortMode === "top" && score > 0;
              const persona = personaForId(c.id);

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                      {persona}
                    </div>

                    {showRank && (
                      <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-yellow-200">
                        #{index + 1} Top MAD
                      </div>
                    )}

                    {momentum && (
                      <div
                        className={[
                          "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]",
                          momentum.cls,
                        ].join(" ")}
                      >
                        {momentum.label}
                      </div>
                    )}

                    {typeof c.score === "number" && (
                      <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/55">
                        Signal {c.score}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <p className="break-words text-sm text-white/90">
                      {c.text}
                    </p>

                    <div className="shrink-0 text-right">
                      <div className="whitespace-nowrap text-xs text-white/40">
                        {timeAgo(c.createdAt)}
                      </div>
                      <div className="mt-2 text-[11px] text-white/30">
                        {reactionCount} reaction{reactionCount === 1 ? "" : "s"}
                      </div>
                      <div className="mt-1 text-[11px] text-white/30">
                        {score.toFixed(1)} score
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <ReactionButton
                      label="Same"
                      count={c.reactions.same}
                      disabled={!!reactedMap[reactionStorageKey(c.id, "same")]}
                      onClick={() => react(c.id, "same")}
                    />
                    <ReactionButton
                      label="LOL"
                      count={c.reactions.lol}
                      disabled={!!reactedMap[reactionStorageKey(c.id, "lol")]}
                      onClick={() => react(c.id, "lol")}
                    />
                    <ReactionButton
                      label="🤝"
                      count={c.reactions.handshake}
                      disabled={!!reactedMap[reactionStorageKey(c.id, "handshake")]}
                      onClick={() => react(c.id, "handshake")}
                    />
                    <ActionButton
                      label="Share"
                      onClick={() => shareConfession(c)}
                    />
                  </div>
                </div>
              );
            })
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
  disabled = false,
}: {
  label: string;
  count: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition",
        disabled
          ? "border-white/5 bg-white/[0.03] text-white/35 opacity-70"
          : "border-white/10 bg-white/5 hover:bg-white/10",
      ].join(" ")}
    >
      {label}
      <span className="rounded bg-white/10 px-2">{count}</span>
    </button>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs transition hover:bg-white/10"
    >
      {label}
    </button>
  );
}
