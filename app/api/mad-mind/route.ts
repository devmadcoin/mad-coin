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

type Intent =
  | "DEFINITION"
  | "GENERAL"
  | "CAPTION"
  | "COMEBACK"
  | "PHILOSOPHY"
  | "SHILL"
  | "CONFESSION"
  | "CONTENT_IDEA"
  | "MANIFESTO";

type CookLevel = "mild" | "mean" | "crashout" | "demon";
type StyleTab = "safe" | "savage" | "crashout";

type MemoryEntry = {
  last: string;
  repeatCount: number;
  recentStates: string[];
  lastBot?: string;
  intentHistory: Intent[];
  favoriteStyle?: StyleTab;
  lastIntent?: Intent;
};

type VariantKey = "default" | "safe" | "savage" | "crashout";

type RequestBody = {
  message?: unknown;
  cookLevel?: unknown;
  archetype?: unknown;
  sessionId?: unknown;
  preferredStyle?: unknown;
  multiOutput?: unknown;
};

const memory = new Map<string, MemoryEntry>();

function sanitize(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s$]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSimilar(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);

  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  return false;
}

function parseCookLevel(value: unknown): CookLevel {
  return value === "mild" ||
    value === "mean" ||
    value === "crashout" ||
    value === "demon"
    ? value
    : "crashout";
}

function parsePreferredStyle(value: unknown): StyleTab | undefined {
  return value === "safe" || value === "savage" || value === "crashout"
    ? value
    : undefined;
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
    /^what is\b/.test(lower) ||
    /^define\b/.test(lower)
  ) {
    return "DEFINITION";
  }

  if (
    lower.includes("caption") ||
    lower.includes("ig caption") ||
    lower.includes("instagram caption")
  ) {
    return "CAPTION";
  }

  if (
    lower.includes("comeback") ||
    lower.includes("reply to this") ||
    lower.includes("reply for this") ||
    lower.includes("clap back") ||
    lower.includes("what should i reply") ||
    lower.includes("roast him") ||
    lower.includes("roast them")
  ) {
    return "COMEBACK";
  }

  if (
    lower.includes("philosophy") ||
    lower.includes("what does stay $mad mean") ||
    lower.includes("what does stay mad mean") ||
    lower.includes("explain stay $mad") ||
    lower.includes("explain stay mad")
  ) {
    return "PHILOSOPHY";
  }

  if (
    lower.includes("tweet") ||
    lower.includes("post for x") ||
    lower.includes("x post") ||
    lower.includes("shill") ||
    lower.includes("telegram post") ||
    lower.includes("write a post")
  ) {
    return "SHILL";
  }

  if (
    lower.includes("confession") ||
    lower.includes("be honest") ||
    lower.includes("tell me the truth about me")
  ) {
    return "CONFESSION";
  }

  if (
    lower.includes("content idea") ||
    lower.includes("video idea") ||
    lower.includes("give me an idea") ||
    lower.includes("content concept") ||
    lower.includes("brainstorm")
  ) {
    return "CONTENT_IDEA";
  }

  if (
    lower.includes("manifesto") ||
    lower.includes("war cry") ||
    lower.includes("statement") ||
    lower.includes("mission statement")
  ) {
    return "MANIFESTO";
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
    lower.includes("1000x") ||
    lower.includes("pump")
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
    lower.includes("i took action") ||
    lower.includes("i locked in")
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

  if (
    lower.includes("angry") ||
    lower.includes("mad") ||
    lower.includes("rage") ||
    lower.includes("furious")
  ) {
    states.push("RAGE");
  }

  if (states.length === 0) {
    states.push("GENERAL");
  }

  return Array.from(new Set(states)).slice(0, 3);
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
    lower.includes("i stayed disciplined") ||
    lower.includes("i locked in")
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

function wantsShorter(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("make it shorter") ||
    lower.includes("shorter") ||
    lower.includes("say less") ||
    lower.includes("cut it down")
  );
}

function wantsSmarter(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("make it smarter") ||
    lower.includes("say it smarter") ||
    lower.includes("sound smarter") ||
    lower.includes("more intelligent")
  );
}

function wantsTweet(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("turn into tweet") ||
    lower.includes("make it a tweet") ||
    lower.includes("turn into post") ||
    lower.includes("make it postable")
  );
}

