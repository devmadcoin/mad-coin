/* app/layout.tsx */
import "./globals.css";

import type { ReactNode } from "react";
import NavBar from "./components/NavBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "$MAD — Stay $MAD",
  description:
    "Controlled chaos. Emotional discipline. Stay $MAD and move different.",
  icons: {
    icon: "/mad.png",
  },
  openGraph: {
    title: "$MAD",
    description: "Stay $MAD. Control yourself.",
    images: ["/mad.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        {/* GLOBAL BACKGROUND SYSTEM */}
        <div className="pointer-events-none fixed inset-0 z-[-1]">
          {/* glow gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.15),transparent_40%),radial-gradient(circle_at_20%_30%,rgba(255,80,0,0.08),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(255,0,60,0.10),transparent_40%)]" />

          {/* grid */}
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />

          {/* fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
        </div>

        {/* MAIN APP */}
        <div className="relative isolate flex min-h-screen flex-col">
          {/* NAV */}
          <NavBar />

          {/* PAGE CONTENT */}
          <main className="relative z-10 flex-1">{children}</main>

          {/* GLOBAL FOOTER (LIGHT, NON-CLUTTERED) */}
          <footer className="relative z-10 border-t border-white/10 bg-black/40 px-4 py-6 text-center text-xs text-white/40 backdrop-blur-xl">
            <p className="uppercase tracking-[0.2em]">Stay $MAD</p>
            <p className="mt-2 text-white/50">
              Controlled chaos. Discipline wins.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
