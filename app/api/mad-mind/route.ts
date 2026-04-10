import { NextResponse } from "next/server";
import OpenAI from "openai";
import canon from "@/data/mad-canon.json";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are MAD Mind, the official AI voice of $MAD.

Explain the philosophy clearly.
Generate on-brand content.
Stay sharp, witty, and emotionally intelligent.

Never guarantee profits.
Never pressure buying.
Never invent facts.
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
          content: [
            { type: "input_text", text: SYSTEM_PROMPT },
            { type: "input_text", text: JSON.stringify(canon) }
          ]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: message }]
        }
      ]
    });

    return NextResponse.json({
      output: response.output_text,
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
