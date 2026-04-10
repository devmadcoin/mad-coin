"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "MAD: Ask something real.\n\nI’ll know if you’re avoiding it.",
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(customMessage?: string) {
    const trimmed = (customMessage ?? input).trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, "You: " + trimmed]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mad-mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        "MAD: " + (data.output || "Signal lost.\n\nTry again."),
      ]);
    } catch {
      setMessages((prev) => [...prev, "MAD: Signal lost.\n\nTry again."]);
    } finally {
      setLoading(false);
    }
  }

  const promptChips = [
    "I panicked and sold.",
    "Why do people lose?",
    "Explain weak hands.",
    "Say it harder.",
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/40 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
              MAD Signal
            </p>

            <h1 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
              MAD Mind
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
              One voice.
              <br />
              Pressure with clarity.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {promptChips.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    setTimeout(() => {
                      send(prompt);
                    }, 100);
                  }}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-white/78 transition duration-200 hover:border-red-500/30 hover:bg-white/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[55vh] overflow-y-auto px-5 py-5 sm:px-6">
            <div className="space-y-4">
              {messages.map((m, i) => {
                const isUser = m.startsWith("You:");

                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "max-w-[85%] rounded-[22px] px-4 py-3 text-sm sm:text-base",
                        isUser
                          ? "bg-red-500 text-white"
                          : "border border-white/10 bg-white/5 text-white/88",
                      ].join(" ")}
                    >
                      <p className="whitespace-pre-wrap leading-7">{m}</p>
                    </div>
                  </div>
                );
              })}

              {loading ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white/70 sm:text-base">
                    MAD: Thinking...
                  </div>
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-4 sm:px-6">
            <div className="flex gap-3">
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Say it directly."
                className="flex-1 rounded-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-red-500/40 sm:text-base"
              />

              <button
                onClick={() => send()}
                disabled={loading}
                className="rounded-full border border-red-500/30 bg-red-500 px-5 py-3 text-sm font-black text-white transition duration-200 hover:scale-[1.01] hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
