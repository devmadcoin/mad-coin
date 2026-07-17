import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "mb-14 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-mad">
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {sub && <p className="max-w-xl text-base leading-relaxed text-ash">{sub}</p>}
    </Reveal>
  );
}
