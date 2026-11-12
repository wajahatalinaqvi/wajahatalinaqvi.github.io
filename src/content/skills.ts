export type SkillCategoryId = "frontend" | "backend" | "commerce" | "workflow";
export interface Technology {
  name: string;
  mark: string;
  capability: string;
  context:
    | "Project work"
    | "Profile capability"
    | "This portfolio"
    | "Engineering workflow";
}
export interface SkillCategory {
  id: SkillCategoryId;
  name: string;
  description: string;
  detail: string;
  code: string;
  technologies: Technology[];
  projects: string[];
  evidenceNote: string;
}

export const skills: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    description: "The part people experience.",
    detail:
      "Responsive interfaces, reusable components, and application state that stays understandable as a product grows.",
    code: "<Experience />",
    technologies: [
      {
        name: "React.js",
        mark: "Re",
        capability:
          "Component-based application interfaces and merchant dashboards.",
        context: "Project work",
      },
      {
        name: "JavaScript",
        mark: "JS",
        capability:
          "Interactions, data handling, and connected browser experiences.",
        context: "Project work",
      },
      {
        name: "TypeScript",
        mark: "TS",
        capability: "Typed interface logic and clearer component contracts.",
        context: "Project work",
      },
      {
        name: "HTML",
        mark: "<>",
        capability: "Semantic page structure with a sensible reading order.",
        context: "Project work",
      },
      {
        name: "CSS",
        mark: "#",
        capability:
          "Responsive layouts, design systems, and purposeful motion.",
        context: "Project work",
      },
      {
        name: "Next.js",
        mark: "N",
        capability:
          "Static routes, metadata, and the architecture of this portfolio.",
        context: "This portfolio",
      },
    ],
    projects: ["rocket-label-lock", "shopvoice"],
    evidenceNote:
      "React and TypeScript in application work. Next.js in the portfolio you’re exploring.",
  },
  {
    id: "backend",
    name: "Backend",
    description: "The logic behind the interface.",
    detail:
      "PHP and Laravel applications, authentication, and data-driven workflows. Clear boundaries between business logic and connected services.",
    code: "request → response",
    technologies: [
      {
        name: "PHP",
        mark: "php",
        capability: "Server-side application logic and data-driven workflows.",
        context: "Profile capability",
      },
      {
        name: "Laravel",
        mark: "La",
        capability:
          "Structured controllers, validation, and application services.",
        context: "Profile capability",
      },
      {
        name: "REST APIs",
        mark: "API",
        capability:
          "Connect interfaces and services through clear data contracts.",
        context: "Profile capability",
      },
      {
        name: "GraphQL",
        mark: "GQ",
        capability:
          "Query the data an integration needs, including Shopify APIs.",
        context: "Profile capability",
      },
      {
        name: "Authentication",
        mark: "Au",
        capability: "OAuth flows and authenticated application access.",
        context: "Profile capability",
      },
      {
        name: "Webhooks",
        mark: "↪",
        capability:
          "Connect application workflows to external platform events.",
        context: "Profile capability",
      },
    ],
    projects: [],
    evidenceNote:
      "These capabilities are described in my professional profile. A detailed public backend case study is still being documented.",
  },
  {
    id: "commerce",
    name: "Commerce",
    description: "Commerce, tailored to the product.",
    detail:
      "Shopify themes and application interfaces, with the same attention to structure, usability, and integration as any other web product.",
    code: "{{ commerce }}",
    technologies: [
      {
        name: "Shopify",
        mark: "Sh",
        capability: "Custom storefront and merchant application experiences.",
        context: "Project work",
      },
      {
        name: "Liquid",
        mark: "{{",
        capability: "Theme customization and dynamic storefront presentation.",
        context: "Project work",
      },
      {
        name: "Shopify Apps",
        mark: "Ap",
        capability: "Embedded and standalone merchant application interfaces.",
        context: "Project work",
      },
      {
        name: "Polaris",
        mark: "Po",
        capability:
          "Consistent admin interfaces using Shopify’s component system.",
        context: "Project work",
      },
      {
        name: "Theme App Extensions",
        mark: "Ex",
        capability:
          "Extend storefront functionality within the theme ecosystem.",
        context: "Profile capability",
      },
      {
        name: "Shopify APIs",
        mark: "{ }",
        capability: "Platform data access and connected commerce workflows.",
        context: "Profile capability",
      },
    ],
    projects: ["djordan-media", "bundle-builder"],
    evidenceNote:
      "Existing storefront and application work, with responsibilities documented in each project.",
  },
  {
    id: "workflow",
    name: "Workflow",
    description: "Better tools. Considered decisions.",
    detail:
      "Versioned changes, practical AI assistance, and deliberate review. Tools help me explore and iterate; engineering judgment stays part of the process.",
    code: "build · review · ship",
    technologies: [
      {
        name: "Git",
        mark: "git",
        capability: "Isolated branches and reviewable, versioned changes.",
        context: "Engineering workflow",
      },
      {
        name: "GitHub",
        mark: "GH",
        capability: "Source collaboration and automated static deployment.",
        context: "This portfolio",
      },
      {
        name: "VS Code",
        mark: "></",
        capability: "A focused environment for implementation and debugging.",
        context: "Engineering workflow",
      },
      {
        name: "Codex",
        mark: "Cx",
        capability:
          "AI-assisted implementation and iteration on this portfolio.",
        context: "This portfolio",
      },
      {
        name: "AI-assisted engineering",
        mark: "AI",
        capability:
          "Explore, debug, and refactor with accountable human review.",
        context: "Engineering workflow",
      },
      {
        name: "Debugging and testing",
        mark: "✓",
        capability: "Check behavior, accessibility, and the exported site.",
        context: "This portfolio",
      },
    ],
    projects: [],
    evidenceNote:
      "This portfolio includes automated browser checks, static export validation, and a prepared GitHub Pages workflow.",
  },
];
