import type { MetadataRoute } from "next";
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wajahat Naqvi — Shopify Full-Stack Developer",
    short_name: "Wajahat Naqvi",
    description:
      "Portfolio of Wajahat Naqvi, a Shopify full-stack developer in Lahore building Shopify apps, storefronts, React interfaces and Laravel APIs.",
    start_url: "/",
    display: "browser",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
