import Link from "next/link";
import { faqs } from "@/content/faqs";

export function Faq() {
  return (
    <div className="faq-list">
      {faqs.map((f) => (
        <details key={f.question} className="faq-item">
          <summary>
            <span>{f.question}</span>
          </summary>
          <p>{f.answer}</p>
          {f.link ? (
            <p className="faq-link">
              <Link className="text-link" href={f.link.href}>
                {f.link.label} →
              </Link>
            </p>
          ) : null}
        </details>
      ))}
    </div>
  );
}
