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

function buildShareText(text: string) {
  return `MAD Mind just said:

"${text}"

Stay $MAD.`;
}

export default function MadMindPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: STARTER_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
        char === "\n" ? 38 : char === "." || char === "," || char === "—" ? 20 : 10;

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
      console.log("MAD MIND API RESPONSE:", data);

      const output =
        typeof data?.output === "string" && data.output.trim().length > 0
          ? data.output.trim()
          : "Signal lost.\nTry again.";

      await wait(220);
      await typeBotMessage(output);
    } catch (error) {
      console.error("MAD Mind frontend error:", error);
      await typeBotMessage("Signal broke.\nTry again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleCopy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(buildShareText(text));
      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex((current) => (current === index ? null : current));
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function handleShareToX(text: string) {
    const shareText = buildShareText(text);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleSayItHarder() {
    const lastUserMessage = getLastUserMessage();
    if (!lastUserMessage || isLoading || isTyping) return;
    void sendMessage(`${lastUserMessage} say it harder`);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,45,45,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,45,45,0.08),transparent_36%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-4 sm:px-6 sm:py-6">
        <div className="flex min-h-[calc(100vh-2rem)] flex-col rounded-[28px] border border-white/10 bg-black/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="border-b border-white/10 px-4 py-6 sm:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              MAD Mind
            </h1>

            <div className="mt-4 space-y-2 text-lg text-white/75">
              <p>One voice.</p>
              <p>Pressure with clarity.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isLoading || isTyping}
                  className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-none px-4 py-6 sm:px-6">
            <div className="space-y-10">
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const isStarter = !isUser && index === 0;

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "max-w-[86%] rounded-[28px] border px-5 py-4 text-[15px] leading-8 sm:max-w-[72%] sm:text-[16px]",
                        isUser
                          ? "border-white/30 bg-black text-white"
                          : "border-white/30 bg-black text-white shadow-[0_0_30px_rgba(255,255,255,0.02)]",
                      ].join(" ")}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {isUser
                          ? `You: ${message.text}`
                          : `MAD Mind: ${message.text}`}
                      </div>

                      {!isUser && !isStarter && message.text && (
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                          <button
                            type="button"
                            onClick={() => void handleCopy(message.text, index)}
                            className="text-white/45 transition hover:text-white"
                          >
                            {copiedIndex === index ? "Copied" : "Copy this"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareToX(message.text)}
                            className="text-white/45 transition hover:text-white"
                          >
                            Share on X
                          </button>

                          <button
                            type="button"
                            onClick={handleSayItHarder}
                            disabled={isLoading || isTyping}
                            className="text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="flex justify-start">
                  <div className="max-w-[86%] rounded-[28px] border border-white/10 bg-[#0b0b0f] px-5 py-4 text-[15px] text-white/65 sm:max-w-[72%] sm:text-[16px]">
                    MAD Mind is thinking...
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
