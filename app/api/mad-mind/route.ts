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

type Intent = "DEFINITION" | "GENERAL";
type CookLevel = "mild" | "mean" | "crashout" | "demon";

type RequestBody = {
  message?: unknown;
  cookLevel?: unknown;
  username?: unknown;
  archetype?: unknown;
  sessionId?: unknown;
};

type MemoryEntry = {
  last: string;
  repeatCount: number;
  recentStates: string[];
  lastBot?: string;
  lastIntent?: Intent;
  lastCookLevel?: CookLevel;
  lastArchetype?: string;
};

type TrackEvent =
  | "message_sent"
  | "respect_mode_hit"
  | "say_it_harder_clicked"
  | "session_best_roast_selected";

type TrackValue = string | number | boolean | null;

const memory = new Map<string, MemoryEntry>();

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s$]/g, "").trim();
}

function isSimilar(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function wantsHarder(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("say it harder") ||
    lower.includes("harder") ||
    lower.includes("go harder") ||
    lower.includes("be harsher") ||
    lower.includes("more brutal") ||
    lower.includes("hit harder")
  );
}

function stripHarderPrompt(text: string): string {
  return text
    .replace(/say it harder/gi, "")
    .replace(/go harder/gi, "")
    .replace(/be harsher/gi, "")
    .replace(/more brutal/gi, "")
    .replace(/hit harder/gi, "")
    .replace(/\bharder\b/gi, "")
    .trim();
}

function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();

  if (
    lower.includes("what is $mad") ||
    lower.includes("what is mad") ||
    lower.includes("define $mad") ||
    lower.includes("define mad") ||
    lower.includes("what does $mad mean") ||
    lower.includes("what does mad mean")
  ) {
    return "DEFINITION";
  }

  return "GENERAL";
}

function detectState(text: string): string[] {
  const lower = text.toLowerCase();
  const states: string[] = [];

  if (
    lower.includes("panic") ||
    lower.includes("scared") ||
    lower.includes("afraid") ||
    lower.includes("fear")
  ) {
    states.push("FEAR");
  }

  if (
    lower.includes("regret") ||
    lower.includes("was i wrong") ||
    lower.includes("i was wrong")
  ) {
    states.push("REGRET");
  }

  if (
    lower.includes("should i") ||
    lower.includes("what should i do") ||
    lower.includes("be honest")
  ) {
    states.push("VALIDATION");
  }

  if (
    lower.includes("moon") ||
    lower.includes("100x") ||
    lower.includes("1000x")
  ) {
    states.push("GREED");
  }

  if (
    lower.includes("maybe") ||
    lower.includes("i think") ||
    lower.includes("not sure") ||
    lower.includes("idk")
  ) {
    states.push("COPE");
  }

  if (
    lower.includes("i stayed calm") ||
    lower.includes("i held") ||
    lower.includes("i stayed disciplined") ||
    lower.includes("i shipped") ||
    lower.includes("i posted") ||
    lower.includes("i took action")
  ) {
    states.push("DISCIPLINE");
  }

  if (states.length === 0) {
    states.push("GENERAL");
  }

  return states.slice(0, 2);
}

function detectRespect(text: string): boolean {
  const lower = text.toLowerCase();

  const accountable =
    lower.includes("i shipped") ||
    lower.includes("i posted") ||
    lower.includes("i took action") ||
    lower.includes("i was wrong") ||
    lower.includes("my fault") ||
    lower.includes("i need discipline") ||
    lower.includes("i need to focus") ||
    lower.includes("i'm fixing it") ||
    lower.includes("im fixing it");

  const victimTone =
    lower.includes("why me") ||
    lower.includes("unfair") ||
    lower.includes("everyone else") ||
    lower.includes("nobody") ||
    lower.includes("they did this");

  return accountable && !victimTone;
}

function buildIntentLayer(intent: Intent): string {
  if (intent !== "DEFINITION") return "";

  return `
INTENT: DEFINITION

The user is asking what $MAD is.

Do NOT fall back into repeated slogans.
Do NOT keep opening with "$MAD is what..."
Vary the angle:
- identity
- contrast
- consequence
- accusation
- verdict

If the first line defines, the second line should accuse, contrast, or imply.
`;
}

function buildCookLayer(cookLevel: CookLevel): string {
  if (cookLevel === "mild") {
    return `
COOK LEVEL: MILD

Be sharp, but controlled.
Prioritize cold judgment over cruelty.
`;
  }

  if (cookLevel === "mean") {
    return `
COOK LEVEL: MEAN

Be dismissive.
Punch cleanly.
Keep it quotable.
`;
  }

  if (cookLevel === "demon") {
    return `
COOK LEVEL: DEMON

Be severe.
Use colder contempt.
Make the reply feel dangerous, compact, and memorable.
`;
  }

  return `
COOK LEVEL: CRASHOUT

Be harsh, fast, and judgmental.
Favor exposure over comfort.
`;
}

function sanitizeCookLevel(value: unknown): CookLevel {
  if (
    value === "mild" ||
    value === "mean" ||
    value === "crashout" ||
    value === "demon"
  ) {
    return value;
  }

  return "crashout";
}

