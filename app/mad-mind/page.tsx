"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hasSupabase, supabase } from "@/lib/supabase/client";

type MessageRole = "user" | "bot";
type CookLevel = "mild" | "mean" | "crashout" | "demon";

type Archetype =
  | "The Hesitator"
  | "The Shortcut Addict"
  | "The Excuse Architect"
  | "The Panic Trader"
  | "The Faker"
  | "The Survivor";

type ChallengeKey =
  | "no_repeats_5"
  | "survive_7"
  | "earn_respect_1"
  | "demon_survive_3"
  | "score_250";

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  ts: number;
  respected?: boolean;
  scoreValue?: number;
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
  respectCount: number;
  lastInputs: string[];
  learnedWeakSpots: string[];
  customInsults: string[];
  noRepeatStreak: number;
};

type LeaderboardEntry = {
  id: string;
  player_name: string;
  score: number;
  survived_responses: number;
  best_streak: number;
  cook_level: CookLevel;
  respect_count: number;
  updated_at?: string;
};

type ChallengeDefinition = {
  key: ChallengeKey;
  title: string;
  description: string;
  target: number;
};

type ChallengeProgress = Record<ChallengeKey, number>;
type ChallengeCompletion = Record<ChallengeKey, boolean>;

type DailyChallengeState = {
  dateKey: string;
  activeKeys: ChallengeKey[];
  progress: ChallengeProgress;
  completed: ChallengeCompletion;
};

const STORAGE_KEYS = {
  messages: "madbot_messages_v7",
  profile: "madbot_profile_v7",
  session: "madbot_session_v7",
  cookLevel: "madbot_cook_level_v7",
  daily: "madbot_daily_v7",
};

const MAX_HISTORY = 60;
const MAX_LAST_INPUTS = 10;
const MAX_LEARNED_WEAKSPOTS = 12;
const MAX_CUSTOM_INSULTS = 18;

const OPENERS = {
  mild: [
    "That’s what you came in with?",
    "You really wanted help with that?",
    "That question is already losing points.",
    "Interesting. Not good. But interesting.",
  ],
  mean: [
    "You typed that like confidence was included for free.",
    "That question looks undercooked.",
    "I’ve seen stronger thinking from people half-awake.",
    "You really hit send on that?",
  ],
  crashout: [
    "That’s the question you walked in with?",
    "I almost respected your curiosity until I read that.",
    "That wasn’t a question. That was a confession.",
    "You ask like consequences are optional.",
  ],
  demon: [
    "You dragged that thought out into public on purpose?",
    "That input had the structural integrity of wet cardboard.",
    "I can already tell your habits are allergic to execution.",
    "That message smells like hesitation and bad timing.",
  ],
} as const;

const REPEAT_OPENERS = {
  mild: ["You already asked this.", "Same question again?"],
  mean: [
    "You asked this already. Repetition is not depth.",
    "Same loop, different minute.",
  ],
  crashout: [
    "You already asked this. Repeating yourself won’t turn confusion into intelligence.",
    "Same question again? So the issue isn’t information. It’s retention.",
    "You’re looping. That’s what panic does when it wants to feel strategic.",
  ],
  demon: [
    "Same question again? Your memory and your momentum are both unemployed.",
    "You brought the same problem back like it aged into wisdom. It didn’t.",
    "You loop because action scares you more than embarrassment.",
  ],
} as const;

const DIAGNOSES = {
  hesitation: [
    "You don’t have a knowledge problem. You have a hesitation addiction.",
    "You stall so long the opportunity dies of old age.",
    "You wait for clarity the way cowards wait for permission.",
  ],
  ego: [
    "You want the result without surviving the embarrassment of being bad first.",
    "Your ego keeps writing checks your discipline can’t cash.",
    "You protect your image harder than your future.",
  ],
  cope: [
    "That’s not analysis. That’s emotional wallpaper over bad habits.",
    "You keep decorating your excuses and calling it self-awareness.",
    "You’re attached to the story that protects your comfort.",
  ],
  greed: [
    "You don’t want mastery. You want a shortcut dressed like destiny.",
    "You keep sniffing for instant upside like consequences won’t invoice you later.",
    "Greed made you impatient, and impatience made you predictable.",
  ],
  fear: [
    "Fear is driving and you’re pretending you’re navigating.",
    "You keep calling it caution because the real word would hurt more.",
    "You want certainty before movement. That’s fear in nice clothes.",
  ],
  discipline: [
    "Execution keeps ghosting you because you only flirt with effort.",
    "You collect plans and abandon them like chores.",
    "Your ambition is loud. Your habits are missing.",
  ],
} as const;

