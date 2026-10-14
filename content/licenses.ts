/**
 * Insurance licenses — one entry per state.
 * Add only licenses you actually hold, copied from your official license record.
 * Every field shown here appears publicly on the home page and /credentials.
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

export const licenses: License[] = [
  {
    state: "Arizona",
    stateCode: "AZ",
    licenseNumber: "22276637",
    licenseType: "Insurance Producer",
    linesOfAuthority: ["Life"],
    residency: "Resident",
    status: "active",
    effectiveDate: "2026-07-03",
    expirationDate: "2029-10-31",
    verificationUrl: "https://difi.az.gov/license-search",
    verificationNote:
      "Arizona Department of Insurance and Financial Institutions. Search as an individual licensee using license number / NPN 22276637.",
  },
];