function sanitizeText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim().slice(0, 500) : fallback;
}

function makeMemoryKey(req: Request, sessionId: string): string {
  if (sessionId) return sessionId;

  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const userAgent = req.headers.get("user-agent") ?? "";
  return `${forwardedFor}::${userAgent}` || "anon";
}

async function trackServerEvent(
  req: Request,
  event: TrackEvent,
  payload: Record<string, TrackValue>
) {
  try {
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    await fetch(`${origin}/api/mad-track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("MAD server tracking failed:", error);
  }
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    const rawMessage = sanitizeText(body.message);
    const cookLevel = sanitizeCookLevel(body.cookLevel);
    const username = sanitizeText(body.username, "Anonymous Survivor");
    const archetype = sanitizeText(body.archetype, "Unknown");
    const sessionId = sanitizeText(body.sessionId);

    if (!rawMessage) {
      return NextResponse.json(
        { output: "Say something real." },
        { status: 400 }
      );
    }

    const harderRequested = wantsHarder(rawMessage);
    const cleanedMessage = harderRequested
      ? stripHarderPrompt(rawMessage)
      : rawMessage;

    const message = cleanedMessage || rawMessage;
    const intent = detectIntent(message);
    const states = detectState(message);
    const respectCandidate = detectRespect(message);

    const memoryKey = makeMemoryKey(req, sessionId);
    const prev = memory.get(memoryKey);
    const previousStates = prev?.recentStates ?? [];

    let escalation = 0;
    if (harderRequested) {
      escalation = 3;
    } else if (prev && isSimilar(prev.last, message)) {
      escalation = Math.min(prev.repeatCount + 1, 3);
    }

    const stateLayer = buildStateLayer(states);
    const escalationLayer = buildEscalationLayer(escalation);
    const continuityLayer = buildContinuityLayer(previousStates, states);
    const intentLayer = buildIntentLayer(intent);
    const cookLayer = buildCookLayer(cookLevel);

    const antiRepeatLayer = prev?.lastBot
      ? `
ANTI-REPETITION:

Your last response was:
"${prev.lastBot}"

Do not reuse the same sentence shape.
Do not restate the same slogan pattern.
Change the opening and second-line behavior.
`
      : "";

    const harderLayer = harderRequested
      ? `
HARDER MODE: ACTIVE

Be sharper.
Be less patient.
Do not get longer.
Do not soften.
Make the second line hit harder than the first.
`
      : "";

    const identityLayer = `
IDENTITY CONTEXT:
- username: ${username || "Anonymous Survivor"}
- archetype: ${archetype || "Unknown"}
- cook level: ${cookLevel}
`;

    const promptBody = `
MAD CANON:
${JSON.stringify(MAD_CANON, null, 2)}

${stateLayer}

${escalationLayer}

${continuityLayer}

${intentLayer}

${cookLayer}

${harderLayer}

${antiRepeatLayer}

${identityLayer}

RESPONSE CONSTRUCTION RULES:
- 1 to 3 lines max
- no bullet points
- no assistant phrasing
- no soft closers
- vary rhythm naturally
- prefer accusation over explanation
- prefer exposure over advice
- sometimes answer in one brutal sentence
- sometimes answer in two short lines
- sometimes answer in three lines with a philosophical finish
- do not let the second line fall back into a definition pattern
- if the first line defines, the second line should accuse, contrast, or imply
- avoid repeating "$MAD is what..." across consecutive replies
- favor lines that feel quotable and memorable

USER:
${message}

Respond in MAD Mind voice.
Keep it extremely short.
Sound like judgment.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: promptBody,
      metadata: {
        app: "mad-mind",
        cook_level: cookLevel,
        intent,
      },
      safety_identifier: sessionId || memoryKey,
    });

    const output =
      typeof response.output_text === "string"
        ? response.output_text.trim()
        : "";

    if (!output) {
      return NextResponse.json({
        output: "Signal lost.\nTry again.",
      });
    }

    memory.set(memoryKey, {
      last: message,
      repeatCount: escalation,
      recentStates: states,
      lastBot: output,
      lastIntent: intent,
      lastCookLevel: cookLevel,
      lastArchetype: archetype,
    });

    await trackServerEvent(req, "message_sent", {
      username,
      archetype,
      cookLevel,
      intent,
      message,
      botText: output,
      respected: respectCandidate,
      escalation,
      harderRequested,
      statePrimary: states[0] ?? "GENERAL",
      stateSecondary: states[1] ?? null,
      sessionId: sessionId || null,
    });

    if (harderRequested) {
      await trackServerEvent(req, "say_it_harder_clicked", {
        username,
        archetype,
        cookLevel,
        originalMessage: rawMessage,
        cleanedMessage: message,
        sessionId: sessionId || null,
      });
    }

    if (respectCandidate) {
      await trackServerEvent(req, "respect_mode_hit", {
        username,
        archetype,
        cookLevel,
        message,
        botText: output,
        sessionId: sessionId || null,
      });
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.error("MAD Mind API error:", error);

    return NextResponse.json(
      { output: "Signal broke.\nTry again." },
      { status: 500 }
    );
  }
}
