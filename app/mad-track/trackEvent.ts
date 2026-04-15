export type MadEventType = "user_message" | "bot_response" | "interaction";

export type MadStyle = "safe" | "savage" | "crashout";

export type MadEvent = {
  type: MadEventType;

  message?: string;
  response?: string;

  intent?: string;
  style?: MadStyle;

  archetype?: string;
  cookLevel?: string;

  respected?: boolean;
  escalation?: number;

  action?: string;

  timestamp: number;
};

const STORAGE_KEY = "mad_events_v2";
const MAX_EVENTS = 300;

function readEvents(): MadEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MadEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: MadEvent[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch (error) {
    console.error("trackEvent write failed:", error);
  }
}

export function trackEvent(event: Omit<MadEvent, "timestamp">) {
  try {
    const next: MadEvent = {
      ...event,
      timestamp: Date.now(),
    };

    const existing = readEvents();
    existing.push(next);
    writeEvents(existing);
  } catch (error) {
    console.error("trackEvent failed:", error);
  }
}

export function getTrackedEvents(): MadEvent[] {
  return readEvents();
}

export function clearTrackedEvents() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getMadAnalytics() {
  const events = readEvents();

  const userMessages = events.filter((e) => e.type === "user_message");
  const botResponses = events.filter((e) => e.type === "bot_response");
  const interactions = events.filter((e) => e.type === "interaction");

  const countMap = (values: Array<string | undefined>) => {
    const map: Record<string, number> = {};
    for (const value of values) {
      if (!value) continue;
      map[value] = (map[value] || 0) + 1;
    }
    return map;
  };

  const topEntry = (map: Record<string, number>) => {
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return entries[0] || null;
  };

  const styleCounts = countMap(botResponses.map((e) => e.style));
  const intentCounts = countMap(botResponses.map((e) => e.intent));
  const archetypeCounts = countMap(userMessages.map((e) => e.archetype));
  const actionCounts = countMap(interactions.map((e) => e.action));
  const cookCounts = countMap(botResponses.map((e) => e.cookLevel));

  const respectedCount = botResponses.filter((e) => e.respected).length;
  const avgEscalation =
    botResponses.length > 0
      ? Number(
          (
            botResponses.reduce((sum, e) => sum + (e.escalation || 0), 0) /
            botResponses.length
          ).toFixed(2),
        )
      : 0;

  const longestResponse =
    [...botResponses]
      .filter((e) => e.response)
      .sort((a, b) => (b.response?.length || 0) - (a.response?.length || 0))[0] || null;

  return {
    totals: {
      events: events.length,
      userMessages: userMessages.length,
      botResponses: botResponses.length,
      interactions: interactions.length,
      respectedCount,
      avgEscalation,
    },
    top: {
      style: topEntry(styleCounts),
      intent: topEntry(intentCounts),
      archetype: topEntry(archetypeCounts),
      interaction: topEntry(actionCounts),
      cookLevel: topEntry(cookCounts),
    },
    counts: {
      styles: styleCounts,
      intents: intentCounts,
      archetypes: archetypeCounts,
      interactions: actionCounts,
      cookLevels: cookCounts,
    },
    samples: {
      longestResponse: longestResponse?.response || null,
    },
    recent: events.slice(-25).reverse(),
  };
}
