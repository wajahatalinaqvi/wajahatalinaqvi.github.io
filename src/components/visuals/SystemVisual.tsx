"use client";
import { useRef, useState } from "react";
import { Braces, Database, Layers3, ShoppingBag, Workflow } from "lucide-react";
import {
  gsap,
  useGSAP,
  motionConditions,
  pointerQuery,
  bindPointerMotion,
} from "@/lib/motion";

const layers = [
  {
    id: "frontend",
    title: "Frontend",
    tech: "React · TypeScript",
    detail:
      "React interfaces and user experiences. Reusable components and interactions that make a product clear.",
    icon: Layers3,
  },
  {
    id: "api",
    title: "APIs",
    tech: "REST · GraphQL · OAuth",
    detail:
      "REST, GraphQL, OAuth, and integrations. Clear contracts connecting interfaces, services, and platforms.",
    icon: Workflow,
  },
  {
    id: "backend",
    title: "Backend",
    tech: "PHP · Laravel",
    detail:
      "Laravel applications and business logic. Structured workflows behind the interface.",
    icon: Database,
  },
  {
    id: "commerce",
    title: "Commerce",
    tech: "Shopify · Liquid · Apps",
    detail:
      "Shopify apps and custom ecommerce functionality, connected to the wider product experience.",
    icon: ShoppingBag,
  },
] as const;
type LayerId = (typeof layers)[number]["id"];

export function SystemVisual() {
  const [selected, setSelected] = useState<LayerId>("frontend");
  const root = useRef<HTMLDivElement>(null);
  const active = layers.find((layer) => layer.id === selected)!;
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(pointerQuery, () =>
        bindPointerMotion(
          root.current!,
          root.current!.querySelector<HTMLElement>(
            ".architecture-perspective",
          )!,
          "tilt",
        ),
      );
      media.add(motionConditions, (context) => {
        if (context.conditions!.reduce) return;
        gsap.utils
          .toArray<SVGPathElement>(".architecture-wire")
          .forEach((path) => {
            const length = path.getTotalLength();
            gsap.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration: 0.85,
                ease: "power2.inOut",
                scrollTrigger: {
                  trigger: root.current,
                  start: "top 92%",
                  once: true,
                },
              },
            );
          });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".architecture-explanation > p",
          { y: 6, opacity: 0.4 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        );
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [selected], revertOnUpdate: true },
  );

  return (
    <div className="architecture-enter" ref={root}>
      <div className="architecture-scroll">
        <div className="architecture-perspective">
          <div className="architecture-stage" data-selected={selected}>
            <div className="architecture-grid" aria-hidden="true" />
            <svg
              className="architecture-connections architecture-connections-desktop"
              viewBox="0 0 1000 380"
              fill="none"
              aria-hidden="true"
            >
              <path
                className={`architecture-wire ${selected === "frontend" ? "is-active" : ""}`}
                d="M240 151H330L446 190"
              />
              <path
                className={`architecture-wire ${selected === "api" ? "is-active" : ""}`}
                d="M500 85V153"
              />
              <path
                className={`architecture-wire ${selected === "backend" ? "is-active" : ""}`}
                d="M760 151H670L554 190"
              />
              <path
                className={`architecture-wire ${selected === "commerce" ? "is-active" : ""}`}
                d="M500 230V284"
              />
            </svg>
            <svg
              className="architecture-connections architecture-connections-mobile"
              viewBox="0 0 400 350"
              fill="none"
              aria-hidden="true"
            >
              {[
                "M95 102V133L180 165",
                "M305 102V133L220 165",
                "M95 250V218L180 185",
                "M305 250V218L220 185",
              ].map((d, i) => (
                <path
                  key={d}
                  d={d}
                  className={`architecture-wire ${selected === layers[i].id ? "is-active" : ""}`}
                />
              ))}
            </svg>
            {layers.map(({ id, title, tech, icon: Icon }) => (
              <div key={id} className={`architecture-layer architecture-${id}`}>
                <button
                  type="button"
                  className="architecture-panel"
                  aria-label={`Explore ${title.toLowerCase()} layer`}
                  aria-pressed={selected === id}
                  aria-describedby="architecture-explanation"
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setSelected(id);
                  }}
                  onFocus={() => setSelected(id)}
                  onClick={() => setSelected(id)}
                >
                  <Icon size={22} aria-hidden="true" />
                  <span className="architecture-panel-name">{title}</span>
                  <span className="architecture-panel-tech">{tech}</span>
                  <span
                    className="architecture-panel-corner"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </button>
              </div>
            ))}
            <div className="architecture-core" aria-hidden="true">
              <span className="architecture-core-base" />
              <span className="architecture-core-middle" />
              <span className="architecture-core-top">
                <Braces size={42} strokeWidth={1.2} />
              </span>
              <span className="architecture-core-caption">
                ONE CONNECTED SYSTEM
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="architecture-explanation" id="architecture-explanation">
        <span className="architecture-explanation-label">
          <span className="status-dot" />
          {active.title}
        </span>
        <p>{active.detail}</p>
        <span className="architecture-hint">EXPLORE A LAYER</span>
      </div>
    </div>
  );
}
