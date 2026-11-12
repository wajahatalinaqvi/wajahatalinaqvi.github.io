"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { skills } from "@/content/skills";
import { scrollToSection } from "@/components/interactive/CommandPalette";
import { gsap, useGSAP, motionConditions } from "@/lib/motion";

type Line = { id: number; kind: "in" | "out" | "err" | "sys"; body: ReactNode };

const commandNames = [
  "help",
  "whoami",
  "skills",
  "projects",
  "open",
  "experience",
  "stack",
  "contact",
  "email",
  "resume",
  "goto",
  "clear",
  "sudo",
  "coffee",
];
const sections = [
  "work",
  "about",
  "expertise",
  "stack-lab",
  "experience",
  "contact",
];
const help: [string, string][] = [
  ["whoami", "a short introduction"],
  ["skills [category]", "frontend · backend · commerce · workflow"],
  ["projects", "list every project"],
  ["open <project>", "open a case study (tab completes)"],
  ["stack <tech>", "projects that used a technology"],
  ["experience", "career timeline"],
  ["goto <section>", "scroll to a section"],
  ["email", "copy my email address"],
  ["resume", "open the résumé"],
  ["clear", "clear the screen"],
];

let uid = 0;
const line = (kind: Line["kind"], body: ReactNode): Line => ({
  id: ++uid,
  kind,
  body,
});

