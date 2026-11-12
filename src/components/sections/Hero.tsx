import { ArrowDown, ArrowUpRight, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SystemVisual } from "@/components/visuals/SystemVisual";
import { profile } from "@/content/profile";
import { HeroMotion } from "@/components/animations/HeroMotion";

export function Hero() {
  return (
    <HeroMotion>
      <div className="hero-intro" data-hero>
        <span className="status-dot" />
        HELLO, I’M WAJAHAT NAQVI
        <span className="intro-divider" />
        BASED IN LAHORE, PK
      </div>
      <h1 id="hero-heading" aria-label="Full-Stack Developer">
        <span className="hero-mask">
          <span className="hero-line">Full-Stack</span>
        </span>
        <span className="hero-mask hero-secondary">
          <span className="hero-line">
            Developer<span className="headline-period">.</span>
          </span>
        </span>
      </h1>
      <p className="hero-description" data-hero>
        Building thoughtful digital products
        <br className="desktop-break" /> from interface to infrastructure.
      </p>
      <div className="hero-actions" data-hero>
        <Button href="#work">View my work</Button>
        <Button href="#contact" secondary>
          Let’s connect
        </Button>
      </div>
      <div className="hero-socials" data-hero>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Github size={15} aria-hidden="true" />
          GitHub
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
        <span />
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={15} aria-hidden="true" />
          LinkedIn
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
      <SystemVisual />
      <div className="hero-bottom">
        <a href="#work">
          <ArrowDown size={14} aria-hidden="true" />
          SCROLL TO EXPLORE
        </a>
        <span>GOOD INTERFACES. SOLID FOUNDATIONS.</span>
      </div>
    </HeroMotion>
  );
}
