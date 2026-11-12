"use client";
import { useEffect, useRef } from "react";

// Canvas dot field behind the hero. Dots breathe in a slow wave, part around
// the pointer and glow mint near it; a click or tap sends a shockwave ring.
// Rendering stops whenever the hero is offscreen or the tab is hidden.
const SPACING = 28;
const RADIUS = 150;

export function HeroField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const hero = el.closest<HTMLElement>(".hero")!;
    const ctx = el.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; ox: number; oy: number }[] = [];
    let frame = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const waves: { x: number; y: number; start: number }[] = [];

    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const box = el.getBoundingClientRect();
      width = box.width;
      height = box.height;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * SPACING;
          const y = r * SPACING + 10;
          dots.push({ x, y, ox: 0, oy: 0 });
        }
    };

    const draw = (time: number) => {
      const t = time / 1000;
      // Ease the pointer so the field lags gracefully behind the cursor.
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      for (let i = waves.length - 1; i >= 0; i--)
        if (now - waves[i].start > 1800) waves.splice(i, 1);

      for (const dot of dots) {
        let push = 0;
        let glow = 0;
        let dx = dot.x - pointer.x;
        let dy = dot.y - pointer.y;
        let dist = Math.hypot(dx, dy) || 1;
        if (pointer.active && dist < RADIUS) {
          const f = 1 - dist / RADIUS;
          push = f * f * 22;
          glow = f;
        }
        let tx = (dx / dist) * push;
        let ty = (dy / dist) * push;
        for (const wave of waves) {
          const age = (now - wave.start) / 1000;
          const ring = age * 520;
          dx = dot.x - wave.x;
          dy = dot.y - wave.y;
          dist = Math.hypot(dx, dy) || 1;
          const band = 1 - Math.min(Math.abs(dist - ring) / 60, 1);
          if (band > 0) {
            const fade = 1 - age / 1.8;
            tx += (dx / dist) * band * 16 * fade;
            ty += (dy / dist) * band * 16 * fade;
            glow = Math.max(glow, band * fade);
          }
        }
        dot.ox += (tx - dot.ox) * 0.18;
        dot.oy += (ty - dot.oy) * 0.18;
        // Ambient breathing: a slow diagonal wave across the grid.
        const wave = reduce
          ? 0.5
          : (Math.sin(dot.x * 0.012 + dot.y * 0.018 - t * 1.1) + 1) / 2;
        const fadeY = 1 - Math.min(dot.y / height, 1) ** 1.6;
        const alpha = (0.08 + wave * 0.1 + glow * 0.75) * fadeY;
        const size = 1 + wave * 0.5 + glow * 1.9;
        ctx.fillStyle =
          glow > 0.05
            ? `rgba(99, 230, 190, ${alpha})`
            : `rgba(160, 170, 181, ${alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x + dot.ox, dot.y + dot.oy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const local = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const move = (event: PointerEvent) => {
      const p = local(event);
      if (!pointer.active) {
        pointer.x = p.x;
        pointer.y = p.y;
      }
      pointer.tx = p.x;
      pointer.ty = p.y;
      pointer.active = event.pointerType === "mouse";
    };
    const leave = () => {
      pointer.active = false;
    };
    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a, button, input")) return;
      const p = local(event);
      waves.push({ ...p, start: performance.now() });
      start();
    };

    build();
    if (reduce) draw(0);
    const resize = new ResizeObserver(() => {
      build();
      if (!running) draw(0);
    });
    resize.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(hero);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("pointerdown", down, { passive: true });
    start();
    return () => {
      stop();
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("pointerdown", down);
    };
  }, []);

  return <canvas ref={canvas} className="hero-field" aria-hidden="true" />;
}
