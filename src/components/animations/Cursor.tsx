"use client";
import { useRef } from "react";
import { gsap, useGSAP, pointerQuery } from "@/lib/motion";

// A trailing ring that reacts to what it hovers. Elements opt in with
// data-cursor="label" (shows a pill with text) or are detected as links.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(pointerQuery, () => {
      const el = ring.current!;
      const text = label.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      let visible = false;
      let mode = "";
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        xTo(event.clientX);
        yTo(event.clientY);
        if (!visible) {
          visible = true;
          gsap.set(el, { x: event.clientX, y: event.clientY });
          gsap.to(el, { opacity: 1, duration: 0.3 });
        }
      };
      const setMode = (next: string, copy = "") => {
        if (next === mode && text.textContent === copy) return;
        mode = next;
        el.dataset.mode = next;
        text.textContent = copy;
      };
      const over = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        const labelled = target.closest<HTMLElement>("[data-cursor]");
        if (labelled) return setMode("label", labelled.dataset.cursor);
        if (target.closest("a, button, summary, [role='tab']"))
          return setMode("link");
        if (target.closest("input, textarea, select")) return setMode("text");
        setMode("");
      };
      const leave = () => {
        visible = false;
        gsap.to(el, { opacity: 0, duration: 0.25 });
      };
      const down = () => gsap.to(el, { scale: 0.82, duration: 0.15 });
      const up = () =>
        gsap.to(el, { scale: 1, duration: 0.35, ease: "back.out(3)" });
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("pointerdown", down, { passive: true });
      window.addEventListener("pointerup", up, { passive: true });
      document.documentElement.dataset.customCursor = "on";
      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        delete document.documentElement.dataset.customCursor;
      };
    });
    return () => media.revert();
  });
  return (
    <div ref={ring} className="cursor-ring" aria-hidden="true">
      <span ref={label} className="cursor-label" />
    </div>
  );
}
