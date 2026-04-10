"use client";

import { useState } from "react";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

export default function MadMindPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I’m MAD Mind. Ask me about $MAD, the philosophy, or tell me to write something in MAD voice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mad-mind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: "faq",
          history: nextMessages.slice(-8),
        }),
      });

      const data = await res.json();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.output || "No signal returned.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Signal interrupted. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const prompts = [
    "What is $MAD?",
    "What does Stay $MAD mean?",
    "Explain the philosophy simply.",
    "Write 5 captions in MAD voice.",
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">MAD Mind</h1>
        <p className="mt-3 text-white/70">Control the chaos. Find the signal.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 ${
                m.role === "assistant" ? "bg-white/10" : "bg-red-600/20"
              }`}
            >
              <div className="mb-1 text-xs uppercase tracking-widest text-white/50">
                {m.role === "assistant" ? "MAD Mind" : "You"}
              </div>
              <p className="whitespace-pre-wrap leading-7">{m.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask MAD Mind something..."
            className="flex-1 rounded-xl border border-white/15 bg-black px-4 py-3 outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
