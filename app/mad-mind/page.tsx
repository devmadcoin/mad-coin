"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/mad-mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        "You: " + trimmed,
        "MAD: " + (data.output || "Signal lost. Try again."),
      ]);

      setInput("");
    } catch {
      setMessages((prev) => [
        ...prev,
        "You: " + trimmed,
        "MAD: Signal lost. Try again.",
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>MAD Mind</h1>

      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Ask MAD Mind..."
      />

      <button onClick={send} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
