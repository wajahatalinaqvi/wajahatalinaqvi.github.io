import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { jsonLd, projectGraph, projectOgImage } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// What each listed technology does, in general terms. Skills content is
// reused where it names the same tool; the rest describe the tool itself,
// not a claim about the project beyond it being in the stack.
const capabilityByName = new Map(
  skills.flatMap((category) =>
    category.technologies.map((t) => [
      t.name.replace(/\.js$/, ""),
      t.capability,
    ]),
  ),
);
const extraCapabilities: Record<string, string> = {
  Redux: "Predictable application state shared across interface screens.",
  "Node.js": "Server-side JavaScript for application services and tooling.",
  Figma: "Design handoff: translating Figma layouts into a working build.",
  "Checkout UI":
    "Shopify checkout UI extensions that add functionality inside checkout.",
};
const capabilityOf = (tech: string) =>
  capabilityByName.get(tech) ?? extraCapabilities[tech];

const platformLabel = (project: Project) =>
  project.category === "Applications" ? "Shopify app" : "Shopify storefront";

function related(project: Project) {
  return projects
    .filter((other) => other.slug !== project.slug)
    .map((other) => ({
      other,
      shared: other.stack.filter((tech) => project.stack.includes(tech)),
    }))
    .filter((item) => item.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length)
    .slice(0, 3);
}

function describe(project: Project) {
  const text = `${project.summary} ${project.contribution}`;
  return text.length > 158 ? `${text.slice(0, 155).trimEnd()}…` : text;
}

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  const title = `${project.name}: ${platformLabel(project)} built with ${project.stack
    .slice(0, 2)
    .join(" & ")}`;
  const description = describe(project);
  const image = {
    url: projectOgImage(slug),
    width: 1200,
    height: 630,
    alt: `${project.name} case study by Wajahat Naqvi`,
  };
  return {
    title,
    description,
    keywords: [
      project.name,
      ...project.stack,
      platformLabel(project),
      "Shopify developer",
      "Wajahat Naqvi",
    ],
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: {
      type: "article",
      title: `${title} — Wajahat Naqvi`,
      description,
      url: `/projects/${slug}/`,
      siteName: "Wajahat Naqvi",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Wajahat Naqvi`,
      description,
      images: [image.url],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  const neighbours = related(project);
  const isApp = project.category === "Applications";
  return (
    <main id="main-content" tabIndex={-1} className="case-study container">
      <nav aria-label="Breadcrumb" className="case-breadcrumb">
        <Link href="/#work" className="text-link case-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to selected work
        </Link>
      </nav>
      <header className="case-header">
        <p className="eyebrow">
          <span />
          {project.type}
        </p>
        <h1>
          {project.name}
          <span>.</span>
        </h1>
        <p>{project.summary}</p>
        <div className="case-meta">
          <div>
            <span>My role</span>
            <p>{project.contribution}</p>
          </div>
          <div>
            <span>Technologies</span>
            <ul className="tech-list">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <a
            className="text-link"
            href={project.url}
            target="_blank"
            rel="noopener"
          >
            {project.url.includes("swishtag.com")
              ? "View project reference"
              : "Visit live website"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>
      <figure className={`case-image project-${project.tone}`}>
        <Image
          src={project.image}
          alt={project.alt}
          width={1440}
          height={960}
          priority
          sizes="(max-width: 1200px) 92vw, 1152px"
        />
        <figcaption>
          {project.name} — {project.type.toLowerCase()}.
        </figcaption>
      </figure>
      <div className="case-body">
        <aside>
          <p className="eyebrow">
            <span />
            On this page
          </p>
          <nav aria-label="Case study contents">
            <a href="#overview">Overview</a>
            <a href="#challenge">The challenge</a>
            <a href="#role">My role</a>
            <a href="#technologies">Technologies</a>
            {neighbours.length > 0 && <a href="#related">Related work</a>}
          </nav>
        </aside>
        <div className="case-narrative">
          <section id="overview">
            <h2>Overview</h2>
            <p>
              {project.name} is a {platformLabel(project)} project:{" "}
              {project.summary.charAt(0).toLowerCase() +
                project.summary.slice(1)}
            </p>
            <p>
              {isApp
                ? "Shopify apps live inside a merchant’s day-to-day workflow, so the interface has to be clear, fast, and consistent with the Shopify admin."
                : "A storefront is where a brand meets its customers, so the theme has to present products well on every screen while staying maintainable in Liquid."}
            </p>
          </section>
          <section id="challenge">
            <h2>The challenge</h2>
            <p>{project.problem}</p>
          </section>
          <section id="role">
            <h2>My role</h2>
            <p>{project.contribution}</p>
          </section>
          <section id="technologies">
            <h2>Technologies</h2>
            <dl className="case-tech">
              {project.stack.map((tech) => (
                <div key={tech}>
                  <dt>{tech}</dt>
                  {capabilityOf(tech) && <dd>{capabilityOf(tech)}</dd>}
                </div>
              ))}
            </dl>
            <a
              className="text-link"
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let’s talk about ${project.name}`)}`}
            >
              Discuss a project like this{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </section>
          {neighbours.length > 0 && (
            <section id="related">
              <h2>Related work</h2>
              <ul className="case-related">
                {neighbours.map(({ other, shared }) => (
                  <li key={other.slug}>
                    <Link href={`/projects/${other.slug}/`}>
                      <strong>{other.name}</strong>
                      <span>
                        {other.type} · also uses {shared.join(", ")}
                      </span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      <Link className="next-project" href={`/projects/${next.slug}/`}>
        <span>
          Next project<strong>{next.name}</strong>
        </span>
        <ArrowRight size={32} aria-hidden="true" />
      </Link>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(projectGraph(project))}
      />
    </main>
  );
}
