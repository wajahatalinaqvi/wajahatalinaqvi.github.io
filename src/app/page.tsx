import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { About } from "@/components/sections/About";
import { Expertise } from "@/components/sections/Expertise";
import { Experience } from "@/components/sections/Experience";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Manifesto } from "@/components/sections/Manifesto";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { StackLab } from "@/components/interactive/StackLab";
import { Terminal } from "@/components/interactive/Terminal";
import { jsonLd, profilePageGraph } from "@/lib/seo";
import { PageMotion } from "@/components/animations/PageMotion";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageMotion>
        <Hero />
        <FeaturedProjects />
        <Manifesto />
        <About />
        <TechMarquee />
        <Expertise />
        <StackLab />
        <Experience />
        <Approach />
        <Terminal />
        <Contact />
      </PageMotion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(profilePageGraph())}
      />
    </main>
  );
}
