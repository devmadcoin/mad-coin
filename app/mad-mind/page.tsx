"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MessageRole = "user" | "bot";

type ChatMessage = {
  id: string;
 role: MessageRole;
  text: string;
  ts: number;
};

type UserProfile = {
  name: string;
  totalMessages: number;
  repeatedQuestions: number;
  hesitationScore: number;
  egoScore: number;
  copeScore: number;
  greedScore: number;
  disciplineScore: number;
  fearScore: number;
  streak: number;
  bestStreak: number;
  survivedResponses: number;
  lastInputs: string[];
  learnedWeakSpots: string[];
  customInsults: string[];
};

type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  survivedResponses: number;
  bestStreak: number;
  updatedAt: number;
};

const STORAGE_KEYS = {
  messages: "madbot_messages_v4",
  profile: "madbot_profile_v4",
  leaderboard: "madbot_leaderboard_v4",
  session: "madbot_session_v4",
};

const MAX_HISTORY = 40;
const MAX_LAST_INPUTS = 8;
const MAX_LEARNED_WEAKSPOTS = 10;
const MAX_CUSTOM_INSULTS = 16;
const MAX_LEADERBOARD = 10;

const OPENERS = [
  "That’s the question you walked in with?",
  "I almost respected your curiosity until I read that.",
  "You typed that with confidence too. Incredible.",
  "That wasn’t a question. That was a public confession.",
  "You really pressed send on that?",
  "You ask like consequences are optional.",
  "That input had the energy of someone dodging accountability.",
  "You came for answers while leaking weakness all over the floor.",
];

const REPEAT_OPENERS = [
  "You already asked this. Repeating yourself won’t turn confusion into intelligence.",
  "Same question again? So the issue isn’t information. It’s retention.",
  "You’re looping. That’s what happens when panic tries to cosplay as strategy.",
  "You brought the same problem back like it aged into wisdom. It didn’t.",
];

const DIAGNOSES = {
  hesitation: [
    "You don’t have a knowledge problem. You have a hesitation addiction.",
    "You stall so long the opportunity dies of old age.",
    "Your favorite strategy is waiting until courage becomes impossible.",
  ],
  ego: [
    "You want the result without surviving the embarrassment of being bad first.",
    "Your ego keeps writing checks your discipline can’t cash.",
    "You protect your image harder than your future.",
  ],
  cope: [
    "That’s not analysis. That’s emotional wallpaper over bad habits.",
    "You keep decorating your excuses and calling it self-awareness.",
    "You’re not confused. You’re attached to the story that protects your comfort.",
  ],
  greed: [
    "You don’t want mastery. You want a shortcut dressed like destiny.",
    "You keep sniffing for instant upside like consequences won’t invoice you later.",
    "Greed made you impatient, and impatience made you predictable.",
  ],
  fear: [
    "Fear is driving and you’re pretending you’re navigating.",
    "You keep calling it caution because ‘cowardice’ would hurt too much.",
    "You want certainty before movement. That’s fear in a business suit.",
  ],
  discipline: [
    "Execution keeps ghosting you because you only flirt with effort.",
    "You collect plans like trophies and abandon them like chores.",
    "Your ambition is loud. Your habits are unemployed.",
  ],
};

const INSULTS = [
  "Even your potential is tired of waiting for you.",
  "You’ve mistaken overthinking for depth.",
  "You move like someone outsourcing their spine.",
  "If avoidance burned calories, you’d be elite.",
  "Your confidence has never met your consistency. That’s why they don’t recognize each other.",
  "You keep asking for a map while actively romantically involved with being lost.",
  "At this point your biggest talent is delaying your own progress with premium excuses.",
  "You want a breakthrough with the work ethic of a buffering video.",
];

const INSIGHT_LINES = [
  "Read this carefully: the bottleneck is not the world. It’s your pattern.",
  "Truth hurts less when you stop negotiating with it.",
  "Momentum is ugly before it becomes impressive.",
  "You do not need more motivation. You need fewer exits.",
  "Most people don’t fail because they’re weak. They fail because they rehearse weakness.",
  "The version of you that wins is built from repeated boring decisions you keep disrespecting.",
];

