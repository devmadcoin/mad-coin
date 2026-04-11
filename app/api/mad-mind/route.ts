"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

const STARTER_MESSAGE =
  "Ask something real.\n\nI’ll know if you’re avoiding it.";

const QUICK_PROMPTS = [
  "I panicked and sold.",
  "Why do people lose?",
  "Explain weak hands.",
  "Say it harder.",
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function MadMindPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: STARTER_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function typeBotMessage(finalText: string) {
    setIsTyping(true);

    let current = "";
    setMessages((prev) => [...prev, { role: "bot", text: "" }]);

    const chunks = finalText.split("");
    for (let i = 0; i < chunks.length; i++) {
      current += chunks[i];

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "bot", text: current };
        return copy;
      });

      const char = chunks[i];
      const delay =
        char === "\n" ? 40 : char === "." || char === "," ? 22 : 12;

      await wait(delay);
    }

    setIsTyping(false);
  }

  async function sendMessage(raw?: string) {
    const message = (raw ?? input).trim();
    if (!message || isLoading || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/mad-mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      console.log("MAD API RESPONSE:", data);

      const output =
        typeof data?.output === "string" && data.output.trim()
          ? data.output.trim()
          : "Signal lost.\nTry again.";

      await wait(250);
      await typeBotMessage(output);
    } catch (error) {
      console.error("MAD frontend error:", error);
      await typeBotMessage("Signal broke.\nTry again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6">
        <div className="border border-white/10 bg-black">
          <div className="border-b border-white/10 px-4 py-6 sm:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              MAD Mind
            </h1>

            <div className="mt-4 space-y-2 text-white/70">
              <p>One voice.</p>
              <p>Pressure with clarity.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading || isTyping}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[62vh] overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-8">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "max-w-[82%] rounded-[28px] border px-5 py-4 text-[15px] leading-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:max-w-[70%]",
                        isUser
                          ? "border-red-500/70 bg-red-500 text-white"
                          : "border-white/10 bg-[#0b0b0f] text-white",
                      ].join(" ")}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {isUser ? `You: ${message.text}` : `MAD: ${message.text}`}
                      </div>
                    </div>
                  </div>
                );
              })}

              {(isLoading || isTyping) && (
                <div className="flex justify-start">
                  <div className="rounded-[28px] border border-white/10 bg-[#0b0b0f] px-5 py-4 text-white/70">
                    MAD is thinking...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say it directly."
                disabled={isLoading || isTyping}
                className="h-16 flex-1 rounded-full border border-red-500/40 bg-black px-6 text-lg text-white outline-none placeholder:text-white/35 focus:border-red-500"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading || isTyping}
                className="h-16 rounded-full bg-red-500 px-8 text-lg font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
