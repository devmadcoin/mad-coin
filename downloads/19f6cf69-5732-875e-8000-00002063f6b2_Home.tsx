import Hero from "@/sections/Hero";
import ExchangeMarquee from "@/sections/ExchangeMarquee";
import LatestDrop from "@/sections/LatestDrop";
import StatementMarquee from "@/sections/StatementMarquee";
import Movement from "@/sections/Movement";
import Testimonials from "@/sections/Testimonials";
import MadTalks from "@/sections/MadTalks";
import CommandCenter from "@/sections/CommandCenter";
import Chronicles from "@/sections/Chronicles";
import Team from "@/sections/Team";
import Join from "@/sections/Join";

export default function Home() {
  return (
    <main>
      <Hero />
      <ExchangeMarquee />
      <LatestDrop />
      <StatementMarquee text="Motivation · Alignment · Discipline" />
      <Movement />
      <Testimonials />
      <MadTalks />
      <StatementMarquee text="Stay $MAD" reverse />
      <CommandCenter />
      <Chronicles />
      <Team />
      <Join />
    </main>
  );
}
