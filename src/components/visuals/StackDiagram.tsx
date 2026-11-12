"use client";
import { Braces, Database, GitBranch, ShoppingBag } from "lucide-react";
import type { SkillCategoryId } from "@/content/skills";

const layers = [
  { id: "frontend", label: "React interface", icon: Braces },
  { id: "backend", label: "API + Laravel", icon: Database },
  { id: "commerce", label: "Commerce", icon: ShoppingBag },
  { id: "workflow", label: "Delivery", icon: GitBranch },
] as const;

export function StackDiagram({
  selected,
  onSelect,
}: {
  selected: SkillCategoryId;
  onSelect: (id: SkillCategoryId) => void;
}) {
  return (
    <div className="stack-diagram">
      <span className="stack-diagram-caption">HOW THE LAYERS CONNECT</span>
      <div className="stack-diagram-flow">
        {layers.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={selected === id ? "is-active" : ""}
            aria-pressed={selected === id}
            aria-label={`Show ${id} technologies`}
            onClick={() => onSelect(id)}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
