import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import Intro from "@/components/Intro";
import Nav from "@/sections/Nav";
import Footer from "@/sections/Footer";
import Home from "@/pages/Home";
import MadMind from "@/pages/MadMind";
import Community from "@/pages/Community";
import Roadmap from "@/pages/Roadmap";
import Game from "@/pages/Game";
import MadArt from "@/pages/MadArt";
import Rewards from "@/pages/Rewards";
import Merch from "@/pages/Merch";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="grain relative min-h-screen bg-ink text-bone">
      <Intro />
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mad-mind" element={<MadMind />} />
        <Route path="/community" element={<Community />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/game" element={<Game />} />
        <Route path="/mad-art" element={<MadArt />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}
