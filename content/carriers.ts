/**
 * Carrier roster shown in the "Provider network" marquee (confirmed by Izaak, Oct 2026).
 *
 * Logos: each PNG in /public/images/carriers/ was cropped from the carrier-logo reference sheet Izaak
 * supplied for PR #5 (Oct 27, 2026), with the white background converted to transparency. The
 * carrier sites were not reachable from the build environment, so nothing was downloaded, redrawn
 * or guessed. To swap in a carrier's own file later, replace the PNG and update its size and
 * `logoSource`. A carrier without `logo` falls back to a text wordmark.
 *
 * Listing a carrier does not mean every product is available in every state or for every client,
 * and no carrier endorses this website (see the disclosure under the marquee).
 */
export type Carrier = {
  /** Full carrier name; also the logo's alt text. */
  name: string;
  /** e.g. "/images/carriers/example.png". */
  logo?: string;
  /** Logo intrinsic width/height in px, required when `logo` is set. */
  logoWidth?: number;
  logoHeight?: number;
  /**
   * Optical size tweak (default 1). Logos are sized by area; heavy, box-filling wordmarks read
   * larger than emblem + thin-text lockups, so nudge them here instead of resizing the file.
   */
  logoScale?: number;
  /** Where the logo file came from (kept for the record; not displayed). */
  logoSource?: string;
};

const SHEET =
  "Cropped from the carrier-logo reference sheet supplied by Izaak Varela (Oct 27, 2026)";

export const carriers: Carrier[] = [
  {
    name: "Aetna",
    logo: "/images/carriers/aetna.png",
    logoWidth: 374,
    logoHeight: 82,
    logoSource: SHEET,
  },
  {
    name: "American Amicable",
    logo: "/images/carriers/american-amicable.png",
    logoWidth: 340,
    logoHeight: 122,
    logoSource: SHEET,
  },
  {
    name: "Americo",
    logo: "/images/carriers/americo.png",
    logoWidth: 366,
    logoHeight: 89,
    logoSource: SHEET,
  },
  {
    name: "Corebridge Financial",
    logo: "/images/carriers/corebridge.png",
    logoWidth: 376,
    logoHeight: 129,
    logoSource: SHEET,
  },
  {
    name: "Chubb",
    logoScale: 0.8,
    logo: "/images/carriers/chubb.png",
    logoWidth: 392,
    logoHeight: 50,
    logoSource: SHEET,
  },
  {
    name: "Ethos",
    logoScale: 0.85,
    logo: "/images/carriers/ethos.png",
    logoWidth: 322,
    logoHeight: 72,
    logoSource: SHEET,
  },
  {
    name: "Foresters Financial",
    logo: "/images/carriers/foresters.png",
    logoWidth: 332,
    logoHeight: 130,
    logoSource: SHEET,
  },
  {
    name: "Mutual of Omaha",
    logoScale: 1.12,
    logo: "/images/carriers/mutual-of-omaha.png",
    logoWidth: 407,
    logoHeight: 107,
    logoSource: SHEET,
  },
  {
    name: "Instabrain",
    logo: "/images/carriers/instabrain.png",
    logoWidth: 381,
    logoHeight: 97,
    logoSource: SHEET,
  },
  {
    name: "Transamerica",
    logoScale: 1.06,
    logo: "/images/carriers/transamerica.png",
    logoWidth: 381,
    logoHeight: 133,
    logoSource: SHEET,
  },
  {
    name: "Royal Neighbors of America",
    logoScale: 1.12,
    logo: "/images/carriers/royal-neighbors.png",
    logoWidth: 402,
    logoHeight: 115,
    logoSource: SHEET,
  },
  {
    name: "National Life Group",
    logoScale: 1.12,
    logo: "/images/carriers/national-life-group.png",
    logoWidth: 387,
    logoHeight: 108,
    logoSource: SHEET,
  },
  {
    name: "F&G",
    logoScale: 0.9,
    logo: "/images/carriers/fg.png",
    logoWidth: 176,
    logoHeight: 125,
    logoSource: SHEET,
  },
];
