/* app/layout.tsx */
import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "$MAD",
  description: "Digital emotion — refined",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <NavBar />
        {/* breathing room under sticky header */}
        <main className="min-h-screen pt-6">{children}</main>
      </body>
    </html>
  );
}
