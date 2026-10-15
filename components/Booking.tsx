import { profile } from "@/content/profile";
import { mailto } from "@/lib/format";
import { DevPlaceholder } from "./DevPlaceholder";
import { Icon } from "./Icon";

/**
 * Online booking through Google Calendar appointment scheduling.
 * - bookingUrl set: "Open Booking Page" (works on every device; bookings land in Google Calendar)
 * - bookingEmbedUrl set too: the booking page is also embedded inline
 * - neither set: falls back to phone/email
 */
export function Booking() {
  const { bookingUrl, bookingEmbedUrl, phone, email } = profile;

  if (!bookingUrl) {
    return (
      <div className="booking-card">
        <DevPlaceholder title="booking URL not set">
          Add your Google appointment schedule link to <code>bookingUrl</code> in{" "}
          <code>content/profile.ts</code>.
        </DevPlaceholder>
        <h2 className="h3">Request a time</h2>
        <p>Call or email with a few days and times that work for you, and I&rsquo;ll confirm.</p>
        <div className="button-row">
          {phone ? (
            <a className="button" href={`tel:${phone.tel}`}>
              <Icon name="phone" size={18} /> Call {phone.display}
            </a>
          ) : null}
          <a className="button button-ghost" href={mailto(email, "Consultation request")}>
            <Icon name="mail" size={18} /> Email Izaak
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="booking">
      <div className="booking-card booking-primary">
        <span className="service-icon" aria-hidden="true">
          <Icon name="calendar" size={22} />
        </span>
        <h2 className="h3">Book online in a minute</h2>
        <p>
          Choose a day and time that works for you on my Google Calendar booking page. You&rsquo;ll
          get a confirmation email from Google with the details.
        </p>
        <a
          className="button button-gold button-lg"
          href={bookingUrl}
          target="_blank"
          rel="noopener"
        >
          <Icon name="calendar" size={18} /> Open Booking Page
          <span className="sr-only"> (Google Calendar, opens in a new tab)</span>
        </a>
        {phone ? (
          <p className="booking-alt">
            Prefer to book by phone? Call <a href={`tel:${phone.tel}`}>{phone.display}</a>.
          </p>
        ) : null}
      </div>

      {bookingEmbedUrl ? (
        <div className="booking-frame">
          <iframe
            src={bookingEmbedUrl}
            title={`Book an appointment with ${profile.name} (Google Calendar)`}
            loading="lazy"
          />
        </div>
      ) : (
        <DevPlaceholder title="inline calendar not enabled">
          Optional: paste the Google &ldquo;Website embed → Inline&rdquo; iframe <code>src</code>{" "}
          into <code>bookingEmbedUrl</code> in <code>content/profile.ts</code> to show the calendar
          on this page. The Open Booking Page button works without it.
        </DevPlaceholder>
      )}
    </div>
  );
}
