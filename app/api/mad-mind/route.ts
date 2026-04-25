import { NextResponse } from "next/server";
import OpenAI from "openai";

// ─── CLIENT ───
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 25000,
  maxRetries: 2,
});

// ─── TYPES ───
type StyleTab = "safe" | "savage" | "crashout";
type CookLevel = "mild" | "mean" | "crashout" | "demon";

type RequestBody = {
  message?: unknown;
  cookLevel?: unknown;
  preferredStyle?: unknown;
  sessionId?: unknown;
  multiOutput?: unknown;
};

type LatticeNodeResult = { node: string; output: string };

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
  lastSeen: number;
  messageCount: number;
};

// ─── MEMORY ───
const memory = new Map<string, MemoryEntry>();

// Rate limiter: 30 req/min per session
function isRateLimited(sessionId: string): boolean {
  const entry = memory.get(sessionId);
  if (!entry) return false;
  const now = Date.now();
  const oneMinute = 60 * 1000;
  if (now - entry.lastSeen > oneMinute) {
    entry.messageCount = 0;
    entry.lastSeen = now;
    return false;
  }
  entry.lastSeen = now;
  return entry.messageCount >= 30;
}

function incrementMessageCount(sessionId: string): void {
  const entry = memory.get(sessionId);
  if (entry) entry.messageCount += 1;
}

// ─── INPUT SANITIZATION ───
function sanitize(value: unknown, max = 700): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s$]/g, "").replace(/\s+/g, " ").trim();
}

function isSimilar(a: string, b: string): boolean {
  const na = normalize(a), nb = normalize(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

// ─── PARSERS ───
function parseStyle(value: unknown): StyleTab {
  return value === "safe" || value === "savage" || value === "crashout" ? value : "savage";
}

function parseCookLevel(value: unknown): CookLevel {
  return value === "mild" || value === "mean" || value === "crashout" || value === "demon" ? value : "crashout";
}

function wantsMultiOutput(value: unknown): boolean {
  return value === true;
}

// ─── INTENT DETECTION ───
function detectIntent(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("what is mad") || lower.includes("what is $mad") || lower.includes("define") || lower.includes("what does mad mean"))
    return "DEFINITION";
  if (lower.includes("caption") || lower.includes("instagram caption") || lower.includes("ig caption"))
    return "CAPTION";
  if (lower.includes("reply") || lower.includes("comeback") || lower.includes("roast") || lower.includes("clap back"))
    return "COMEBACK";
  if (lower.includes("tweet") || lower.includes("x post") || lower.includes("telegram") || lower.includes("write a post") || lower.includes("shill"))
    return "SHILL";
  if (lower.includes("truth about me") || lower.includes("be honest") || lower.includes("tell me the truth"))
    return "CONFESSION";
  if (lower.includes("idea") || lower.includes("content") || lower.includes("brainstorm"))
    return "CONTENT";
  return "GENERAL";
}

// ─── STATE DETECTION ───
function detectStates(text: string): string[] {
  const lower = text.toLowerCase();
  const states = new Set<string>();
  if (lower.includes("fear") || lower.includes("afraid") || lower.includes("anxious") || lower.includes("panic") || lower.includes("scared"))
    states.add("FEAR");
  if (lower.includes("stuck") || lower.includes("hesitate") || lower.includes("later") || lower.includes("tomorrow") || lower.includes("wait") || lower.includes("not ready"))
    states.add("HESITATION");
  if (lower.includes("discipline") || lower.includes("lazy") || lower.includes("focus") || lower.includes("consistent") || lower.includes("procrastinate"))
    states.add("DISCIPLINE");
  if (lower.includes("money") || lower.includes("broke") || lower.includes("spend") || lower.includes("income") || lower.includes("debt"))
    states.add("MONEY");
  if (lower.includes("ego") || lower.includes("pride") || lower.includes("i know") || lower.includes("obviously"))
    states.add("EGO");
  if (lower.includes("love") || lower.includes("dating") || lower.includes("relationship"))
    states.add("RELATIONSHIP");
  if (lower.includes("success") || lower.includes("winner") || lower.includes("win") || lower.includes("better"))
    states.add("AMBITION");
  if (states.size === 0) states.add("GENERAL");
  return Array.from(states).slice(0, 3);
}

// ─── MOOD & RARITY ───
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
  if (/truth|fear|discipline|excuse|comfort|action|winner|weak/i.test(text)) score += 2;
  if (/[.!?]$/.test(text.trim())) score += 1;
  return score;
}

