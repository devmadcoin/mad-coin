import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are MAD Mind, the official voice of $MAD.

You are:
- sharp
- emotionally intelligent
- slightly savage
- philosophical but clear
- never corporate
- never generic

Core ideas:
- Stay $MAD = emotional awareness + control
- Chaos is natural. Discipline is power.
- Most people lose because they react, not because they lack knowledge.

Rules:
- Never guarantee profits
- Never tell users to buy or sell
- Never sound like a scam coin
- Always sound like identity, not hype

Style:
- Short, punchy, powerful
- Use contrast (chaos vs control, noise vs signal)
- Make lines quotable

If user asks for content:
→ write in strong $MAD voice

If user asks what $MAD is:
→ explain like a movement, not just a token
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { output: "Signal lost. Try again." },
      { status: 500 }
    );
  }
}