export function Terminal() {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [lines, setLines] = useState<Line[]>(() => [
    line("sys", "wn-shell v3 — type “help” or press Tab to explore."),
  ]);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) => {
        if (context.conditions!.reduce) return;
        gsap.from(".terminal-window", {
          y: 60,
          rotateX: 12,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          transformPerspective: 1200,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            once: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  const find = (name: string) => {
    const q = name.toLowerCase().replace(/\s+/g, "-");
    return projects.find(
      (p) =>
        p.slug === q ||
        p.slug.startsWith(q) ||
        p.name.toLowerCase().startsWith(name.toLowerCase()),
    );
  };

  function execute(raw: string): Line[] {
    const [cmd = "", ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    switch (cmd.toLowerCase()) {
      case "":
        return [];
      case "help":
        return [
          line(
            "out",
            <dl className="term-help">
              {help.map(([name, text]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>,
          ),
        ];
      case "whoami":
        return [
          line(
            "out",
            <>
              <b>{profile.name}</b> — {profile.role}, {profile.location}.
              <br />
              React interfaces, Laravel backends, APIs, and Shopify commerce —
              built as one connected system.
            </>,
          ),
        ];
      case "skills": {
        const list = arg
          ? skills.filter((s) => s.id.startsWith(arg.toLowerCase()))
          : skills;
        if (!list.length)
          return [line("err", `skills: unknown category “${arg}”`)];
        return list.map((s) =>
          line(
            "out",
            <>
              <span className="term-key">{s.name.padEnd(9)}</span>
              {s.technologies.map((t) => t.name).join(" · ")}
            </>,
          ),
        );
      }
      case "projects":
      case "ls":
        return [
          line(
            "out",
            <ul className="term-list">
              {projects.map((p) => (
                <li key={p.slug}>
                  <button type="button" onClick={() => run(`open ${p.slug}`)}>
                    {p.slug}
                  </button>
                  <span>{p.type}</span>
                </li>
              ))}
            </ul>,
          ),
          line("sys", "tip: open <name> — or click one"),
        ];
      case "open":
      case "cd": {
        const project = find(arg);
        if (!project)
          return [
            line(
              "err",
              `open: no project matches “${arg || "?"}” — try “projects”`,
            ),
          ];
        setTimeout(() => router.push(`/projects/${project.slug}/`), 450);
        return [line("out", `→ opening ${project.name}…`)];
      }
      case "stack": {
        if (!arg) return [line("err", "usage: stack <tech>  e.g. stack react")];
        const hits = projects.filter((p) =>
          p.stack.some((t) => t.toLowerCase().includes(arg.toLowerCase())),
        );
        if (!hits.length)
          return [line("err", `stack: no projects list “${arg}”`)];
        return [
          line(
            "out",
            `${hits.length} project${hits.length > 1 ? "s" : ""} with ${arg}:`,
          ),
          ...hits.map((p) =>
            line("out", `  · ${p.name}  [${p.stack.join(", ")}]`),
          ),
        ];
      }
      case "experience":
        return experience.map((e) =>
          line(
            "out",
            <>
              <span className="term-key">{e.period}</span>
              <br />
              {e.title} @ {e.company}
            </>,
          ),
        );
      case "goto": {
        const target = sections.find((s) => s.startsWith(arg.toLowerCase()));
        if (!target)
          return [line("err", `goto: try one of ${sections.join(", ")}`)];
        setTimeout(
          () => scrollToSection(`#${target}`, pathname, router.push),
          250,
        );
        return [line("out", `→ scrolling to #${target}`)];
      }
      case "contact":
        return [
          line(
            "out",
            <>
              email&nbsp;&nbsp;&nbsp; {profile.email}
              <br />
              github&nbsp;&nbsp; {profile.github.replace("https://", "")}
              <br />
              linkedin {profile.linkedin.replace("https://www.", "")}
            </>,
          ),
        ];
      case "email":
        navigator.clipboard?.writeText(profile.email).catch(() => {});
        return [line("out", `✓ copied ${profile.email}`)];
      case "resume":
        window.open(profile.resume, "_blank", "noopener");
        return [line("out", "→ opening résumé (PDF)")];
      case "clear":
        setLines([]);
        return [];
      case "sudo":
        if (/hire/.test(arg))
          return [
            line("out", "[sudo] permission granted. Excellent decision."),
            line("out", `→ ${profile.email} is the fastest route.`),
          ];
        return [line("err", "sudo: nice try. (hint: sudo hire-me)")];
      case "coffee":
        return [line("out", "☕ brewing… features ship faster now.")];
      case "rm":
        return [line("err", "rm: this portfolio is load-bearing.")];
      default:
        return [line("err", `${cmd}: command not found — type “help”`)];
    }
  }

  function run(raw: string) {
    const output = execute(raw);
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    setCursor(-1);
    setValue("");
    if (raw.trim().toLowerCase() === "clear") return;
    setLines((current) => [...current, line("in", raw), ...output]);
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    run(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (next >= 0) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setValue(next >= 0 ? history[next] : "");
    } else if (event.key === "Tab") {
      // Complete commands, then project slugs / sections / categories.
      const [cmd, ...rest] = value.split(" ");
      const partial = rest.join(" ");
      let pool: string[] = [];
      let prefix = "";
      if (rest.length === 0) {
        pool = commandNames;
      } else {
        prefix = `${cmd} `;
        if (["open", "cd"].includes(cmd)) pool = projects.map((p) => p.slug);
        if (cmd === "goto") pool = sections;
        if (cmd === "skills") pool = skills.map((s) => s.id);
      }
      const matches = pool.filter((p) =>
        p.startsWith(rest.length ? partial : cmd),
      );
      if (!value && rest.length === 0) {
        event.preventDefault();
        setLines((current) => [
          ...current,
          line("sys", commandNames.join("  ")),
        ]);
      } else if (matches.length === 1) {
        event.preventDefault();
        setValue(`${prefix}${matches[0]}${rest.length ? "" : " "}`);
      } else if (matches.length > 1) {
        event.preventDefault();
        setLines((current) => [...current, line("sys", matches.join("  "))]);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <section
      ref={root}
      id="terminal"
      className="section terminal-section container"
      aria-labelledby="terminal-heading"
    >
      <div className="terminal-copy">
        <p className="eyebrow">
          <span />
          Prefer the command line?
        </p>
        <h2 id="terminal-heading">Explore it like a developer.</h2>
        <p className="section-description">
          A working shell over the same content as the rest of the site. Try{" "}
          <code>whoami</code>, <code>stack react</code>, or <code>open</code>{" "}
          with Tab.
        </p>
        <div className="terminal-suggestions">
          {["help", "whoami", "projects", "stack shopify", "sudo hire-me"].map(
            (suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => {
                  run(suggestion);
                  input.current?.focus({ preventScroll: true });
                }}
              >
                {suggestion}
              </button>
            ),
          )}
        </div>
      </div>
      <div
        className="terminal-window"
        onClick={(event) => {
          if (!(event.target as HTMLElement).closest("button"))
            input.current?.focus({ preventScroll: true });
        }}
      >
        <div className="terminal-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>wajahat@portfolio: ~</p>
        </div>
        <div
          ref={screen}
          className="terminal-screen"
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          data-lenis-prevent
        >
          {lines.map((l) => (
            <div key={l.id} className={`term-line term-${l.kind}`}>
              {l.kind === "in" && <span className="term-prompt">❯</span>}
              {l.body}
            </div>
          ))}
        </div>
        <form className="terminal-input" onSubmit={submit}>
          <label htmlFor="terminal-command" className="term-prompt">
            ❯<span className="sr-only">Terminal command</span>
          </label>
          <input
            id="terminal-command"
            ref={input}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="type a command…"
          />
        </form>
      </div>
    </section>
  );
}
