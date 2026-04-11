import { NextResponse } from "next/server";
import OpenAI from "openai";

import { MAD_CANON } from "./mad-canon";
import {
  SYSTEM_PROMPT,
  buildStateLayer,
  buildEscalationLayer,
  buildContinuityLayer,
  buildCookLayer,
  buildArchetypeLayer,
  buildRespectLayer,
  buildAntiRepetitionLayer,
  buildDefinitionLayer,
} from "@/lib/mad-prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Intent = "DEFINITION" | "GENERAL";
type CookLevel = "mild" | "mean" | "crashout" | "demon";

type MemoryEntry = {
  last: string;
  repeatCount: number;
  recentStates: string[];
  lastBot?: string;
};

const memory = new Map<string, MemoryEntry>();

function sanitize(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s$]/g, "").trim();
}

function isSimilar(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();

  if (
    lower.includes("what is $mad") ||
    lower.includes("what is mad") ||
    lower.includes("define $mad") ||
    lower.includes("define mad") ||
    lower.includes("what does $mad mean") ||
    lower.includes("what does mad mean") ||
    lower.includes("what is") ||
    lower.includes("define")
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

  if (
    lower.includes("ego") ||
    lower.includes("i know") ||
    lower.includes("obviously") ||
    lower.includes("i'm better") ||
    lower.includes("im better")
  ) {
    states.push("EGO");
  }

  if (
    lower.includes("hesitate") ||
    lower.includes("not ready") ||
    lower.includes("later") ||
    lower.includes("tomorrow") ||
    lower.includes("eventually")
  ) {
    states.push("HESITATION");
  }

  if (states.length === 0) {
    states.push("GENERAL");
  }

  return Array.from(new Set(states)).slice(0, 2);
}

function detectRespect(text: string): boolean {
  const lower = text.toLowerCase();

  return (
    lower.includes("i was wrong") ||
    lower.includes("my fault") ||
    lower.includes("i took action") ||
    lower.includes("i shipped") ||
    lower.includes("i posted") ||
    lower.includes("i stayed calm") ||
    lower.includes("i held") ||
    lower.includes("i stayed disciplined")
  );
}

function wantsHarder(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("say it harder") ||
    lower.includes("go harder") ||
    lower.includes("be harsher") ||
    lower.includes("more brutal") ||
    lower.includes("hit harder") ||
    lower === "harder"
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const raw = sanitize(body.message);
    if (!raw) {
      return NextResponse.json({ output: "Say something real." });
    }

    const cookLevel: CookLevel =
      body.cookLevel === "mild" ||
      body.cookLevel === "mean" ||
      body.cookLevel === "crashout" ||
      body.cookLevel === "demon"
        ? body.cookLevel
        : "crashout";

    const archetype = sanitize(body.archetype);
    const sessionId = sanitize(body.sessionId) || "anon";

    const harder = wantsHarder(raw);
    const message = harder ? stripHarderPrompt(raw) || raw : raw;

    const intent = detectIntent(message);
    const states = detectState(message);
    const respect = detectRespect(message);

    const prev = memory.get(sessionId);

    let escalation = 0;

    if (harder) {
      escalation = prev?.lastBot
        ? Math.min((prev.repeatCount || 0) + 2, 3)
        : 2;
    } else if (prev && isSimilar(prev.last, message)) {
      escalation = Math.min(prev.repeatCount + 1, 3);
    }

    const input = `
MAD CANON:
${JSON.stringify(MAD_CANON, null, 2)}

${buildStateLayer(states)}

${buildEscalationLayer(escalation)}

${buildContinuityLayer(prev?.recentStates || [], states)}

${buildCookLayer(cookLevel)}

${buildArchetypeLayer(archetype || undefined)}

${buildRespectLayer(respect)}

${buildDefinitionLayer(intent === "DEFINITION")}

${buildAntiRepetitionLayer(prev?.lastBot)}

${
  harder
    ? `
HARDER MODE:
Go shorter.
Go colder.
Hit harder.
Do not get longer.
Do not soften.
Make the last sentence feel final.
`
    : ""
}

RESPONSE CONSTRUCTION RULES:
- 1 to 3 sentences max
- no bullet points
- no assistant phrasing
- no soft closers
- vary rhythm naturally
- prefer accusation over explanation
- prefer exposure over advice
- sometimes answer in one brutal sentence
- sometimes answer in two short sentences
- sometimes answer in three sentences with a philosophical finish
- do not let the second sentence fall back into a definition pattern
- if the first sentence defines, the second sentence should accuse, contrast, or imply
- avoid repeating "$MAD is..." across consecutive replies
- favor lines that feel quotable and memorable

USER:
${message}
`;

    const res = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input,
    });

    const output = res.output_text?.trim() || "Say it again.";

    memory.set(sessionId, {
      last: message,
      repeatCount: escalation,
      recentStates: states,
      lastBot: output,
    });

    return NextResponse.json({ output });
  } catch (error) {
    console.error("MAD Mind route error:", error);
    return NextResponse.json({ output: "Signal broke." }, { status: 500 });
  }
}
