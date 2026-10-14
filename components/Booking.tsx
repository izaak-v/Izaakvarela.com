import Link from "next/link";
import { profile } from "@/content/profile";
import { mailto } from "@/lib/format";
import { DevPlaceholder } from "./DevPlaceholder";
import { Icon } from "./Icon";

/** Embeds the Google Calendar appointment schedule, or falls back to email when not configured. */
export function Booking() {
  const url = profile.bookingUrl;

  if (!url) {
    return (
      <div className="booking-fallback">
        <DevPlaceholder title="booking URL not set">
          Add your Google appointment schedule link to <code>bookingUrl</code> in{" "}
          <code>content/profile.ts</code>. Until then, the live site shows the email option below.
        </DevPlaceholder>
        <h2 className="h3">Request a time by email</h2>
        <p>
          Send me a few days and times that work for you, and I&rsquo;ll reply to confirm a
          consultation.
        </p>
        <div className="button-row">
          <a className="button" href={mailto(profile.email, "Consultation request")}>
            <Icon name="mail" size={18} /> Email {profile.email}
          </a>
          <Link className="button button-ghost" href="/contact">
            Use the contact form
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = url.includes("?") ? `${url}&gv=true` : `${url}?gv=true`;

  return (
    <div className="booking">
      <div className="booking-frame">
        <iframe
          src={embedUrl}
          title={`Book an appointment with ${profile.name} (Google Calendar)`}
          loading="lazy"
        />
      </div>
      <p className="booking-alt">
        Trouble viewing the calendar?{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open the booking page in a new tab
        </a>
        .
      </p>
    </div>
  );
}
