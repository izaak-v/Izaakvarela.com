import Link from "next/link";
import { profile } from "@/content/profile";
import { Booking } from "@/components/Booking";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Schedule a Consultation",
  description: `Book a free, no-obligation life insurance consultation with ${profile.name}, ${profile.title}.`,
  path: "/schedule",
});

const covers = [
  "Who you want to protect and what you want coverage to do",
  "Any coverage you already have through work or elsewhere",
  "How different types of life insurance generally work",
  "Options that may fit your goals and budget, and next steps if you want them",
];

export default function SchedulePage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="schedule-title">
        <div className="container narrow-head">
          <p className="eyebrow eyebrow-light">Schedule</p>
          <h1 id="schedule-title">Schedule a Life Insurance Consultation</h1>
          <p className="hero-lede">
            A relaxed conversation about your goals and the coverage options available to you. Free
            and with no obligation to buy anything.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Booking">
        <div className="container schedule-grid">
          <aside className="schedule-aside">
            <h2 className="h3">What we&rsquo;ll cover</h2>
            <ul className="check-list check-list-lg">
              {covers.map((c) => (
                <li key={c}>
                  <Icon name="check" size={18} /> {c}
                </li>
              ))}
            </ul>
            <p className="fine-print">
              Please don&rsquo;t share Social Security numbers, bank details, or medical records
              when booking. If an application is ever appropriate, we&rsquo;ll handle that
              separately and securely.
            </p>
            <p>
              Prefer to ask a question first?{" "}
              <Link className="text-link" href="/contact">
                Contact me
              </Link>
              .
            </p>
          </aside>
          <div className="schedule-main">
            <Booking />
          </div>
        </div>
      </section>
    </>
  );
}
