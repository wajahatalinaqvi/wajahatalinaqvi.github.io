"use client";
import { useRef } from "react";
import { skills } from "@/content/skills";
import { gsap, ScrollTrigger, useGSAP, motionConditions } from "@/lib/motion";

const all = skills.flatMap((category) =>
  category.technologies.map((technology) => ({
    ...technology,
    category: category.name,
  })),
);
const rows = [all.filter((_, i) => i % 2 === 0), all.filter((_, i) => i % 2)];

// Two counter-moving rails of every technology on the site. Scroll velocity
// speeds them up, flips their direction and leans the type into the motion.
export function TechMarquee() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        if (context.conditions!.reduce) return;
        const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track");
        const loops = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: i % 2 ? -50 : 0 },
            {
              xPercent: i % 2 ? 0 : -50,
              duration: 38 + i * 6,
              ease: "none",
              repeat: -1,
            },
          ),
        );
        // Start deep into the loop so reversing on upward scroll never stalls.
        loops.forEach((loop) => loop.totalTime(loop.duration() * 200));
        const skewTo = gsap.quickTo(".marquee-row", "skewX", {
          duration: 0.5,
          ease: "power3",
        });
        let direction = 1;
        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) =>
            loops.forEach((loop) =>
              self.isActive ? loop.play() : loop.pause(),
            ),
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            if (Math.abs(velocity) > 40) direction = velocity > 0 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(velocity) / 350, 5);
            loops.forEach((loop) =>
              gsap.to(loop, {
                timeScale: boost * direction,
                duration: 0.2,
                overwrite: true,
                onComplete: () => {
                  gsap.to(loop, {
                    timeScale: direction,
                    duration: 1.2,
                    ease: "power2.out",
                  });
                },
              }),
            );
            skewTo(gsap.utils.clamp(-8, 8, velocity / -220));
          },
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        });
        if (!trigger.isActive) loops.forEach((loop) => loop.pause());
        gsap.from(".marquee-row", {
          xPercent: (i) => (i % 2 ? 12 : -12),
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            once: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="tech-marquee"
      aria-label="Technologies I work with"
    >
      <p className="sr-only">
        {all.map((technology) => technology.name).join(", ")}
      </p>
      {rows.map((row, r) => (
        <div className="marquee-row" key={r} aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) =>
              row.map((technology) => (
                <span
                  className="marquee-item"
                  key={`${copy}-${technology.name}`}
                >
                  <span className="marquee-mark">{technology.mark}</span>
                  {technology.name}
                  <small>{technology.category}</small>
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
