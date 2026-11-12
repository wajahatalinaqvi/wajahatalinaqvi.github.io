"use client";
import { useRef, type ReactNode } from "react";
import {
  gsap,
  SplitText,
  useGSAP,
  motionConditions,
  pointerQuery,
} from "@/lib/motion";

export function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        const { reduce, mobile } = context.conditions!;
        if (reduce) return;
        // Characters rise through the existing line masks.
        const split = SplitText.create(".hero-line", {
          type: "chars",
          charsClass: "hero-char",
          aria: "none",
        });
        const intro = gsap.utils.toArray<HTMLElement>(".hero-scramble");
        gsap
          .timeline({ defaults: { duration: 0.7, ease: "power3.out" } })
          .from(".hero-intro", { opacity: 0, duration: 0.4 }, 0.05)
          .from(
            intro,
            {
              duration: 1.1,
              ease: "none",
              stagger: 0.25,
              scrambleText: {
                text: "{original}",
                chars: "01<>/{}#_",
                revealDelay: 0.25,
                speed: 0.6,
              },
            },
            0.05,
          )
          .from(
            split.chars,
            {
              yPercent: 115,
              rotate: 6,
              opacity: 0,
              duration: 0.95,
              ease: "expo.out",
              stagger: { each: 0.028, from: "start" },
            },
            0.15,
          )
          .from(
            ".headline-period",
            { scale: 0, duration: 0.6, ease: "back.out(4)" },
            0.85,
          )
          .from(".hero-description", { y: 20, opacity: 0 }, 0.55)
          .from(
            ".hero-actions .button",
            { y: 18, opacity: 0, stagger: 0.08 },
            0.65,
          )
          .from(".hero-socials", { opacity: 0 }, 0.8)
          .from(".hero-bottom", { opacity: 0 }, 0.9)
          .from(
            ".architecture-enter",
            { y: mobile ? 18 : 48, opacity: 0, duration: 1.1 },
            0.6,
          );

        // Scrolling away: the two headline lines part, the copy recedes.
        const exit = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        };
        gsap.to(".hero h1 .hero-mask:first-child .hero-line", {
          xPercent: mobile ? -4 : -9,
          ease: "none",
          scrollTrigger: exit,
        });
        gsap.to(".hero h1 .hero-secondary .hero-line", {
          xPercent: mobile ? 4 : 9,
          ease: "none",
          scrollTrigger: exit,
        });
        gsap.to(".hero h1, .hero-intro, .hero-description", {
          opacity: 0.15,
          ease: "power1.in",
          scrollTrigger: { ...exit, end: "45% top" },
        });
        gsap.to(".architecture-scroll", {
          y: mobile ? -12 : -40,
          scale: mobile ? 0.98 : 0.9,
          ease: "none",
          scrollTrigger: { ...exit, id: "hero-composition" },
        });
        if (!mobile) {
          for (const [cls, x] of [
            [".architecture-frontend", -26],
            [".architecture-backend", 26],
          ] as const)
            gsap.from(cls, {
              x,
              ease: "none",
              scrollTrigger: { ...exit, end: "bottom 25%" },
            });
        }
        return () => split.revert();
      });

      // Pointer: a soft mint spotlight follows the cursor across the hero,
      // and headline letters lift as the pointer passes over them.
      media.add(pointerQuery, () => {
        const hero = root.current!;
        const setX = gsap.quickTo(hero, "--spot-x", {
          duration: 0.8,
          ease: "power3",
        });
        const setY = gsap.quickTo(hero, "--spot-y", {
          duration: 0.8,
          ease: "power3",
        });
        const move = (event: PointerEvent) => {
          const bounds = hero.getBoundingClientRect();
          setX(event.clientX - bounds.left);
          setY(event.clientY - bounds.top);
        };
        const lift = (event: PointerEvent) => {
          const char = (event.target as HTMLElement).closest(".hero-char");
          if (!char || gsap.isTweening(char)) return;
          gsap
            .timeline()
            .to(char, {
              yPercent: -14,
              color: "#63e6be",
              duration: 0.22,
              ease: "power2.out",
            })
            .to(char, {
              yPercent: 0,
              color: "",
              duration: 0.7,
              ease: "elastic.out(1, 0.4)",
            });
        };
        hero.addEventListener("pointermove", move, { passive: true });
        hero.addEventListener("pointerover", lift, { passive: true });
        hero.dataset.spotlight = "on";
        return () => {
          hero.removeEventListener("pointermove", move);
          hero.removeEventListener("pointerover", lift);
          delete hero.dataset.spotlight;
        };
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
