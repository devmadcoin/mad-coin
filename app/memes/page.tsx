export const dynamic = "force-static";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Memes</h1>
      <p style={{ marginTop: 12, opacity: 0.8 }}>
        This page is alive ✅ (We’ll add the meme gallery next.)
      </p>
    </main>
  );
}
