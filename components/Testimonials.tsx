import { testimonials } from "@/content/testimonials";
import { isDev } from "@/lib/env";

const samples = [
  {
    name: "Sample A.",
    quote: "Sample testimonial text. Replace with a real, approved client quote.",
    state: "AZ",
    coverageType: "Life Insurance",
  },
  {
    name: "Sample B.",
    quote: "Sample testimonial text. Replace with a real, approved client quote.",
    state: "AZ",
    coverageType: "Final Expense",
  },
];

/** Renders only approved testimonials. Labeled samples appear in `npm run dev` only. */
export function Testimonials() {
  const approved = testimonials.filter((t) => t.approved);
  const showSamples = isDev && approved.length === 0;
  const items = showSamples ? samples : approved;
  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="container">
        <p className="eyebrow">Client experiences</p>
        <h2 id="testimonials-title">What clients say</h2>
        <ul className="testimonial-grid">
          {items.map((t, i) => (
            <li key={i} className={`testimonial-card${showSamples ? " is-sample" : ""}`}>
              {showSamples ? (
                <p className="sample-label">Sample testimonial — replace before publishing</p>
              ) : null}
              <blockquote>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <p className="testimonial-meta">
                <strong>{t.name}</strong>
                {[t.state, t.coverageType].filter(Boolean).length ? (
                  <span> · {[t.state, t.coverageType].filter(Boolean).join(" · ")}</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
        {!showSamples ? (
          <p className="fine-print">
            Testimonials reflect individual experiences shared with permission and are not a
            guarantee of future results or coverage outcomes.
          </p>
        ) : null}
      </div>
    </section>
  );
}
