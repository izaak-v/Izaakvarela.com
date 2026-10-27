import Image from "next/image";
import type { Carrier } from "@/content/carriers";

/**
 * Continuously scrolling carrier strip.
 *
 * The roster is rendered twice in one track that translates by exactly -50%, so the loop is seamless
 * (the second copy lands where the first started). The duplicate copy is aria-hidden; screen readers
 * get the single labelled list. Motion pauses on hover/focus and is disabled entirely under
 * prefers-reduced-motion, where the list wraps as a static row instead.
 */
export function CarrierMarquee({ carriers }: { carriers: Carrier[] }) {
  const items = (copy: 0 | 1) =>
    carriers.map((c) => (
      <li key={`${copy}-${c.name}`} className="marquee-item">
        {c.logo && c.logoWidth && c.logoHeight ? (
          <Image
            src={c.logo}
            alt={copy === 0 ? c.name : ""}
            width={c.logoWidth}
            height={c.logoHeight}
            sizes="180px"
            className="marquee-logo"
          />
        ) : (
          <span className="marquee-wordmark">{c.name}</span>
        )}
      </li>
    ));

  return (
    <div
      className="marquee"
      role="region"
      tabIndex={0}
      aria-label="Carrier network (scrolling; hover or focus to pause)"
    >
      <div className="marquee-track" data-testid="marquee-track">
        <ul className="marquee-list" aria-label="Insurance carriers">
          {items(0)}
        </ul>
        <ul className="marquee-list" aria-hidden="true">
          {items(1)}
        </ul>
      </div>
    </div>
  );
}
