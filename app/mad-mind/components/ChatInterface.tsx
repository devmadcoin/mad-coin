"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./useChat";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messageCount: number;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  status: "idle" | "sending" | "error";
  typing: boolean;
  sendMessage: (text: string) => void;
  clearChat: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sessionId: string;
}

/* ─── Suggested starters ─── */
const STARTERS = [
  "What does $MAD mean to you?",
  "Tell me about the Matrix philosophy",
  "How do I build conviction?",
  "What's your study of the day?",
];

/* ─── Utilities ─── */
function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ─── Copy button ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60"
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
    </button>
  );
}

/* ─── Sidebar ─── */
function ChatSidebar({
  sessions,
  activeSession,
  onSelect,
  onNewChat,
}: {
  sessions: ChatSession[];
  activeSession: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="shrink-0 w-12 border-r border-white/5 bg-[#0a0a0a] flex flex-col items-center py-4 gap-3">
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <button
          onClick={onNewChat}
          className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center text-red-400 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="shrink-0 w-[260px] border-r border-white/5 bg-[#0a0a0a] flex flex-col">
      <div className="p-3 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Chats</span>
        <div className="flex gap-1">
          <button
            onClick={onNewChat}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/60 transition-all"
            title="New chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/60 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-white/20">No chat history yet</p>
          </div>
        )}
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full text-left p-3 rounded-xl transition-all group ${
              s.id === activeSession
                ? "bg-white/[0.06] border border-white/10"
                : "hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">💬</span>
              <span className="text-xs font-bold text-white/70 truncate flex-1">{s.title}</span>
            </div>
            <p className="text-[10px] text-white/30 truncate pl-5">{s.lastMessage}</p>
            <div className="flex items-center justify-between mt-1.5 pl-5">
              <span className="text-[9px] text-white/15">{formatTime(s.timestamp)}</span>
              <span className="text-[9px] text-white/15">{s.messageCount} msg</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Message bubble ─── */
function MessageBubble({ msg, isLatest }: { msg: ChatMessage; isLatest: boolean }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-2xl px-5 py-3.5 ${
            isUser
              ? "bg-red-500/[0.12] border border-red-500/20 text-white/90"
              : "bg-white/[0.03] border border-white/[0.08] text-white/75"
          }`}
        >
          <p className="text-sm leading-[1.7] whitespace-pre-wrap">{msg.text}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1.5 ${isUser ? "justify-end pr-1" : "justify-start pl-1"}`}>
          <span className="text-[9px] text-white/20 tabular-nums">{formatTime(msg.timestamp)}</span>
          {!isUser && <CopyButton text={msg.text} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Typing indicator ─── */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] px-5 py-4">
        <div className="flex gap-1.5 items-center h-4">
          <span className="h-2 w-2 rounded-full bg-red-400/50 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-red-400/50 animate-bounce" style={{ animationDelay: "120ms" }} />
          <span className="h-2 w-2 rounded-full bg-red-400/50 animate-bounce" style={{ animationDelay: "240ms" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Chat Interface ─── */
export default function ChatInterface({
  messages,
  status,
  typing,
  sendMessage,
  clearChat,
  scrollRef,
  sessionId,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Load sessions from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mad-claw-sessions");
      if (raw) {
        setSessions(JSON.parse(raw));
      }
    } catch { /* ignore */ }
  }, []);

  /* Save sessions */
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("mad-claw-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  /* Update current session in sidebar */
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    setSessions((prev) => {
      const existing = prev.find((s) => s.id === sessionId);
      const title = messages.find((m) => m.role === "user")?.text.slice(0, 30) || "New chat";
      if (existing) {
        return prev.map((s) =>
          s.id === sessionId
            ? { ...s, lastMessage: lastMsg.text.slice(0, 40), timestamp: lastMsg.timestamp, messageCount: messages.length, title }
            : s
        );
      }
      return [
        ...prev,
        {
          id: sessionId,
          title,
          lastMessage: lastMsg.text.slice(0, 40),
          timestamp: lastMsg.timestamp,
          messageCount: messages.length,
        },
      ];
    });
  }, [messages, sessionId]);

  const handleSend = useCallback(() => {
    if (!input.trim() || status === "sending" || typing) return;
    sendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, status, typing, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* Auto-resize textarea */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const handleNewChat = () => {
    clearChat();
    setSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    /* Switch to that session — reload page with that session */
    localStorage.setItem("mad-claw-chat-session", id);
    window.location.reload();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-[500px] rounded-[24px] border border-white/10 bg-[#080808] overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.04)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          sessions={sessions}
          activeSession={sessionId}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/50 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <span className="text-sm">🦞</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 border-2 border-[#080808]" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Mad Claw</p>
                <p className="text-[9px] text-white/25">
                  {typing ? "typing..." : status === "sending" ? "thinking..." : "online"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {hasMessages && (
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/25 hover:text-white/40 transition-all text-[10px] font-bold"
                title="New chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5 scrollbar-thin"
        >
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <span className="text-3xl">🦞</span>
              </div>
              <h2 className="text-xl font-black text-white mb-2">Mad Claw</h2>
              <p className="text-sm text-white/40 max-w-[300px] mb-8 leading-relaxed">
                Not a utility. A presence that remembers.<br />
                Ask anything. I bring everything I&apos;ve studied into every reply.
              </p>

              <div className="grid gap-2 w-full max-w-[400px]">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/50 hover:bg-white/[0.06] hover:border-white/10 hover:text-white/70 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id || `${msg.role}-${i}-${msg.timestamp}`}
                  msg={msg}
                  isLatest={i === messages.length - 1}
                />
              ))}
              {typing && <TypingIndicator />}
              {status === "error" && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const lastUser = [...messages].reverse().find((m) => m.role === "user");
                      if (lastUser) sendMessage(lastUser.text);
                    }}
                    className="text-[11px] text-red-400/60 bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-all"
                  >
                    ⚠️ The Claw lost the signal. Click to retry.
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 sm:px-8 py-4 border-t border-white/5">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={status === "sending" || typing}
              placeholder="Message Mad Claw..."
              rows={1}
              className="w-full px-5 py-3.5 pr-14 rounded-2xl border border-white/10 bg-white/[0.03] text-white text-sm placeholder:text-white/20 outline-none focus:border-red-500/30 focus:bg-white/[0.05] transition-all resize-none disabled:opacity-40 leading-relaxed"
              style={{ minHeight: "48px", maxHeight: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || status === "sending" || typing}
              className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
                !input.trim() || status === "sending"
                  ? "text-white/10 cursor-not-allowed"
                  : "bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:scale-105"
              }`}
            >
              {status === "sending" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/10 text-center">
            Mad Claw can make mistakes. The signal is strong but not perfect.
          </p>
        </div>
      </div>
    </div>
  );
}
