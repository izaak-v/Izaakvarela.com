/**
 * State insurance licenses — optional extra detail shown on /credentials and the home page.
 * Primary verification is NIPR via your NPN (see content/profile.ts).
 * Every entry here appears publicly.
 */

export type License = {
  state: string;
  stateCode: string;
  licenseNumber: string;
  /** e.g. "Insurance Producer" */
  licenseType?: string;
  /** e.g. ["Life"] */
  linesOfAuthority?: string[];
  residency?: "Resident" | "Non-resident";
  status: "active" | "inactive";
  /** ISO date, YYYY-MM-DD */
  effectiveDate?: string;
  /** ISO date, YYYY-MM-DD */
  expirationDate?: string;
  /** Official state lookup page where anyone can confirm the license. */
  verificationUrl?: string;
  /** Short hint shown under the button, e.g. which number to search by. */
  verificationNote?: string;
};

/**
 * Optional, secondary to NIPR verification. Leave empty unless you want a specific state
 * license shown publicly. Only add states you have confirmed from your official license record.
 *
 * Example (from your license printout — uncomment ONLY after confirming the issuing state):
 * {
 *   state: "Arizona",
 *   stateCode: "AZ",
 *   licenseNumber: "22276637",
 *   licenseType: "Insurance Producer",
 *   linesOfAuthority: ["Life"],
 *   residency: "Resident",
 *   status: "active",
 *   effectiveDate: "2026-07-03",
 *   expirationDate: "2029-10-31",
 *   verificationUrl: "https://difi.az.gov/license-search",
 * },
 */
export const licenses: License[] = [];
