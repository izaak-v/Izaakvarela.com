"use client";

import { useState } from "react";
import { TOPICS, US_STATES, formatContactEmail, validateContact } from "@/lib/contact";

type Props = {
  email: string;
  name: string;
  /** true when the server can send email (RESEND_API_KEY set); otherwise opens the visitor's email app. */
  serverEnabled: boolean;
};

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export function ContactForm({ email, name, serverEnabled }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const result = validateContact(values);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }

    if (!serverEnabled) {
      const subject = `Website inquiry from ${result.data.firstName} ${result.data.lastName}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatContactEmail(result.data))}`;
      setStatus({
        kind: "sent",
        message: "Your email app should open with your message ready to send. Just press Send.",
      });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, company: values.company ?? "" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Please email ${email} directly.`);
      form.reset();
      setStatus({
        kind: "sent",
        message: `Thank you — your message was sent. ${name} will reply by email.`,
      });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            maxLength={60}
          />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" autoComplete="family-name" required maxLength={60} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">
            Phone <span className="optional">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </div>
        <div className="field">
          <label htmlFor="state">
            State <span className="optional">(optional)</span>
          </label>
          <select id="state" name="state" defaultValue="" autoComplete="address-level1">
            <option value="">Select your state</option>
            {US_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="topic">What can I help you with?</label>
          <select id="topic" name="topic" defaultValue="">
            <option value="">Choose a topic</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            maxLength={3000}
            aria-describedby="message-hint"
          />
          <p id="message-hint" className="hint">
            Please don&rsquo;t include Social Security numbers, bank or payment details, or medical
            information.
          </p>
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <p className="form-disclosure">
        By submitting this form, you authorize {name} to contact you by email or phone to respond to
        your inquiry. Submitting this form does not obligate you to purchase anything and does not
        apply for or bind any insurance coverage. See the <a href="/privacy">Privacy Policy</a>.
      </p>

      <div className="form-actions">
        <button className="button" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        {!serverEnabled ? (
          <span className="hint">This opens your email app with your message filled in.</span>
        ) : null}
      </div>

      <p
        className={`form-status ${status.kind}`}
        role={status.kind === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {status.message}
      </p>
    </form>
  );
}