const CLOSERS = [
  "Stay $MAD.",
  "Stay $MAD or stay average.",
  "Stay $MAD or stay decorative.",
  "Stay $MAD or stay forgettable.",
  "Your move. Stay $MAD.",
];

const CHAOS_LINES = [
  "YoU FeLt DoUbT... aNd CaLlEd It LoGiC.",
  "ThAt WaSn’T a QuEsTiOn. ThAt WaS a SpIrItUaL cOlLaPsE iN lOw ReSoLuTiOn.",
  "YoU DoN’t NeEd a SiGn. YoU nEeD a BaCkBoNe.",
  "EvEn YoUr ExCuSeS aRe RuNnInG oUt Of ChArGe.",
];

const SAFE_GUARD_PATTERNS = [
  /suicide/i,
  /kill myself/i,
  /self harm/i,
  /i want to die/i,
  /hurt myself/i,
  /cut myself/i,
  /anorexia/i,
  /bulimia/i,
  /overdose/i,
];

function normalizeInput(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, " ");
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybe(probability: number) {
  return Math.random() < probability;
}

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function defaultProfile(): UserProfile {
  return {
    name: "Anonymous Survivor",
    totalMessages: 0,
    repeatedQuestions: 0,
    hesitationScore: 0,
    egoScore: 0,
    copeScore: 0,
    greedScore: 0,
    disciplineScore: 0,
    fearScore: 0,
    streak: 0,
    bestStreak: 0,
    survivedResponses: 0,
    lastInputs: [],
    learnedWeakSpots: [],
    customInsults: [],
  };
}

function scoreInput(input: string) {
  const text = normalizeInput(input);

  let hesitation = 0;
  let ego = 0;
  let cope = 0;
  let greed = 0;
  let discipline = 0;
  let fear = 0;

  if (
    /should i|what if|not sure|maybe|i think|i guess|can i|could i|do you think/i.test(
      text,
    )
  ) {
    hesitation += 2;
  }

  if (/rich|get rich|money fast|viral|blow up|win big|moon|100x/i.test(text)) {
    greed += 2;
  }

  if (/why me|unfair|they|everyone else|nobody|always happens/i.test(text)) {
    cope += 2;
  }

  if (/best|greatest|smart|genius|perfect|i know|obviously/i.test(text)) {
    ego += 1;
  }

  if (/scared|afraid|fear|nervous|anxious|panic|worried/i.test(text)) {
    fear += 2;
  }

  if (/start tomorrow|later|eventually|someday|when i'm ready/i.test(text)) {
    discipline += 2;
    hesitation += 1;
  }

  if (/lazy|procrastinat|stuck|repeat|again|same/i.test(text)) {
    discipline += 2;
  }

  return { hesitation, ego, cope, greed, discipline, fear };
}

function dominantTrait(profile: UserProfile) {
  const pairs = [
    ["hesitation", profile.hesitationScore],
    ["ego", profile.egoScore],
    ["cope", profile.copeScore],
    ["greed", profile.greedScore],
    ["discipline", profile.disciplineScore],
    ["fear", profile.fearScore],
  ] as const;

  return pairs.sort((a, b) => b[1] - a[1])[0][0];
}

function buildWeakSpotLabel(input: string) {
  const text = normalizeInput(input);

  if (/rich|money|profit|100x|moon|investment|token/i.test(text)) {
    return "chases upside faster than mastery";
  }
  if (/same|again|repeat/i.test(text)) {
    return "loops instead of learning";
  }
  if (/should i|maybe|not sure|guess/i.test(text)) {
    return "hesitates until momentum dies";
  }
  if (/afraid|fear|panic|worried/i.test(text)) {
    return "lets fear wear the crown";
  }
  if (/later|tomorrow|eventually/i.test(text)) {
    return "romanticizes delay";
  }
  if (/why me|unfair|they/i.test(text)) {
    return "outsources blame";
  }

  return "asks for answers while dodging action";
}

