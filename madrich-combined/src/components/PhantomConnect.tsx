import CaPill from "@/components/CaPill";
import { LINKS } from "@/lib/data";
import {
  MAD_GATE_AMOUNT,
  formatMad,
  isMobileUserAgent,
  shortAddr,
} from "@/lib/mad-gate";
import { cn } from "@/lib/utils";

export const PHANTOM_INSTALL = "https://phantom.app/";

type PhantomConnectProps = {
  address: string | null;
  balance: number;
  checking: boolean;
  unlocked: boolean;
  error: string;
  status?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSwitch: () => void;
};

/**
 * Clawd / MadClaw Phantom connect card.
 * Same window.solana stack — no new wallet adapter, no keys held.
 * Later lock-card rules: CA + Jupiter, Solana-only, no BNB/RH chrome.
 */
export default function PhantomConnect({
  address,
  balance,
  checking,
  unlocked,
  error,
  status,
  onConnect,
  onDisconnect,
  onSwitch,
}: PhantomConnectProps) {
  const mobile = isMobileUserAgent();
  const need = Math.max(0, MAD_GATE_AMOUNT - balance);
  const pct = Math.min(100, (balance / MAD_GATE_AMOUNT) * 100);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
      <div className="border-b border-white/8 bg-black/40 px-6 py-5 text-center sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Solana only · Phantom</p>
        <h2 className="mt-2 font-display text-2xl uppercase text-bone sm:text-3xl">
          Hold {MAD_GATE_AMOUNT.toLocaleString()} $MAD to unlock. We only read balance.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ash">
          $MAD lives on Solana. Connect Phantom — no transaction, no signature, no spend. Solana
          only. No chain switcher, pause, timer, or LIVE chrome.
        </p>
        <div className="mt-4 flex justify-center">
          <CaPill />
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-mad px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition hover:scale-105 hover:shadow-glow"
          >
            Buy $MAD on Jupiter
          </a>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {!address ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {mobile && (
              <p className="max-w-md text-sm text-ash">
                On mobile, open the <span className="text-bone">Phantom app</span>, tap the globe for
                the in-app browser, and go to this page. Then connect.
              </p>
            )}
            <button
              type="button"
              onClick={onConnect}
              disabled={checking}
              className="rounded-full bg-mad px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all hover:scale-105 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? "Checking balance…" : "Connect wallet"}
            </button>
            <a
              href={PHANTOM_INSTALL}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-mad-bright underline decoration-mad/40 underline-offset-4 hover:text-bone"
            >
              Install Phantom →
            </a>
            {error && (
              <p className="font-mono text-xs text-mad-bright">
                {error}{" "}
                <a href={PHANTOM_INSTALL} target="_blank" rel="noreferrer" className="underline">
                  Install Phantom
                </a>
              </p>
            )}
            {status && !error && <p className="font-mono text-xs text-ash">{status}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-xs text-ash">
              Connected <span className="text-green-400">{shortAddr(address)}</span>
            </p>
            <p className="font-display text-3xl text-bone">
              {checking ? "…" : formatMad(balance)}{" "}
              <span className="text-lg text-ash">/ {MAD_GATE_AMOUNT.toLocaleString()} $MAD</span>
            </p>
            <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-black/50">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  unlocked ? "bg-green-500" : "bg-mad",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-sm text-ash">
              {unlocked
                ? "Gate cleared. DCA tracker is local; other tabs stay Coming until they are wired."
                : balance === 0
                  ? "No $MAD in this wallet."
                  : `Need ${need.toLocaleString()} more to unlock.`}
            </p>
            {unlocked && (
              <p className="rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-green-400">
                Unlocked
              </p>
            )}
            {error && <p className="font-mono text-xs text-mad-bright">{error}</p>}
            {status && !error && <p className="font-mono text-xs text-ash">{status}</p>}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={onSwitch}
                className="rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-wider text-bone transition hover:border-mad/50"
              >
                Switch wallet
              </button>
              <button
                type="button"
                onClick={onDisconnect}
                className="rounded-full border border-white/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-ash transition hover:text-bone"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
