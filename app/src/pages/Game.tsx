import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SectionHeading from "@/components/SectionHeading";
import { GAMES_LINKS } from "@/lib/pages-data";

const STEPS = [
  { n: "1", title: "Make Roblox", desc: "No account yet? Create one at roblox.com. It's free and takes 2 minutes." },
  { n: "2", title: "Watch Help", desc: "New to Roblox? Use our tutorial for the easiest setup and first-game walkthrough." },
  { n: "3", title: "Join $MAD", desc: "Click Play Now, join the official $MAD game, and start making decisions." },
];

export default function Game() {
  return (
    <PageShell
      eyebrow="Official $MAD Experience"
      title={<>
        $MAD <span className="text-mad">Games</span>
      </>
      }
      sub="The next generation isn't on PCs — they're on tablets, phones, and consoles. Roblox has 300M+ monthly players. That's why $MAD lives there."
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-mad/25 shadow-glow-sm">
          <video
            src="/assets/game/mad-banner.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-48 w-full object-cover sm:h-64"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Official Partner</span>
            <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
              $MAD <span className="text-mad">x</span> Strikeout
            </h2>
            <p className="mt-2 max-w-md text-sm text-ash">
              Proud sponsor of Strikeout on Roblox. MAD Mondays hit different.
            </p>
            <a
              href={GAMES_LINKS.strikeout}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-fit rounded-full bg-mad px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
            >
              Play Strikeout →
            </a>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <TiltCard className="h-full rounded-3xl" max={5}>
            <div className="flex h-full flex-col rounded-3xl border border-mad/30 bg-panel p-8 shadow-glow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-green-400">● Live Now</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ash">The Reincarnation Update</span>
              </div>
              <h3 className="mt-4 font-display text-3xl uppercase text-bone sm:text-4xl">+1 MAD Per Second</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ash">
                The first official $MAD game. Step into the arena, wield the MAD blade, and prove your
                conviction. New auras, new madness.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { v: "68.6K+", l: "Visits" },
                  { v: "265", l: "Favorites" },
                  { v: "6/18/26", l: "Updated" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/8 bg-black/30 p-4 text-center">
                    <p className="font-mono text-lg font-bold text-mad-bright">{s.v}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ash">{s.l}</p>
                  </div>
                ))}
              </div>
              <a
                href={GAMES_LINKS.madIncremental}
                target="_blank"
                rel="noreferrer"
                className="mt-7 w-fit rounded-full bg-mad px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all hover:scale-105 hover:shadow-glow"
              >
                🎮 Play Now →
              </a>
            </div>
          </TiltCard>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-panel">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${GAMES_LINKS.robuxVideo}?rel=0&modestbranding=1`}
                title="Watch the Madness"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Watch the Madness</p>
              <h4 className="mt-2 font-display text-xl uppercase text-bone">10K ROBUX Spent</h4>
              <p className="mt-2 text-sm text-ash">
                Coffee Blox just dropped 10,000 ROBUX into MAD INCREMENTAL. Crazy auras, weak to
                overpowered. Real gameplay. Real chaos. Real $MAD.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <SectionHeading
        eyebrow="New here?"
        title={<>
          How It <span className="text-mad">Works</span>
        </>
      }
      />
      <div className="grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/8 bg-panel p-7">
              <span className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-8xl text-mad/10">{s.n}</span>
              <p className="font-mono text-sm text-mad">Step {s.n}</p>
              <h4 className="mt-2 font-display text-xl uppercase text-bone">{s.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-ash">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/8 bg-panel p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Digital Wearables</p>
              <h4 className="mt-2 font-display text-2xl uppercase text-bone">MAD Skate Shirt</h4>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                Rock the $MAD brand inside Roblox. Official digital clothing in the Roblox catalog. Rep
                the community everywhere you go.
              </p>
            </div>
            <a
              href={GAMES_LINKS.shirt}
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-fit rounded-full border border-mad/40 px-7 py-3 text-sm font-bold uppercase tracking-wider text-mad-bright transition-all hover:bg-mad hover:text-white hover:shadow-glow"
            >
              Get the Shirt →
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/8 bg-panel p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Special Guest</p>
              <h4 className="mt-2 font-display text-2xl uppercase text-bone">Kubo Was Here</h4>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                Community supporter featured inside the $MAD gaming world. The FAM shows up everywhere.
              </p>
            </div>
            <a
              href={GAMES_LINKS.kubo}
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-fit rounded-full border border-white/15 px-7 py-3 text-sm font-bold uppercase tracking-wider text-bone transition-all hover:border-mad/50 hover:text-mad-bright"
            >
              Visit @Kubo100x →
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
          <div className="grid items-center lg:grid-cols-2">
            <div className="p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Quick Help</p>
              <h4 className="mt-2 font-display text-2xl uppercase text-bone">Need Help First?</h4>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                Watch this quick setup video to get into Roblox and start playing fast.
              </p>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${GAMES_LINKS.setupVideo}?rel=0&modestbranding=1`}
                title="Roblox setup"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
