"use client";
import { useRef, type ReactNode } from "react";
import {
  gsap,
  useGSAP,
  motionConditions,
  pointerQuery,
  bindPointerMotion,
} from "@/lib/motion";

export function ProjectMotion({
  children,
  tone,
}: {
  children: ReactNode;
  tone: string;
}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        const { reduce, desktop } = context.conditions!;
        if (reduce) return;
        gsap
          .timeline({
            defaults: { duration: 0.75, ease: "power3.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 89%",
              once: true,
            },
          })
          .fromTo(
            ".project-shutter",
            { scaleY: 1 },
            { scaleY: 0, transformOrigin: "center top" },
            0,
          )
          .from(".project-screenshot", { scale: 1.06, duration: 0.9 }, 0.04)
          .from(".project-info h3", { y: 24, opacity: 0, duration: 0.65 }, 0.15)
          .from(
            ".project-summary, .project-contribution, .tech-list, .project-actions",
            { y: 16, opacity: 0, duration: 0.6, stagger: 0.07 },
            0.24,
          );
        // The card frame opens from a narrow window to full bleed as it
        // travels up the viewport.
        gsap.fromTo(
          ".project-image-link",
          { clipPath: "inset(9% 7% 9% 7% round 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 8px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "top 45%",
              scrub: 0.6,
            },
          },
        );
        if (desktop) {
          gsap.fromTo(
            ".project-scroll",
            { yPercent: 2 },
            {
              yPercent: -2,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root.current,
                start: "top 90%",
                end: "bottom 10%",
                scrub: 0.4,
              },
            })
            .fromTo(
              ".project-focus-ring",
              { opacity: 0.1 },
              { opacity: 0.9, duration: 1 },
            )
            .to(".project-focus-ring", { opacity: 0.2, duration: 1 });
        }
      });
      media.add(pointerQuery, () =>
        bindPointerMotion(
          root.current!.querySelector<HTMLElement>(".project-image-link")!,
          root.current!.querySelector<HTMLElement>(".project-tilt")!,
          "tilt",
        ),
      );
      root.current?.setAttribute("data-motion-ready", "true");
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <article ref={root} className={`project-card project-${tone}`}>
      {children}
    </article>
  );
}