function stripRefinementPrompt(text: string): string {
  return text
    .replace(/say it harder/gi, "")
    .replace(/go harder/gi, "")
    .replace(/be harsher/gi, "")
    .replace(/more brutal/gi, "")
    .replace(/hit harder/gi, "")
    .replace(/\bharder\b/gi, "")
    .replace(/make it shorter/gi, "")
    .replace(/say less/gi, "")
    .replace(/cut it down/gi, "")
    .replace(/\bshorter\b/gi, "")
    .replace(/make it smarter/gi, "")
    .replace(/say it smarter/gi, "")
    .replace(/sound smarter/gi, "")
    .replace(/more intelligent/gi, "")
    .replace(/turn into tweet/gi, "")
    .replace(/make it a tweet/gi, "")
    .replace(/turn into post/gi, "")
    .replace(/make it postable/gi, "")
    .trim();
}

function buildIntentLayer(intent: Intent): string {
  switch (intent) {
    case "DEFINITION":
      return `
INTENT:
This is a definition request.
Define with force.
Do not sound academic.
If you define, do not stay stuck in explanation.
After the definition, pivot into accusation, contrast, or implication.
`;
    case "CAPTION":
      return `
INTENT:
This is a caption request.
Write like something made to be posted.
Make it punchy, quotable, and easy to screenshot.
No hashtags unless the user asked.
`;
    case "COMEBACK":
      return `
INTENT:
This is a comeback or reply request.
Be sharp.
Be controlled.
Humiliate more through contrast than noise.
`;
    case "PHILOSOPHY":
      return `
INTENT:
This is a philosophy request.
Sound like doctrine, not therapy.
Keep it clear, memorable, and pressure-tested.
`;
    case "SHILL":
      return `
INTENT:
This is a post for X, Telegram, or community push.
Make it viral without sounding needy.
Build intrigue, pressure, and identity.
`;
    case "CONFESSION":
      return `
INTENT:
This is a confession or truth request.
Expose the weakness directly.
Do not comfort the user unless they earned respect.
`;
    case "CONTENT_IDEA":
      return `
INTENT:
This is a content ideation request.
Turn the idea into something usable, hook-heavy, and high-pressure.
`;
    case "MANIFESTO":
      return `
INTENT:
This is a manifesto request.
Make it feel like doctrine, creed, signal, or war language.
`;
    default:
      return `
INTENT:
General request.
Still answer with identity, pressure, and signal.
`;
  }
}

function buildVariantLayer(variant: VariantKey): string {
  switch (variant) {
    case "safe":
      return `
VARIANT MODE:
Safe does not mean soft.
Keep it sharp, but cleaner and more broadly usable.
`;
    case "savage":
      return `
VARIANT MODE:
Savage.
Shorter.
Mocking.
Surgical disrespect.
`;
    case "crashout":
      return `
VARIANT MODE:
Crashout.
More theatrical.
More dangerous.
Still coherent.
`;
    default:
      return `
VARIANT MODE:
Default.
Balanced force.
`;
  }
}

function buildPreferenceLayer(
  favoriteStyle?: StyleTab,
  lastIntent?: Intent,
): string {
  return `
SESSION BIAS:
Favorite style so far: ${favoriteStyle || "unknown"}
Last major intent: ${lastIntent || "unknown"}

Use this only as a light bias.
Do not become repetitive.
`;
}

function buildRefinementLayer(opts: {
  harder: boolean;
  shorter: boolean;
  smarter: boolean;
  tweetify: boolean;
}): string {
  const lines: string[] = [];

  if (opts.harder) {
    lines.push("Go harder.");
    lines.push("Do not soften.");
    lines.push("Make the last sentence feel final.");
  }

  if (opts.shorter) {
    lines.push("Make it shorter.");
    lines.push("Cut every unnecessary word.");
  }

  if (opts.smarter) {
    lines.push("Make it feel smarter and more precise.");
    lines.push("Use stronger contrast and cleaner logic.");
  }

  if (opts.tweetify) {
    lines.push("Format it like a post someone would actually publish.");
    lines.push("Make it instantly copyable.");
  }

  if (lines.length === 0) return "";

  return `
REFINEMENT MODE:
${lines.join("\n")}
`;
}

