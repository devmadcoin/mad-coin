"use client";

import { useEffect, useMemo, useState } from "react";

type TrackEvent =
  | "message_sent"
  | "copy_clicked"
  | "share_x_clicked"
  | "say_it_harder_clicked"
  | "cook_level_changed"
  | "respect_mode_hit"
  | "roast_card_opened"
  | "roast_card_copied"
  | "challenge_completed"
  | "archetype_revealed"
  | "leaderboard_submitted"
  | "session_best_roast_selected"
  | "share_score_clicked"
  | "challenge_friend_clicked"
  | string;

type TrackValue = string | number | boolean | null;

type TrackItem = {
  event: TrackEvent;
  payload: Record<string, TrackValue>;
  timestamp: string;
};

type TrackResponse = {
  ok: boolean;
  count: number;
  events: TrackItem[];
};

type SummaryStat = {
  label: string;
  value: string | number;
  sublabel?: string;
};

type EventFilter = "all" | "engagement" | "bot" | "competition" | "identity";

const EVENT_GROUPS: Record<EventFilter, string[]> = {
  all: [],
  engagement: [
    "copy_clicked",
    "share_x_clicked",
    "share_score_clicked",
    "challenge_friend_clicked",
    "roast_card_opened",
    "roast_card_copied",
    "say_it_harder_clicked",
  ],
  bot: [
    "message_sent",
    "respect_mode_hit",
    "session_best_roast_selected",
  ],
  competition: [
    "challenge_completed",
    "leaderboard_submitted",
  ],
  identity: [
    "archetype_revealed",
    "cook_level_changed",
  ],
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function niceEventName(event: string) {
  return event.replace(/_/g, " ");
}

function countEvents(events: TrackItem[], eventName: string) {
  return events.filter((item) => item.event === eventName).length;
}

function aggregateTop(
  events: TrackItem[],
  eventNames: string[],
  payloadKeys: string[],
  limit = 5
): Array<[string, number]> {
  const map = new Map<string, number>();

  for (const item of events) {
    if (!eventNames.includes(item.event)) continue;

    let found = "";
    for (const key of payloadKeys) {
      const raw = item.payload[key];
      if (typeof raw === "string" && raw.trim()) {
        found = raw.trim();
        break;
      }
    }

    if (!found) continue;
    map.set(found, (map.get(found) || 0) + 1);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function aggregateBooleanRate(
  events: TrackItem[],
  eventName: string,
  payloadKey: string
) {
  let yes = 0;
  let total = 0;

  for (const item of events) {
    if (item.event !== eventName) continue;
    const raw = item.payload[payloadKey];
    if (typeof raw === "boolean") {
      total += 1;
      if (raw) yes += 1;
    }
  }

  return {
    yes,
    total,
    percent: total === 0 ? 0 : Math.round((yes / total) * 100),
  };
}

function truncateText(text: string, max = 220) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function getTextPayload(item: TrackItem, keys: string[]) {
  for (const key of keys) {
    const raw = item.payload[key];
    if (typeof raw === "string" && raw.trim()) return raw.trim();
  }
  return "";
}

function getNumberPayload(item: TrackItem, keys: string[]) {
  for (const key of keys) {
    const raw = item.payload[key];
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string") {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function sortByCountDesc<T extends [string, number]>(items: T[]) {
  return [...items].sort((a, b) => b[1] - a[1]);
}

export default function MadTrackPage() {
  const [data, setData] = useState<TrackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");

  async function loadData() {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch("/api/mad-track", {
        method: "GET",
        cache: "no-store",
      });

      const json = (await res.json()) as TrackResponse;

      if (!json.ok) {
        throw new Error("Tracking data failed to load.");
      }

      setData(json);
    } catch (err) {
      console.error("MAD track page error:", err);
      setError("Failed to load tracking data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const events = data?.events ?? [];

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    const allowed = EVENT_GROUPS[activeFilter];
    return events.filter((item) => allowed.includes(item.event));
  }, [events, activeFilter]);

  const totalMessages = useMemo(
    () => countEvents(events, "message_sent"),
    [events]
  );

  const totalCopies = useMemo(
    () =>
      countEvents(events, "copy_clicked") +
      countEvents(events, "roast_card_copied"),
    [events]
  );

  const totalShares = useMemo(
    () =>
      countEvents(events, "share_x_clicked") +
      countEvents(events, "share_score_clicked") +
      countEvents(events, "challenge_friend_clicked"),
    [events]
  );

  const totalRespectHits = useMemo(
    () => countEvents(events, "respect_mode_hit"),
    [events]
  );

  const totalChallengeCompletions = useMemo(
    () => countEvents(events, "challenge_completed"),
    [events]
  );

  const totalLeaderboardSubmits = useMemo(
    () => countEvents(events, "leaderboard_submitted"),
    [events]
  );

  const topCopied = useMemo(
    () =>
      aggregateTop(
        events,
        ["copy_clicked", "roast_card_copied"],
        ["text", "roastText", "cardText", "botText"]
      ),
    [events]
  );

  const topShared = useMemo(
    () =>
      aggregateTop(
        events,
        ["share_x_clicked", "share_score_clicked", "challenge_friend_clicked"],
        ["text", "shareText", "challengeText", "roastText"]
      ),
    [events]
  );

  const topHarder = useMemo(
    () =>
      aggregateTop(
        events,
        ["say_it_harder_clicked"],
        ["originalBotText", "text", "botText"]
      ),
    [events]
  );

  const topArchetypes = useMemo(
    () =>
      aggregateTop(
        events,
        ["archetype_revealed"],
        ["archetype", "name"]
      ),
    [events]
  );

  const topCookLevels = useMemo(
    () =>
      aggregateTop(
        events,
        ["cook_level_changed"],
        ["cookLevel", "level"]
      ),
    [events]
  );

  const topChallenges = useMemo(
    () =>
      aggregateTop(
        events,
        ["challenge_completed"],
        ["challengeKey", "challengeTitle", "title"]
      ),
    [events]
  );

  const topRoastCards = useMemo(
    () =>
      aggregateTop(
        events,
        ["roast_card_opened", "session_best_roast_selected"],
        ["roastText", "text", "botText"]
      ),
    [events]
  );

  const topScores = useMemo(() => {
    const scoreMap = new Map<string, number>();

    for (const item of events) {
      if (
        item.event !== "leaderboard_submitted" &&
        item.event !== "share_score_clicked"
      ) {
        continue;
      }

      const name =
        getTextPayload(item, ["playerName", "name", "username"]) || "Unknown";
      const score = getNumberPayload(item, ["score"]);

      if (score === null) continue;

      const current = scoreMap.get(name) || 0;
      if (score > current) {
        scoreMap.set(name, score);
      }
    }

    return sortByCountDesc(
      Array.from(scoreMap.entries()) as Array<[string, number]>
    ).slice(0, 5);
  }, [events]);

  const respectRate = useMemo(
    () => aggregateBooleanRate(events, "message_sent", "respected"),
    [events]
  );

  const summaryStats = useMemo<SummaryStat[]>(
    () => [
      {
        label: "Total Events",
        value: data?.count ?? events.length,
        sublabel: "All tracked actions",
      },
      {
        label: "Messages Sent",
        value: totalMessages,
        sublabel: "Bot conversations",
      },
      {
        label: "Copies",
        value: totalCopies,
        sublabel: "Copy + roast card copy",
      },
      {
        label: "Shares",
        value: totalShares,
        sublabel: "X, score, and challenge shares",
      },
      {
        label: "Respect Hits",
        value: totalRespectHits,
        sublabel: "Rare accountability moments",
      },
      {
        label: "Challenges Cleared",
        value: totalChallengeCompletions,
        sublabel: "Completed daily tasks",
      },
      {
        label: "Leaderboard Posts",
        value: totalLeaderboardSubmits,
        sublabel: "Competitive submissions",
      },
      {
        label: "Respect Rate",
        value: `${respectRate.percent}%`,
        sublabel:
          respectRate.total === 0
            ? "No scored message events yet"
            : `${respectRate.yes}/${respectRate.total} respected`,
      },
    ],
    [
      data?.count,
      events.length,
      totalMessages,
      totalCopies,
      totalShares,
      totalRespectHits,
      totalChallengeCompletions,
      totalLeaderboardSubmits,
      respectRate.percent,
      respectRate.total,
      respectRate.yes,
    ]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading tracking data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-8 text-red-300">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              MAD Track
            </h1>
            <p className="mt-3 text-white/65">
              Live interaction analytics for MAD Mind.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadData();
            }}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/5"
          >
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5"
            >
              <div className="text-sm text-white/45">{stat.label}</div>
              <div className="mt-2 text-3xl font-extrabold">{stat.value}</div>
              {stat.sublabel ? (
                <div className="mt-2 text-xs text-white/40">{stat.sublabel}</div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <Panel title="Top Copied">
            {topCopied.length === 0 ? (
              <EmptyText text="No copied responses yet." />
            ) : (
              topCopied.map(([text, count], i) => (
                <TopTextCard
                  key={`copied-${i}`}
                  countLabel={`Copied ${count}x`}
                  text={text}
                />
              ))
            )}
          </Panel>

          <Panel title="Top Shared">
            {topShared.length === 0 ? (
              <EmptyText text="No shared responses yet." />
            ) : (
              topShared.map(([text, count], i) => (
                <TopTextCard
                  key={`shared-${i}`}
                  countLabel={`Shared ${count}x`}
                  text={text}
                />
              ))
            )}
          </Panel>

          <Panel title="Most Pushed Harder">
            {topHarder.length === 0 ? (
              <EmptyText text="No harder events yet." />
            ) : (
              topHarder.map(([text, count], i) => (
                <TopTextCard
                  key={`harder-${i}`}
                  countLabel={`Harder ${count}x`}
                  text={text}
                />
              ))
            )}
          </Panel>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <Panel title="Top Archetypes">
            {topArchetypes.length === 0 ? (
              <EmptyText text="No archetype reveals yet." />
            ) : (
              topArchetypes.map(([name, count], i) => (
                <StatRow
                  key={`archetype-${i}`}
                  label={name}
                  value={`${count}x`}
                />
              ))
            )}
          </Panel>

          <Panel title="Top Cook Levels">
            {topCookLevels.length === 0 ? (
              <EmptyText text="No cook level changes yet." />
            ) : (
              topCookLevels.map(([name, count], i) => (
                <StatRow
                  key={`cook-${i}`}
                  label={name.toUpperCase()}
                  value={`${count}x`}
                />
              ))
            )}
          </Panel>

          <Panel title="Top Challenges">
            {topChallenges.length === 0 ? (
              <EmptyText text="No challenges completed yet." />
            ) : (
              topChallenges.map(([name, count], i) => (
                <StatRow
                  key={`challenge-${i}`}
                  label={name}
                  value={`${count}x`}
                />
              ))
            )}
          </Panel>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Panel title="Top Roast Cards">
            {topRoastCards.length === 0 ? (
              <EmptyText text="No roast card opens yet." />
            ) : (
              topRoastCards.map(([text, count], i) => (
                <TopTextCard
                  key={`roast-card-${i}`}
                  countLabel={`Opened ${count}x`}
                  text={text}
                />
              ))
            )}
          </Panel>

          <Panel title="Top Scores Seen">
            {topScores.length === 0 ? (
              <EmptyText text="No score submissions yet." />
            ) : (
              topScores.map(([name, score], i) => (
                <StatRow
                  key={`score-${i}`}
                  label={name}
                  value={score}
                />
              ))
            )}
          </Panel>
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold">Recent Events</h2>

            <div className="flex flex-wrap gap-2">
              {(["all", "engagement", "bot", "competition", "identity"] as EventFilter[]).map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      activeFilter === filter
                        ? "bg-white text-black"
                        : "border border-white/10 bg-black/40 text-white/75 hover:bg-white/5"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-white/50">No events for this filter.</div>
            ) : (
              filteredEvents.map((item, index) => (
                <div
                  key={`${item.timestamp}-${item.event}-${index}`}
                  className="rounded-[20px] border border-white/10 bg-black/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/75">
                      {niceEventName(item.event)}
                    </div>
                    <div className="text-sm text-white/45">
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {Object.entries(item.payload).length === 0 ? (
                      <div className="text-sm text-white/40">No payload</div>
                    ) : (
                      Object.entries(item.payload).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 sm:flex-row sm:items-start"
                        >
                          <div className="min-w-[160px] text-xs font-semibold uppercase tracking-wide text-white/40">
                            {key}
                          </div>
                          <div className="break-words text-sm text-white/85">
                            {String(value)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <div className="text-sm text-white/50">{text}</div>;
}

function TopTextCard({
  countLabel,
  text,
}: {
  countLabel: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="text-xs text-white/40">{countLabel}</div>
      <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
        {truncateText(text)}
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 p-3">
      <div className="text-sm text-white/90">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}
