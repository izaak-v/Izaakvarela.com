/**
 * Client testimonials.
 * ONLY entries with `approved: true` are ever shown publicly.
 * Set `approved: true` only after the client has given written permission to publish.
 * If none are approved, the testimonials section is hidden on the live site.
 */

export type Testimonial = {
  /** First name or initials only, e.g. "Maria G." or "J.R." */
  name: string;
  quote: string;
  /** Two-letter state code or full name, optional */
  state?: string;
  /** Optional, e.g. "Final Expense" */
  coverageType?: string;
  /** Client has given permission to publish this testimonial. */
  approved: boolean;
};

export const testimonials: Testimonial[] = [
  // {
  //   name: "First name or initials",
  //   quote: "Their words, exactly as approved.",
  //   state: "AZ",
  //   coverageType: "Life Insurance",
  //   approved: false,
  // },
];
