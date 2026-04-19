"use client";

import { useEffect, useMemo, useState } from "react";

type ReactionKey = "same" | "lol" | "handshake";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
};

const MAX_LENGTH = 220;
const PAGE_SIZE = 6;

const PROMPTS = [
  "What made you mad today?",
  "What are you pretending doesn't bother you?",
  "What are you building in silence?",
  "What do people keep getting wrong?",
  "What do you want to say with no filter?",
];

const FILTERS = ["Latest", "Hot", "Unhinged"] as const;
type FilterMode = (typeof FILTERS)[number];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function confessionScore(confession: Confession) {
  const same = confession.reactions.same || 0;
  const lol = confession.reactions.lol || 0;
  const handshake = confession.reactions.handshake || 0;

  return same * 2 + lol * 1.2 + handshake * 1.6;
}

function sortConfessions(items: Confession[], mode: FilterMode) {
  const copy = [...items];

  if (mode === "Latest") {
    return copy.sort((a, b) => b.createdAt - a.createdAt);
  }

  if (mode === "Hot") {
    return copy.sort((a, b) => {
      const scoreDiff = confessionScore(b) - confessionScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return b.createdAt - a.createdAt;
    });
  }

  return copy.sort((a, b) => {
    const aEnergy = confessionScore(a) + a.text.length * 0.05;
    const bEnergy = confessionScore(b) + b.text.length * 0.05;
    return bEnergy - aEnergy;
  });
}

function ReactionButton({
  label,
  value,
  active = false,
  onClick,
}: {
  label: string;
  value: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200",
        active
          ? "border-red-400/40 bg-red-500/15 text-white"
          : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-white/45">{value}</span>
    </button>
  );
}

function PageButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-[40px] items-center justify-center rounded-full border px-4 text-sm font-bold transition duration-200",
        active
          ? "border-red-400/40 bg-red-500/15 text-white"
          : "border-white/10 bg-white/[0.04] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function MadConfessions() {
  const [text, setText] = useState("");
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("Latest");
  const [error, setError] = useState("");
  const [reacted, setReacted] = useState<Record<string, ReactionKey | null>>({});
  const [page, setPage] = useState(1);

  async function loadConfessions() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/confessions", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load confessions");
      }

      const data = (await res.json()) as Confession[];
      setConfessions(Array.isArray(data) ? data : []);
    } catch {
      setError("Couldn’t load confessions right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfessions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const sortedConfessions = useMemo(() => {
    return sortConfessions(confessions, filter);
  }, [confessions, filter]);

  const totalPages = Math.max(1, Math.ceil(sortedConfessions.length / PAGE_SIZE));

  const pagedConfessions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedConfessions.slice(start, start + PAGE_SIZE);
  }, [sortedConfessions, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  async function submitConfession() {
    const trimmed = text.trim();

    if (!trimmed) return;
    if (trimmed.length > MAX_LENGTH) return;

    try {
      setPosting(true);
      setError("");

      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        throw new Error("Failed to post confession");
      }

      setText("");
      await loadConfessions();
      setPage(1);
      setFilter("Latest");
    } catch {
      setError("Couldn’t post your confession.");
    } finally {
      setPosting(false);
    }
  }

  async function reactToConfession(id: string, reaction: ReactionKey) {
    try {
      const res = await fetch("/api/confessions/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, reaction }),
      });

      if (!res.ok) {
        throw new Error("Failed to react");
      }

      setReacted((prev) => ({
        ...prev,
        [id]: reaction,
      }));

      setConfessions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                reactions: {
                  ...item.reactions,
                  [reaction]: (item.reactions[reaction] || 0) + 1,
                },
              }
            : item,
        ),
      );
    } catch {
      setError("Couldn’t save reaction.");
    }
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,0,0,0.96),rgba(8,0,0,0.98))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.32)] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-red-200/45">
              MAD CONFESSIONS
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Everyone’s mad about something.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Anonymous thoughts from the community. No filter. No fake perfect
              life. Just real feelings, real pressure, real chaos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-bold transition duration-200",
                  filter === item
                    ? "border-red-400/40 bg-red-500/15 text-white"
                    : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-black/30 p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setText(prompt)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/60 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="Drop your confession..."
              className="min-h-[140px] w-full resize-none bg-transparent px-5 py-4 text-base text-white outline-none placeholder:text-white/28"
            />

            <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/35">
                <span>Anonymous</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>Raw</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>No Filter</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={[
                    "text-xs font-bold",
                    text.length > MAX_LENGTH - 25
                      ? "text-yellow-300/80"
                      : "text-white/35",
                  ].join(" ")}
                >
                  {text.length}/{MAX_LENGTH}
                </span>

                <button
                  type="button"
                  onClick={submitConfession}
                  disabled={posting || !text.trim()}
                  className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-sm font-black text-white transition duration-200 hover:scale-[1.02] hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post Confession"}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <p className="mt-3 text-sm text-red-300/80">{error}</p>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-white/45">
            {sortedConfessions.length > 0
              ? `${sortedConfessions.length} total confession${
                  sortedConfessions.length === 1 ? "" : "s"
                }`
              : "No confessions yet"}
          </p>

          {totalPages > 1 ? (
            <p className="text-sm text-white/35">
              Page {page} of {totalPages}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4">
          {loading ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-white/55">
              Loading confessions...
            </div>
          ) : pagedConfessions.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-white/55">
              No confessions yet. Be the first to drop one.
            </div>
          ) : (
            pagedConfessions.map((confession) => (
              <article
                key={confession.id}
                className="group rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 transition duration-200 hover:border-white/16 hover:bg-white/[0.05]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-red-200/80">
                    anonymous
                  </span>

                  <span className="text-sm text-white/35">
                    {timeAgo(confession.createdAt)}
                  </span>
                </div>

                <p className="mt-4 text-xl font-semibold leading-relaxed text-white/90 sm:text-2xl">
                  {confession.text}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <ReactionButton
                    label="Same"
                    value={confession.reactions.same || 0}
                    active={reacted[confession.id] === "same"}
                    onClick={() => reactToConfession(confession.id, "same")}
                  />
                  <ReactionButton
                    label="Mad"
                    value={confession.reactions.lol || 0}
                    active={reacted[confession.id] === "lol"}
                    onClick={() => reactToConfession(confession.id, "lol")}
                  />
                  <ReactionButton
                    label="Respect"
                    value={confession.reactions.handshake || 0}
                    active={reacted[confession.id] === "handshake"}
                    onClick={() =>
                      reactToConfession(confession.id, "handshake")
                    }
                  />
                </div>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <PageButton onClick={() => setPage(Math.max(1, page - 1))}>
              Prev
            </PageButton>

            {pageNumbers.map((pageNumber) => (
              <PageButton
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            ))}

            <PageButton onClick={() => setPage(Math.min(totalPages, page + 1))}>
              Next
            </PageButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
