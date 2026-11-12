"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  Database,
  GitBranch,
  ShoppingBag,
} from "lucide-react";
import { skills, type SkillCategoryId } from "@/content/skills";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackDiagram } from "@/components/visuals/StackDiagram";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  motionConditions,
  pointerQuery,
} from "@/lib/motion";

const icons = [Braces, Database, ShoppingBag, GitBranch];
export function Expertise() {
  const [selected, setSelected] = useState<SkillCategoryId>("frontend");
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const category = skills.find((skill) => skill.id === selected)!;
  const index = skills.indexOf(category);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        root.current
          ?.querySelector('[role="tablist"]')
          ?.setAttribute(
            "aria-orientation",
            context.conditions!.desktop ? "vertical" : "horizontal",
          );
        if (context.conditions!.reduce) return;
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".skills-panel",
              start: "top 92%",
              once: true,
            },
          })
          .from(".skills-panel-intro", { y: 16, opacity: 0, duration: 0.4 })
          .to(
            ".skills-panel-intro h3",
            {
              duration: 0.8,
              ease: "none",
              scrambleText: {
                text: category.code,
                chars: "<>/{}[]=_01",
                speed: 0.8,
              },
            },
            0,
          )
          .from(
            ".technology-card",
            {
              y: 34,
              rotateX: -55,
              opacity: 0,
              transformOrigin: "50% 0%",
              stagger: { each: 0.06, grid: "auto", from: "start" },
              duration: 0.75,
              ease: "expo.out",
            },
            0.07,
          )
          .from(
            ".technology-mark",
            {
              scale: 0,
              rotate: -90,
              stagger: 0.06,
              duration: 0.6,
              ease: "back.out(2.5)",
            },
            0.2,
          )
          .from(".skill-evidence", { y: 12, opacity: 0, duration: 0.4 }, 0.15);
      });
      media.add(pointerQuery, () => {
        const grid =
          root.current!.querySelector<HTMLElement>(".technology-grid");
        if (!grid) return;
        const move = (event: PointerEvent) => {
          for (const card of grid.querySelectorAll<HTMLElement>(
            ".technology-card",
          )) {
            const bounds = card.getBoundingClientRect();
            card.style.setProperty(
              "--glow-x",
              `${event.clientX - bounds.left}px`,
            );
            card.style.setProperty(
              "--glow-y",
              `${event.clientY - bounds.top}px`,
            );
          }
        };
        grid.addEventListener("pointermove", move, { passive: true });
        return () => grid.removeEventListener("pointermove", move);
      });
      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refreshFrame);
        media.revert();
      };
    },
    { scope: root, dependencies: [selected], revertOnUpdate: true },
  );

  function navigate(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    let next = current;
    if (["ArrowDown", "ArrowRight"].includes(event.key))
      next = (current + 1) % skills.length;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key))
      next = (current - 1 + skills.length) % skills.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = skills.length - 1;
    else return;
    event.preventDefault();
    setSelected(skills[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section
      ref={root}
      id="expertise"
      className="section expertise-section container"
    >
      <SectionHeading
        label="Technology & expertise"
        title="The tools behind the work."
        description="Different technologies. One connected approach to building software."
      />
      <div className="skills-explorer">
        <div className="skills-sidebar">
          <div
            className="skills-category-list"
            role="tablist"
            aria-label="Technology categories"
          >
            <span
              className="skills-active-rail"
              aria-hidden="true"
              style={{ "--active-index": index } as React.CSSProperties}
            />
            {skills.map((skill, i) => {
              const Icon = icons[i];
              return (
                <button
                  key={skill.id}
                  ref={(node) => {
                    tabs.current[i] = node;
                  }}
                  id={`skill-tab-${skill.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected === skill.id}
                  aria-controls="skills-panel"
                  tabIndex={selected === skill.id ? 0 : -1}
                  onKeyDown={(event) => navigate(event, i)}
                  onClick={() => setSelected(skill.id)}
                >
                  <Icon size={23} aria-hidden="true" />
                  <span>
                    {skill.name}
                    <small>{skill.description}</small>
                  </span>
                  <ArrowUpRight
                    className="category-arrow"
                    size={17}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <div className="skills-sidebar-note">
            <span className="status-dot" />
            <p>
              Capabilities over percentages.
              <br />
              <strong>See what the tools make possible.</strong>
            </p>
          </div>
        </div>
        <div
          id="skills-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`skill-tab-${selected}`}
          className="skills-panel"
        >
          <div className="skills-panel-intro">
            <div>
              <p className="eyebrow">{category.name} / 06 technologies</p>
              <h3>{category.code}</h3>
            </div>
            <p>{category.detail}</p>
          </div>
          <StackDiagram selected={selected} onSelect={setSelected} />
          <ul
            className="technology-grid"
            aria-label={`${category.name} technologies`}
          >
            {category.technologies.map((technology) => (
              <li key={technology.name} className="technology-card">
                <div className="technology-card-top">
                  <span className="technology-mark" aria-hidden="true">
                    {technology.mark}
                  </span>
                  <h4>{technology.name}</h4>
                </div>
                <p>{technology.capability}</p>
                <span className="technology-context">{technology.context}</span>
              </li>
            ))}
          </ul>
          <div className="skill-evidence">
            <span className="skill-evidence-label">IN PRACTICE</span>
            <p>{category.evidenceNote}</p>
            <div className="skill-evidence-links">
              {category.projects.map((slug) => {
                const project = projects.find((item) => item.slug === slug)!;
                return (
                  <Link key={slug} href={`/projects/${slug}/`}>
                    {project.name}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                );
              })}
              {selected === "workflow" && (
                <a href="#work">
                  Explore the project work
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {selected === "backend" && (
                <a href="#about">
                  Read about my approach
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <noscript>
        <div className="skills-nojs">
          {skills.slice(1).map((skill) => (
            <div key={skill.id}>
              <h3>{skill.name}</h3>
              <p>
                {skill.technologies
                  .map((technology) => technology.name)
                  .join(" · ")}
              </p>
              <p>{skill.detail}</p>
            </div>
          ))}
        </div>
      </noscript>
    </section>
  );
}
