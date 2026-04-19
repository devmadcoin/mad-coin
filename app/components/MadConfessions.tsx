"use client";

import { useEffect, useMemo, useState } from "react";

type ReactionKey = "same" | "lol" | "handshake";
type FilterMode = "Latest" | "Hot" | "Unhinged";
type ApiMode = "latest" | "hot" | "unhinged";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
  score?: number;
};

type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type GetConfessionsResponse = {
  confessions: Confession[];
  pagination: Pagination;
  mode: ApiMode;
  error?: string;
};

type PostConfessionResponse = {
  item?: Confession;
  cooldownSeconds?: number;
  rating?: string;
  error?: string;
  retryAfterSeconds?: number;
};

type PatchReactionResponse = {
  item?: Confession;
  reactionLocked?: boolean;
  retryAfterSeconds?: number;
  error?: string;
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

const FILTERS: FilterMode[] = ["Latest", "Hot", "Unhinged"];

function filterToApiMode(filter: FilterMode): ApiMode {
  if (filter === "Hot") return "hot";
  if (filter === "Unhinged") return "unhinged";
  return "latest";
}

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
  active = false,
  disabled = false,
  children,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-[42px] items-center justify-center rounded-full border px-4 text-sm font-bold transition duration-200",
        active
          ? "border-red-400/40 bg-red-500/15 text-white"
          : "border-white/10 bg-white/[0.04] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
        disabled &&
          "cursor-not-allowed opacity-40 hover:border-white/10 hover:bg-white/[0.04] hover:text-white/65",
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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [error, setError] = useState("");
  const [reacted, setReacted] = useState<Record<string, ReactionKey | null>>(
    {},
  );

  const apiMode = useMemo(() => filterToApiMode(filter), [filter]);

  async function loadConfessions(nextPage = page, nextFilter = filter) {
    try {
      setLoading(true);
      setError("");

      const mode = filterToApiMode(nextFilter);
      const res = await fetch(
        `/api/confessions?mode=${mode}&page=${nextPage}&pageSize=${PAGE_SIZE}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await res.json()) as GetConfessionsResponse;

      if (!res.ok) {
        throw new Error(data.error || "Failed to load confessions");
      }

      setConfessions(Array.isArray(data.confessions) ? data.confessions : []);
      setPagination(
        data.pagination ?? {
          page: nextPage,
          pageSize: PAGE_SIZE,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );
    } catch (err) {
      setError("Couldn’t load confessions right now.");
      setConfessions([]);
      setPagination({
        page: 1,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfessions(page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

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

      const data = (await res.json()) as PostConfessionResponse;

      if (!res.ok) {
        if (res.status === 429 && data.retryAfterSeconds) {
          throw new Error(
            `Cooldown active. Try again in ${data.retryAfterSeconds}s.`,
          );
        }

        throw new Error(data.error || "Failed to post confession");
      }

      setText("");
      setPage(1);
      setFilter("Latest");
      await loadConfessions(1, "Latest");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn’t post your confession.",
      );
    } finally {
      setPosting(false);
    }
  }

  async function reactToConfession(id: string, reaction: ReactionKey) {
    try {
      setError("");

      const res = await fetch("/api/confessions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          reaction,
          delta: 1,
        }),
      });

      const data = (await res.json()) as PatchReactionResponse;

      if (!res.ok) {
        if (res.status === 429 && data.retryAfterSeconds) {
          throw new Error("You already used that reaction recently.");
        }

        throw new Error(data.error || "Failed to react");
      }

      if (!data.item) {
        throw new Error("Missing updated confession");
      }

      setReacted((prev) => ({
        ...prev,
        [id]: reaction,
      }));

      setConfessions((prev) =>
        prev.map((item) => (item.id === id ? data.item! : item)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn’t save reaction.",
      );
    }
  }

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages || 1;
    const current = pagination.page || 1;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
    return Array.from(pages)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
  }, [pagination.page, pagination.totalPages]);

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
                onClick={() => {
                  setFilter(item);
                  setPage(1);
                }}
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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-white/45">
            {pagination.totalItems > 0
              ? `${pagination.totalItems} total confession${
                  pagination.totalItems === 1 ? "" : "s"
                }`
              : "No confessions yet"}
          </p>

          <p className="text-sm text-white/35">
            {filter} • Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>

        <div className="mt-4 grid gap-4">
          {loading ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-white/55">
              Loading confessions...
            </div>
          ) : confessions.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-white/55">
              No confessions yet. Be the first to drop one.
            </div>
          ) : (
            confessions.map((confession, index) => (
              <article
                key={confession.id}
                className="group rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 transition duration-200 hover:border-white/16 hover:bg-white/[0.05]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-red-200/80">
                      anonymous
                    </span>

                    {index === 0 && pagination.page === 1 && filter !== "Latest" ? (
                      <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-yellow-200/80">
                        loudest
                      </span>
                    ) : null}
                  </div>

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

        {pagination.totalPages > 1 ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <PageButton
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Prev
            </PageButton>

            {pageNumbers.map((pageNumber, index) => {
              const prevPage = pageNumbers[index - 1];
              const showGap = index > 0 && pageNumber - prevPage > 1;

              return (
                <div key={pageNumber} className="flex items-center gap-2">
                  {showGap ? (
                    <span className="px-1 text-sm text-white/30">…</span>
                  ) : null}

                  <PageButton
                    active={pageNumber === pagination.page}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PageButton>
                </div>
              );
            })}

            <PageButton
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPage((prev) => Math.min(pagination.totalPages, prev + 1))
              }
            >
              Next
            </PageButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
