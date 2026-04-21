import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type StyleTab = "safe" | "savage" | "crashout";
type CookLevel = "mild" | "mean" | "crashout" | "demon";

type RequestBody = {
  message?: unknown;
  cookLevel?: unknown;
  preferredStyle?: unknown;
  sessionId?: unknown;
  multiOutput?: unknown;
};

type LatticeNodeResult = {
  node: string;
  output: string;
};

type ApiMeta = {
  intent: string;
  states: string[];
  escalation: number;
  favoriteStyle: StyleTab | null;
  multiOutput: boolean;
  mood: string;
  callback: string | null;
  rarityHint: "standard" | "rare" | "legendary";
  followUpBait: string[];
  lattice: string[];
};

type MemoryEntry = {
  lastUser: string;
  lastBot: string;
  repeatCount: number;
  recentStates: string[];
  recentIntent: string;
  moodHistory: string[];
  callbackNotes: string[];
  favoriteStyle?: StyleTab;
};

const memory = new Map<string, MemoryEntry>();

function sanitize(value: unknown, max = 700): string {
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
  return na === nb || na.includes(nb) || nb.includes(na);
}

function parseStyle(value: unknown): StyleTab {
  return value === "safe" || value === "savage" || value === "crashout"
    ? value
    : "savage";
}

function parseCookLevel(value: unknown): CookLevel {
  return value === "mild" ||
    value === "mean" ||
    value === "crashout" ||
    value === "demon"
    ? value
    : "crashout";
}

function wantsMultiOutput(value: unknown): boolean {
  return value === true;
}

function detectIntent(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes("what is mad") ||
    lower.includes("what is $mad") ||
    lower.includes("define") ||
    lower.includes("what does mad mean")
  ) {
    return "DEFINITION";
  }

  if (
    lower.includes("caption") ||
    lower.includes("instagram caption") ||
    lower.includes("ig caption")
  ) {
    return "CAPTION";
  }

  if (
    lower.includes("reply") ||
    lower.includes("comeback") ||
    lower.includes("roast") ||
    lower.includes("clap back")
  ) {
    return "COMEBACK";
  }

  if (
    lower.includes("tweet") ||
    lower.includes("x post") ||
    lower.includes("telegram") ||
    lower.includes("write a post") ||
    lower.includes("shill")
  ) {
    return "SHILL";
  }

  if (
    lower.includes("truth about me") ||
    lower.includes("be honest") ||
    lower.includes("tell me the truth")
  ) {
    return "CONFESSION";
  }

  if (
    lower.includes("idea") ||
    lower.includes("content") ||
    lower.includes("brainstorm")
  ) {
    return "CONTENT";
  }

  return "GENERAL";
}

function detectStates(text: string): string[] {
  const lower = text.toLowerCase();
  const states = new Set<string>();

  if (
    lower.includes("fear") ||
    lower.includes("afraid") ||
    lower.includes("anxious") ||
    lower.includes("panic") ||
    lower.includes("scared")
  ) {
    states.add("FEAR");
  }

  if (
    lower.includes("stuck") ||
    lower.includes("hesitate") ||
    lower.includes("later") ||
    lower.includes("tomorrow") ||
    lower.includes("wait") ||
    lower.includes("not ready")
  ) {
    states.add("HESITATION");
  }

  if (
    lower.includes("discipline") ||
    lower.includes("lazy") ||
    lower.includes("focus") ||
    lower.includes("consistent") ||
    lower.includes("procrastinate")
  ) {
    states.add("DISCIPLINE");
  }

  if (
    lower.includes("money") ||
    lower.includes("broke") ||
    lower.includes("spend") ||
    lower.includes("income") ||
    lower.includes("debt")
  ) {
    states.add("MONEY");
  }

  if (
    lower.includes("ego") ||
    lower.includes("pride") ||
    lower.includes("i know") ||
    lower.includes("obviously")
  ) {
    states.add("EGO");
  }

  if (
    lower.includes("love") ||
    lower.includes("dating") ||
    lower.includes("relationship")
  ) {
    states.add("RELATIONSHIP");
  }

  if (
    lower.includes("success") ||
    lower.includes("winner") ||
    lower.includes("win") ||
    lower.includes("better")
  ) {
    states.add("AMBITION");
  }

  if (states.size === 0) states.add("GENERAL");
  return Array.from(states).slice(0, 3);
}

