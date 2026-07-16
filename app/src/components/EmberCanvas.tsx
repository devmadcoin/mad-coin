import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  alpha: number;
  hue: number;
  phase: number;
};

export default function EmberCanvas({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    let raf = 0;

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: h + Math.random() * h * 0.2,
      r: (Math.random() * 2.2 + 0.6) * devicePixelRatio,
      speed: (Math.random() * 0.5 + 0.18) * devicePixelRatio,
      drift: (Math.random() - 0.5) * 0.4 * devicePixelRatio,
      alpha: Math.random() * 0.55 + 0.12,
      hue: Math.random() * 24 - 4,
      phase: Math.random() * Math.PI * 2,
    });

    const parts: Particle[] = Array.from({ length: density }, () => {
      const p = spawn();
      p.y = Math.random() * h;
      return p;
    });

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.speed;
        p.x += p.drift + Math.sin(t + p.phase) * 0.24 * devicePixelRatio;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, spawn());
        const flicker = 0.72 + Math.sin(t * 3 + p.phase) * 0.28;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${8 + p.hue}, 92%, 58%, ${p.alpha * flicker})`;
        ctx.shadowColor = "rgba(234,32,34,0.85)";
        ctx.shadowBlur = 7 * devicePixelRatio;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