const INSULTS = {
  mild: [
    "Even your potential is asking for a clearer plan.",
    "You’ve mistaken overthinking for progress.",
    "You move like someone waiting for life to blink first.",
  ],
  mean: [
    "Even your potential is tired of waiting for you.",
    "You’ve mistaken overthinking for depth.",
    "You move like someone outsourcing their spine.",
    "You want a breakthrough with the work ethic of a buffering video.",
  ],
  crashout: [
    "Even your potential is tired of waiting for you.",
    "You’ve mistaken overthinking for depth.",
    "You move like someone outsourcing their spine.",
    "If avoidance burned calories, you’d be elite.",
    "Your confidence has never met your consistency.",
    "At this point your biggest talent is delaying your own progress with premium excuses.",
  ],
  demon: [
    "Your future keeps knocking and you keep answering with excuses.",
    "Your consistency is so absent it should file a missing persons report.",
    "You keep asking for a map while actively dating confusion.",
    "At this point your excuses have more reps than your discipline.",
    "You want elite outcomes with habits that belong in clearance.",
  ],
} as const;

const INSIGHT_LINES = [
  "The bottleneck is not the world. It’s your pattern.",
  "Truth hurts less when you stop negotiating with it.",
  "Momentum is ugly before it becomes impressive.",
  "You do not need more motivation. You need fewer exits.",
  "The version of you that wins is built from boring decisions you keep disrespecting.",
];

const RESPECT_LINES = [
  "For once, that didn’t sound pathetic.",
  "Good. That answer had a spine.",
  "Rare. Accountability. Keep that.",
  "That actually sounded disciplined.",
  "You might be worth watching after all.",
];

const CLOSERS = {
  mild: ["Do better.", "Your move.", "Lock in."],
  mean: ["Lock in.", "Your move.", "Fix it."],
  crashout: [
    "Stay $MAD.",
    "Stay $MAD or stay average.",
    "Your move. Stay $MAD.",
  ],
  demon: [
    "Stay $MAD or stay forgettable.",
    "Stay $MAD or stay decorative.",
    "Stay $MAD. Or keep rotting in hesitation.",
  ],
} as const;

const CHAOS_LINES = [
  "YoU FeLt DoUbT... aNd CaLlEd It LoGiC.",
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
  /overdose/i,
];

