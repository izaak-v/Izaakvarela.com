import type { IconName } from "@/components/Icon";
import type { QuoteInterest } from "@/lib/quote";

/**
 * Coverage categories shown in the homepage coverage section and used as topics in the forms.
 *
 * `summary` is always visible; `details` is the short educational breakdown revealed by "Learn more".
 * Keep it general: no rates, guarantees, underwriting promises or personal recommendations, and no
 * suggestion that every product is available to every person or in every state.
 *
 * `image` is optional: drop a photo in /public/images/coverage/ and set its path here to show a
 * thumbnail beside the row.
 */
export type Service = {
  id: string;
  /** Also the Request Coverage form option this row's CTA preselects. */
  title: Exclude<QuoteInterest, "Not Sure">;
  summary: string;
  details: {
    /** What it is. */
    what: string;
    /** Who it is generally for. */
    oftenFor: string;
    /** The problem it helps solve. */
    why: string;
    /** One to three short key points. */
    keyPoints: string[];
  };
  cta: string;
  icon: IconName;
  image?: string;
};

export const services: Service[] = [
  {
    id: "life-insurance",
    title: "Life Insurance",
    summary: "A benefit paid to the people you choose, structured for temporary or lifelong needs.",
    details: {
      what: "A contract that pays a death benefit to your beneficiaries according to the policy terms. It can be set up for a period of years (term) or designed to last for life (permanent).",
      oftenFor:
        "Anyone whose family, partner or business would face financial strain if they passed away.",
      why: "It can help loved ones cover lost income, debts and everyday costs during a difficult time.",
      keyPoints: [
        "Temporary and permanent options",
        "Benefit is paid according to the policy terms",
        "Options vary by carrier, state and eligibility",
      ],
    },
    cta: "Explore Life Insurance Options",
    icon: "shield",
  },
  {
    id: "final-expense",
    title: "Final Expense",
    summary:
      "A smaller permanent policy intended to help loved ones with funeral and end-of-life costs.",
    details: {
      what: "A permanent life insurance option generally designed to help with funeral, burial, medical and other end-of-life expenses.",
      oftenFor:
        "People who want a smaller permanent policy intended to reduce the financial burden on family members.",
      why: "Funeral and final costs can arrive all at once; this coverage is meant to help family handle them.",
      keyPoints: [
        "Designed around final expenses",
        "Permanent coverage when kept in force",
        "Eligibility and benefits vary by carrier",
      ],
    },
    cta: "Explore Final Expense Coverage",
    icon: "leaf",
  },
  {
    id: "mortgage-protection",
    title: "Mortgage Protection",
    summary: "Life insurance planned around your home loan, to help your family stay in the home.",
    details: {
      what: "Life insurance used as part of a plan to help a family manage mortgage obligations if the insured dies.",
      oftenFor: "Homeowners who want to help protect their family's ability to remain in the home.",
      why: "A mortgage payment doesn't stop if a household loses an income; this coverage is meant to help keep it manageable.",
      keyPoints: [
        "Coverage can be structured around mortgage needs",
        "Benefit is paid according to the policy terms",
        "It is not mortgage insurance from your lender",
      ],
    },
    cta: "Explore Mortgage Protection",
    icon: "home",
  },
  {
    id: "family-protection",
    title: "Family Protection",
    summary:
      "A needs-based plan around income, dependents and major obligations — not a single product.",
    details: {
      what: "A planning approach rather than one specific policy. It can combine coverage intended to help replace income, protect dependents, cover major obligations and provide financial support after a death.",
      oftenFor: "Parents, partners and caregivers with people who rely on them.",
      why: "It looks at the whole picture — income, debts, childcare and future costs like education — so coverage lines up with what your family would actually need.",
      keyPoints: [
        "Built around your family's needs, not a product",
        "May combine term and permanent coverage",
        "Options vary by carrier, state and eligibility",
      ],
    },
    cta: "Build a Family Protection Plan",
    icon: "users",
  },
  {
    id: "living-benefits",
    title: "Living Benefits",
    summary:
      "Riders on some policies that may allow early access to part of the benefit after a qualifying event.",
    details: {
      what: "Certain life insurance policies may include riders or provisions that allow access to part of the death benefit after a qualifying event while the insured is still living.",
      oftenFor:
        "People who want additional financial protection if a qualifying serious illness or condition occurs.",
      why: "A serious illness can bring costs and lost income while you're still living; these features may help with that.",
      keyPoints: [
        "Availability varies by policy and carrier",
        "Qualifying events and amounts vary",
        "Using living benefits can reduce the remaining death benefit",
      ],
    },
    cta: "Learn About Living Benefits",
    icon: "pulse",
  },
  {
    id: "term-life",
    title: "Term Life",
    summary:
      "Coverage for a set number of years — often used while children are young or a mortgage is open.",
    details: {
      what: "Coverage for a specific period of time, such as 10, 20 or 30 years.",
      oftenFor:
        "Income replacement, mortgages, young families or other temporary financial obligations.",
      why: "It can provide a larger amount of death-benefit protection during the years a family may need it most.",
      keyPoints: [
        "Fixed coverage period",
        "Generally focused on death-benefit protection",
        "Options vary by carrier and eligibility",
      ],
    },
    cta: "Explore Term Coverage",
    icon: "hourglass",
  },
  {
    id: "permanent-life",
    title: "Whole Life / Permanent Coverage",
    summary:
      "Coverage designed to last your lifetime, with some policies building cash value over time.",
    details: {
      what: "Life insurance designed to remain in force for life when policy requirements are met.",
      oftenFor:
        "Long-term family protection, final expenses, legacy planning and permanent death-benefit needs.",
      why: "Some needs don't end after 20 or 30 years; permanent coverage is meant to be there whenever it's needed.",
      keyPoints: [
        "Permanent coverage",
        "May build cash value, depending on the policy",
        "Premiums and features vary by product and carrier",
      ],
    },
    cta: "Explore Permanent Coverage",
    icon: "pillar",
  },
];
