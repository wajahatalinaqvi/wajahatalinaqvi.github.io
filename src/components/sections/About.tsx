import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" className="section about-section container">
      <div className="about-photo" data-reveal>
        <Image
          src="/images/wajahat-naqvi.webp"
          alt="Wajahat Naqvi, Full-Stack Developer based in Lahore"
          width={600}
          height={720}
          sizes="(max-width: 700px) 90vw, 30vw"
        />
        <div className="portrait-caption">
          <span>Wajahat Naqvi</span>
          <MapPin size={13} aria-hidden="true" /> Lahore, PK
        </div>
      </div>
      <div className="about-copy" data-reveal>
        <p className="eyebrow">
          <span />A little about me
        </p>
        <h2>
          I care about the
          <br />
          whole <em>picture.</em>
        </h2>
        <p className="about-lead">
          The interface matters. So does everything behind it.
        </p>
        <p>
          I’m Wajahat, a full-stack developer based in Lahore. I build web
          applications across React interfaces, PHP and Laravel backends, APIs,
          and third-party integrations.
        </p>
        <p>
          My commerce work brings that thinking to Shopify themes and
          applications. I like turning complex requirements into clear
          experiences, with reusable code and a structure that makes sense to
          the next developer.
        </p>
        <p>
          I use AI to explore ideas, debug, and refactor more efficiently. The
          decisions, review, and responsibility stay with me.
        </p>
        <a className="text-link" href={profile.resume}>
          A closer look at my experience{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <div className="about-signature">
          Wajahat<span>Always curious. Always building.</span>
        </div>
      </div>
    </section>
  );
}
