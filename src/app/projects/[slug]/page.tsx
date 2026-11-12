import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: {
      title: `${project.name} — Wajahat Naqvi`,
      description: project.summary,
      url: `/projects/${slug}/`,
      images: [
        {
          url: "/images/social-card.png",
          width: 1200,
          height: 630,
          alt: `${project.name} — Wajahat Naqvi`,
        },
      ],
    },
    twitter: {
      title: `${project.name} — Wajahat Naqvi`,
      description: project.summary,
      images: ["/images/social-card.png"],
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main-content" tabIndex={-1} className="case-study container">
      <Link href="/#work" className="text-link case-back">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to selected work
      </Link>
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
            <span>Contribution</span>
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
            rel="noreferrer"
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
          Project asset preserved from the original public portfolio.
        </figcaption>
      </figure>
      <div className="case-body">
        <aside>
          <p className="eyebrow">
            <span />
            Project notes
          </p>
          <nav aria-label="Case study contents">
            <a href="#overview">Overview</a>
            <a href="#challenge">The challenge</a>
            <a href="#contribution">My contribution</a>
            <a href="#implementation">Implementation</a>
            <a href="#results">Results & verification</a>
          </nav>
        </aside>
        <div className="case-narrative">
          <section id="overview">
            <h2>The overview</h2>
            <p>
              {project.summary} This project was included in my original public
              portfolio as {project.type.toLowerCase()} work.
            </p>
          </section>
          <section id="challenge">
            <h2>The challenge</h2>
            <p>{project.problem}</p>
            <p className="content-note">
              Needs verification: the full business brief, constraints, and
              project-specific challenges have not yet been documented.
            </p>
          </section>
          <section id="contribution">
            <h2>My contribution</h2>
            <p>{project.contribution}</p>
            <p>
              The listed technologies are carried over from the original
              portfolio. They describe the project stack rather than a claim of
              sole ownership of the whole product.
            </p>
          </section>
          <section id="implementation">
            <h2>Architecture & implementation</h2>
            <p>
              {project.category === "Applications"
                ? "The existing portfolio identifies this as application work in the Shopify ecosystem. The public stack above is the available implementation record."
                : "The existing portfolio identifies this as custom storefront or theme work. Liquid and the listed interface technologies form the available implementation record."}
            </p>
            <p className="content-note">
              Needs verification: component boundaries, API contracts,
              implementation decisions, technical challenges, and solutions.
              Private code and client business data are intentionally excluded.
            </p>
          </section>
          <section id="results">
            <h2>Results, with context.</h2>
            <p>
              The original portfolio provides a project preview and an external
              reference. No measured outcomes or performance figures are
              available to substantiate further results.
            </p>
            <p className="content-note">
              Needs verification: delivery scope, release dates, results, and
              any additional publication permissions. The referenced website may
              have changed since the work was completed.
            </p>
            <a
              className="text-link"
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let’s talk about ${project.name}`)}`}
            >
              Discuss this project <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </section>
        </div>
      </div>
      <Link className="next-project" href={`/projects/${next.slug}/`}>
        <span>
          Next project<strong>{next.name}</strong>
        </span>
        <ArrowRight size={32} aria-hidden="true" />
      </Link>
    </main>
  );
}
