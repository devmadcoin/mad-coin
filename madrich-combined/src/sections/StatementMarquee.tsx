import { cn } from "@/lib/utils";

export default function StatementMarquee({
  text,
  reverse = false,
  className,
}: {
  text: string;
  reverse?: boolean;
  className?: string;
}) {
  const items = Array.from({ length: 6 }, () => text);
  return (
    <div
      className={cn(
        "relative -rotate-1 overflow-hidden border-y border-mad/30 bg-mad py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max items-center gap-8 whitespace-nowrap",
          reverse ? "animate-marquee-rev" : "animate-marquee",
        )}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8">
            {items.map((t, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-8 font-display text-xl uppercase tracking-wider text-white"
              >
                {t} <span className="text-2xl">😡</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
