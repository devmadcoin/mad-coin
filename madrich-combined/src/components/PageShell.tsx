import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function PageShell({
  eyebrow,
  title,
  sub,
  top,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  top?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(234,32,34,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {top && <div className="mb-10">{top}</div>}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col items-center gap-4 text-center"
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-mad">
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone sm:text-6xl">
            {title}
          </h1>
          {sub && <p className="max-w-2xl text-base leading-relaxed text-ash">{sub}</p>}
        </motion.div>
        <Reveal>{children}</Reveal>
      </div>
    </div>
  );
}
