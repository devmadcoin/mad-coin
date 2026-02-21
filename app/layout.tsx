/* app/layout.tsx */
import "./globals.css";
import type { ReactNode } from "react";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <NavBar />
        {/* breathing room is now handled by padding-top on main */}
        <main className="min-h-screen pt-4">{children}</main>
      </body>
    </html>
  );
}
