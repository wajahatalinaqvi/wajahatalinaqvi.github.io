import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="section experience-section container">
      <SectionHeading
        label="The journey so far"
        title="Learning through building."
      />
      <div className="experience-layout">
        <div className="experience-intro">
          <p>
            From frontend foundations to connected applications and commerce
            experiences.
          </p>
          <a href={profile.resume} className="text-link">
            View full résumé <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <div className="education-note">
            <span>FOUNDATIONS</span>
            <p>
              BS Computer Science
              <br />
              Superior University · 2019–2023
            </p>
          </div>
        </div>
        <div className="timeline">
          <span className="timeline-progress" aria-hidden="true" />
          <ol>
            {experience.map((item, index) => (
              <li
                key={item.company}
                className={index === 0 ? "current-role" : undefined}
              >
                <div className="timeline-dot" />
                <div className="timeline-meta">
                  <p>{item.period}</p>
                  {item.provisional && <span>Pending confirmation</span>}
                </div>
                <h3>{item.title}</h3>
                <h4>{item.company}</h4>
                <p className="timeline-description">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
