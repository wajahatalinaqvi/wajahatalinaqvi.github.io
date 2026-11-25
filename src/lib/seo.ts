import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import type { Project } from "@/content/projects";

// One identity graph shared by every page. Pages reference the Person and
// WebSite by @id instead of repeating them, which is how search engines
// connect a profile page, its case studies, and the author behind them.
export const site = {
  url: profile.url,
  name: profile.name,
  title: "Shopify Full-Stack Developer",
  personId: `${profile.url}/#person`,
  websiteId: `${profile.url}/#website`,
};

export const projectOgImage = (slug: string) => `/og/${slug}.jpg`;

export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export function identityGraph() {
  const current = experience.find((item) => item.period.includes("present"));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": site.personId,
        name: profile.name,
        jobTitle: site.title,
        description:
          "Shopify full-stack developer in Lahore, Pakistan, building Shopify apps, Liquid storefronts, React interfaces, and Laravel APIs.",
        url: `${profile.url}/`,
        image: `${profile.url}/images/wajahat-naqvi.webp`,
        email: `mailto:${profile.email}`,
        sameAs: [profile.github, profile.linkedin],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressCountry: "PK",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Superior University",
        },
        ...(current && {
          worksFor: { "@type": "Organization", name: current.company },
        }),
        knowsAbout: [
          "Shopify Development",
          "Shopify Apps",
          "Shopify Liquid",
          "Shopify Polaris",
          "Checkout UI Extensions",
          "React",
          "TypeScript",
          "Next.js",
          "Laravel",
          "PHP",
          "GraphQL",
          "REST APIs",
          "Ecommerce Development",
          "AI Workflows",
        ],
      },
      {
        "@type": "WebSite",
        "@id": site.websiteId,
        url: `${profile.url}/`,
        name: `${profile.name} — ${site.title}`,
        inLanguage: "en",
        publisher: { "@id": site.personId },
      },
    ],
  };
}

export function profilePageGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${profile.url}/#profile`,
    url: `${profile.url}/`,
    name: `${profile.name} — ${site.title}`,
    isPartOf: { "@id": site.websiteId },
    mainEntity: { "@id": site.personId },
    inLanguage: "en",
  };
}

export function projectGraph(project: Project) {
  const url = `${profile.url}/projects/${project.slug}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: project.name,
        headline: `${project.name} — ${project.type}`,
        description: `${project.summary} ${project.contribution}`,
        genre: project.type,
        keywords: [...project.stack, project.category, "Shopify"].join(", "),
        image: `${profile.url}${projectOgImage(project.slug)}`,
        author: { "@id": site.personId },
        creator: { "@id": site.personId },
        isPartOf: { "@id": site.websiteId },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${profile.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Selected work",
            item: `${profile.url}/#work`,
          },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };
}