function makeCustomInsultFromWeakSpot(weakSpot: string) {
  const templates = [
    `You still ${weakSpot}. That’s not bad luck. That’s identity.`,
    `Every time you speak, I can hear that you ${weakSpot}.`,
    `Your whole pattern screams that you ${weakSpot}.`,
    `The tragic part is you don’t even notice how often you ${weakSpot}.`,
    `You keep proving that you ${weakSpot}, then act shocked by the result.`,
  ];

  return pick(templates);
}

function isSensitiveInput(input: string) {
  return SAFE_GUARD_PATTERNS.some((pattern) => pattern.test(input));
}

function buildSafeResponse(input: string) {
  const lower = normalizeInput(input);

  if (
    /suicide|kill myself|i want to die|hurt myself|self harm|cut myself|overdose/i.test(
      lower,
    )
  ) {
    return `I’m not going to roast you on this one.

This sounds serious, and I want to be direct: you deserve immediate support right now, not an insult bot.

Please contact emergency services now if you might act on this, or reach out to a crisis line right away. If you’re in the U.S. or Canada, call or text 988. If you’re elsewhere, contact your local emergency number now and go where other people are.

Tell one real person near you immediately: “I am not safe alone right now.”`;
  }

  return `Not doing insult mode on this topic.

Ask me again in roast mode about business, discipline, mindset, branding, content, or decisions and I’ll go back to breaking ankles.`;
}

function buildBotReply(input: string, profile: UserProfile) {
  if (isSensitiveInput(input)) {
    return buildSafeResponse(input);
  }

  const normalized = normalizeInput(input);
  const isRepeat = profile.lastInputs.includes(normalized);

  const trait = dominantTrait(profile);
  const opener = isRepeat ? pick(REPEAT_OPENERS) : pick(OPENERS);

  const diagnosisPool =
    trait === "hesitation"
      ? DIAGNOSES.hesitation
      : trait === "ego"
        ? DIAGNOSES.ego
        : trait === "cope"
          ? DIAGNOSES.cope
          : trait === "greed"
            ? DIAGNOSES.greed
            : trait === "fear"
              ? DIAGNOSES.fear
              : DIAGNOSES.discipline;

  const diagnosis = pick(diagnosisPool);

  const learnedInsert =
    profile.customInsults.length > 0 && maybe(0.45)
      ? pick(profile.customInsults)
      : pick(INSULTS);

  const insight = maybe(0.75) ? pick(INSIGHT_LINES) : "";
  const chaos = maybe(0.14) ? `\n\n${pick(CHAOS_LINES)}` : "";
  const closer = pick(CLOSERS);

  const shortMode = maybe(0.22);

  if (shortMode) {
    return `${opener}\n\n${learnedInsert}\n\n${closer}`;
  }

  return `${opener}

${diagnosis}

${learnedInsert}

${insight}${chaos ? chaos : ""}

${closer}`;
}

function updateProfileFromInput(prev: UserProfile, input: string): UserProfile {
  const normalized = normalizeInput(input);
  const scores = scoreInput(input);
  const repeated = prev.lastInputs.includes(normalized);
  const weakSpot = buildWeakSpotLabel(input);

  const nextWeakSpots = Array.from(
    new Set([weakSpot, ...prev.learnedWeakSpots]),
  ).slice(0, MAX_LEARNED_WEAKSPOTS);

  const generatedInsult = makeCustomInsultFromWeakSpot(weakSpot);

  const nextCustomInsults = Array.from(
    new Set([generatedInsult, ...prev.customInsults]),
  ).slice(0, MAX_CUSTOM_INSULTS);

  const nextLastInputs = [normalized, ...prev.lastInputs].slice(
    0,
    MAX_LAST_INPUTS,
  );

  const survivedResponses = prev.survivedResponses + 1;
  const streak = prev.streak + 1;

  return {
    ...prev,
    totalMessages: prev.totalMessages + 1,
    repeatedQuestions: prev.repeatedQuestions + (repeated ? 1 : 0),
    hesitationScore: prev.hesitationScore + scores.hesitation,
    egoScore: prev.egoScore + scores.ego,
    copeScore: prev.copeScore + scores.cope,
    greedScore: prev.greedScore + scores.greed,
    disciplineScore: prev.disciplineScore + scores.discipline,
    fearScore: prev.fearScore + scores.fear,
    streak,
    bestStreak: Math.max(prev.bestStreak, streak),
    survivedResponses,
    lastInputs: nextLastInputs,
    learnedWeakSpots: nextWeakSpots,
    customInsults: nextCustomInsults,
  };
}