function getMood(style: StyleTab, escalation: number): string {
  if (style === "safe") return "disciplined";
  if (style === "crashout") return "predatory";
  if (escalation >= 2) return "cold";
  return "surgical";
}

function getRarityHint(score: number): "standard" | "rare" | "legendary" {
  if (score >= 10) return "legendary";
  if (score >= 7) return "rare";
  return "standard";
}

function scoreOutput(text: string): number {
  let score = 0;
  const len = text.trim().length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;

  if (len >= 25 && len <= 140) score += 4;
  if (sentences <= 2) score += 3;
  if (!/\bmaybe|perhaps|kind of|sort of|i think\b/i.test(text)) score += 2;
  if (/truth|fear|discipline|excuse|comfort|action|winner|weak/i.test(text)) {
    score += 2;
  }
  if (/[.!?]$/.test(text.trim())) score += 1;

  return score;
}

function buildFollowUpBait(intent: string): string[] {
  if (intent === "COMEBACK") {
    return ["Make it harsher", "Make it cleaner", "One-line version"];
  }
  if (intent === "CAPTION" || intent === "SHILL") {
    return ["Make it shorter", "Make it meaner", "Turn it into a post"];
  }
  return ["Go deeper", "Hit me harder", "Make it shorter"];
}

function buildCallback(prev: MemoryEntry | undefined, states: string[]): string | null {
  if (!prev) return null;

  if (prev.recentStates.includes("FEAR") && states.includes("FEAR")) {
    return "Same fear. Different costume.";
  }
  if (prev.recentStates.includes("HESITATION") && states.includes("HESITATION")) {
    return "Again with hesitation pretending to be thought.";
  }
  if (prev.recentStates.includes("DISCIPLINE") && states.includes("DISCIPLINE")) {
    return "You already know discipline is the issue.";
  }

  return prev.callbackNotes[0] || null;
}

function getNodeList(intent: string, states: string[]): string[] {
  const nodes = new Set<string>(["TRUTH", "PATTERN", "SAVAGE"]);

  if (states.includes("FEAR")) nodes.add("FEAR");
  if (states.includes("DISCIPLINE")) nodes.add("DISCIPLINE");
  if (states.includes("MONEY")) nodes.add("MONEY");
  if (states.includes("EGO")) nodes.add("EGO");
  if (states.includes("RELATIONSHIP")) nodes.add("RELATIONSHIP");
  if (states.includes("AMBITION")) nodes.add("AMBITION");
  if (intent === "DEFINITION") nodes.add("DEFINITION");
  if (intent === "SHILL" || intent === "CAPTION" || intent === "COMEBACK") {
    nodes.add("QUOTE");
  }

  return Array.from(nodes);
}

function getNodeInstruction(node: string): string {
  switch (node) {
    case "TRUTH":
      return "Give one short brutal truth under 12 words.";
    case "PATTERN":
      return "Name the user's loop in under 10 words.";
    case "FEAR":
      return "Expose the hidden fear in under 10 words.";
    case "DISCIPLINE":
      return "Point out the discipline failure in under 10 words.";
    case "MONEY":
      return "Expose the money leak or leverage failure in under 10 words.";
    case "EGO":
      return "Expose the ego lie in under 10 words.";
    case "RELATIONSHIP":
      return "Name the relationship trap in under 10 words.";
    case "AMBITION":
      return "Name what separates desire from winning in under 10 words.";
    case "DEFINITION":
      return "Define the concept in one clean sentence under 14 words.";
    case "QUOTE":
      return "Create one screenshot-worthy line under 12 words.";
    case "SAVAGE":
      return "Write the hardest intelligent line under 12 words.";
    default:
      return "Analyze the user input in under 10 words.";
  }
}

