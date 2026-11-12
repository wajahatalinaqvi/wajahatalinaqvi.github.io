"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Database,
  GitBranch,
  ShoppingBag,
} from "lucide-react";
import { skills } from "@/content/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [Braces, Database, ShoppingBag, GitBranch];
export function Expertise() {
  const [selected, setSelected] = useState(0);
  return (
    <section id="expertise" className="section expertise-section container">
      <SectionHeading
        label="Tools & expertise"
        title="Across the stack."
        description="The right tool for the problem. A connected approach to the product."
      />
      <div className="expertise-layout">
        <div className="expertise-accordion">
          {skills.map((skill, index) => {
            const Icon = icons[index];
            return (
              <div
                key={skill.name}
                className={`expertise-item ${selected === index ? "is-selected" : ""}`}
              >
                <h3>
                  <button
                    id={`skill-button-${index}`}
                    type="button"
                    aria-expanded={selected === index}
                    aria-controls={`skill-panel-${index}`}
                    onClick={() => setSelected(selected === index ? -1 : index)}
                  >
                    <Icon size={21} aria-hidden="true" />
                    <span>
                      {skill.name}
                      <small>{skill.description}</small>
                    </span>
                    {selected === index ? (
                      <ArrowDown size={18} aria-hidden="true" />
                    ) : (
                      <ArrowUpRight size={18} aria-hidden="true" />
                    )}
                  </button>
                </h3>
                <div
                  id={`skill-panel-${index}`}
                  role="region"
                  aria-labelledby={`skill-button-${index}`}
                  hidden={selected !== index}
                >
                  <p>{skill.detail}</p>
                  <ul className="tech-list">
                    {skill.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <div className="expertise-diagram" data-reveal>
          <div className="diagram-topline">
            <span className="status-dot" />
            THE CONNECTED STACK
          </div>
          <div className="diagram-code">
            {skills[Math.max(0, selected)].code}
          </div>
          <div className="diagram-flow">
            {["Frontend", "API", "Backend", "Services"].map((item, index) => (
              <span key={item} className={index === selected ? "active" : ""}>
                {item}
              </span>
            ))}
          </div>
          <p>
            Different layers.
            <br />
            <strong>One considered experience.</strong>
          </p>
          <span className="diagram-bottom">
            BUILT WITH THE WHOLE SYSTEM IN MIND
          </span>
        </div>
      </div>
    </section>
  );
}
