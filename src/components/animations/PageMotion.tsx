"use client";
import { useRef, type ReactNode } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  motionConditions,
  pointerQuery,
  bindPointerMotion,
} from "@/lib/motion";

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        const { reduce, desktop } = context.conditions!;
        if (reduce) return;
        // Headings: words rise out of per-line masks, the eyebrow marker
        // draws in, and supporting copy follows.
        const splits = gsap.utils
          .toArray<HTMLElement>(
            ".section-heading h2, .about-copy h2, .contact-copy h2, [data-split]",
          )
          .map((heading) => {
            const split = SplitText.create(heading, {
              type: "lines,words",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.words, {
                  yPercent: 110,
                  rotate: 3,
                  duration: 1,
                  ease: "expo.out",
                  stagger: 0.045,
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 88%",
                    once: true,
                  },
                }),
            });
            return split;
          });
        gsap.utils.toArray<HTMLElement>(".eyebrow").forEach((eyebrow) => {
          gsap.from(eyebrow, {
            opacity: 0,
            x: -12,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: eyebrow, start: "top 92%", once: true },
          });
          const marker = eyebrow.querySelector("span");
          if (marker)
            gsap.from(marker, {
              scale: 0,
              rotate: 90,
              duration: 0.6,
              ease: "back.out(3)",
              scrollTrigger: { trigger: eyebrow, start: "top 92%", once: true },
            });
        });
        gsap.utils
          .toArray<HTMLElement>(".section-description")
          .forEach((element) =>
            gsap.from(element, {
              y: 24,
              opacity: 0,
              duration: 0.9,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            }),
          );
        gsap
          .timeline({
            defaults: { duration: 0.8, ease: "power3.out" },
            scrollTrigger: {
              trigger: ".about-section",
              start: "top 82%",
              once: true,
            },
          })
          .fromTo(
            ".portrait-shutter",
            { scaleY: 1 },
            { scaleY: 0, transformOrigin: "center bottom" },
            0,
          )
          .from(
            ".about-copy > p:not(.eyebrow)",
            { y: 20, opacity: 0, stagger: 0.09, duration: 0.65 },
            0.24,
          )
          .from(
            ".about-copy > .text-link, .about-signature, .portrait-caption",
            { opacity: 0, stagger: 0.1 },
            0.5,
          );
        if (desktop)
          gsap.fromTo(
            ".about-photo > img",
            { yPercent: -3, scale: 1.08 },
            {
              yPercent: 3,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-photo",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        gsap.fromTo(
          ".timeline-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              id: "career-progress",
              trigger: ".timeline",
              start: "top 75%",
              end: "bottom 65%",
              scrub: 0.35,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>(".timeline li").forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 75%",
            end: "max",
            toggleClass: { targets: item, className: "is-reached" },
          });
          gsap.from(item.querySelectorAll("h3, h4, .timeline-description"), {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
        });
        gsap.from(".contact-form", {
          x: desktop ? 24 : 0,
          y: desktop ? 0 : 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 92%",
            once: true,
          },
        });
        return () => {
          splits.forEach((split) => split.revert());
        };
      });
      media.add(pointerQuery, () => {
        const cleanups = gsap.utils
          .toArray<HTMLElement>("[data-magnetic]")
          .map((button) =>
            bindPointerMotion(
              button,
              button.querySelector<HTMLElement>("[data-magnetic-content]") ||
                button,
              "magnetic",
            ),
          );
        return () => cleanups.forEach((cleanup) => cleanup());
      });
      const archive = root.current?.querySelector("details");
      const refresh = () => ScrollTrigger.refresh();
      archive?.addEventListener("toggle", refresh);
      const refreshFrame = requestAnimationFrame(refresh);
      return () => {
        cancelAnimationFrame(refreshFrame);
        archive?.removeEventListener("toggle", refresh);
        media.revert();
      };
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
