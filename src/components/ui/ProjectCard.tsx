import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className={`project-card project-${project.tone}`} data-reveal>
      <Link
        className="project-image-link"
        href={`/projects/${project.slug}/`}
        aria-label={`View ${project.name} case study`}
      >
        <div className="project-image">
          <div className="browser-chrome">
            <span />
            <span />
            <span />
            <p>{project.name.toLowerCase().replaceAll(" ", "")}</p>
            <ArrowUpRight size={12} />
          </div>
          <Image
            src={project.image}
            alt={project.alt}
            width={1200}
            height={800}
            sizes="(max-width: 700px) 92vw, 44vw"
            className="project-screenshot"
          />
        </div>
        <span className="project-open">
          <ArrowUpRight size={21} aria-hidden="true" />
        </span>
        <span className="project-visual-label">{project.type}</span>
      </Link>
      <div className="project-info">
        <div className="project-index">0{index + 1}</div>
        <div>
          <p className="project-type">{project.type}</p>
          <h3>
            <Link href={`/projects/${project.slug}/`}>
              {project.name}
              <ArrowUpRight size={21} aria-hidden="true" />
            </Link>
          </h3>
          <p className="project-summary">{project.summary}</p>
          <p className="project-contribution">
            <span>My contribution</span>
            {project.contribution}
          </p>
          <ul className="tech-list" aria-label={`${project.name} technologies`}>
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="project-actions">
            <Link href={`/projects/${project.slug}/`}>
              View case study <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <a href={project.url} target="_blank" rel="noreferrer">
              {project.url.includes("swishtag.com")
                ? "Project reference"
                : "Live website"}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
