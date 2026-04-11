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

function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();
  if (lower.includes("what is") || lower.includes("define")) {
    return "DEFINITION";
  }
  return "GENERAL";
}

function detectState(text: string): string[] {
  const lower = text.toLowerCase();
  const states: string[] = [];

  if (lower.includes("panic") || lower.includes("fear")) states.push("FEAR");
  if (lower.includes("regret")) states.push("REGRET");
  if (lower.includes("should i")) states.push("VALIDATION");
  if (lower.includes("100x") || lower.includes("moon")) states.push("GREED");
  if (lower.includes("maybe") || lower.includes("idk")) states.push("COPE");

  if (!states.length) states.push("GENERAL");

  return states.slice(0, 2);
}

function detectRespect(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("i was wrong") || lower.includes("i took action");
}

function wantsHarder(text: string): boolean {
  return text.toLowerCase().includes("harder");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const raw = sanitize(body.message);
    if (!raw) {
      return NextResponse.json({ output: "Say something real." });
    }

    const cookLevel: CookLevel = body.cookLevel || "crashout";
    const archetype = sanitize(body.archetype);
    const sessionId = sanitize(body.sessionId) || "anon";

    const harder = wantsHarder(raw);
    const message = raw.replace(/harder/gi, "").trim() || raw;

    const intent = detectIntent(message);
    const states = detectState(message);
    const respect = detectRespect(message);

    const prev = memory.get(sessionId);
    const escalation =
      harder ? 3 : prev && prev.last === message
        ? Math.min(prev.repeatCount + 1, 3)
        : 0;

    const input = `
MAD CANON:
${JSON.stringify(MAD_CANON)}

${buildStateLayer(states)}
${buildEscalationLayer(escalation)}
${buildContinuityLayer(prev?.recentStates || [], states)}
${buildCookLayer(cookLevel)}
${buildArchetypeLayer(archetype)}
${buildRespectLayer(respect)}
${buildDefinitionLayer(intent === "DEFINITION")}
${buildAntiRepetitionLayer(prev?.lastBot)}

${harder ? "Go colder. Go sharper. End it." : ""}

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
  } catch (err) {
    return NextResponse.json({ output: "Signal broke." });
  }
}
