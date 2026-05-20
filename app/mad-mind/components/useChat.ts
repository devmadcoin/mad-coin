import { useState, useEffect, useRef } from "react";

export interface ChatMessage {
  role: "user" | "claw";
  text: string;
  timestamp: number;
  id?: string;
  latticePatternId?: string;
  latticeCategory?: string;
}

export default function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Initialize session */
  useEffect(() => {
    let sid = localStorage.getItem("mad-claw-chat-session");
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("mad-claw-chat-session", sid);
    }
    setSessionId(sid);

    /* Load history */
    fetch(`/api/mad-mind/chat?sessionId=${sid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages?.length) {
          setMessages(data.messages.map((m: ChatMessage, i: number) => ({
            ...m,
            id: m.id || `${m.role}-${i}-${m.timestamp}`,
          })));
        }
      })
      .catch(() => { /* ignore */ });
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const userMsg: ChatMessage = { 
      role: "user", 
      text: text.trim(), 
      timestamp: Date.now(),
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("sending");
    setTyping(true);

    try {
      const res = await fetch("/api/mad-mind/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId }),
      });

      const data = await res.json();
      if (data.reply) {
        const clawMsg: ChatMessage = { 
          role: "claw", 
          text: data.reply, 
          timestamp: Date.now(),
          id: `claw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          latticePatternId: data.lattice?.patternId,
          latticeCategory: data.lattice?.category,
        };
        setMessages((prev) => [...prev, clawMsg]);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    const newSid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("mad-claw-chat-session", newSid);
    setSessionId(newSid);
    setMessages([]);
  };

  return { messages, status, typing, sendMessage, clearChat, scrollRef, sessionId };
}
