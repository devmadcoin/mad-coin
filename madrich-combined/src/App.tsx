import { Routes, Route, Navigate, useLocation } from "react-router";
import { useEffect } from "react";
import Nav from "@/sections/Nav";
import Footer from "@/sections/Footer";
import Intro from "@/components/Intro";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Community from "@/pages/Community";
import Game from "@/pages/Game";
import MadArt from "@/pages/MadArt";
import MapPage from "@/pages/Map";
import Merch from "@/pages/Merch";
import Tools from "@/pages/Tools";
import GrokDesk from "@/pages/GrokDesk";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <Intro />
      <Nav />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/mad-art" element={<MadArt />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/grok-desk" element={<GrokDesk />} />
        <Route path="/mad-mind" element={<Navigate to="/about" replace />} />
        <Route path="/roadmap" element={<Navigate to="/about" replace />} />
        <Route path="/fuel" element={<Navigate to="/about" replace />} />
        <Route path="/rewards" element={<Navigate to="/about" replace />} />
        <Route path="/journal" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
