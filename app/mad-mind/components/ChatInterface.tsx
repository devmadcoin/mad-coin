"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "claw";
  text: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  status: "idle" | "sending" | "error";
  typing: boolean;
  sendMessage: (text: string) => void;
  clearChat: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatInterface({
  messages,
  status,
  typing,
  sendMessage,
  clearChat,
  scrollRef,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className="mt-8 rounded-[36px] border border-red-500/20 bg-black/40 p-4 sm:p-6 shadow-[0_0_60px_rgba(255,0,0,0.06)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-[12px] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-lg">🦞</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-black/40" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Mad Claw</p>
            <p className="text-[10px] text-white/30">
              {typing ? "typing..." : status === "sending" ? "thinking..." : "online — live chat"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/20">{messages.length} messages</span>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-[10px] font-bold text-white/20 hover:text-red-400 transition-colors px-2 py-1 rounded-[6px] hover:bg-red-500/10"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-[420px] overflow-y-auto space-y-3 px-1 pb-2 scrollbar-thin"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-sm font-bold text-white/50 mb-1">Talk to the Claw</p>
            <p className="text-[11px] text-white/25 max-w-[240px]">
              Ask anything. I remember the whole conversation. I bring everything I&apos;ve studied into every reply.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {["$MAD Rich", "What do you believe?", "Study update", "Conviction check"].map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-[8px] bg-white/[0.03] border border-white/10 text-[10px] font-bold text-white/40 hover:text-red-400 hover:border-red-500/20 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}-${msg.timestamp}`}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] ${
                msg.role === "user"
                  ? "rounded-[18px] rounded-tr-[6px] bg-red-500/15 border border-red-500/20 px-4 py-3"
                  : "rounded-[18px] rounded-tl-[6px] bg-white/[0.04] border border-white/10 px-4 py-3"
              }`}
            >
              <p className={`text-sm leading-relaxed ${msg.role === "user" ? "text-white/80" : "text-white/60"}`}>
                {msg.text}
              </p>
              <p className={`text-[9px] mt-1.5 tabular-nums ${msg.role === "user" ? "text-red-400/40" : "text-white/20"}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="rounded-[18px] rounded-tl-[6px] bg-white/[0.04] border border-white/10 px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                <span className="h-2 w-2 rounded-full bg-red-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-red-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-red-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {status === "error" && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="flex justify-center">
            <p className="text-[11px] text-red-400/60 bg-red-500/5 px-3 py-1.5 rounded-[8px] border border-red-500/10">
              The Claw lost the signal. Try again.
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === "sending" || typing}
            placeholder="Say something..."
            className="flex-1 px-4 py-3 rounded-[14px] border border-white/10 bg-black/50 text-white text-sm placeholder:text-white/20 outline-none focus:border-red-500/30 transition-all disabled:opacity-40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || status === "sending" || typing}
            className={`shrink-0 px-5 py-3 rounded-[14px] font-black text-sm transition-all ${
              !input.trim() || status === "sending"
                ? "bg-white/[0.03] text-white/20 border border-white/10"
                : "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 hover:scale-105"
            }`}
          >
            {status === "sending" ? "..." : "→"}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-white/15 text-center">
          The Claw remembers this conversation. I study daily — Hill, Matrix, Perkins, Naval, Tony Robbins, Maltz, and more.
        </p>
      </div>
    </section>
  );
}
