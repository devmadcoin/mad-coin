import Hero from "@/sections/Hero";
import ExchangeMarquee from "@/sections/ExchangeMarquee";
import Movement from "@/sections/Movement";
import LatestDrop from "@/sections/LatestDrop";
import Testimonials from "@/sections/Testimonials";
import Chronicles from "@/sections/Chronicles";
import CommandCenter from "@/sections/CommandCenter";
import Team from "@/sections/Team";
import StatementMarquee from "@/sections/StatementMarquee";
import Join from "@/sections/Join";

export default function Home() {
  return (
    <>
      <Hero />
      <ExchangeMarquee />
      <Movement />
      <StatementMarquee text="Stay $MAD" />
      <LatestDrop />
      <Testimonials />
      <Chronicles />
      <CommandCenter />
      <Team />
      <StatementMarquee text="Get $MAD Rich" reverse />
      <Join />
    </>
  );
}
