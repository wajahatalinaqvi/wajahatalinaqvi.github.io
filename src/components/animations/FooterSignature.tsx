"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, motionConditions } from "@/lib/motion";

// Viewport-wide signature that rises letter by letter as the page ends, then
// drifts slightly with the last few hundred pixels of scroll.
export function FooterSignature({ text }: { text: string }) {
  const root = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        if (context.conditions!.reduce) return;
        const split = SplitText.create(root.current, {
          type: "chars",
          charsClass: "signature-char",
          aria: "none",
        });
        gsap.from(split.chars, {
          yPercent: 105,
          ease: "expo.out",
          duration: 1.3,
          stagger: { each: 0.035, from: "center" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 100%",
            once: true,
          },
        });
        gsap.fromTo(
          split.chars,
          { "--signature-glow": 0 },
          {
            "--signature-glow": 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
        return () => split.revert();
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <p ref={root} className="footer-signature" aria-hidden="true">
      {text}
    </p>
  );
}
