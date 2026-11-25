import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { skills } from "@/content/skills";

export const dynamic = "force-static";

// A plain-text summary for AI search and answer engines (llmstxt.org format),
// generated from the same content files as the site so it never drifts.
export function GET() {
  const lines = [
    `# ${profile.name} — Shopify Full-Stack Developer`,
    "",
    `> ${profile.name} is a Shopify full-stack developer based in Lahore, Pakistan. He builds Shopify apps, Liquid storefronts, React interfaces, and Laravel/PHP backends and APIs.`,
    "",
    `- Portfolio: ${profile.url}/`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- Email: ${profile.email}`,
    `- Résumé (PDF): ${profile.url}${profile.resume}`,
    "",
    "## Experience",
    ...experience.map(
      (item) =>
        `- ${item.title}, ${item.company} (${item.period}): ${item.description}`,
    ),
    "- Education: BS Computer Science, Superior University (2019–2023)",
    "",
    "## Skills",
    ...skills.map(
      (category) =>
        `- ${category.name}: ${category.technologies.map((t) => t.name).join(", ")}`,
    ),
    "",
    "## Projects",
    ...projects.map(
      (project) =>
        `- [${project.name}](${profile.url}/projects/${project.slug}/): ${project.type}. ${project.summary} Stack: ${project.stack.join(", ")}.`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
