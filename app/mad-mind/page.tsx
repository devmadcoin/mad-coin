"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  async function send() {
    if (!input) return;

    const res = await fetch("/api/mad-mind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...messages, "You: " + input, "MAD: " + data.output]);
    setInput("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>MAD Mind</h1>

      <div>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask MAD Mind..."
      />

      <button onClick={send}>Send</button>
    </div>
  );
}