const CHALLENGE_DEFINITIONS: Record<ChallengeKey, ChallengeDefinition> = {
  no_repeats_5: {
    key: "no_repeats_5",
    title: "No Echoes",
    description: "Send 5 messages without repeating yourself.",
    target: 5,
  },
  survive_7: {
    key: "survive_7",
    title: "Steel Stomach",
    description: "Survive 7 bot replies in one day.",
    target: 7,
  },
  earn_respect_1: {
    key: "earn_respect_1",
    title: "Earn Respect",
    description: "Trigger 1 rare respect reply.",
    target: 1,
  },
  demon_survive_3: {
    key: "demon_survive_3",
    title: "Demon Shift",
    description: "Survive 3 replies in Demon mode.",
    target: 3,
  },
  score_250: {
    key: "score_250",
    title: "Quarter Kilo Rage",
    description: "Reach a score of 250.",
    target: 250,
  },
};

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
    respectCount: 0,
    lastInputs: [],
    learnedWeakSpots: [],
    customInsults: [],
    noRepeatStreak: 0,
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

  if (/should i|what if|not sure|maybe|i think|i guess|can i|could i|do you think/.test(text)) {
    hesitation += 2;
  }

  if (/rich|get rich|money fast|viral|blow up|win big|moon|100x|pump|profit/.test(text)) {
    greed += 2;
  }

  if (/why me|unfair|they|everyone else|nobody|always happens/.test(text)) {
    cope += 2;
  }

  if (/best|greatest|smart|genius|perfect|i know|obviously/.test(text)) {
    ego += 1;
  }

  if (/scared|afraid|fear|nervous|anxious|panic|worried/.test(text)) {
    fear += 2;
  }

  if (/start tomorrow|later|eventually|someday|when i'm ready/.test(text)) {
    discipline += 2;
    hesitation += 1;
  }

  if (/lazy|procrastinat|stuck|repeat|again|same/.test(text)) {
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

function deriveArchetype(profile: UserProfile): Archetype {
  const trait = dominantTrait(profile);

  if (profile.survivedResponses >= 12 && profile.respectCount >= 2 && profile.repeatedQuestions <= 2) {
    return "The Survivor";
  }

  if (trait === "hesitation") return "The Hesitator";
  if (trait === "greed") return "The Shortcut Addict";
  if (trait === "cope") return "The Excuse Architect";
  if (trait === "fear") return "The Panic Trader";
  if (trait === "ego") return "The Faker";

  return "The Survivor";
}

function archetypeDescription(archetype: Archetype) {
  switch (archetype) {
    case "The Hesitator":
      return "Waits for certainty until momentum dies.";
    case "The Shortcut Addict":
      return "Wants upside faster than mastery.";
    case "The Excuse Architect":
      return "Builds clean stories around bad habits.";
    case "The Panic Trader":
      return "Lets fear hold the steering wheel.";
    case "The Faker":
      return "Protects image harder than progress.";
    case "The Survivor":
      return "Still flawed, but actually moving.";
  }
}

function buildWeakSpotLabel(input: string) {
  const text = normalizeInput(input);

  if (/rich|money|profit|100x|moon|investment|token|pump/.test(text)) {
    return "chases upside faster than mastery";
  }
  if (/same|again|repeat/.test(text)) {
    return "loops instead of learning";
  }
  if (/should i|maybe|not sure|guess/.test(text)) {
    return "hesitates until momentum dies";
  }
  if (/afraid|fear|panic|worried/.test(text)) {
    return "lets fear wear the crown";
  }
  if (/later|tomorrow|eventually/.test(text)) {
    return "romanticizes delay";
  }
  if (/why me|unfair|they/.test(text)) {
    return "outsources blame";
  }

  return "asks for answers while dodging action";
}

function makeCustomInsultFromWeakSpot(weakSpot: string, cookLevel: CookLevel) {
  const templates =
    cookLevel === "mild"
      ? [
          `You still ${weakSpot}. That’s the leak.`,
          `I can already tell you ${weakSpot}.`,
          `Your pattern says you ${weakSpot}.`,
        ]
      : cookLevel === "mean"
        ? [
            `You still ${weakSpot}. That’s not bad luck. That’s pattern.`,
            `Every time you speak, I can hear that you ${weakSpot}.`,
            `Your whole pattern screams that you ${weakSpot}.`,
          ]
        : [
            `You still ${weakSpot}. That’s not bad luck. That’s identity.`,
            `Every time you speak, I can hear that you ${weakSpot}.`,
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

  if (/suicide|kill myself|i want to die|hurt myself|self harm|cut myself|overdose/.test(lower)) {
    return `I’m not doing roast mode on this.

This sounds serious. Please contact emergency services now if you might act on this, or call or text 988 right now if you’re in the U.S. or Canada.

Tell one real person near you immediately: "I am not safe alone right now."`;
  }

  return `Not doing insult mode on this topic.`;
}

function shouldRespect(input: string) {
  const text = normalizeInput(input);

  const accountable =
    /i will|i did|i'm doing|i am doing|i took action|i shipped|i posted|i learned|i was wrong|my fault|i need discipline|i need to focus/.test(
      text,
    );

  const lessVictim = !/why me|unfair|they|everyone else|nobody/.test(text);

  return accountable && lessVictim;
}

function buildBotReply(input: string, profile: UserProfile, cookLevel: CookLevel) {
  if (isSensitiveInput(input)) {
    return { text: buildSafeResponse(input), respected: false };
  }

  const normalized = normalizeInput(input);
  const isRepeat = profile.lastInputs.includes(normalized);
  const trait = dominantTrait(profile);

  const respectChance =
    shouldRespect(input)
      ? cookLevel === "mild"
        ? 0.18
        : cookLevel === "mean"
          ? 0.12
          : cookLevel === "crashout"
            ? 0.08
            : 0.06
      : 0;

  if (respectChance > 0 && maybe(respectChance)) {
    return {
      text: `${pick(RESPECT_LINES)}

${pick(INSIGHT_LINES)}

${pick(CLOSERS[cookLevel])}`,
      respected: true,
    };
  }

  const opener = isRepeat ? pick(REPEAT_OPENERS[cookLevel]) : pick(OPENERS[cookLevel]);

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

  const learnedInsert =
    profile.customInsults.length > 0 && maybe(0.45)
      ? pick(profile.customInsults)
      : pick(INSULTS[cookLevel]);

  const insight = maybe(0.72) ? pick(INSIGHT_LINES) : "";
  const chaos =
    (cookLevel === "crashout" || cookLevel === "demon") && maybe(cookLevel === "demon" ? 0.2 : 0.12)
      ? `\n\n${pick(CHAOS_LINES)}`
      : "";

  const closer = pick(CLOSERS[cookLevel]);
  const shortMode =
    cookLevel === "mild"
      ? maybe(0.28)
      : cookLevel === "mean"
        ? maybe(0.24)
        : maybe(0.2);

  if (shortMode) {
    return {
      text: `${opener}

${learnedInsert}

${closer}`,
      respected: false,
    };
  }

  return {
    text: `${opener}

${pick(diagnosisPool)}

${learnedInsert}

${insight}${chaos}

${closer}`,
    respected: false,
  };
}

function updateProfileFromInput(prev: UserProfile, input: string, cookLevel: CookLevel): UserProfile {
  const normalized = normalizeInput(input);
  const scores = scoreInput(input);
  const repeated = prev.lastInputs.includes(normalized);
  const weakSpot = buildWeakSpotLabel(input);

  const nextWeakSpots = Array.from(new Set([weakSpot, ...prev.learnedWeakSpots])).slice(
    0,
    MAX_LEARNED_WEAKSPOTS,
  );

  const generatedInsult = makeCustomInsultFromWeakSpot(weakSpot, cookLevel);

  const nextCustomInsults = Array.from(new Set([generatedInsult, ...prev.customInsults])).slice(
    0,
    MAX_CUSTOM_INSULTS,
  );

  const nextLastInputs = [normalized, ...prev.lastInputs].slice(0, MAX_LAST_INPUTS);

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
    streak: prev.streak + 1,
    bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
    survivedResponses: prev.survivedResponses + 1,
    lastInputs: nextLastInputs,
    learnedWeakSpots: nextWeakSpots,
    customInsults: nextCustomInsults,
    noRepeatStreak: repeated ? 0 : prev.noRepeatStreak + 1,
  };
}

