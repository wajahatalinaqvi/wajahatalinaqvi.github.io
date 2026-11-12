"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ScrollTrigger, useGSAP } from "@/lib/motion";

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
            <Link href={`/projects/${project.slug}/`} key={project.slug}>
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
    </section>
  );
}
