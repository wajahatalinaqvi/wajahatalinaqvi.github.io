"use client";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RotateCcw, Shuffle, X } from "lucide-react";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  gsap,
  Draggable,
  Flip,
  useGSAP,
  motionConditions,
  pointerQuery,
} from "@/lib/motion";

// Every technology named in the real project data, most used first.
const usage = new Map<string, number>();
for (const project of projects)
  for (const tech of project.stack) usage.set(tech, (usage.get(tech) ?? 0) + 1);
const technologies = [...usage.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count }));

export function StackLab() {
  const root = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [stack, setStack] = useState<string[]>([]);

  const toggle = (name: string, force?: boolean) => {
    flipState.current = Flip.getState(".lab-result, .lab-chip");
    setStack((current) => {
      const has = current.includes(name);
      const next = force ?? !has;
      if (next === has) return current;
      return next ? [...current, name] : current.filter((n) => n !== name);
    });
  };

  const ranked = useMemo(() => {
    return projects
      .map((project, order) => {
        const matched = project.stack.filter((tech) => stack.includes(tech));
        return { project, matched, order };
      })
      .sort((a, b) =>
        stack.length
          ? b.matched.length - a.matched.length || a.order - b.order
          : a.order - b.order,
      );
  }, [stack]);
  const full = ranked.filter(
    (r) => stack.length && r.matched.length === stack.length,
  );
  const partial = ranked.filter((r) => r.matched.length > 0);

  // Re-rank results with Flip whenever the stack changes.
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    Flip.from(state, {
      targets: ".lab-result, .lab-chip",
      duration: 0.6,
      ease: "power3.inOut",
      absolute: false,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.25 }),
    });
  }, [stack]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        if (context.conditions!.reduce) return;
        // Tokens tumble into the arena the first time it is seen.
        gsap.from(".lab-token", {
          y: -220,
          rotate: () => gsap.utils.random(-40, 40),
          opacity: 0,
          duration: 1.1,
          ease: "bounce.out",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: {
            trigger: ".lab-arena",
            start: "top 80%",
            once: true,
          },
        });
      });
      // Fine pointers can throw tokens; drop them on the tray to add them.
      media.add(pointerQuery, () => {
        const arena = root.current!.querySelector<HTMLElement>(".lab-arena")!;
        const tray = root.current!.querySelector<HTMLElement>(".lab-tray")!;
        const draggables = Draggable.create(".lab-token", {
          bounds: arena,
          inertia: true,
          edgeResistance: 0.75,
          zIndexBoost: true,
          minimumMovement: 6,
          onPress() {
            gsap.to(this.target, { scale: 1.08, duration: 0.2 });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.3 });
          },
          onDrag() {
            const over = this.hitTest(tray, "40%");
            tray.classList.toggle("is-over", over);
            gsap.to(this.target, {
              rotate: gsap.utils.clamp(-18, 18, this.deltaX * 1.6),
              duration: 0.3,
              overwrite: "auto",
            });
          },
          onDragEnd() {
            tray.classList.remove("is-over");
            gsap.to(this.target, {
              rotate: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
            });
            if (this.hitTest(tray, "40%")) {
              const name = (this.target as HTMLElement).dataset.tech!;
              toggle(name, true);
              // The token springs home; its chip appears in the tray.
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.6)",
              });
            }
          },
          onClick() {
            toggle((this.target as HTMLElement).dataset.tech!);
          },
        });
        root.current!.dataset.draggable = "true";
        return () => {
          draggables.forEach((d) => d.kill());
          delete root.current?.dataset.draggable;
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  const scatter = () => {
    const arena = root.current!.querySelector<HTMLElement>(".lab-arena")!;
    const box = arena.getBoundingClientRect();
    gsap.utils.toArray<HTMLElement>(".lab-token").forEach((token) => {
      const rect = token.getBoundingClientRect();
      const baseX =
        rect.left - box.left - (Number(gsap.getProperty(token, "x")) || 0);
      const baseY =
        rect.top - box.top - (Number(gsap.getProperty(token, "y")) || 0);
      gsap.to(token, {
        x: gsap.utils.random(-baseX + 8, box.width - baseX - rect.width - 8),
        y: gsap.utils.random(
          -baseY + 8,
          box.height * 0.62 - baseY - rect.height,
        ),
        rotate: gsap.utils.random(-14, 14),
        duration: 0.9,
        ease: "expo.out",
      });
    });
  };
  const reset = () => {
    gsap.to(".lab-token", {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.7)",
      stagger: 0.02,
    });
    flipState.current = Flip.getState(".lab-result, .lab-chip");
    setStack([]);
  };

  const summary = !stack.length
    ? "Pick technologies to see which projects used them."
    : full.length
      ? `${full.length} project${full.length > 1 ? "s" : ""} used ${stack.join(" + ")}.`
      : `No single project used all of these — ${partial.length} used at least one.`;

  return (
    <section ref={root} id="stack-lab" className="section stack-lab container">
      <SectionHeading
        label="Stack lab"
        title="Build a stack. See where I’ve used it."
        description="Throw the tokens around, drop them in the tray, or just tap them. Projects re-rank by how much of your stack they share."
      />
      <div className="lab-layout">
        <div className="lab-arena" data-cursor-zone>
          <div className="lab-toolbar">
            <span className="lab-hint">
              <span className="status-dot" />
              <span className="lab-hint-drag">Drag, throw or tap</span>
              <span className="lab-hint-tap">Tap to add</span>
            </span>
            <div>
              <button
                type="button"
                onClick={scatter}
                className="lab-tool lab-scatter"
              >
                <Shuffle size={14} aria-hidden="true" /> Scatter
              </button>
              <button type="button" onClick={reset} className="lab-tool">
                <RotateCcw size={14} aria-hidden="true" /> Reset
              </button>
            </div>
          </div>
          <div className="lab-tokens" role="group" aria-label="Technologies">
            {technologies.map(({ name, count }) => (
              <button
                key={name}
                type="button"
                className="lab-token"
                data-tech={name}
                aria-pressed={stack.includes(name)}
                onClick={(event) => {
                  // Draggable handles pointer clicks; keyboard uses this.
                  if (root.current?.dataset.draggable && event.detail > 0)
                    return;
                  toggle(name);
                }}
              >
                {name}
                <small>{count}×</small>
              </button>
            ))}
          </div>
          <div className="lab-tray" role="group" aria-label="Your stack">
            <span className="lab-tray-label">YOUR STACK</span>
            {stack.length === 0 && (
              <span className="lab-tray-empty">Drop technologies here</span>
            )}
            {stack.map((name) => (
              <button
                key={name}
                type="button"
                className="lab-chip"
                data-flip-id={`chip-${name}`}
                onClick={() => toggle(name, false)}
                aria-label={`Remove ${name}`}
              >
                {name} <X size={12} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <div className="lab-results">
          <p className="lab-summary" role="status" aria-live="polite">
            {summary}
          </p>
          <ol className="lab-list">
            {ranked.map(({ project, matched }) => {
              const share = stack.length ? matched.length / stack.length : 0;
              return (
                <li
                  key={project.slug}
                  className="lab-result"
                  data-flip-id={project.slug}
                  data-state={
                    !stack.length ? "idle" : matched.length ? "match" : "miss"
                  }
                >
                  <Link href={`/projects/${project.slug}/`} data-cursor="Open">
                    <span className="lab-result-name">
                      {project.name}
                      <small>{project.type}</small>
                    </span>
                    <span className="lab-result-stack">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className={matched.includes(tech) ? "is-hit" : ""}
                        >
                          {tech}
                        </span>
                      ))}
                    </span>
                    <span
                      className="lab-meter"
                      style={{ "--share": share } as React.CSSProperties}
                      aria-hidden="true"
                    />
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
