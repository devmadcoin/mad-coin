import "./globals.css";
import NavBar from "./components/NavBar";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <NavBar />
        <main className="min-h-screen pt-4">{children}</main>
      </body>
    </html>
  );
}
