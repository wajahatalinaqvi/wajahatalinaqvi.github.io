"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { gsap, ScrollTrigger, useGSAP, pointerQuery } from "@/lib/motion";

const filters = ["All work", "Applications", "Storefronts"] as const;
export function FeaturedProjects() {
  const [filter, setFilter] = useState<string>("All work");
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(frame);
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );
  // Archive rows: a screenshot trails the cursor, swapping as rows change.
  const [preview, setPreview] = useState<string | null>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(pointerQuery, () => {
        const list = root.current!.querySelector<HTMLElement>(".archive-list");
        const card =
          root.current!.querySelector<HTMLElement>(".archive-preview");
        if (!list || !card) return;
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          scale: 0.6,
          opacity: 0,
        });
        const xTo = gsap.quickTo(card, "x", { duration: 0.55, ease: "power3" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.55, ease: "power3" });
        const rTo = gsap.quickTo(card, "rotate", {
          duration: 0.6,
          ease: "power3",
        });
        let lastX = 0;
        const move = (event: PointerEvent) => {
          xTo(event.clientX);
          yTo(event.clientY);
          rTo(gsap.utils.clamp(-10, 10, (event.clientX - lastX) * 0.6));
          lastX = event.clientX;
        };
        const enter = (event: PointerEvent) => {
          lastX = event.clientX;
          gsap.set(card, { x: event.clientX, y: event.clientY });
          gsap.to(card, {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: "expo.out",
          });
        };
        const leave = () =>
          gsap.to(card, {
            scale: 0.6,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        list.addEventListener("pointermove", move, { passive: true });
        list.addEventListener("pointerenter", enter);
        list.addEventListener("pointerleave", leave);
        return () => {
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerenter", enter);
          list.removeEventListener("pointerleave", leave);
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );
  const featured = projects
    .slice(0, 4)
    .filter((project) => filter === "All work" || project.category === filter);
  return (
    <section ref={root} id="work" className="section work-section container">
      <SectionHeading
        label="Selected work"
        title="Built to solve. Made to last."
        description="A selection of application interfaces and commerce experiences I’ve helped bring to life."
      />
      <div className="work-toolbar">
        <div
          className="project-filters"
          role="group"
          aria-label="Filter featured projects"
        >
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              {item === "All work" && <span>04</span>}
            </button>
          ))}
        </div>
        <span className="work-caption">SELECTED PROJECTS / 2023—2026</span>
      </div>
      <p className="sr-only" role="status">
        {featured.length} featured projects shown
      </p>
      <div className="project-grid" key={filter}>
        {featured.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={projects.indexOf(project)}
          />
        ))}
      </div>
      <details className="project-archive">
        <summary>
          More from the archive{" "}
          <span>
            04 projects <ArrowDown size={16} aria-hidden="true" />
          </span>
        </summary>
        <div className="archive-list">
          {projects.slice(4).map((project) => (
            <Link
              href={`/projects/${project.slug}/`}
              key={project.slug}
              onPointerEnter={() => setPreview(project.image)}
            >
              <span>
                {project.name}
                <small>{project.type}</small>
              </span>
              <span>
                {project.stack.slice(0, 2).join(" / ")}
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </details>
      <div className="archive-preview" aria-hidden="true">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={preview} src={preview} alt="" />
        )}
      </div>
    </section>
  );
}
