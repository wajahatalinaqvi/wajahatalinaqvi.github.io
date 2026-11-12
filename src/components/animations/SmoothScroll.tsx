"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

// Inertial wheel scrolling for fine pointers only. Touch, keyboard and
// reduced-motion users keep the browser's native scroll untouched.
const smoothQuery =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function SmoothScroll() {
  useEffect(() => {
    const query = matchMedia(smoothQuery);
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis || !query.matches) return;
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        anchors: { offset: -96 },
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.dataset.smooth = "true";
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    };
    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      tick = null;
      delete document.documentElement.dataset.smooth;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
    const change = () => (query.matches ? start() : stop());
    start();
    query.addEventListener("change", change);
    return () => {
      query.removeEventListener("change", change);
      stop();
    };
  }, []);
  return null;
}
