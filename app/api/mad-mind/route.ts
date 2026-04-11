import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MAD_CANON } from "./mad-canon";
import {
  SYSTEM_PROMPT,
  buildStateLayer,
  buildEscalationLayer,
  buildContinuityLayer,
} from "@/lib/mad-prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MemoryEntry = {
  last: string;
  count: number;
  recentStates: string[];
  lastBot?: string;
};

const memory = new Map<string, MemoryEntry>();

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function isSimilar(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function wantsHarder(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("harder");
}

function stripHarderPrompt(text: string): string {
  return text.replace(/harder/gi, "").trim();
}

/* 🔥 NEW — INTENT DETECTION */
function detectIntent(text: string): "DEFINITION" | "GENERAL" {
  const lower = text.toLowerCase();

  if (
    lower.includes("what is $mad") ||
    lower.includes("what is mad") ||
    lower.includes("define $mad") ||
    lower.includes("what does mad mean")
  ) {
    return "DEFINITION";
  }

  return "GENERAL";
}

function detectState(text: string): string[] {
  const lower = text.toLowerCase();

  if (lower.includes("panic") || lower.includes("scared")) return ["FEAR"];
  if (lower.includes("regret") || lower.includes("wrong")) return ["REGRET"];
  if (lower.includes("should i")) return ["VALIDATION"];
  if (lower.includes("100x") || lower.includes("moon")) return ["GREED"];

  return ["GENERAL"];
}

export async function POST(req: Request) {
  try {
    const { message: rawMessage } = await req.json();

    if (!rawMessage) {
      return NextResponse.json({ output: "Say something real." });
    }

    const harderRequested = wantsHarder(rawMessage);
    const cleanedMessage = stripHarderPrompt(rawMessage);

    const message = cleanedMessage || rawMessage;

    const intent = detectIntent(message); // 🔥 NEW

    const userId = "global"; // simple memory

    const prev = memory.get(userId);
    let escalation = 0;

    if (harderRequested) {
      escalation = 3;

      memory.set(userId, {
        last: message,
        count: 3,
        recentStates: [],
        lastBot: prev?.lastBot,
      });
    } else if (prev && isSimilar(prev.last, message)) {
      escalation = Math.min(prev.count + 1, 3);
    }

    const states = detectState(message);

    const stateLayer = buildStateLayer(states);
    const escalationLayer = buildEscalationLayer(escalation);
    const continuityLayer = buildContinuityLayer(
      prev?.recentStates ?? [],
      states
    );

    /* 🔥 HARDER MODE */
    const harderLayer = harderRequested
      ? `
HARDER MODE:

- remove patience
- cut deeper
- no slogans
- no repetition
- make it final
`
      : "";

    /* 🔥 ANTI-REPEAT */
    const antiRepeatLayer = prev?.lastBot
      ? `
Your last answer was:
"${prev.lastBot}"

Do NOT repeat it.
Use a different structure and angle.
`
      : "";

    /* 🔥 NEW — INTENT LAYER */
    const intentLayer =
      intent === "DEFINITION"
        ? `
INTENT: DEFINING $MAD

Do NOT reuse slogans like:
- controlled chaos
- feel everything / obey nothing

Instead rotate angles:
- identity (what you become)
- contrast (what it is NOT)
- consequence (what happens without it)
- separation (why most fail it)

Each answer must feel different.
`
        : "";

    const fullPrompt = `
${SYSTEM_PROMPT}

${stateLayer}
${escalationLayer}
${continuityLayer}
${harderLayer}
${antiRepeatLayer}
${intentLayer}

USER:
${message}

Respond in MAD Mind voice.
1–3 lines max.
Sound like judgment.
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: fullPrompt,
    });

    const output = response.output_text?.trim() || "Try again.";

    memory.set(userId, {
      last: message,
      count: escalation,
      recentStates: states,
      lastBot: output,
    });

    return NextResponse.json({ output });
  } catch (err) {
    return NextResponse.json({ output: "Signal broke." });
  }
}
