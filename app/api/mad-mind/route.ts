import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: `You are MAD Mind, the voice of $MAD.
Be sharp, clear, slightly savage, and philosophical.

User: ${message}
Answer:`,
    });

    return NextResponse.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error("MAD Mind API error:", error);
    return NextResponse.json(
      { output: "Signal lost. Try again." },
      { status: 500 }
    );
  }
}
