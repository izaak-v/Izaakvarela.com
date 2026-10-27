/**
 * Insurance carriers shown in the "Provider network" section.
 *
 * Add ONLY carriers you are actually appointed with, confirmed from your own records (for example
 * your contracting/appointment list). Each entry appears publicly. Logos: use official artwork you
 * have permission to display, saved under /public/images/carriers/, and set `logo` to its path —
 * without a logo the carrier's name is shown as text.
 *
 * Until at least one carrier is listed, the section shows the general provider-network statement
 * without names.
 */
export type Carrier = {
  name: string;
  /** e.g. "/images/carriers/example.svg" */
  logo?: string;
  /** Logo width/height in px (intrinsic), required when `logo` is set. */
  logoWidth?: number;
  logoHeight?: number;
};

export const carriers: Carrier[] = [];
