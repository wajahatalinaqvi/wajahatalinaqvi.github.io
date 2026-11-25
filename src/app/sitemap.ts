import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
export const dynamic = "force-static";

// Date of the last commit that touched any of these paths, so lastmod only moves when a page
// really changes. Falls back to the build time if git history is unavailable.
function lastModified(...paths: string[]): Date {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...paths],
      {
        encoding: "utf8",
      },
    ).trim();
    if (iso) return new Date(iso);
  } catch {
    // not a git checkout
  }
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = lastModified(
    "src/content/projects.ts",
    "src/app/projects",
  );
  return [
    {
      url: `${profile.url}/`,
      lastModified: lastModified(
        "src/app",
        "src/components",
        "src/content",
        "public",
      ),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${profile.url}/projects/${project.slug}/`,
      lastModified: projectPages,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
