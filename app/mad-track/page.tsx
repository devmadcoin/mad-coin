"use client";

import { useEffect, useMemo, useState } from "react";

type TrackEvent =
  | "message_sent"
  | "copy_clicked"
  | "share_x_clicked"
  | "say_it_harder_clicked";

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

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function aggregateTop(
  events: TrackItem[],
  eventName: TrackEvent,
  payloadKey: string
): Array<[string, number]> {
  const map = new Map<string, number>();

  for (const item of events) {
    if (item.event !== eventName) continue;

    const raw = item.payload[payloadKey];
    const text = typeof raw === "string" ? raw.trim() : "";

    if (!text) continue;

    map.set(text, (map.get(text) || 0) + 1);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export default function MadTrackPage() {
  const [data, setData] = useState<TrackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setIsLoading(true);
    setError("");

    try {
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
    void loadData();
  }, []);

  const eventCounts = useMemo(() => {
    const counts: Record<TrackEvent, number> = {
      message_sent: 0,
      copy_clicked: 0,
      share_x_clicked: 0,
      say_it_harder_clicked: 0,
    };

    for (const item of data?.events ?? []) {
      counts[item.event] += 1;
    }

    return counts;
  }, [data]);

  const topCopied = useMemo(() => {
    return aggregateTop(data?.events ?? [], "copy_clicked", "text");
  }, [data]);

  const topShared = useMemo(() => {
    return aggregateTop(data?.events ?? [], "share_x_clicked", "text");
  }, [data]);

  const topHarder = useMemo(() => {
    return aggregateTop(
      data?.events ?? [],
      "say_it_harder_clicked",
      "originalBotText"
    );
  }, [data]);

  const topPromptsLeadingToShares = useMemo(() => {
    return aggregateTop(data?.events ?? [], "share_x_clicked", "prompt");
  }, [data]);

  const topPromptsLeadingToCopies = useMemo(() => {
    return aggregateTop(data?.events ?? [], "copy_clicked", "prompt");
  }, [data]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              MAD Track
            </h1>
            <p className="mt-3 text-white/65">
              Live interaction tracking for MAD Mind.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/5"
          >
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-6 text-white/65">
            Loading tracking data...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-[24px] border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <div className="text-sm text-white/45">Total Events</div>
                <div className="mt-2 text-3xl font-bold">{data.count}</div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <div className="text-sm text-white/45">Messages Sent</div>
                <div className="mt-2 text-3xl font-bold">
                  {eventCounts.message_sent}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <div className="text-sm text-white/45">Copied</div>
                <div className="mt-2 text-3xl font-bold">
                  {eventCounts.copy_clicked}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <div className="text-sm text-white/45">Shared on X</div>
                <div className="mt-2 text-3xl font-bold">
                  {eventCounts.share_x_clicked}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <div className="text-sm text-white/45">Say It Harder</div>
                <div className="mt-2 text-3xl font-bold">
                  {eventCounts.say_it_harder_clicked}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <h2 className="text-xl font-bold">Top Copied</h2>
                <div className="mt-4 space-y-3">
                  {topCopied.length === 0 ? (
                    <div className="text-sm text-white/50">
                      No copied responses yet.
                    </div>
                  ) : (
                    topCopied.map(([text, count], i) => (
                      <div key={i} className="rounded-xl border border-white/10 p-3">
                        <div className="text-xs text-white/40">Copied {count}x</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
                          {text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <h2 className="text-xl font-bold">Top Shared</h2>
                <div className="mt-4 space-y-3">
                  {topShared.length === 0 ? (
                    <div className="text-sm text-white/50">
                      No shared responses yet.
                    </div>
                  ) : (
                    topShared.map(([text, count], i) => (
                      <div key={i} className="rounded-xl border border-white/10 p-3">
                        <div className="text-xs text-white/40">Shared {count}x</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
                          {text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <h2 className="text-xl font-bold">Most Pushed Harder</h2>
                <div className="mt-4 space-y-3">
                  {topHarder.length === 0 ? (
                    <div className="text-sm text-white/50">
                      No “Say it harder” events yet.
                    </div>
                  ) : (
                    topHarder.map(([text, count], i) => (
                      <div key={i} className="rounded-xl border border-white/10 p-3">
                        <div className="text-xs text-white/40">Harder {count}x</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
                          {text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <h2 className="text-xl font-bold">Top Prompts Leading to Shares</h2>
                <div className="mt-4 space-y-3">
                  {topPromptsLeadingToShares.length === 0 ? (
                    <div className="text-sm text-white/50">
                      No share-linked prompts yet.
                    </div>
                  ) : (
                    topPromptsLeadingToShares.map(([prompt, count], i) => (
                      <div key={i} className="rounded-xl border border-white/10 p-3">
                        <div className="text-xs text-white/40">Led to shares {count}x</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
                          {prompt}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
                <h2 className="text-xl font-bold">Top Prompts Leading to Copies</h2>
                <div className="mt-4 space-y-3">
                  {topPromptsLeadingToCopies.length === 0 ? (
                    <div className="text-sm text-white/50">
                      No copy-linked prompts yet.
                    </div>
                  ) : (
                    topPromptsLeadingToCopies.map(([prompt, count], i) => (
                      <div key={i} className="rounded-xl border border-white/10 p-3">
                        <div className="text-xs text-white/40">Led to copies {count}x</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
                          {prompt}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
              <h2 className="text-2xl font-bold">Recent Events</h2>

              <div className="mt-5 space-y-4">
                {data.events.length === 0 ? (
                  <div className="text-white/50">No events yet.</div>
                ) : (
                  data.events.map((item, index) => (
                    <div
                      key={`${item.timestamp}-${item.event}-${index}`}
                      className="rounded-[20px] border border-white/10 bg-black/60 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/75">
                          {item.event}
                        </div>
                        <div className="text-sm text-white/45">
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {Object.entries(item.payload).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 sm:flex-row sm:items-start"
                          >
                            <div className="min-w-[140px] text-xs font-semibold uppercase tracking-wide text-white/40">
                              {key}
                            </div>
                            <div className="break-words text-sm text-white/85">
                              {String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