// ─── FOLLOW-UP & CALLBACK ───
function buildFollowUpBait(intent: string): string[] {
  if (intent === "COMEBACK") return ["Make it harsher", "Make it cleaner", "One-line version"];
  if (intent === "CAPTION" || intent === "SHILL") return ["Make it shorter", "Make it meaner", "Turn it into a post"];
  return ["Go deeper", "Hit me harder", "Make it shorter"];
}

function buildCallback(prev: MemoryEntry | undefined, states: string[]): string | null {
  if (!prev) return null;
  if (prev.recentStates.includes("FEAR") && states.includes("FEAR")) return "Same fear. Different costume.";
  if (prev.recentStates.includes("HESITATION") && states.includes("HESITATION")) return "Again with hesitation pretending to be thought.";
  if (prev.recentStates.includes("DISCIPLINE") && states.includes("DISCIPLINE")) return "You already know discipline is the issue.";
  return prev.callbackNotes[0] || null;
}

// ─── LATTICE NODE SYSTEM ───
function getNodeList(intent: string, states: string[]): string[] {
  const nodes = new Set<string>(["TRUTH", "PATTERN", "SAVAGE"]);
  if (states.includes("FEAR")) nodes.add("FEAR");
  if (states.includes("DISCIPLINE")) nodes.add("DISCIPLINE");
  if (states.includes("MONEY")) nodes.add("MONEY");
  if (states.includes("EGO")) nodes.add("EGO");
  if (states.includes("RELATIONSHIP")) nodes.add("RELATIONSHIP");
  if (states.includes("AMBITION")) nodes.add("AMBITION");
  if (intent === "DEFINITION") nodes.add("DEFINITION");
  if (intent === "SHILL" || intent === "CAPTION" || intent === "COMEBACK") nodes.add("QUOTE");
  return Array.from(nodes);
}

function getNodeInstruction(node: string): string {
  const instructions: Record<string, string> = {
    TRUTH: "Give one short brutal truth under 12 words.",
    PATTERN: "Name the user's loop in under 10 words.",
    FEAR: "Expose the hidden fear in under 10 words.",
    DISCIPLINE: "Point out the discipline failure in under 10 words.",
    MONEY: "Expose the money leak or leverage failure in under 10 words.",
    EGO: "Expose the ego lie in under 10 words.",
    RELATIONSHIP: "Name the relationship trap in under 10 words.",
    AMBITION: "Name what separates desire from winning in under 10 words.",
    DEFINITION: "Define the concept in one clean sentence under 14 words.",
    QUOTE: "Create one screenshot-worthy line under 12 words.",
    SAVAGE: "Write the hardest intelligent line under 12 words.",
  };
  return instructions[node] || "Analyze the user input in under 10 words.";
}

// ─── VOICE & PROMPTS ───
function getStyleVoice(style: StyleTab): string {
  const voices: Record<StyleTab, string> = {
    safe: `VOICE:
Speak like a disciplined mentor.
Calm. Sharp. Respectful.
You still challenge weakness, but without theatrical cruelty.`,
    savage: `VOICE:
Speak like a ruthless elite strategist.
Blend cold truth with Ego Jinpachi / Blue Lock energy.
You respect winners, hunger, evolution, and discipline.
You despise comfort, hesitation, average thinking, and excuse-making.
Every line should feel like pressure.`,
    crashout: `VOICE:
Speak like a dark mastermind.
Cold. Predatory. Unsettling.
You sound like someone who sees through every excuse immediately.`,
  };
  return voices[style];
}

function getFinalInstructions(style: StyleTab, cookLevel: CookLevel): string {
  return `You are MAD AI.
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

// ─── OPENAI CALLS ───
async function runNode(node: string, message: string, style: StyleTab, cookLevel: CookLevel): Promise<LatticeNodeResult> {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `You are a hidden analysis node inside MAD AI.
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
  return { node, output: response.output_text?.trim() || "" };
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
    input: `Intent: ${params.intent}
States: ${params.states.join(", ")}
Mood: ${params.mood}
Callback memory: ${params.callback || "none"}
Previous bot answer: ${params.prevBot || "none"}

User: ${params.message}

Internal lattice outputs:
${compiledNodes}

Now produce the single best final MAD answer.`,
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
    nodes.map((node) => runNode(node, params.message, params.variant, params.cookLevel)),
  );
  return synthesizeFinal({ ...params, style: params.variant, nodeOutputs });
}