function calcSurvivorScore(profile: UserProfile, cookLevel: CookLevel) {
  const traitPressure =
    profile.hesitationScore +
    profile.egoScore +
    profile.copeScore +
    profile.greedScore +
    profile.disciplineScore +
    profile.fearScore;

  const levelBonus =
    cookLevel === "mild" ? 0 : cookLevel === "mean" ? 20 : cookLevel === "crashout" ? 45 : 80;

  return (
    profile.survivedResponses * 12 +
    profile.bestStreak * 18 -
    profile.repeatedQuestions * 7 +
    Math.floor(traitPressure * 1.4) +
    profile.respectCount * 35 +
    levelBonus
  );
}

function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function seededIndex(seed: string, mod: number, offset = 0) {
  let hash = 0;
  const src = `${seed}-${offset}`;
  for (let i = 0; i < src.length; i += 1) {
    hash = (hash * 31 + src.charCodeAt(i)) % 2147483647;
  }
  return Math.abs(hash) % mod;
}

function createDailyState(dateKey: string): DailyChallengeState {
  const allKeys = Object.keys(CHALLENGE_DEFINITIONS) as ChallengeKey[];
  const chosen = new Set<ChallengeKey>();

  let salt = 0;
  while (chosen.size < 3) {
    chosen.add(allKeys[seededIndex(dateKey, allKeys.length, salt)]);
    salt += 1;
  }

  const progress: ChallengeProgress = {
    no_repeats_5: 0,
    survive_7: 0,
    earn_respect_1: 0,
    demon_survive_3: 0,
    score_250: 0,
  };

  const completed: ChallengeCompletion = {
    no_repeats_5: false,
    survive_7: false,
    earn_respect_1: false,
    demon_survive_3: false,
    score_250: false,
  };

  return {
    dateKey,
    activeKeys: Array.from(chosen),
    progress,
    completed,
  };
}

