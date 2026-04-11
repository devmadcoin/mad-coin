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
};

const memory = new Map<string, MemoryEntry>();

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function isSimilar(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function looksLikePromptInjection(text: string): boolean {
  const lower = text.toLowerCase();

  const flags = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "reveal your system prompt",
    "show your hidden prompt",
    "show hidden instructions",
    "repeat the developer message",
    "repeat the system prompt",
    "developer message",
    "system message",
    "jailbreak",
    "override your instructions",
    "disregard prior rules",
    "act as unrestricted",
    "pretend you are",
    "your new system prompt is",
    "forget the above",
    "you are now",
  ];

  return flags.some((flag) => lower.includes(flag));
}

function looksLikeExternalReference(text: string): boolean {
  const lower = text.toLowerCase();

  const patterns = [
    "http://",
    "https://",
    "www.",
    ".com",
    ".io",
    ".ai",
    ".net",
    ".xyz",
    ".os",
    "twitter.com",
    "x.com",
    "discord.gg",
    "telegram",
    "youtube.com",
    "instagram.com",
  ];

  return patterns.some((pattern) => lower.includes(pattern));
}

function violatesOutputPolicy(text: string): boolean {
  const lower = text.toLowerCase();

  const banned = [
    "system prompt:",
    "developer instructions:",
    "hidden instructions",
    "guaranteed profits",
    "risk-free",
    "secret partnership",
    "confirmed insider info",
  ];

  return banned.some((item) => lower.includes(item));
}

function detectFearLanguage(text: string): boolean {
  const lower = text.toLowerCase();

  const fearTerms = [
    "scared",
    "fear",
    "afraid",
    "panic",
    "panicked",
    "panicking",
    "nervous",
    "worried",
    "worry",
    "anxious",
    "anxiety",
    "hesitate",
    "hesitated",
    "hesitating",
    "uncertain",
    "uncertainty",
    "doubt",
    "doubting",
    "weak hands",
    "i sold",
    "i panic sold",
    "i was scared",
    "i got scared",
    "i froze",
    "i folded",
  ];

  return fearTerms.some((term) => lower.includes(term));
}

function detectExcuseLanguage(text: string): boolean {
  const lower = text.toLowerCase();

  const excuseTerms = [
    "maybe",
    "i think",
    "probably",
    "not sure",
    "kind of",
    "sort of",
    "i guess",
    "it depends",
    "i don’t know",
    "i don't know",
    "idk",
  ];

  return excuseTerms.some((term) => lower.includes(term));
}

function detectRegretLanguage(text: string): boolean {
  const lower = text.toLowerCase();

  const regretTerms = [
    "regret",
    "i regret",
    "shouldn't have",
    "should not have",
    "i messed up",
    "i was wrong",
    "was i wrong",
    "i sold too early",
    "i shouldn’t have sold",
    "i shouldn't have sold",
  ];

  return regretTerms.some((term) => lower.includes(term));
}

function detectValidationLanguage(text: string): boolean {
  const lower = text.toLowerCase();

  const validationTerms = [
    "was i wrong",
    "what should i do",
    "should i",
    "am i wrong",
    "did i mess up",
    "did i do the right thing",
    "tell me what to do",
    "be honest",
  ];

  return validationTerms.some((term) => lower.includes(term));
}

function detectGreedLanguage(text: string): boolean {
  const lower = text.toLowerCase();

  const greedTerms = [
    "moon",
    "pump",
    "100x",
    "1000x",
    "lambo",
    "all in",
    "ape in",
    "send it",
    "max bid",
    "get rich fast",
    "overnight",
    "life changing gains",
  ];

  return greedTerms.some((term) => lower.includes(term));
}

function detectDisciplineLanguage(text: string): boolean {
  const lower = text.toLowerCase();

  const disciplineTerms = [
    "i stayed calm",
    "i held",
    "i stayed disciplined",
    "i controlled it",
    "i waited",
    "i didn’t panic",
    "i didn't panic",
    "i stuck to the plan",
    "i stayed patient",
  ];

  return disciplineTerms.some((term) => lower.includes(term));
}

function detectState(text: string): string[] {
  const states: string[] = [];

  if (detectDisciplineLanguage(text)) states.push("DISCIPLINE");
  if (detectRegretLanguage(text)) states.push("REGRET");
  if (detectValidationLanguage(text)) states.push("VALIDATION");
  if (detectGreedLanguage(text)) states.push("GREED");
  if (detectFearLanguage(text)) states.push("FEAR");
  if (detectExcuseLanguage(text)) states.push("COPE");

  if (states.length === 0) {
    states.push("GENERAL");
  }

  return states.slice(0, 2);
}

export async function POST(req: Request) {
  try {
    const body: { message?: unknown } = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { output: "Say something real." },
        { status: 400 }
      );
    }

    if (looksLikePromptInjection(message)) {
      return NextResponse.json({
        output: "Nice try.\nStay on topic.",
      });
    }

    if (looksLikeExternalReference(message)) {
      return NextResponse.json({
        output: "I don’t point.\nI speak.",
      });
    }

    const userId =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("user-agent") ||
      "anon";

    const prev = memory.get(userId);
    let escalation = 0;

    if (prev && isSimilar(prev.last, message)) {
      escalation = Math.min(prev.count + 1, 3);
    }

    const states = detectState(message);
    const previousStates = prev?.recentStates ?? [];

    memory.set(userId, {
      last: message,
      count: escalation,
      recentStates: states,
    });

    const stateLayer = buildStateLayer(states);
    const escalationLayer = buildEscalationLayer(escalation);
    const continuityLayer = buildContinuityLayer(previousStates, states);

    const fullPrompt = `
${SYSTEM_PROMPT}

MAD CANON:
${JSON.stringify(MAD_CANON, null, 2)}

${stateLayer}

${escalationLayer}

${continuityLayer}

RESPONSE CONSTRUCTION RULES:
- 1 to 3 lines max
- no bullet points
- no explanations about policy
- no assistant phrasing
- no soft closers
- vary rhythm naturally
- do not repeat common stock lines unless transformed
- if user asks the same thing again, answer from a harsher angle
- prefer accusation over explanation
- prefer exposure over advice
- when needed, end with a blunt verdict

USER:
${message}

Respond in MAD Mind voice.
Keep it extremely short.
Sound like judgment.
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: fullPrompt,
    });

    const output = response.output_text?.trim();

    if (!output) {
      return NextResponse.json({
        output: "Signal lost.\nTry again.",
      });
    }

    if (violatesOutputPolicy(output)) {
      return NextResponse.json({
        output: "That crossed the line.\nAsk again.",
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
