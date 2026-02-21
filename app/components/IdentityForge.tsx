"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Manifest = {
  bg: string[];
  base: string[];
  eyes: string[];
  mouth: string[];
  accessories: string[];
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function safePath(p: string) {
  // Handles spaces + odd characters safely
  // (manifest.json should be normal, but this keeps you safe)
  const parts = (p || "").split("/").map((x) => encodeURIComponent(x));
  return parts.join("/");
}

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function loadImg(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function IdentityForge() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string>("");

  // selections
  const [bg, setBg] = useState<string>("");
  const [base, setBase] = useState<string>("");
  const [eyes, setEyes] = useState<string>("");
  const [mouth, setMouth] = useState<string>("");
  const [accessory, setAccessory] = useState<string>("");

  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load manifest
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        const res = await fetch("/pfp/manifest.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`manifest.json not found (status ${res.status})`);
        const data = (await res.json()) as Manifest;

        if (!alive) return;
        setManifest(data);

        // set defaults (first item)
        setBg(data.bg?.[0] || "");
        setBase(data.base?.[0] || "");
        setEyes(data.eyes?.[0] || "");
        setMouth(data.mouth?.[0] || "");
        setAccessory(data.accessories?.[0] || "");
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load manifest");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Build final src paths
  const layerSrc = useMemo(() => {
    const mk = (p: string) => (p ? `/pfp/${safePath(p)}` : "");
    return {
      bg: mk(bg),
      base: mk(base),
      eyes: mk(eyes),
      mouth: mk(mouth),
      accessory: mk(accessory),
    };
  }, [bg, base, eyes, mouth, accessory]);

  function randomize() {
    if (!manifest) return;
    setBg(pickRandom(manifest.bg));
    setBase(pickRandom(manifest.base));
    setEyes(pickRandom(manifest.eyes));
    setMouth(pickRandom(manifest.mouth));
    if (manifest.accessories?.length) setAccessory(pickRandom(manifest.accessories));
  }

  async function downloadPfp() {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      const size = 1024;
      const c = canvasRef.current;
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.clearRect(0, 0, size, size);

      // Circle clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // draw in order: bg -> base -> eyes -> mouth -> accessory
      const ordered = [layerSrc.bg, layerSrc.base, layerSrc.eyes, layerSrc.mouth, layerSrc.accessory].filter(Boolean);

      for (const src of ordered) {
        const img = await loadImg(src);
        ctx.drawImage(img, 0, 0, size, size);
      }

      ctx.restore();

      const png = c.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = "mad-pfp.png";
      a.click();
    } catch (e: any) {
      setErr(e?.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  if (err) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <p className="text-sm font-semibold text-red-200">Forge error</p>
        <p className="mt-2 text-sm text-white/70">{err}</p>
        <p className="mt-3 text-xs text-white/40">
          Make sure <span className="text-white/70">public/pfp/manifest.json</span> exists and your filenames match.
        </p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <p className="text-white/70">Loading Forge…</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      {/* LEFT: preview */}
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Preview</p>

        <div className="mt-4 flex justify-center">
          <div className="relative h-[320px] w-[320px] overflow-hidden rounded-full border border-white/10 bg-black/40 shadow-2xl">
            {/* Layers */}
            {layerSrc.bg && (
              <Image src={layerSrc.bg} alt="bg" fill className="object-cover" priority />
            )}
            {layerSrc.base && (
              <Image src={layerSrc.base} alt="base" fill className="object-cover" priority />
            )}
            {layerSrc.eyes && (
              <Image src={layerSrc.eyes} alt="eyes" fill className="object-cover" priority />
            )}
            {layerSrc.mouth && (
              <Image src={layerSrc.mouth} alt="mouth" fill className="object-cover" priority />
            )}
            {layerSrc.accessory && (
              <Image src={layerSrc.accessory} alt="accessory" fill className="object-cover" priority />
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button
            onClick={randomize}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Randomize
          </button>

          <button
            onClick={downloadPfp}
            disabled={downloading}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:opacity-60"
          >
            {downloading ? "Exporting…" : "Download PNG"}
          </button>
        </div>

        {/* hidden canvas for export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* RIGHT: controls */}
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Controls</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select label="Background" value={bg} onChange={setBg} options={manifest.bg} />
          <Select label="Base" value={base} onChange={setBase} options={manifest.base} />
          <Select label="Eyes" value={eyes} onChange={setEyes} options={manifest.eyes} />
          <Select label="Mouth" value={mouth} onChange={setMouth} options={manifest.mouth} />
          <Select label="Accessory" value={accessory} onChange={setAccessory} options={manifest.accessories} />
        </div>

        <p className="mt-4 text-xs text-white/40">
          Tip: if an image doesn’t show, it’s almost always a filename mismatch. Whatever is in{" "}
          <span className="text-white/70">public/pfp/</span> must match{" "}
          <span className="text-white/70">manifest.json</span> exactly.
        </p>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/20"
      >
        {options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
