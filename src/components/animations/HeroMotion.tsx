"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, motionConditions } from "@/lib/motion";

export function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        const { reduce, mobile } = context.conditions!;
        if (reduce) return;
        gsap
          .timeline({ defaults: { duration: 0.7, ease: "power3.out" } })
          .from(".hero-intro", { y: 16, opacity: 0 }, 0.08)
          .from(
            ".hero-line",
            { yPercent: 108, rotation: 1.5, stagger: 0.1 },
            0.15,
          )
          .from(".headline-period", { y: 20, opacity: 0, duration: 0.4 }, 0.48)
          .from(".hero-description", { y: 20, opacity: 0 }, 0.4)
          .from(
            ".hero-actions .button",
            { y: 18, opacity: 0, stagger: 0.08 },
            0.52,
          )
          .from(".hero-socials", { opacity: 0 }, 0.65)
          .from(
            ".architecture-enter",
            { y: mobile ? 18 : 32, opacity: 0 },
            0.56,
          );
        gsap.to(".architecture-scroll", {
          y: mobile ? -12 : -28,
          scale: mobile ? 0.98 : 0.92,
          ease: "none",
          scrollTrigger: {
            id: "hero-composition",
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        if (!mobile) {
          gsap.from(".architecture-frontend", {
            x: -22,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom 25%",
              scrub: 0.6,
            },
          });
          gsap.from(".architecture-backend", {
            x: 22,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom 25%",
              scrub: 0.6,
            },
          });
        }
      });
      root.current?.setAttribute("data-motion-ready", "true");
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      className="hero container"
      aria-labelledby="hero-heading"
    >
      {children}
    </section>
  );
}