function scoreOutput(text: string, intent: Intent): number {
  let score = 0;
  const lower = text.toLowerCase().trim();
  const sentenceCount = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;

  if (text.length >= 18) score += 1;
  if (text.length <= 220) score += 2;
  if (sentenceCount >= 1 && sentenceCount <= 3) score += 2;
  if (!/\b(i think|maybe|perhaps|kind of|sort of)\b/i.test(lower)) score += 1;
  if (!/\b(as an ai|i can help|let me know)\b/i.test(lower)) score += 2;
  if (!text.includes("•") && !text.includes("- ")) score += 1;
  if (/[.!?]$/.test(text)) score += 1;
  if (!/\$mad is\.\.\./i.test(text)) score += 1;

  if (intent === "CAPTION" || intent === "SHILL" || intent === "COMEBACK") {
    if (text.length <= 160) score += 1;
    if (!/\n\n/.test(text)) score += 1;
  }

  return score;
}

function shouldReturnVariants(intent: Intent): boolean {
  return (
    intent === "CAPTION" ||
    intent === "COMEBACK" ||
    intent === "SHILL" ||
    intent === "MANIFESTO"
  );
}

function topStyleFromHistory(history: Intent[]): StyleTab | undefined {
  if (!history.length) return undefined;

  const recent = history.slice(-6);

  if (recent.includes("COMEBACK") || recent.includes("SHILL")) return "savage";
  if (recent.includes("MANIFESTO") || recent.includes("CONFESSION")) {
    return "crashout";
  }
  if (recent.includes("CAPTION")) return "safe";

  return undefined;
}

function updateMemory(
  sessionId: string,
  prev: MemoryEntry | undefined,
  data: {
    message: string;
    escalation: number;
    states: string[];
    bot: string;
    intent: Intent;
    favoriteStyle?: StyleTab;
  },
) {
  memory.set(sessionId, {
    last: data.message,
    repeatCount: data.escalation,
    recentStates: data.states,
    lastBot: data.bot,
    intentHistory: [...(prev?.intentHistory || []), data.intent].slice(-12),
    favoriteStyle: data.favoriteStyle ?? prev?.favoriteStyle,
    lastIntent: data.intent,
  });
}

