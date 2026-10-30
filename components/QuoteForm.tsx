"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { US_STATES } from "@/lib/contact";
import {
  CONTACT_TIMES,
  COVERAGE_RANGES,
  QUOTE_CONSENT_TEXT,
  QUOTE_INTERESTS,
  QUOTE_INTEREST_EVENT,
  SMS_CONSENT_TEXT,
  formatQuoteEmail,
  quoteSubject,
  validateQuote,
} from "@/lib/quote";
import { Icon } from "./Icon";

type Props = { email: string; phone: { display: string; tel: string } | null };

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "fallback"; mailtoHref: string }
  | { kind: "error"; message: string; field?: string };

export function QuoteForm({ email, phone }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const interestRef = useRef<HTMLSelectElement>(null);

  // Coverage CTAs preselect the matching option; the visitor can still change it.
  useEffect(() => {
    const onInterest = (e: Event) => {
      const value = (e as CustomEvent<unknown>).detail;
      if (interestRef.current && (QUOTE_INTERESTS as readonly unknown[]).includes(value))
        interestRef.current.value = value as string;
    };
    window.addEventListener(QUOTE_INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(QUOTE_INTEREST_EVENT, onInterest);
  }, []);
  const errField = status.kind === "error" ? status.field : undefined;
  const invalid = (f: string) =>
    errField === f ? { "aria-invalid": true, "aria-describedby": "quote-error" } : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const fd = new FormData(e.currentTarget);
    const values = {
      ...Object.fromEntries(fd),
      consent: fd.get("consent") === "on",
      smsConsent: fd.get("smsConsent") === "on",
    } as Record<string, unknown>;
    const result = validateQuote(values);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error, field: result.field });
      if (result.field)
        formRef.current?.querySelector<HTMLElement>(`[name="${result.field}"]`)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          company: String(values.company ?? ""),
          // Recorded as the SMS consent source (page only — no query string or hash).
          pageUrl: `${window.location.origin}${window.location.pathname}`,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
      if (res.status === 503) {
        const now = new Date();
        setStatus({
          kind: "fallback",
          mailtoHref: `mailto:${email}?subject=${encodeURIComponent(quoteSubject(result.data))}&body=${encodeURIComponent(formatQuoteEmail(result.data, now))}`,
        });
        return;
      }
      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            json.error || `Sorry, your request couldn't be sent. Please email ${email} directly.`,
          field: json.field,
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: `The connection timed out or dropped. Your details are still here — please try again, or email ${email} directly.`,
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
        <h3>Thanks — your request has been received.</h3>
        <p>I&rsquo;ll reach out soon at the phone number or email you provided.</p>
        <div className="button-row">
          <Link className="btn btn-amber" href="/schedule">
            <Icon name="calendar" size={18} /> Schedule a Call
          </Link>
          {phone ? (
            <a className="btn btn-outline" href={`tel:${phone.tel}`}>
              <Icon name="phone" size={18} /> Call Izaak
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="quote-form"
      onSubmit={onSubmit}
      noValidate
      aria-label="Request coverage"
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor="q-firstName">
            First name{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="q-firstName"
            name="firstName"
            autoComplete="given-name"
            required
            maxLength={60}
            {...invalid("firstName")}
          />
        </div>
        <div className="field">
          <label htmlFor="q-lastName">
            Last name{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="q-lastName"
            name="lastName"
            autoComplete="family-name"
            required
            maxLength={60}
            {...invalid("lastName")}
          />
        </div>
        <div className="field">
          <label htmlFor="q-phone">
            Phone{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="q-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            maxLength={30}
            {...invalid("phone")}
          />
        </div>
        <div className="field">
          <label htmlFor="q-email">
            Email{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="q-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
            {...invalid("email")}
          />
        </div>
        <div className="field">
          <label htmlFor="q-state">
            State{" "}
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="q-state"
            name="state"
            defaultValue=""
            autoComplete="address-level1"
            required
            {...invalid("state")}
          >
            <option value="">Select your state</option>
            {US_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-interest">
            What are you looking for? <span className="optional">(optional)</span>
          </label>
          <select
            ref={interestRef}
            id="q-interest"
            name="interest"
            defaultValue=""
            {...invalid("interest")}
          >
            <option value="">Choose one</option>
            {QUOTE_INTERESTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-coverageRange">
            Desired coverage <span className="optional">(optional)</span>
          </label>
          <select
            id="q-coverageRange"
            name="coverageRange"
            defaultValue=""
            {...invalid("coverageRange")}
          >
            <option value="">Choose a range</option>
            {COVERAGE_RANGES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-bestTime">
            Best time to contact <span className="optional">(optional)</span>
          </label>
          <select id="q-bestTime" name="bestTime" defaultValue="" {...invalid("bestTime")}>
            <option value="">Choose a time</option>
            {CONTACT_TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="q-message">
            Message / notes <span className="optional">(optional)</span>
          </label>
          <textarea
            id="q-message"
            name="message"
            rows={4}
            maxLength={2000}
            aria-describedby="q-message-hint"
          />
          <p id="q-message-hint" className="hint">
            Please don&rsquo;t include Social Security numbers, bank details, medical records, or
            medication or health details.
          </p>
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor="q-company">Company</label>
          <input id="q-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="field field-full consent">
          <input id="q-consent" name="consent" type="checkbox" required {...invalid("consent")} />
          <label htmlFor="q-consent">{QUOTE_CONSENT_TEXT}</label>
        </div>
        <div className="field field-full consent">
          <input id="q-smsConsent" name="smsConsent" type="checkbox" />
          <div className="consent-copy">
            <label htmlFor="q-smsConsent">{SMS_CONSENT_TEXT}</label>
            <p className="consent-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms &amp; Conditions</a>
            </p>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-amber btn-lg" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Request Coverage"}
        </button>
        <p className="hint">
          Submitting doesn&rsquo;t apply for or bind coverage. See the{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      <div className={`form-status ${status.kind}`} role="status" aria-live="polite">
        {status.kind === "error" ? (
          <p role="alert" id="quote-error">
            {status.message}
          </p>
        ) : null}
        {status.kind === "fallback" ? (
          <div className="form-fallback">
            <p>
              Online sending isn&rsquo;t available at the moment, but your details are still in the
              form. You can send them from your own email app instead
              {phone ? (
                <>
                  {" "}
                  or call <a href={`tel:${phone.tel}`}>{phone.display}</a>
                </>
              ) : null}
              .
            </p>
            <a className="btn btn-amber" href={status.mailtoHref}>
              <Icon name="mail" size={18} /> Open in my email app
            </a>
          </div>
        ) : null}
      </div>
    </form>
  );
}
