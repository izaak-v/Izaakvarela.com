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
        </details>
      ))}
    </div>
  );
}
