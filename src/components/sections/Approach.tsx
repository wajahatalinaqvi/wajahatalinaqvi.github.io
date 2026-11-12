"use client";
import { useRef } from "react";
import { gsap, useGSAP, motionConditions } from "@/lib/motion";

const steps = [
  ["Discover", "Understand the people, the problem, and what success means."],
  ["Plan", "Map the system. Choose tools and boundaries with intent."],
  ["Build", "Create reusable components and clear application logic."],
  ["Test", "Check behavior, accessibility, and performance on real screens."],
  ["Ship", "Review the details, release carefully, and keep improving."],
];

// Desktop: the section pins and the process travels sideways, one stage at a
// time, while a progress rail fills. Smaller screens keep a vertical reveal.
export function Approach() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        const { reduce, desktop } = context.conditions!;
        if (reduce) return;
        const items = gsap.utils.toArray<HTMLElement>(".approach-steps li");
        if (!desktop) {
          items.forEach((item) =>
            gsap.from(item, {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 90%", once: true },
            }),
          );
          return;
        }
        const track =
          root.current!.querySelector<HTMLElement>(".approach-steps")!;
        const distance = () => track.scrollWidth - track.clientWidth;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "approach-pin",
            trigger: ".approach-stage",
            start: "top 12%",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.round(self.progress * (items.length - 1));
              items.forEach((item, i) =>
                item.classList.toggle("is-current", i === active),
              );
              const counter = root.current!.querySelector<HTMLElement>(
                ".approach-counter b",
              );
              if (counter)
                counter.textContent = String(active + 1).padStart(2, "0");
            },
          },
        });
        tl.to(track, { x: () => -distance() }, 0).fromTo(
          ".approach-rail-fill",
          { scaleX: 0 },
          { scaleX: 1 },
          0,
        );
        items.forEach((item) => {
          tl.fromTo(
            item.querySelector(".approach-number"),
            { xPercent: 30 },
            { xPercent: -30 },
            0,
          );
        });
        items[0]?.classList.add("is-current");
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      className="section approach-section container"
      aria-labelledby="approach-heading"
    >
      <div className="approach-stage">
        <div className="approach-head">
          <div>
            <p className="eyebrow">
              <span />
              How I work
            </p>
            <h2 id="approach-heading" data-split>
              Good work is a process.
            </h2>
          </div>
          <p className="approach-counter" aria-hidden="true">
            <b>01</b> / 0{steps.length}
          </p>
        </div>
        <ol className="approach-steps">
          {steps.map(([name, description], index) => (
            <li key={name}>
              <span className="approach-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="approach-index">0{index + 1}</span>
              <h3>{name}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <div className="approach-rail" aria-hidden="true">
          <span className="approach-rail-fill" />
        </div>
      </div>
    </section>
  );
}