function calcSurvivorScore(profile: UserProfile) {
  const traitPressure =
    profile.hesitationScore +
    profile.egoScore +
    profile.copeScore +
    profile.greedScore +
    profile.disciplineScore +
    profile.fearScore;

  return (
    profile.survivedResponses * 12 +
    profile.bestStreak * 18 -
    profile.repeatedQuestions * 7 +
    Math.floor(traitPressure * 1.4)
  );
}

function upsertLeaderboard(entry: LeaderboardEntry) {
  const current = loadJSON<LeaderboardEntry[]>(STORAGE_KEYS.leaderboard, []);
  const filtered = current.filter((item) => item.id !== entry.id);
  const merged = [...filtered, entry]
    .sort((a, b) => b.score - a.score || b.bestStreak - a.bestStreak)
    .slice(0, MAX_LEADERBOARD);

  saveJSON(STORAGE_KEYS.leaderboard, merged);
  return merged;
}

export default function MadMindPage() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("Anonymous Survivor");
  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedMessages = loadJSON<ChatMessage[]>(STORAGE_KEYS.messages, []);
    const savedProfile = loadJSON<UserProfile>(
      STORAGE_KEYS.profile,
      defaultProfile(),
    );
    const savedLeaderboard = loadJSON<LeaderboardEntry[]>(
      STORAGE_KEYS.leaderboard,
      [],
    );
    const session = loadJSON<{ id: string; name: string } | null>(
      STORAGE_KEYS.session,
      null,
    );

    setMessages(savedMessages);
    setProfile(savedProfile);
    setLeaderboard(savedLeaderboard);
    setUsername(session?.name || savedProfile.name || "Anonymous Survivor");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveJSON(STORAGE_KEYS.messages, messages.slice(-MAX_HISTORY));
  }, [messages, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveJSON(STORAGE_KEYS.profile, profile);
  }, [profile, mounted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const score = useMemo(() => calcSurvivorScore(profile), [profile]);

  function saveIdentity(name: string) {
    const cleaned = name.trim() || "Anonymous Survivor";
    setUsername(cleaned);

    const nextProfile = { ...profile, name: cleaned };
    setProfile(nextProfile);
    saveJSON(STORAGE_KEYS.session, { id: "local-user", name: cleaned });

    const updated = upsertLeaderboard({
      id: "local-user",
      name: cleaned,
      score: calcSurvivorScore(nextProfile),
      survivedResponses: nextProfile.survivedResponses,
      bestStreak: nextProfile.bestStreak,
      updatedAt: Date.now(),
    });

    setLeaderboard(updated);
  }

  function resetSession() {
    const fresh = defaultProfile();
    fresh.name = username || "Anonymous Survivor";
    setProfile(fresh);
    setMessages([]);
    saveJSON(STORAGE_KEYS.profile, fresh);
    saveJSON(STORAGE_KEYS.messages, []);
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text: trimmed,
      ts: Date.now(),
    };

    const nextProfile = updateProfileFromInput(profile, trimmed);

    setMessages((prev) => [...prev, userMsg]);
    setProfile(nextProfile);
    setInput("");
    setIsThinking(true);

    const delay = 350 + Math.floor(Math.random() * 450);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const reply = buildBotReply(trimmed, nextProfile);

    const botMsg: ChatMessage = {
      id: uid(),
      role: "bot",
      text: reply,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsThinking(false);

    const updatedLeaderboard = upsertLeaderboard({
      id: "local-user",
      name: nextProfile.name || username || "Anonymous Survivor",
      score: calcSurvivorScore(nextProfile),
      survivedResponses: nextProfile.survivedResponses,
      bestStreak: nextProfile.bestStreak,
      updatedAt: Date.now(),
    });

    setLeaderboard(updatedLeaderboard);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">Loading $MAD Mind…</div>
      </div>
    );
  }

  const dominant = dominantTrait(profile);
  const dominantLabel =
    dominant.charAt(0).toUpperCase() + dominant.slice(1);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,120,0,0.10),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-red-400/80">
                  $MAD Mind
                </p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  Crashout Survivor Chamber
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/65 sm:text-base">
                  Sharper memory. More variation. Better pressure. Repeats get punished.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={resetSession}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                >
                  Reset session
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-red-300/80">
              Identity
            </p>

            <div className="mt-3 flex flex-col gap-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter survivor name"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-red-400/50"
              />
              <button
                onClick={() => saveIdentity(username)}
                className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.01] hover:bg-red-400"
              >
                Save survivor name
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.42fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                    Live Chamber
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Talk to the bot</h2>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    Survivor Score: {score}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    Best Streak: {profile.bestStreak}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    Dominant Weakness: {dominantLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[58vh] overflow-y-auto px-4 py-4 sm:px-6">
              {messages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-6 text-white/55">
                  <p className="text-lg font-semibold text-white">
                    Enter the chamber.
                  </p>
                  <p className="mt-2 text-sm">
                    Ask about money, focus, mindset, branding, discipline, virality,
                    content, fear, hesitation, or execution.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[88%] rounded-3xl px-4 py-3 whitespace-pre-wrap ${
                        message.role === "user"
                          ? "ml-auto border border-white/10 bg-white/10 text-white"
                          : "border border-red-500/20 bg-red-500/10 text-red-50"
                      }`}
                    >
                      <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
                        {message.role === "user" ? "Survivor" : "$MAD Bot"}
                      </div>
                      <div className="text-sm leading-7 sm:text-[15px]">
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="max-w-[88%] rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-50">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
                        $MAD Bot
                      </div>
                      <div className="text-sm leading-7 sm:text-[15px]">
                        analyzing weakness...
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-4 sm:px-6">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={4}
                  placeholder="Type your question and press Enter..."
                  className="w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-white/30"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-white/35">
                    Enter = send · Shift + Enter = new line
                  </p>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isThinking}
                    className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.01] hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send to chamber
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                Learned Profile
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/45">Messages</div>
                  <div className="mt-1 text-xl font-black">{profile.totalMessages}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/45">Repeats</div>
                  <div className="mt-1 text-xl font-black">{profile.repeatedQuestions}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/45">Survived</div>
                  <div className="mt-1 text-xl font-black">{profile.survivedResponses}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-white/45">Best Streak</div>
                  <div className="mt-1 text-xl font-black">{profile.bestStreak}</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Meter label="Hesitation" value={clamp(profile.hesitationScore, 0, 100)} />
                <Meter label="Ego" value={clamp(profile.egoScore, 0, 100)} />
                <Meter label="Cope" value={clamp(profile.copeScore, 0, 100)} />
                <Meter label="Greed" value={clamp(profile.greedScore, 0, 100)} />
                <Meter label="Discipline Damage" value={clamp(profile.disciplineScore, 0, 100)} />
                <Meter label="Fear" value={clamp(profile.fearScore, 0, 100)} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                Learned Weak Spots
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.learnedWeakSpots.length === 0 ? (
                  <span className="text-sm text-white/45">No weakness profile yet.</span>
                ) : (
                  profile.learnedWeakSpots.map((spot) => (
                    <span
                      key={spot}
                      className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-100"
                    >
                      {spot}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                Top Survivors
              </p>

              <div className="mt-4 space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-white/45">No survivors ranked yet.</p>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                    >
                      <div>
                        <div className="text-sm font-bold">
                          #{index + 1} {entry.name}
                        </div>
                        <div className="mt-1 text-xs text-white/45">
                          Survived: {entry.survivedResponses} · Best streak: {entry.bestStreak}
                        </div>
                      </div>
                      <div className="text-right text-sm font-black text-red-300">
                        {entry.score}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-white/50">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