function ensureDailyState(state: DailyChallengeState | null) {
  const key = todayKey();
  if (!state || state.dateKey !== key) return createDailyState(key);
  return state;
}

function updateDailyProgress(
  current: DailyChallengeState,
  profile: UserProfile,
  score: number,
  cookLevel: CookLevel,
  respectedThisTurn: boolean,
) {
  const next: DailyChallengeState = {
    ...current,
    progress: { ...current.progress },
    completed: { ...current.completed },
  };

  next.progress.no_repeats_5 = Math.max(next.progress.no_repeats_5, profile.noRepeatStreak);
  next.progress.survive_7 = Math.max(next.progress.survive_7, profile.survivedResponses);
  next.progress.earn_respect_1 = Math.max(
    next.progress.earn_respect_1,
    respectedThisTurn ? 1 : profile.respectCount,
  );
  next.progress.demon_survive_3 =
    cookLevel === "demon"
      ? Math.max(next.progress.demon_survive_3, next.progress.demon_survive_3 + 1)
      : next.progress.demon_survive_3;
  next.progress.score_250 = Math.max(next.progress.score_250, score);

  for (const key of next.activeKeys) {
    const def = CHALLENGE_DEFINITIONS[key];
    next.completed[key] = next.progress[key] >= def.target;
  }

  return next;
}

