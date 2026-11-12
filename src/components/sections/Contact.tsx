"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Github, Linkedin } from "lucide-react";
import { profile } from "@/content/profile";

export function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [copyStatus, setCopyStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;
    setStatus("sending");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("Email copied");
    } catch {
      setCopyStatus("Copy unavailable. Use the email link.");
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-inner">
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">
            <span />
            Let’s build something
          </p>
          <h2>
            Have something
            <br />
            worth <em>building?</em>
          </h2>
          <p>
            A product idea, a tricky integration, or a team that cares about the
            details. I’d like to hear about it.
          </p>
          <div className="email-row">
            <a href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <button
              onClick={copy}
              type="button"
              aria-label="Copy email address"
            >
              {copyStatus === "Email copied" ? (
                <Check size={17} />
              ) : (
                <Copy size={17} />
              )}
            </button>
          </div>
          <p className="copy-status" role="status">
            {copyStatus}
          </p>
          <div className="contact-socials">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={16} aria-hidden="true" /> GitHub{" "}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={16} aria-hidden="true" /> LinkedIn{" "}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href={profile.resume}>
              Résumé <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
        <form
          className="contact-form"
          action="https://formspree.io/f/xdoqjgzv"
          method="POST"
          onSubmit={submit}
        >
          <p className="form-title">Or leave a note.</p>
          <div className="form-row">
            <label>
              Your name
              <input
                name="fullname"
                autoComplete="name"
                placeholder="Alex Morgan"
                required
                maxLength={120}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="alex@company.com"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label>
            What are you working on?
            <textarea
              name="message"
              placeholder="Tell me a little about your project…"
              rows={4}
              required
              minLength={10}
              maxLength={5000}
            />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>
              Leave this empty
              <input name="_gotcha" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="form-submit-row">
            <span>Let’s start a conversation.</span>
            <button
              className="button button-primary"
              disabled={status === "sending"}
              type="submit"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div
            role="status"
            aria-live="polite"
            className={`form-status ${status}`}
          >
            {status === "success" && "Thanks — your message has been sent."}
            {status === "error" && (
              <>
                Your message couldn’t be sent. Please try again or{" "}
                <a href={`mailto:${profile.email}`}>email me directly</a>.
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
