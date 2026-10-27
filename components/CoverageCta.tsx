"use client";

import { QUOTE_INTEREST_EVENT, type QuoteInterest } from "@/lib/quote";
import { Icon } from "./Icon";

/**
 * Coverage CTA: a plain in-page link to the Request Coverage form that also preselects the matching
 * "What are you looking for?" option. Without JavaScript it still jumps to the form.
 */
export function CoverageCta({ interest, children }: { interest: QuoteInterest; children: string }) {
  return (
    <a
      className="coverage-cta-link"
      href="#request"
      onClick={() =>
        window.dispatchEvent(new CustomEvent(QUOTE_INTEREST_EVENT, { detail: interest }))
      }
    >
      {children} <Icon name="arrow" size={16} />
    </a>
  );
}
