"use client";
import { useRef, type ReactNode } from "react";
import {
  gsap,
  ScrollTrigger,
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
        gsap.utils
          .toArray<HTMLElement>(".section-heading, .approach-section > div")
          .forEach((element) => {
            gsap.from(element, {
              y: 28,
              opacity: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            });
          });
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
          .from(".about-copy h2", { y: 34, opacity: 0 }, 0.12)
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
        gsap.from(".approach-steps li", {
          y: 24,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".approach-steps",
            start: "top 90%",
            once: true,
          },
        });
        gsap.from(".contact-copy h2", {
          y: 25,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 85%",
            once: true,
          },
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
