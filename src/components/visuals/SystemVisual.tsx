"use client";

import { useRef, type PointerEvent } from "react";
import { Braces, Database, Layers3, Workflow } from "lucide-react";

export function SystemVisual() {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      !matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    ref.current?.style.setProperty("--tilt-x", `${-y * 5}deg`);
    ref.current?.style.setProperty("--tilt-y", `${x * 7}deg`);
  }
  function reset() {
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <div
      className="system-visual"
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <div className="visual-grid" />
      <div className="system-world" ref={ref}>
        <svg className="system-wires" viewBox="0 0 900 320" fill="none">
          <path d="M170 120H280L350 185H550L620 120H730M450 185V65M450 185V285" />
          <path className="wire-accent" d="M280 120L350 185H550L620 120" />
          <circle cx="450" cy="65" r="4" />
          <circle cx="450" cy="285" r="4" />
        </svg>
        <div className="system-node node-interface">
          <Layers3 size={24} />
          <span>01 / INTERFACE</span>
          <strong>Thoughtful by design.</strong>
          <div className="mini-interface">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="system-core">
          <div className="core-top">
            <Braces size={38} strokeWidth={1.2} />
          </div>
          <div className="core-layer core-layer-one" />
          <div className="core-layer core-layer-two" />
          <span>CONNECTED BY CODE</span>
        </div>
        <div className="system-node node-backend">
          <Database size={24} />
          <span>03 / INFRASTRUCTURE</span>
          <strong>Reliable at the core.</strong>
          <div className="mini-code">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="api-node">
          <Workflow size={15} />
          <span>API & INTEGRATIONS</span>
        </div>
        <span className="visual-coordinate coordinate-left">
          FRONTEND → BACKEND
        </span>
        <span className="visual-coordinate coordinate-right">
          ONE CONNECTED SYSTEM
        </span>
      </div>
    </div>
  );
}