function roastCardScore(text: string, respected?: boolean) {
  const lengthValue = Math.min(text.length, 280);
  const punctuationBonus = (text.match(/[.!?]/g) ?? []).length * 3;
  const capsChaosBonus = /[A-Z]{3,}/.test(text) ? 18 : 0;
  const respectBonus = respected ? 20 : 0;
  return lengthValue + punctuationBonus + capsChaosBonus + respectBonus;
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mad_bot_scores")
    .select("*")
    .order("score", { ascending: false })
    .order("best_streak", { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return data as LeaderboardEntry[];
}

async function upsertRemoteScore(entry: Omit<LeaderboardEntry, "id">) {
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("mad_bot_scores")
    .select("id, score, best_streak, survived_responses, respect_count")
    .eq("player_name", entry.player_name)
    .maybeSingle();

  if (existing?.id) {
    const mergedScore = Math.max(existing.score ?? 0, entry.score);
    const mergedBestStreak = Math.max(existing.best_streak ?? 0, entry.best_streak);
    const mergedSurvived = Math.max(existing.survived_responses ?? 0, entry.survived_responses);
    const mergedRespect = Math.max(existing.respect_count ?? 0, entry.respect_count);

    await supabase
      .from("mad_bot_scores")
      .update({
        score: mergedScore,
        best_streak: mergedBestStreak,
        survived_responses: mergedSurvived,
        respect_count: mergedRespect,
        cook_level: entry.cook_level,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("mad_bot_scores").insert({
      player_name: entry.player_name,
      score: entry.score,
      survived_responses: entry.survived_responses,
      best_streak: entry.best_streak,
      cook_level: entry.cook_level,
      respect_count: entry.respect_count,
    });
  }
}

export default function MadMindPage() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("Anonymous Survivor");
  const [cookLevel, setCookLevel] = useState<CookLevel>("crashout");
  const [isThinking, setIsThinking] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [supabaseStatus, setSupabaseStatus] = useState(
    hasSupabase ? "Supabase connected" : "Local mode only",
  );
  const [dailyState, setDailyState] = useState<DailyChallengeState>(createDailyState(todayKey()));
  const [selectedRoast, setSelectedRoast] = useState<ChatMessage | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedMessages = loadJSON<ChatMessage[]>(STORAGE_KEYS.messages, []);
    const savedProfile = loadJSON<UserProfile>(STORAGE_KEYS.profile, defaultProfile());
    const savedSession = loadJSON<{ name: string } | null>(STORAGE_KEYS.session, null);
    const savedCookLevel = loadJSON<CookLevel>(STORAGE_KEYS.cookLevel, "crashout");
    const savedDaily = loadJSON<DailyChallengeState | null>(STORAGE_KEYS.daily, null);

    setMessages(savedMessages);
    setProfile(savedProfile);
    setUsername(savedSession?.name || savedProfile.name || "Anonymous Survivor");
    setCookLevel(savedCookLevel);
    setDailyState(ensureDailyState(savedDaily));
    setMounted(true);

    if (hasSupabase) {
      fetchLeaderboard()
        .then((rows) => {
          setLeaderboard(rows);
          setSupabaseStatus("Supabase live leaderboard");
        })
        .catch(() => {
          setSupabaseStatus("Supabase unavailable");
        });
    }
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
    if (!mounted) return;
    saveJSON(STORAGE_KEYS.cookLevel, cookLevel);
  }, [cookLevel, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveJSON(STORAGE_KEYS.daily, dailyState);
  }, [dailyState, mounted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!copyToast) return;
    const t = setTimeout(() => setCopyToast(""), 1400);
    return () => clearTimeout(t);
  }, [copyToast]);

  const score = useMemo(() => calcSurvivorScore(profile, cookLevel), [profile, cookLevel]);
  const archetype = useMemo(() => deriveArchetype(profile), [profile]);

  const topRoast = useMemo(() => {
    const botMessages = messages.filter((m) => m.role === "bot");
    if (botMessages.length === 0) return null;

    return [...botMessages]
      .map((m) => ({ ...m, scoreValue: roastCardScore(m.text, m.respected) }))
      .sort((a, b) => (b.scoreValue ?? 0) - (a.scoreValue ?? 0))[0];
  }, [messages]);

  const activeChallenges = dailyState.activeKeys.map((key) => CHALLENGE_DEFINITIONS[key]);

  async function saveIdentity(name: string) {
    const cleaned = name.trim() || "Anonymous Survivor";
    setUsername(cleaned);

    const nextProfile = { ...profile, name: cleaned };
    setProfile(nextProfile);
    saveJSON(STORAGE_KEYS.session, { name: cleaned });

    if (hasSupabase) {
      await upsertRemoteScore({
        player_name: cleaned,
        score: calcSurvivorScore(nextProfile, cookLevel),
        survived_responses: nextProfile.survivedResponses,
        best_streak: nextProfile.bestStreak,
        cook_level: cookLevel,
        respect_count: nextProfile.respectCount,
      });

      const rows = await fetchLeaderboard();
      setLeaderboard(rows);
    }
  }

  function resetSession() {
    const fresh = defaultProfile();
    fresh.name = username || "Anonymous Survivor";
    setProfile(fresh);
    setMessages([]);
    setSelectedRoast(null);
    saveJSON(STORAGE_KEYS.profile, fresh);
    saveJSON(STORAGE_KEYS.messages, []);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast("Copied");
    } catch {
      setCopyToast("Copy failed");
    }
  }

  async function shareScore() {
    const text = `${username} survived the $MAD Bot in ${cookLevel.toUpperCase()} mode with score ${score} as ${archetype}.`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // ignore
      }
    }

    await copyText(text);
  }

  async function copyRoastCard(message: ChatMessage) {
    const card = [
      "━━━━━━━━━━━━━━━━━━",
      "$MAD BOT ROAST CARD",
      "━━━━━━━━━━━━━━━━━━",
      `Name: ${username}`,
      `Archetype: ${archetype}`,
      `Cook Level: ${cookLevel.toUpperCase()}`,
      `Score: ${score}`,
      "",
      message.text,
      "",
      "Stay $MAD.",
    ].join("\n");

    await copyText(card);
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

    const nextProfileBase = updateProfileFromInput(profile, trimmed, cookLevel);

    setMessages((prev) => [...prev, userMsg]);
    setProfile(nextProfileBase);
    setInput("");
    setIsThinking(true);

    const delay = 280 + Math.floor(Math.random() * 420);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const reply = buildBotReply(trimmed, nextProfileBase, cookLevel);

    const finalProfile = reply.respected
      ? {
          ...nextProfileBase,
          respectCount: nextProfileBase.respectCount + 1,
        }
      : nextProfileBase;

    const botMsg: ChatMessage = {
      id: uid(),
      role: "bot",
      text: reply.text,
      ts: Date.now(),
      respected: reply.respected,
      scoreValue: roastCardScore(reply.text, reply.respected),
    };

    const nextMessages = [...messages, userMsg, botMsg];
    const nextScore = calcSurvivorScore(finalProfile, cookLevel);
    const nextDaily = updateDailyProgress(
      ensureDailyState(dailyState),
      finalProfile,
      nextScore,
      cookLevel,
      reply.respected,
    );

    setProfile(finalProfile);
    setMessages((prev) => [...prev, botMsg]);
    setDailyState(nextDaily);
    setIsThinking(false);

    if (hasSupabase) {
      await upsertRemoteScore({
        player_name: (finalProfile.name || username || "Anonymous Survivor").trim(),
        score: nextScore,
        survived_responses: finalProfile.survivedResponses,
        best_streak: finalProfile.bestStreak,
        cook_level: cookLevel,
        respect_count: finalProfile.respectCount,
      });

      const rows = await fetchLeaderboard();
      setLeaderboard(rows);
    }

    const newTop = [...nextMessages]
      .filter((m) => m.role === "bot")
      .map((m) => ({ ...m, scoreValue: roastCardScore(m.text, m.respected) }))
      .sort((a, b) => (b.scoreValue ?? 0) - (a.scoreValue ?? 0))[0];

    if (newTop && (!topRoast || (newTop.scoreValue ?? 0) > (topRoast.scoreValue ?? 0))) {
      setSelectedRoast(newTop);
    }
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
        <div className="mx-auto max-w-6xl px-6 py-20">Loading $MAD Mind...</div>
      </div>
    );
  }

  const dominant = dominantTrait(profile);
  const dominantLabel = dominant.charAt(0).toUpperCase() + dominant.slice(1);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,60,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,120,0,0.14),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-red-400/80">$MAD Mind</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Archetype Chamber</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Daily challenges, roast cards, and a hidden behavior archetype that evolves as you talk.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["mild", "mean", "crashout", "demon"] as CookLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setCookLevel(level)}
                  className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                    cookLevel === level
                      ? "bg-red-500 text-white"
                      : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}

              <button
                onClick={resetSession}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-red-300/80">Identity</p>

            <div className="mt-3 flex flex-col gap-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter survivor name"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-red-400/50"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => saveIdentity(username)}
                  className="flex-1 rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-400"
                >
                  Save name
                </button>
                <button
                  onClick={shareScore}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-white/90 hover:bg-black/50"
                >
                  Share
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/60">
                {supabaseStatus}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-[0.68fr_0.32fr]">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Archetype</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{archetype}</h2>
                <p className="mt-1 text-sm text-white/70">{archetypeDescription(archetype)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
                <div className="text-xs text-white/45">Dominant weakness</div>
                <div className="mt-1 text-sm font-bold">{dominantLabel}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Session Best Roast</p>
            {topRoast ? (
              <button
                onClick={() => setSelectedRoast(topRoast)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left hover:bg-black/50"
              >
                <div className="text-sm font-bold text-red-200">Open roast card</div>
                <div className="mt-2 line-clamp-3 text-sm text-white/70">{topRoast.text}</div>
              </button>
            ) : (
              <p className="mt-3 text-sm text-white/45">No roast card yet.</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.42fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Live Chamber</p>
                  <h2 className="mt-1 text-xl font-bold">Talk to the bot</h2>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    Score: {score}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    Best Streak: {profile.bestStreak}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    Respect: {profile.respectCount}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                    No Repeat Streak: {profile.noRepeatStreak}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[58vh] overflow-y-auto px-4 py-4 sm:px-6">
              {messages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-6 text-white/55">
                  <p className="text-lg font-semibold text-white">Enter the chamber.</p>
                  <p className="mt-2 text-sm">
                    Ask about money, discipline, virality, hesitation, fear, branding, or execution.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div
                        className={`max-w-[88%] rounded-3xl px-4 py-3 whitespace-pre-wrap ${
                          message.role === "user"
                            ? "ml-auto border border-white/10 bg-white/10 text-white"
                            : message.respected
                              ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-50"
                              : "border border-red-500/20 bg-red-500/10 text-red-50"
                        }`}
                      >
                        <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
                          {message.role === "user" ? "Survivor" : message.respected ? "Respect Mode" : "$MAD Bot"}
                        </div>
                        <div className="text-sm leading-7 sm:text-[15px]">{message.text}</div>
                      </div>

                      {message.role === "bot" && (
                        <div className="mt-2 flex max-w-[88%] flex-wrap gap-2">
                          <button
                            onClick={() => copyText(message.text)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10"
                          >
                            Copy roast
                          </button>
                          <button
                            onClick={() => setSelectedRoast(message)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10"
                          >
                            Roast card
                          </button>
                          <button
                            onClick={shareScore}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10"
                          >
                            Share score
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {isThinking && (
                    <div className="max-w-[88%] rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-50">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">$MAD Bot</div>
                      <div className="text-sm leading-7 sm:text-[15px]">analyzing weakness...</div>
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
                  <p className="text-xs text-white/35">Enter = send · Shift + Enter = new line</p>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isThinking}
                    className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.01] hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Daily Challenges</p>
              <div className="mt-4 space-y-3">
                {activeChallenges.map((challenge) => {
                  const progress = dailyState.progress[challenge.key];
                  const complete = dailyState.completed[challenge.key];
                  const pct = Math.min((progress / challenge.target) * 100, 100);

                  return (
                    <div
                      key={challenge.key}
                      className={`rounded-2xl border p-4 ${
                        complete
                          ? "border-emerald-400/30 bg-emerald-500/10"
                          : "border-white/10 bg-black/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold">{challenge.title}</div>
                          <div className="mt-1 text-xs text-white/55">{challenge.description}</div>
                        </div>
                        <div className="text-xs font-bold text-white/70">
                          {complete ? "DONE" : `${Math.min(progress, challenge.target)}/${challenge.target}`}
                        </div>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            complete ? "bg-emerald-400" : "bg-red-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Learned Profile</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Stat label="Messages" value={profile.totalMessages} />
                <Stat label="Repeats" value={profile.repeatedQuestions} />
                <Stat label="Survived" value={profile.survivedResponses} />
                <Stat label="Respect" value={profile.respectCount} />
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
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Learned Weak Spots</p>
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
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Top Survivors</p>
              <div className="mt-4 space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-white/45">
                    {hasSupabase ? "No scores yet." : "Connect Supabase for a global leaderboard."}
                  </p>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.player_name}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                    >
                      <div>
                        <div className="text-sm font-bold">
                          #{index + 1} {entry.player_name}
                        </div>
                        <div className="mt-1 text-xs text-white/45">
                          {entry.cook_level.toUpperCase()} · Survived: {entry.survived_responses} · Streak: {entry.best_streak}
                        </div>
                      </div>
                      <div className="text-right text-sm font-black text-red-300">{entry.score}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>

        {selectedRoast ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-neutral-950 p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300/80">$MAD Roast Card</p>
                  <h3 className="mt-2 text-2xl font-black">{username}</h3>
                  <p className="mt-1 text-sm text-white/55">
                    {archetype} · {cookLevel.toUpperCase()} · Score {score}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoast(null)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div
                className={`mt-5 rounded-[24px] border p-5 ${
                  selectedRoast.respected
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-red-500/20 bg-red-500/10"
                }`}
              >
                <p className="text-sm leading-7 text-white/95 whitespace-pre-wrap">
                  {selectedRoast.text}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => copyRoastCard(selectedRoast)}
                  className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400"
                >
                  Copy card
                </button>
                <button
                  onClick={() => copyText(selectedRoast.text)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/90 hover:bg-white/10"
                >
                  Copy roast only
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {copyToast ? (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs text-white/90 backdrop-blur">
            {copyToast}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="text-white/45">{label}</div>
      <div className="mt-1 text-xl font-black">{value}</div>
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
