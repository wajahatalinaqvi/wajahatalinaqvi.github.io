"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, motionConditions } from "@/lib/motion";

const statement =
  "The interface matters. So does everything behind it. I connect React interfaces, Laravel services, APIs and Shopify commerce into one system that feels simple to the people using it.";
const highlights = ["interface", "everything", "one", "system", "simple"];

// Words brighten one by one as the visitor reads down the page: the scroll
// position is the reading cursor.
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        const { reduce, mobile } = context.conditions!;
        if (reduce) return;
        const split = SplitText.create(".manifesto-text", {
          type: "words",
          wordsClass: "manifesto-word",
          aria: "none",
        });
        split.words.forEach((word) => {
          const clean = word.textContent!.replace(/[^a-z]/gi, "").toLowerCase();
          if (highlights.includes(clean)) word.classList.add("is-key");
        });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: mobile ? "top 75%" : "top 65%",
              end: mobile ? "bottom 60%" : "bottom 55%",
              scrub: 0.5,
            },
          })
          .fromTo(
            split.words,
            { opacity: 0.12, filter: "blur(3px)", y: 6 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              stagger: 0.12,
              ease: "power1.out",
            },
          )
          .fromTo(
            ".manifesto-rule",
            { scaleX: 0 },
            { scaleX: 1, ease: "none", duration: split.words.length * 0.12 },
            0,
          );
        return () => split.revert();
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      className="manifesto container"
      aria-labelledby="manifesto-label"
    >
      <p className="eyebrow" id="manifesto-label">
        <span />
        What I believe
      </p>
      <p className="manifesto-text">{statement}</p>
      <span className="manifesto-rule" aria-hidden="true" />
    </section>
  );
}
