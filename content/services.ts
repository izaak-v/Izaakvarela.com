import type { IconName } from "@/components/Icon";

/**
 * Coverage categories shown in the homepage coverage grid and used as topics in the forms.
 * `image` is optional: drop a photo in /public/images/coverage/ and set its path here to show it
 * on the card (otherwise the card uses its icon artwork).
 */
export type Service = {
  id: string;
  title: string;
  summary: string;
  icon: IconName;
  image?: string;
};

export const services: Service[] = [
  {
    id: "life-insurance",
    title: "Life Insurance",
    summary:
      "A benefit for the people you choose, to help replace income and cover what you leave behind.",
    icon: "shield",
  },
  {
    id: "final-expense",
    title: "Final Expense",
    summary:
      "Smaller permanent policies intended to help loved ones with funeral and end-of-life costs.",
    icon: "leaf",
  },
  {
    id: "mortgage-protection",
    title: "Mortgage Protection",
    summary: "Life insurance planned around your home loan, to help your family keep the house.",
    icon: "home",
  },
  {
    id: "family-protection",
    title: "Family Protection",
    summary: "A look at income replacement, debts, childcare and future costs like education.",
    icon: "users",
  },
  {
    id: "living-benefits",
    title: "Living Benefits",
    summary:
      "Riders on some policies that may allow early access to benefits for a qualifying illness.",
    icon: "pulse",
  },
  {
    id: "term-life",
    title: "Term Life",
    summary:
      "Coverage for a set number of years — often used while children are young or a mortgage is open.",
    icon: "hourglass",
  },
  {
    id: "permanent-life",
    title: "Whole Life / Permanent Coverage",
    summary:
      "Coverage designed to last your lifetime, with some policies building cash value over time.",
    icon: "pillar",
  },
];