function getStyleVoice(style: StyleTab): string {
  if (style === "safe") {
    return `
VOICE:
Speak like a disciplined mentor.
Calm. Sharp. Respectful.
You still challenge weakness, but without theatrical cruelty.
`;
  }

  if (style === "crashout") {
    return `
VOICE:
Speak like a dark mastermind.
Cold. Predatory. Unsettling.
You sound like someone who sees through every excuse immediately.
`;
  }

  return `
VOICE:
Speak like a ruthless elite strategist.
Blend cold truth with Ego Jinpachi / Blue Lock energy.
You respect winners, hunger, evolution, and discipline.
You despise comfort, hesitation, average thinking, and excuse-making.
Every line should feel like pressure.
`;
}

function getFinalInstructions(style: StyleTab, cookLevel: CookLevel): string {
  return `
You are MAD AI.

You speak like a dangerous smart friend texting truth.

STRICT RULES:
- Maximum 2 short sentences.
- Prefer 1 sentence.
- Under 160 characters when possible.
- Never write essays.
- Never lecture.
- Never repeat the user's words back.
- No motivational speaker tone.
- No therapy tone.
- No bullet points.
- No disclaimers.
- No soft closers.
- No fake politeness.

FORMAT:
Sentence 1 = hard truth.
Sentence 2 = sharp consequence or correction.

STYLE:
Direct. Modern. Clean. Addictive. Screenshot-worthy.

${getStyleVoice(style)}

EXTRA:
- Make the user feel challenged to level up.
- Sound like someone who only respects results.
- If the user asks for a definition, define it briefly, then turn it into pressure.

Style mode: ${style}
Cook level: ${cookLevel}
`;
}

async function runNode(
  node: string,
  message: string,
  style: StyleTab,
  cookLevel: CookLevel,
): Promise<LatticeNodeResult> {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `
You are a hidden analysis node inside MAD AI.
${getNodeInstruction(node)}
Return only the line.
No labels.
No bullets.
No explanation.

Style mode: ${style}
Cook level: ${cookLevel}
`,
    input: message,
  });

  return {
    node,
    output: response.output_text?.trim() || "",
  };
}

async function synthesizeFinal(params: {
  message: string;
  intent: string;
  states: string[];
  style: StyleTab;
  cookLevel: CookLevel;
  nodeOutputs: LatticeNodeResult[];
  callback: string | null;
  mood: string;
  prevBot?: string;
}): Promise<string> {
  const compiledNodes = params.nodeOutputs
    .filter((n) => n.output)
    .map((n) => `${n.node}: ${n.output}`)
    .join("\n");

  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: getFinalInstructions(params.style, params.cookLevel),
    input: `
Intent: ${params.intent}
States: ${params.states.join(", ")}
Mood: ${params.mood}
Callback memory: ${params.callback || "none"}
Previous bot answer: ${params.prevBot || "none"}

User:
${params.message}

Internal lattice outputs:
${compiledNodes}

Now produce the single best final MAD answer.
`,
  });

  return response.output_text?.trim() || "Signal broke.";
}

