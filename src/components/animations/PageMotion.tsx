"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 0.85 } })
          .from("[data-hero]", {
            y: 24,
            opacity: 0,
            stagger: 0.09,
            clearProps: "all",
          })
          .from(
            ".system-world",
            { y: 30, opacity: 0, clearProps: "all" },
            "<0.3",
          );
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          // Leave essential content visible; only transform below-the-fold sections.
          gsap.from(element, {
            y: 22,
            duration: 0.75,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: element, start: "top 95%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>(".project-image").forEach((element) => {
          gsap.from(element, {
            scale: 0.96,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 95%", once: true },
            clearProps: "transform",
          });
        });
        gsap.fromTo(
          ".timeline-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.4,
            },
          },
        );
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
