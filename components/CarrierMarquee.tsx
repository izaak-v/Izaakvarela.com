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
/**
 * Logos are normalised by visual area rather than one fixed height: a wide wordmark gets less height
 * than a compact mark, so every logo reads at a similar size. Returns the desktop height in px; CSS
 * scales it down on small screens.
 */
const LOGO_AREA = 6400;
const logoHeight = (w: number, h: number, scale = 1) =>
  Math.round(Math.min(56, Math.max(22, Math.sqrt(LOGO_AREA / (w / h)) * scale)));

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
            sizes={`${Math.ceil((logoHeight(c.logoWidth, c.logoHeight, c.logoScale) * c.logoWidth) / c.logoHeight)}px`}
            className="marquee-logo"
            // Eager: the track is wider than the screen, and lazy logos could pop in mid-loop.
            loading="eager"
            style={
              {
                "--logo-h": `${logoHeight(c.logoWidth, c.logoHeight, c.logoScale)}px`,
              } as React.CSSProperties
            }
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
