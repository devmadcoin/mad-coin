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
type MemoryEntry = {
  last: string;
  count: number;
  recentStates: string[];
  lastBot?: string;
};

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
    .replace(/harder/gi, "")
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
    lower.includes("i stayed disciplined")
  ) {
    states.push("DISCIPLINE");
  }

  if (states.length === 0) {
    states.push("GENERAL");
  }

  return states.slice(0, 2);
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

export async function POST(req: Request) {
  try {
    const body: { message?: unknown } = await req.json();
    const rawMessage =
      typeof body.message === "string" ? body.message.trim() : "";

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

    const userId =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("user-agent") ||
      "anon";

    const prev = memory.get(userId);
    const previousStates = prev?.recentStates ?? [];

    let escalation = 0;
    if (harderRequested) {
      escalation = 3;
    } else if (prev && isSimilar(prev.last, message)) {
      escalation = Math.min(prev.count + 1, 3);
    }

    const states = detectState(message);

    const stateLayer = buildStateLayer(states);
    const escalationLayer = buildEscalationLayer(escalation);
    const continuityLayer = buildContinuityLayer(previousStates, states);
    const intentLayer = buildIntentLayer(intent);

    const antiRepeatLayer = prev?.lastBot
      ? `
ANTI-REPETITION:

Your last response was:
"${prev.lastBot}"

Do not reuse the same sentence shape.
Do not restate the same slogan pattern.
Change the opening and the second-line behavior.
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

    const fullPrompt = `
${SYSTEM_PROMPT}

MAD CANON:
${JSON.stringify(MAD_CANON, null, 2)}

${stateLayer}

${escalationLayer}

${continuityLayer}

${intentLayer}

${harderLayer}

${antiRepeatLayer}

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
      input: fullPrompt,
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

    memory.set(userId, {
      last: message,
      count: escalation,
      recentStates: states,
      lastBot: output,
    });

    return NextResponse.json({ output });
  } catch (error) {
    console.error("MAD Mind API error:", error);

    return NextResponse.json(
      { output: "Signal broke.\nTry again." },
      { status: 500 }
    );
  }
}
