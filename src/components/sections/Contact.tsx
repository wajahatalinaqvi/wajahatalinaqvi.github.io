"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Github, Linkedin } from "lucide-react";
import { profile } from "@/content/profile";

export function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [copyStatus, setCopyStatus] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"fullname" | "email" | "message", string>>
  >({});
  const feedback = useRef<HTMLDivElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;
    const fields = {
      fullname: form.elements.namedItem("fullname") as HTMLInputElement,
      email: form.elements.namedItem("email") as HTMLInputElement,
      message: form.elements.namedItem("message") as HTMLTextAreaElement,
    };
    const nextErrors: typeof errors = {};
    if (!fields.fullname.value.trim())
      nextErrors.fullname = "Please enter your name.";
    if (!fields.email.value.trim() || fields.email.validity.typeMismatch)
      nextErrors.email = "Please enter a valid email address.";
    if (fields.message.value.trim().length < 10)
      nextErrors.message =
        "Please tell me a little more — at least 10 characters.";
    setErrors(nextErrors);
    const firstError = (Object.keys(nextErrors) as (keyof typeof fields)[])[0];
    if (firstError) {
      fields[firstError].focus();
      setStatus("idle");
      return;
    }
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
      feedback.current?.focus();
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
          ref={(form) => {
            if (form) form.noValidate = true;
          }}
          aria-busy={status === "sending"}
        >
          <p className="form-title">Or leave a note.</p>
          <div className="form-row">
            <div className="form-field">
              <label>
                Your name
                <span aria-hidden="true" className="required-marker">
                  {" "}
                  *
                </span>
                <input
                  name="fullname"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                  maxLength={120}
                  aria-invalid={!!errors.fullname}
                  aria-describedby={errors.fullname ? "name-error" : undefined}
                />
              </label>
              {errors.fullname && (
                <span id="name-error" className="field-error">
                  {errors.fullname}
                </span>
              )}
            </div>
            <div className="form-field">
              <label>
                Email address
                <span aria-hidden="true" className="required-marker">
                  {" "}
                  *
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="alex@company.com"
                  required
                  maxLength={254}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </label>
              {errors.email && (
                <span id="email-error" className="field-error">
                  {errors.email}
                </span>
              )}
            </div>
          </div>
          <div className="form-field">
            <label>
              What are you working on?
              <span aria-hidden="true" className="required-marker">
                {" "}
                *
              </span>
              <textarea
                name="message"
                placeholder="Tell me a little about your project…"
                rows={4}
                required
                minLength={10}
                maxLength={5000}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
            </label>
            {errors.message && (
              <span id="message-error" className="field-error">
                {errors.message}
              </span>
            )}
          </div>
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
              data-magnetic
            >
              {status === "sending" ? "Sending…" : "Send message"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div
            ref={feedback}
            tabIndex={-1}
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
