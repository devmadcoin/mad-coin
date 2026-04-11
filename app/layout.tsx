/* app/layout.tsx */
import "./globals.css";

import type { ReactNode } from "react";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="relative isolate min-h-screen">
          <NavBar />
          <main className="relative z-0 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