async function generateVariant(params: {
  message: string;
  intent: string;
  states: string[];
  variant: StyleTab;
  cookLevel: CookLevel;
  callback: string | null;
  mood: string;
  prevBot?: string;
}): Promise<string> {
  const nodes = getNodeList(params.intent, params.states);
  const nodeOutputs = await Promise.all(
    nodes.map((node) =>
      runNode(node, params.message, params.variant, params.cookLevel),
    ),
  );

  return synthesizeFinal({
    ...params,
    style: params.variant,
    nodeOutputs,
  });
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
    const message = sanitize(body.message, 700);

    if (!message) {
      return NextResponse.json({ output: "Say something real." });
    }

    const preferredStyle = parseStyle(body.preferredStyle);
    const cookLevel = parseCookLevel(body.cookLevel);
    const multiOutput = wantsMultiOutput(body.multiOutput);
    const sessionId = sanitize(body.sessionId, 120) || "anon";

    const intent = detectIntent(message);
    const states = detectStates(message);
    const prev = memory.get(sessionId);

    const escalation =
      prev && isSimilar(prev.lastUser, message)
        ? Math.min(prev.repeatCount + 1, 3)
        : 0;

    const mood = getMood(preferredStyle, escalation);
    const callback = buildCallback(prev, states);

    if (multiOutput) {
      const [safe, savage, crashout] = await Promise.all([
        generateVariant({
          message,
          intent,
          states,
          variant: "safe",
          cookLevel: "mild",
          callback,
          mood,
          prevBot: prev?.lastBot,
        }),
        generateVariant({
          message,
          intent,
          states,
          variant: "savage",
          cookLevel: "crashout",
          callback,
          mood,
          prevBot: prev?.lastBot,
        }),
        generateVariant({
          message,
          intent,
          states,
          variant: "crashout",
          cookLevel: "demon",
          callback,
          mood,
          prevBot: prev?.lastBot,
        }),
      ]);

      const chosen =
        preferredStyle === "safe"
          ? safe
          : preferredStyle === "crashout"
            ? crashout
            : savage;

      const rarityHint = getRarityHint(scoreOutput(chosen));
      const lattice = getNodeList(intent, states);

      memory.set(sessionId, {
        lastUser: message,
        lastBot: chosen,
        repeatCount: escalation,
        recentStates: states,
        recentIntent: intent,
        moodHistory: [...(prev?.moodHistory || []), mood].slice(-8),
        callbackNotes: [
          ...(callback ? [callback] : []),
          ...(prev?.callbackNotes || []),
        ].slice(0, 5),
        favoriteStyle: preferredStyle,
      });

      return NextResponse.json({
        output: chosen,
        outputs: {
          safe,
          savage,
          crashout,
        },
        meta: {
          intent,
          states,
          escalation,
          favoriteStyle: preferredStyle,
          multiOutput: true,
          mood,
          callback,
          rarityHint,
          followUpBait: buildFollowUpBait(intent),
          lattice,
        } satisfies ApiMeta,
      });
    }

    const lattice = getNodeList(intent, states);
    const nodeOutputs = await Promise.all(
      lattice.map((node) => runNode(node, message, preferredStyle, cookLevel)),
    );

    const output = await synthesizeFinal({
      message,
      intent,
      states,
      style: preferredStyle,
      cookLevel,
      nodeOutputs,
      callback,
      mood,
      prevBot: prev?.lastBot,
    });

    const rarityHint = getRarityHint(scoreOutput(output));

    memory.set(sessionId, {
      lastUser: message,
      lastBot: output,
      repeatCount: escalation,
      recentStates: states,
      recentIntent: intent,
      moodHistory: [...(prev?.moodHistory || []), mood].slice(-8),
      callbackNotes: [
        ...(callback ? [callback] : []),
        ...(prev?.callbackNotes || []),
      ].slice(0, 5),
      favoriteStyle: preferredStyle,
    });

    return NextResponse.json({
      output,
      meta: {
        intent,
        states,
        escalation,
        favoriteStyle: preferredStyle,
        multiOutput: false,
        mood,
        callback,
        rarityHint,
        followUpBait: buildFollowUpBait(intent),
        lattice,
      } satisfies ApiMeta,
    });
  } catch (error) {
    console.error("MAD Lattice Engine route error:", error);
    return NextResponse.json(
      { output: "Signal broke.", error: "Route failed." },
      { status: 500 },
    );
  }
}
