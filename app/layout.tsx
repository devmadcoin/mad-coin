import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        {/* NAV BAR */}
        <nav className="flex justify-center gap-6 p-6 border-b border-white/10 bg-black/60 backdrop-blur">
          <Link href="/">Home</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/forge">Forge</Link>
          <Link href="/memes">Memes</Link>
        </nav>

        {/* PAGE CONTENT */}
        <main className="min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}
