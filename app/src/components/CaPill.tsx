import { useState } from "react";
import { CA } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function CaPill({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CA;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        "group flex items-center gap-3 rounded-full border border-mad/30 bg-mad/5 px-5 py-2.5 font-mono text-xs text-mad-bright transition-all duration-300 hover:border-mad/60 hover:bg-mad/10 hover:shadow-glow-sm sm:text-sm",
        className,
      )}
    >
      <span className="max-w-[180px] truncate sm:max-w-none">{CA}</span>
      <span className="shrink-0 text-ash transition-colors group-hover:text-bone">
        {copied ? "✓ copied" : "⧉"}
      </span>
    </button>
  );
}
