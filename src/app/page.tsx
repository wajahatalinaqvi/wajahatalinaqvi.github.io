import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { About } from "@/components/sections/About";
import { Expertise } from "@/components/sections/Expertise";
import { Experience } from "@/components/sections/Experience";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { PageMotion } from "@/components/animations/PageMotion";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageMotion>
        <Hero />
        <FeaturedProjects />
        <About />
        <Expertise />
        <Experience />
        <Approach />
        <Contact />
      </PageMotion>
    </main>
  );
}