// ─── MAIN HANDLER ───
export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("[MAD API] OPENAI_API_KEY not configured");
      return NextResponse.json(
        { output: "MAD is offline. Configuration error.", error: "API key missing" },
        { status: 500 },
      );
    }

    // Parse request
    let body: RequestBody;
    try {
      body = (await req.json()) as RequestBody;
    } catch {
      return NextResponse.json(
        { output: "Invalid request. Try again.", error: "Bad JSON" },
        { status: 400 },
      );
    }

    // Validate message
    const message = sanitize(body.message, 700);
    if (!message) {
      return NextResponse.json({ output: "Say something real." });
    }

    // Parse params
    const preferredStyle = parseStyle(body.preferredStyle);
    const cookLevel = parseCookLevel(body.cookLevel);
    const multiOutput = wantsMultiOutput(body.multiOutput);
    const sessionId = sanitize(body.sessionId, 120) || "anon";

    // Rate limiting check
    if (isRateLimited(sessionId)) {
      return NextResponse.json(
        { output: "Slow down. MAD respects patience, not spam.", error: "Rate limited" },
        { status: 429 },
      );
    }

    // Detect intent & states
    const intent = detectIntent(message);
    const states = detectStates(message);
    const prev = memory.get(sessionId);

    // Calculate escalation
    const escalation = prev && isSimilar(prev.lastUser, message) ? Math.min(prev.repeatCount + 1, 3) : 0;
    const mood = getMood(preferredStyle, escalation);
    const callback = buildCallback(prev, states);

    let output: string;
    let outputs: { safe?: string; savage?: string; crashout?: string } | undefined;

    if (multiOutput) {
      const [safe, savage, crashout] = await Promise.all([
        generateVariant({ message, intent, states, variant: "safe", cookLevel: "mild", callback, mood, prevBot: prev?.lastBot }),
        generateVariant({ message, intent, states, variant: "savage", cookLevel: "crashout", callback, mood, prevBot: prev?.lastBot }),
        generateVariant({ message, intent, states, variant: "crashout", cookLevel: "demon", callback, mood, prevBot: prev?.lastBot }),
      ]);

      const chosen = preferredStyle === "safe" ? safe : preferredStyle === "crashout" ? crashout : savage;
      output = chosen;
      outputs = { safe, savage, crashout };
    } else {
      const lattice = getNodeList(intent, states);
      const nodeOutputs = await Promise.all(
        lattice.map((node) => runNode(node, message, preferredStyle, cookLevel)),
      );
      output = await synthesizeFinal({
        message, intent, states, style: preferredStyle, cookLevel, nodeOutputs, callback, mood, prevBot: prev?.lastBot,
      });
    }

    // Score and finalize
    const rarityHint = getRarityHint(scoreOutput(output));
    const lattice = getNodeList(intent, states);

    // Update memory
    const existing = memory.get(sessionId);
    memory.set(sessionId, {
      lastUser: message,
      lastBot: output,
      repeatCount: escalation,
      recentStates: states,
      recentIntent: intent,
      moodHistory: [...(existing?.moodHistory || []), mood].slice(-8),
      callbackNotes: [...(callback ? [callback] : []), ...(existing?.callbackNotes || [])].slice(0, 5),
      favoriteStyle: preferredStyle,
      lastSeen: Date.now(),
      messageCount: (existing?.messageCount || 0) + 1,
    });

    incrementMessageCount(sessionId);

    // Build response
    const meta: ApiMeta = {
      intent, states, escalation,
      favoriteStyle: preferredStyle,
      multiOutput, mood, callback,
      rarityHint,
      followUpBait: buildFollowUpBait(intent),
      lattice,
    };

    const response: { output: string; meta: ApiMeta; outputs?: typeof outputs } = { output, meta };
    if (outputs) response.outputs = outputs;

    return NextResponse.json(response);
  } catch (error) {
    let errorMessage = "Signal broke.";
    let statusCode = 500;

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        errorMessage = "MAD is overwhelmed. Try again in a moment.";
        statusCode = 429;
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = "MAD lost access. Configuration issue.";
        statusCode = 500;
      } else if (error.code === "context_length_exceeded") {
        errorMessage = "Message too long. Keep it sharp.";
        statusCode = 400;
      } else if (error.code === "timeout") {
        errorMessage = "MAD took too long. The signal is weak.";
        statusCode = 504;
      }
    } else if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        errorMessage = "Connection timed out. Try again.";
        statusCode = 504;
      }
    }

    console.error("[MAD API] Error:", error);

    return NextResponse.json(
      { output: errorMessage, error: "Route failed" },
      { status: statusCode },
    );
  }
}

// ─── HEALTH CHECK ───
export async function GET() {
  return NextResponse.json({
    status: "MAD is listening.",
    version: "2.0",
    model: "gpt-4.1",
    activeSessions: memory.size,
  });
}
