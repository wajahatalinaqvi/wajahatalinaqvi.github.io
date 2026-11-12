"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Copy,
  CornerDownLeft,
  FileText,
  Github,
  Hash,
  Linkedin,
  Search,
  Terminal,
} from "lucide-react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { gsap } from "@/lib/motion";

type Command = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Projects" | "Actions";
  keywords: string;
  icon: typeof Hash;
  run: () => void | Promise<void>;
};

export const openPalette = () =>
  window.dispatchEvent(new CustomEvent("palette:open"));

// Smoothly reach an in-page section from anywhere on the site.
export function scrollToSection(
  hash: string,
  pathname: string,
  push: (url: string) => void,
) {
  if (pathname !== "/") return push(`/${hash}`);
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const lenis = (
    window as unknown as {
      __lenis?: { scrollTo: (t: HTMLElement, o: object) => void };
    }
  ).__lenis;
  if (lenis) lenis.scrollTo(target, { offset: -96, duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", hash);
}

function score(query: string, text: string) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 10 - t.indexOf(q) / 100;
  // Subsequence match: "rll" finds "rocket label lock".
  let i = 0;
  for (const char of t) if (char === q[i]) i++;
  return i === q.length ? 1 : 0;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const opener = useRef<Element | null>(null);

  const close = useCallback(() => {
    const el = panel.current;
    const finish = () => {
      setOpen(false);
      setQuery("");
      (opener.current as HTMLElement | null)?.focus?.();
    };
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return finish();
    gsap.to(el, {
      opacity: 0,
      y: 10,
      scale: 0.98,
      duration: 0.18,
      ease: "power2.in",
      onComplete: finish,
    });
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (hash: string) => () =>
      scrollToSection(hash, pathname, router.push);
    return [
      ...(
        [
          ["#work", "Selected work", "Projects and case studies"],
          ["#about", "About", "Who I am and how I think"],
          ["#expertise", "Expertise", "The tools behind the work"],
          ["#stack-lab", "Stack Lab", "Build a stack, find the projects"],
          ["#experience", "Experience", "Career timeline"],
          ["#terminal", "Terminal", "Explore from the command line"],
          ["#contact", "Contact", "Start a conversation"],
        ] as const
      ).map(([hash, label, hint]) => ({
        id: hash,
        label,
        hint,
        group: "Navigate" as const,
        keywords: `${label} ${hint} section`,
        icon: hash === "#terminal" ? Terminal : Hash,
        run: go(hash),
      })),
      ...projects.map((project) => ({
        id: project.slug,
        label: project.name,
        hint: project.type,
        group: "Projects" as const,
        keywords: `${project.name} ${project.type} ${project.stack.join(" ")} ${project.category}`,
        icon: Briefcase,
        run: () => router.push(`/projects/${project.slug}/`),
      })),
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        group: "Actions",
        keywords: "email mail contact copy",
        icon: Copy,
        run: async () => {
          await navigator.clipboard?.writeText(profile.email);
          setToast("Email copied to clipboard");
        },
      },
      {
        id: "resume",
        label: "Open résumé",
        hint: "PDF",
        group: "Actions",
        keywords: "resume cv pdf download",
        icon: FileText,
        run: () => {
          window.open(profile.resume, "_blank", "noopener");
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: "github.com/wajahatalinaqvi",
        group: "Actions",
        keywords: "github code repositories",
        icon: Github,
        run: () => {
          window.open(profile.github, "_blank", "noopener");
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "Professional profile",
        group: "Actions",
        keywords: "linkedin social profile",
        icon: Linkedin,
        run: () => {
          window.open(profile.linkedin, "_blank", "noopener");
        },
      },
    ];
  }, [pathname, router]);

  const results = useMemo(
    () =>
      commands
        .map((command) => ({
          command,
          rank: score(query, `${command.label} ${command.keywords}`),
        }))
        .filter((item) => item.rank > 0)
        .sort((a, b) => (query ? b.rank - a.rank : 0))
        .map((item) => item.command),
    [commands, query],
  );

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const typing = (event.target as HTMLElement).closest(
        "input, textarea, [contenteditable]",
      );
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        opener.current = document.activeElement;
        setOpen((value) => !value);
      } else if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        opener.current = document.activeElement;
        setOpen(true);
      }
    };
    const onOpen = () => {
      opener.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const lenis = (
      window as unknown as { __lenis?: { stop(): void; start(): void } }
    ).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    input.current?.focus();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: -14, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "expo.out" },
      );
      gsap.from(".palette-item", {
        opacity: 0,
        x: -8,
        duration: 0.3,
        stagger: 0.015,
        ease: "power2.out",
        delay: 0.05,
      });
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    list.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const run = (command?: Command) => {
    if (!command) return;
    close();
    // Let the dialog leave before scrolling or navigating.
    setTimeout(() => command.run(), 200);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (index) =>
          (index - 1 + Math.max(results.length, 1)) %
          Math.max(results.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[active]);
    } else if (event.key === "Tab") {
      // Keep focus inside the dialog; the input is its only tab stop.
      event.preventDefault();
      input.current?.focus();
    }
  };

  return (
    <>
      {open && (
        <div
          className="palette-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={panel}
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onKeyDown}
          >
            <div className="palette-search">
              <Search size={18} aria-hidden="true" />
              <input
                ref={input}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search sections, projects, actions…"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={
                  results[active] ? `palette-${results[active].id}` : undefined
                }
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd>esc</kbd>
            </div>
            <ul
              ref={list}
              id="palette-list"
              role="listbox"
              aria-label="Commands"
              className="palette-list"
            >
              {results.length === 0 && (
                <li className="palette-empty" role="presentation">
                  Nothing matches “{query}”. Try “react”, “shopify” or “email”.
                </li>
              )}
              {results.map((command, index) => {
                const showGroup =
                  index === 0 || results[index - 1].group !== command.group;
                const Icon = command.icon;
                return (
                  <li key={command.id} role="presentation">
                    {showGroup && (
                      <span className="palette-group" aria-hidden="true">
                        {command.group}
                      </span>
                    )}
                    <div
                      id={`palette-${command.id}`}
                      role="option"
                      aria-selected={index === active}
                      data-index={index}
                      className="palette-item"
                      onMouseMove={() => index !== active && setActive(index)}
                      onClick={() => run(command)}
                    >
                      <span className="palette-icon">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="palette-label">
                        {command.label}
                        <small>{command.hint}</small>
                      </span>
                      {index === active ? (
                        <CornerDownLeft size={15} aria-hidden="true" />
                      ) : (
                        <ArrowRight size={15} aria-hidden="true" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="palette-footer" aria-hidden="true">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> open
              </span>
              <span>
                <kbd>/</kbd> or <kbd>⌘K</kbd> anywhere
              </span>
            </div>
          </div>
        </div>
      )}
      <p className="palette-toast" role="status" data-visible={!!toast}>
        {toast}
      </p>
    </>
  );
}
