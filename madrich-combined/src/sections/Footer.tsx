import { Link } from "react-router";
import { PAGE_LINKS } from "@/lib/pages-data";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/mad-logo.png" alt="$MAD" className="h-9 w-9 rounded-full" />
            <span className="font-display text-lg tracking-wide text-bone">$MAD RICH CLUB</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {PAGE_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash transition-colors hover:text-mad-bright"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <p className="max-w-2xl rounded-2xl border border-white/8 bg-panel px-6 py-4 text-center text-xs leading-relaxed text-ash">
            ⚠️ <span className="font-semibold text-bone">$MAD is a memecoin for entertainment purposes only.</span>{" "}
            Not financial advice. Always DYOR. The MAD FAM is a community — not a company, not a
            guarantee, not a promise. Tokens may go up, down, or sideways. Never invest more than you
            can afford to lose.
          </p>

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash/60">
            © 2026 MAD Rich Club · Stay $MAD 😡
          </p>
        </div>
      </div>
    </footer>
  );
}
