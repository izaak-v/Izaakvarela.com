"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  TOPICS,
  US_STATES,
  contactSubject,
  formatContactEmail,
  validateContact,
  type ContactPayload,
} from "@/lib/contact";
import { Icon } from "./Icon";

type Props = {
  email: string;
  name: string;
  phone: { display: string; tel: string } | null;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  /** Online delivery isn't configured: offer the visitor's email app, pre-filled. */
  | { kind: "fallback"; mailtoHref: string }
  | { kind: "error"; message: string };

function mailtoFor(email: string, d: ContactPayload): string {
  return `mailto:${email}?subject=${encodeURIComponent(contactSubject(d))}&body=${encodeURIComponent(formatContactEmail(d))}`;
}

export function ContactForm({ email, name, phone }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inFlight = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // guard against double taps / duplicate submissions
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const result = validateContact(values);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, company: values.company ?? "" }),
        signal: AbortSignal.timeout(20000),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 503) {
        setStatus({ kind: "fallback", mailtoHref: mailtoFor(email, result.data) });
        return;
      }
      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            json.error || `Sorry, your message couldn't be sent. Please email ${email} directly.`,
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: `The connection timed out or dropped. Your message is still here — please try again, or email ${email} directly.`,
      });
    } finally {
      inFlight.current = false;
    }
  }

  if (status.kind === "sent") {
    return (
      <div
        className="form-success"
        role="status"
        aria-live="polite"
        tabIndex={-1}
        ref={(el) => el?.focus()}
      >
        <span className="form-success-icon" aria-hidden="true">
          <Icon name="check" size={28} />
        </span>
        <h3>Thanks — your message has been sent.</h3>
        <p>I&rsquo;ll get back to you as soon as I can.</p>
        <div className="button-row">
          <Link className="button button-gold" href="/schedule">
            <Icon name="calendar" size={18} /> Schedule a Consultation
          </Link>
          {phone ? (
            <a className="button button-ghost" href={`tel:${phone.tel}`}>
              <Icon name="phone" size={18} /> Call Me
            </a>
          ) : null}
        </div>
      </div>
    );
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
            Please don&rsquo;t include sensitive information: Social Security numbers, bank account
            or routing numbers, payment card details, or detailed medical information.
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
        <button
          className="button"
          type="submit"
          disabled={status.kind === "sending"}
          aria-disabled={status.kind === "sending"}
        >
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>

      <div className={`form-status ${status.kind}`} role="status" aria-live="polite">
        {status.kind === "error" ? <p role="alert">{status.message}</p> : null}
        {status.kind === "fallback" ? (
          <div className="form-fallback">
            <p>
              Online sending isn&rsquo;t available at the moment, but your message is still in the
              form. You can send it from your own email app instead
              {phone ? (
                <>
                  {" "}
                  or call <a href={`tel:${phone.tel}`}>{phone.display}</a>
                </>
              ) : null}
              .
            </p>
            <a className="button button-gold" href={status.mailtoHref}>
              <Icon name="mail" size={18} /> Open in my email app
            </a>
          </div>
        ) : null}
      </div>
    </form>
  );
}
