export type Service = {
  id: string;
  title: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "life-insurance",
    title: "Life Insurance",
    summary:
      "Coverage that pays a benefit to the people you choose, to help replace income and cover obligations if you pass away.",
    points: ["Term and permanent options", "Sized around your goals and budget"],
  },
  {
    id: "final-expense",
    title: "Final Expense",
    summary:
      "Smaller permanent policies intended to help loved ones with funeral costs, medical bills, and other end-of-life expenses.",
    points: ["Typically simplified applications", "Focused on lasting coverage"],
  },
  {
    id: "mortgage-protection",
    title: "Mortgage Protection",
    summary:
      "Life insurance arranged around your home loan, so your family has resources to help keep the house if your income stops.",
    points: ["Benefit can track your balance or term", "Paid to your beneficiaries"],
  },
  {
    id: "family-protection",
    title: "Family Protection",
    summary:
      "A broader look at what your household would need — income replacement, debts, childcare, and future costs like education.",
    points: ["Needs-based conversation", "Coordinates with coverage you already have"],
  },
  {
    id: "living-benefits",
    title: "Living Benefits",
    summary:
      "Some policies include riders that may let you access part of the death benefit early if you experience a qualifying illness.",
    points: ["Terms vary by policy and carrier", "Explained in plain language"],
  },
];
