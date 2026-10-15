"use client";

import { useEffect, useState } from "react";

type Props = { src: string; fallbackUrl: string; title: string };

/**
 * Inline Google Calendar booking page with a loading state.
 * Cross-origin iframes can't reliably report load failures, so if the frame hasn't loaded
 * after a while we show a gentle note pointing to the external booking page.
 */
export function BookingEmbed({ src, fallbackUrl, title }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const t = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(t);
  }, [loaded]);

  return (
    <div className="booking-embed">
      <div className={`booking-frame${loaded ? " is-loaded" : ""}`}>
        {!loaded ? (
          <div className="booking-loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <span>Loading available times…</span>
          </div>
        ) : null}
        <iframe src={src} title={title} onLoad={() => setLoaded(true)} />
      </div>
      <p className="booking-alt" aria-live="polite">
        {slow && !loaded ? "The calendar is taking a while to load. " : "Calendar not showing? "}
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
          Open the booking page in a new tab
        </a>
        .
      </p>
    </div>
  );
}
