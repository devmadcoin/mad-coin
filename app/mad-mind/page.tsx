"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

const STARTER_MESSAGE = `Ask something real.

I’ll know if you’re avoiding it.`;

const QUICK_PROMPTS = [
  "What is $MAD?",
  "Why do people lose?",
  "i panic sold, what should i do?",
  "What should i do?",
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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function getLastUserMessage(): string {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return messages[i].text;
    }
    return "";
  }

  async function typeBotMessage(finalText: string) {
    setIsTyping(true);

    let current = "";

    setMessages((prev) => [...prev, { role: "bot", text: "" }]);

    for (let i = 0; i < finalText.length; i++) {
      current += finalText[i];

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "bot", text: current };
        return next;
      });

      const char = finalText[i];
      const delay =
        char === "\n" ? 35 : char === "." || char === "," || char === "—" ? 18 : 10;

      await wait(delay);
    }

    setIsTyping(false);
  }

  async function sendMessage(rawMessage?: string) {
    const message = (rawMessage ?? input).trim();

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
        typeof data?.output === "string" && data.output.trim().length > 0
          ? data.output.trim()
          : "Signal lost.\nTry again.";

      await wait(220);
      await typeBotMessage(output);
    } catch (error) {
      console.error("MAD frontend error:", error);
      await typeBotMessage("Signal broke.\nTry again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleCopy(text: string, index: number) {
    const tweet = `MAD Mind just called me out:

"${text}"

Stay $MAD.`;

    await navigator.clipboard.writeText(tweet);
    setCopiedIndex(index);

    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,40,40,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,40,40,0.08),transparent_35%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6">
        <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-[28px] border border-white/10 bg-black/90">
          
          {/* HEADER */}
          <div className="border-b border-white/10 px-4 py-6 sm:px-6">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              MAD Mind
            </h1>

            <div className="mt-4 text-white/70">
              <p>One voice.</p>
              <p>Pressure with clarity.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading || isTyping}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* CHAT */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-8">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[75%] rounded-[24px] border px-5 py-4">
                      <div className="whitespace-pre-wrap">
                        {isUser
                          ? `You: ${message.text}`
                          : `MAD Mind: ${message.text}`}
                      </div>

                      {/* BOT ACTIONS */}
                      {!isUser && index !== 0 && (
                        <div className="mt-3 flex gap-4 text-xs">
                          <button
                            onClick={() => handleCopy(message.text, index)}
                            className="text-white/50 hover:text-white"
                          >
                            {copiedIndex === index ? "Copied" : "Copy this"}
                          </button>

                          <button
                            onClick={() =>
                              sendMessage(getLastUserMessage() + " say it harder")
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            Say it harder
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {(isLoading || isTyping) && (
                <div className="text-white/60">
                  MAD Mind is thinking...
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say it directly."
                className="flex-1 rounded-full border px-6 py-4 bg-black"
              />

              <button className="bg-red-500 px-6 rounded-full">
                Send
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
