"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./useChat";
import MadChaoPixel from "./MadChaoPixel";

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
  "Why does my 401k feel like a scam?",
  "What makes $MAD different from every other memecoin?",
  "How do I stop being a lurker?",
  "Why does the chart control my mood?",
  "What book should I read first?",
  "Why do I keep trenching?",
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
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60"
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
      <div className="shrink-0 w-12 border-r border-[#1a1a1a]/10 bg-[#F5F1E8] flex flex-col items-center py-4 gap-3">
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 rounded-lg hover:bg-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/40 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <button
          onClick={onNewChat}
          className="w-8 h-8 rounded-lg bg-[#FF2D2D]/15 hover:bg-[#FF2D2D]/25 flex items-center justify-center text-[#FF6B00] transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="shrink-0 w-[260px] border-r border-[#1a1a1a]/10 bg-[#F5F1E8] flex flex-col">
      <div className="p-3 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/50">Chats</span>
        <div className="flex gap-1">
          <button
            onClick={onNewChat}
            className="p-1.5 rounded-lg hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 transition-all"
            title="New chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-[#1a1a1a]/40">No chat history yet</p>
          </div>
        )}
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full text-left p-3 rounded-xl transition-all group ${
              s.id === activeSession
                ? "bg-[#1a1a1a]/[0.06] border border-[#1a1a1a]/10"
                : "hover:bg-[#1a1a1a]/[0.03] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">💬</span>
              <span className="text-xs font-bold text-[#1a1a1a]/70 truncate flex-1">{s.title}</span>
            </div>
            <p className="text-[10px] text-[#1a1a1a]/30 truncate pl-5">{s.lastMessage}</p>
            <div className="flex items-center justify-between mt-1.5 pl-5">
              <span className="text-[9px] text-[#1a1a1a]/30">{formatTime(s.timestamp)}</span>
              <span className="text-[9px] text-[#1a1a1a]/30">{s.messageCount} msg</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Feedback buttons (👍 / 👎) ─── */
function FeedbackButtons({
  sessionId,
  timestamp,
  text,
  userMessage,
  patternId,
}: {
  sessionId: string;
  timestamp: number;
  text: string;
  userMessage?: string;
  patternId?: string;
}) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const sendFeedback = async (type: "up" | "down") => {
    if (voted) return;
    try {
      await fetch("/api/mad-mind/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          timestamp,
          feedback: type,
          message: userMessage,
          reply: text,
          patternId,
        }),
      });
      setVoted(type);
    } catch { /* ignore */ }
  };

  if (voted) {
    return (
      <span className="text-[9px] text-[#1a1a1a]/15 ml-1">
        {voted === "up" ? "✓ Thanks" : "✓ Noted"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
      <button
        onClick={() => sendFeedback("up")}
        className="p-1 rounded hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/25 hover:text-[#FF6B00] transition-all"
        title="Good response"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
        </svg>
      </button>
      <button
        onClick={() => sendFeedback("down")}
        className="p-1 rounded hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/25 hover:text-[#FF6B00] transition-all"
        title="Bad response"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zM17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"/>
        </svg>
      </button>
    </div>
  );
}

/* ─── Message bubble ─── */
function MessageBubble({ msg, isLatest, sessionId, userMessage }: { msg: ChatMessage; isLatest: boolean; sessionId: string; userMessage?: string }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group gap-1 items-end`}>
      {!isUser && (
        <div className="shrink-0">
          <MadChaoPixel size={28} animated={false} showLabel={false} />
        </div>
      )}
      <div className={`max-w-[85%] sm:max-w-[75%]`}>
        <div
          className={`rounded-xl px-3 py-2 ${
            isUser
              ? "bg-[#FF2D2D]/[0.12] border border-[#FF2D2D]/20 text-[#1a1a1a]/90"
              : "bg-[#1a1a1a]/[0.03] border border-[#1a1a1a]/[0.08] text-[#1a1a1a]/75"
          }`}
        >
          <p className="text-sm leading-[1.6] whitespace-pre-wrap">{msg.text}</p>
        </div>
        <div className={`flex items-center gap-2 mt-0.5 ${isUser ? "justify-end pr-1" : "justify-start pl-1"}`}>
          <span className="text-[9px] text-[#1a1a1a]/20 tabular-nums">{formatTime(msg.timestamp)}</span>
          {!isUser && <CopyButton text={msg.text} />}
          {!isUser && (
            <FeedbackButtons
              sessionId={sessionId}
              timestamp={msg.timestamp}
              text={msg.text}
              userMessage={userMessage}
              patternId={msg.latticePatternId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Typing indicator ─── */
function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2 items-end">
      <div className="shrink-0 mb-1">
        <MadChaoPixel size={28} animated={true} showLabel={false} />
      </div>
      <div className="rounded-xl bg-[#1a1a1a]/[0.03] border border-[#1a1a1a]/[0.08] px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="h-2 w-2 rounded-full bg-[#FF6B00]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-[#FF6B00]/50 animate-bounce" style={{ animationDelay: "120ms" }} />
          <span className="h-2 w-2 rounded-full bg-[#FF6B00]/50 animate-bounce" style={{ animationDelay: "240ms" }} />
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
  const [isMobile, setIsMobile] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
    <div className="flex h-[calc(100dvh-80px)] sm:h-[calc(100vh-80px)] min-h-[400px] sm:min-h-[500px] rounded-none sm:rounded-[24px] border-0 sm:border border-[#1a1a1a]/10 bg-[#F5F1E8] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.04)] relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="absolute inset-0 bg-[#1a1a1a]/60 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className={`${isMobile ? 'absolute left-0 top-0 bottom-0 z-30 w-[280px]' : 'relative shrink-0 w-[260px]'}`}>
          <ChatSidebar
            sessions={sessions}
            activeSession={sessionId}
            onSelect={handleSelectSession}
            onNewChat={handleNewChat}
          />
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 border-b border-[#1a1a1a]/[0.08]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/50 transition-all"
              >
                <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            )}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center overflow-hidden">
                <MadChaoPixel size={isMobile ? 24 : 28} animated={false} showLabel={false} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#FF6B00] border-2 border-[#F5F1E8]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#1a1a1a]">The Claw</p>
                <p className="text-[8px] sm:text-[9px] text-[#1a1a1a]/50">
                  {typing ? "reading..." : status === "sending" ? "tuning..." : "listening"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {hasMessages && (
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/25 hover:text-[#1a1a1a]/40 transition-all text-[10px] font-bold"
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
          className="flex-1 overflow-y-auto px-2 sm:px-3 py-1 sm:py-2 scrollbar-thin ios-momentum"
        >
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center mb-3 sm:mb-4 overflow-hidden">
                <MadChaoPixel size={isMobile ? 40 : 48} animated={true} showLabel={false} />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1a1a1a] mb-1">THE ORACLE</h2>
              <p className="text-xs sm:text-sm text-[#1a1a1a]/40 max-w-[300px] mb-4 sm:mb-5 leading-relaxed">
                The Claw does not answer questions.<br />
                It reveals which frequency you are on.
              </p>

              <div className="grid gap-1.5 w-full max-w-[400px]">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#1a1a1a]/[0.03] border border-[#1a1a1a]/[0.06] text-xs sm:text-sm text-[#1a1a1a]/50 hover:bg-[#1a1a1a]/[0.06] hover:border-[#1a1a1a]/10 hover:text-[#1a1a1a]/70 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const prevUser = [...messages.slice(0, i)].reverse().find((m) => m.role === "user");
                return (
                  <MessageBubble
                    key={msg.id || `${msg.role}-${i}-${msg.timestamp}`}
                    msg={msg}
                    isLatest={i === messages.length - 1}
                    sessionId={sessionId}
                    userMessage={prevUser?.text}
                  />
                );
              })}
              {typing && <TypingIndicator />}
              {status === "error" && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const lastUser = [...messages].reverse().find((m) => m.role === "user");
                      if (lastUser) sendMessage(lastUser.text);
                    }}
                    className="text-[10px] sm:text-[11px] text-[#FF6B00]/60 bg-[#FF2D2D]/5 px-3 sm:px-4 py-2 rounded-xl border border-[#FF2D2D]/10 hover:bg-[#FF2D2D]/10 transition-all"
                  >
                    ⚠️ The Claw lost the signal. Click to retry.
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 border-t border-[#1a1a1a]/5 safe-top">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={status === "sending" || typing}
              placeholder="Message Mad Claw..."
              rows={1}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/20 outline-none focus:border-[#FF2D2D]/30 focus:bg-[#1a1a1a]/[0.05] transition-all resize-none disabled:opacity-40 leading-relaxed"
              style={{ minHeight: "40px", maxHeight: "160px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || status === "sending" || typing}
              className={`absolute right-2 bottom-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                !input.trim() || status === "sending"
                  ? "text-[#1a1a1a]/10 cursor-not-allowed"
                  : "bg-[#FF2D2D]/15 text-[#FF6B00] hover:bg-[#FF2D2D]/25 hover:scale-105"
              }`}
            >
              {status === "sending" ? (
                <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : (
                <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-[9px] sm:text-[10px] text-[#1a1a1a]/10 text-center">
            Mad Claw can make mistakes. The signal is strong but not perfect.
          </p>
        </div>
      </div>
    </div>
  );
}
