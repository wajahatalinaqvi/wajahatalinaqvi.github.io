import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger, useGSAP };

export const motionConditions = {
  desktop: "(min-width: 900px)",
  tablet: "(min-width: 700px) and (max-width: 899px)",
  mobile: "(max-width: 699px)",
  reduce: "(prefers-reduced-motion: reduce)",
};
export const pointerQuery =
  "(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// Pointer input schedules at most one frame. No idle loop or React scroll state.
// quickTo tweens are constructed inside the caller's GSAP context for cleanup.
export function bindPointerMotion(
  boundary: HTMLElement,
  target: HTMLElement,
  mode: "tilt" | "magnetic",
) {
  const xTo = gsap.quickTo(target, mode === "tilt" ? "rotationY" : "x", {
    duration: 0.35,
    ease: "power3.out",
  });
  const yTo = gsap.quickTo(target, mode === "tilt" ? "rotationX" : "y", {
    duration: 0.35,
    ease: "power3.out",
  });
  const limit = gsap.utils.clamp(-1, 1);
  let frame = 0;
  let clientX = 0;
  let clientY = 0;
  const move = (event: PointerEvent) => {
    clientX = event.clientX;
    clientY = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const bounds = boundary.getBoundingClientRect();
      const x = limit(((clientX - bounds.left) / bounds.width) * 2 - 1);
      const y = limit(((clientY - bounds.top) / bounds.height) * 2 - 1);
      xTo(x * (mode === "tilt" ? 2.2 : 3));
      yTo(y * (mode === "tilt" ? -2.2 : 2));
      frame = 0;
    });
  };
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    xTo(0);
    yTo(0);
  };
  boundary.addEventListener("pointermove", move, { passive: true });
  boundary.addEventListener("pointerleave", reset);
  return () => {
    cancelAnimationFrame(frame);
    boundary.removeEventListener("pointermove", move);
    boundary.removeEventListener("pointerleave", reset);
  };
}
