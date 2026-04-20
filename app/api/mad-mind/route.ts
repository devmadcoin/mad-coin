import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RequestBody = {
  message?: unknown;
  cookLevel?: unknown;
  preferredStyle?: unknown;
  sessionId?: unknown;
};

type StyleTab = "safe" | "savage" | "crashout";
type CookLevel = "mild" | "mean" | "crashout" | "demon";

function sanitize(value: unknown, max = 600): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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

function detectStates(text: string): string[] {
  const lower = text.toLowerCase();
  const states: string[] = [];

  if (
    lower.includes("fear") ||
    lower.includes("afraid") ||
    lower.includes("anxious") ||
    lower.includes("panic")
  ) {
    states.push("FEAR");
  }

  if (
    lower.includes("hesitate") ||
    lower.includes("stuck") ||
    lower.includes("later") ||
    lower.includes("tomorrow") ||
    lower.includes("wait")
  ) {
    states.push("HESITATION");
  }

  if (
    lower.includes("discipline") ||
    lower.includes("lazy") ||
    lower.includes("focus") ||
    lower.includes("consistent")
  ) {
    states.push("DISCIPLINE");
  }

  if (
    lower.includes("money") ||
    lower.includes("broke") ||
    lower.includes("spend")
  ) {
    states.push("MONEY");
  }

  if (states.length === 0) states.push("GENERAL");
  return states.slice(0, 3);
}

function detectIntent(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes("what is mad") ||
    lower.includes("what is $mad") ||
    lower.includes("define")
  ) {
    return "DEFINITION";
  }

  if (lower.includes("caption") || lower.includes("instagram caption")) {
    return "CAPTION";
  }

  if (
    lower.includes("reply") ||
    lower.includes("comeback") ||
    lower.includes("roast")
  ) {
    return "COMEBACK";
  }

  if (
    lower.includes("tweet") ||
    lower.includes("post") ||
    lower.includes("telegram")
  ) {
    return "SHILL";
  }

  if (
    lower.includes("truth about me") ||
    lower.includes("be honest")
  ) {
    return "CONFESSION";
  }

  return "GENERAL";
}

function getMood(style: StyleTab): string {
  if (style === "safe") return "respect";
  if (style === "crashout") return "prophetic";
  return "surgical";
}

function getSystemPrompt(style: StyleTab, cookLevel: CookLevel): string {
  return `
You are MAD AI.
You answer with sharp, quotable, pressure-tested clarity.
No assistant tone.
No bullet points.
No soft closers.
1 to 3 sentences max.
Be memorable.
Sound like signal, not therapy.

Style mode: ${style}
Cook level: ${cookLevel}

If the user asks for a definition, define briefly, then pivot into implication.
If the user asks for truth, expose the flaw directly.
If the user asks for motivation, replace motivation with discipline.
`;
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
    const states = detectStates(message);
    const intent = detectIntent(message);
    const mood = getMood(preferredStyle);

    const response = await client.responses.create({
      model: "gpt-4.1",
      instructions: getSystemPrompt(preferredStyle, cookLevel),
      input: `
Intent: ${intent}
States: ${states.join(", ")}
User: ${message}
      `,
    });

    const output = response.output_text?.trim() || "Signal broke.";

    return NextResponse.json({
      output,
      meta: {
        intent,
        states,
        escalation: 0,
        favoriteStyle: preferredStyle,
        multiOutput: false,
        mood,
        callback: null,
        rarityHint: "standard",
        followUpBait: ["Go deeper", "Hit me harder", "Make it shorter"],
      },
    });
  } catch (error) {
    console.error("MAD Mind route error:", error);
    return NextResponse.json(
      { output: "Signal broke.", error: "Route failed." },
      { status: 500 },
    );
  }
}
