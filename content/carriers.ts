/**
 * Carrier roster shown in the "Provider network" marquee (confirmed by Izaak, Oct 2026).
 *
 * Logos: only add official artwork (the carrier's own media/brand page or website asset) that you
 * have permission to display. Save it under /public/images/carriers/ and set `logo`, `logoWidth`
 * and `logoHeight`. Until then the carrier is shown as a clean text wordmark — never a guessed or
 * redrawn logo.
 *
 * Listing a carrier does not mean every product is available in every state or for every client,
 * and no carrier endorses this website (see the disclosure under the marquee).
 */
export type Carrier = {
  name: string;
  /** e.g. "/images/carriers/example.svg" — official asset only. */
  logo?: string;
  /** Logo intrinsic width/height in px, required when `logo` is set. */
  logoWidth?: number;
  logoHeight?: number;
  /** Where the logo file came from (kept for the record; not displayed). */
  logoSource?: string;
};

export const carriers: Carrier[] = [
  { name: "Aetna" },
  { name: "American Amicable" },
  { name: "Americo" },
  { name: "Corebridge" },
  { name: "Chubb" },
  { name: "Ethos" },
  { name: "Foresters" },
  { name: "Mutual of Omaha" },
  { name: "Instabrain" },
  { name: "Transamerica" },
  { name: "Royal Neighbors" },
  { name: "National Life Group" },
  { name: "F&G" },
];