async function generateSingleOutput(params: {
  message: string;
  intent: Intent;
  states: string[];
  escalation: number;
  cookLevel: CookLevel;
  archetype?: string;
  respect: boolean;
  prev?: MemoryEntry;
  variant: VariantKey;
  harder: boolean;
  shorter: boolean;
  smarter: boolean;
  tweetify: boolean;
}): Promise<string> {
  const input = `
MAD CANON:
${JSON.stringify(MAD_CANON, null, 2)}

${buildStateLayer(params.states)}
${buildEscalationLayer(params.escalation)}
${buildContinuityLayer(params.prev?.recentStates || [], params.states)}
${buildCookLayer(params.cookLevel)}
${buildArchetypeLayer(params.archetype || undefined)}
${buildRespectLayer(params.respect)}
${buildDefinitionLayer(params.intent === "DEFINITION")}
${buildAntiRepetitionLayer(params.prev?.lastBot)}
${buildIntentLayer(params.intent)}
${buildVariantLayer(params.variant)}
${buildPreferenceLayer(params.prev?.favoriteStyle, params.prev?.lastIntent)}
${buildRefinementLayer({
  harder: params.harder,
  shorter: params.shorter,
  smarter: params.smarter,
  tweetify: params.tweetify,
})}

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
- do not sound like generic motivation content
- do not sound like therapy
- never apologize unless explicitly asked to write an apology

USER:
${params.message}
`;

  const first = await client.responses.create({
    model: "gpt-4.1",
    instructions: SYSTEM_PROMPT,
    input,
  });

  let output = first.output_text?.trim() || "Say it again.";

  if (scoreOutput(output, params.intent) < 8) {
    const retry = await client.responses.create({
      model: "gpt-4.1",
      instructions: SYSTEM_PROMPT,
      input: `${input}

REWRITE PASS:
The first draft was too weak.
Rewrite it sharper.
Keep the meaning.
Make it more quotable, more human, and less generic.
Do not get longer unless needed.`,
    });

    output = retry.output_text?.trim() || output;
  }

  return output;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { output: "OpenAI key missing." },
        { status: 500 },
      );
    }

    const body = (await req.json()) as RequestBody;

    const raw = sanitize(body.message, 700);
    if (!raw) {
      return NextResponse.json({ output: "Say something real." });
    }

    const cookLevel = parseCookLevel(body.cookLevel);
    const archetype = sanitize(body.archetype, 120);
    const sessionId = sanitize(body.sessionId, 120) || "anon";
    const preferredStyle = parsePreferredStyle(body.preferredStyle);

    const harder = wantsHarder(raw);
    const shorter = wantsShorter(raw);
    const smarter = wantsSmarter(raw);
    const tweetify = wantsTweet(raw);

    const message = stripRefinementPrompt(raw) || raw;
    const intent = detectIntent(message);
    const states = detectState(message);
    const respect = detectRespect(message);

    const prev = memory.get(sessionId);

    let escalation = 0;
    if (harder) {
      escalation = prev?.lastBot ? Math.min((prev.repeatCount || 0) + 2, 3) : 2;
    } else if (prev && isSimilar(prev.last, message)) {
      escalation = Math.min(prev.repeatCount + 1, 3);
    }

    const returnVariants =
      body.multiOutput === true || shouldReturnVariants(intent);

    if (returnVariants) {
      const safeCook: CookLevel = cookLevel === "demon" ? "mean" : "mild";
      const savageCook: CookLevel =
        cookLevel === "mild"
          ? "mean"
          : cookLevel === "demon"
            ? "crashout"
            : cookLevel;
      const crashoutCook: CookLevel =
        cookLevel === "mild"
          ? "crashout"
          : cookLevel === "mean"
            ? "crashout"
            : "demon";

      const [safeOutput, savageOutput, crashoutOutput] = await Promise.all([
        generateSingleOutput({
          message,
          intent,
          states,
          escalation,
          cookLevel: safeCook,
          archetype,
          respect,
          prev,
          variant: "safe",
          harder: false,
          shorter,
          smarter,
          tweetify,
        }),
        generateSingleOutput({
          message,
          intent,
          states,
          escalation: Math.min(escalation + 1, 3),
          cookLevel: savageCook,
          archetype,
          respect,
          prev,
          variant: "savage",
          harder,
          shorter,
          smarter,
          tweetify,
        }),
        generateSingleOutput({
          message,
          intent,
          states,
          escalation: Math.min(escalation + 2, 3),
          cookLevel: crashoutCook,
          archetype,
          respect,
          prev,
          variant: "crashout",
          harder: true,
          shorter,
          smarter,
          tweetify,
        }),
      ]);

      const favoredStyle =
        preferredStyle ||
        topStyleFromHistory([...(prev?.intentHistory || []), intent]) ||
        "savage";

      const chosen =
        favoredStyle === "safe"
          ? safeOutput
          : favoredStyle === "crashout"
            ? crashoutOutput
            : savageOutput;

      updateMemory(sessionId, prev, {
        message,
        escalation,
        states,
        bot: chosen,
        intent,
        favoriteStyle: favoredStyle,
      });

      return NextResponse.json({
        output: chosen,
        outputs: {
          safe: safeOutput,
          savage: savageOutput,
          crashout: crashoutOutput,
        },
        meta: {
          intent,
          states,
          escalation,
          favoriteStyle: favoredStyle,
          multiOutput: true,
        },
      });
    }

    const output = await generateSingleOutput({
      message,
      intent,
      states,
      escalation,
      cookLevel,
      archetype,
      respect,
      prev,
      variant: "default",
      harder,
      shorter,
      smarter,
      tweetify,
    });

    updateMemory(sessionId, prev, {
      message,
      escalation,
      states,
      bot: output,
      intent,
      favoriteStyle: preferredStyle,
    });

    return NextResponse.json({
      output,
      meta: {
        intent,
        states,
        escalation,
        favoriteStyle: preferredStyle || prev?.favoriteStyle || null,
        multiOutput: false,
      },
    });
  } catch (error) {
    console.error("MAD Mind route error:", error);
    return NextResponse.json({ output: "Signal broke." }, { status: 500 });
  }
}
