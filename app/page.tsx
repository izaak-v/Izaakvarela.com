import Link from "next/link";
import { profile } from "@/content/profile";
import { licenses } from "@/content/licenses";
import { services } from "@/content/services";
import { Portrait } from "@/components/Portrait";
import { LicenseList } from "@/components/LicenseList";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Icon, type IconName } from "@/components/Icon";
import { personJsonLd } from "@/lib/structured-data";
import { mailto } from "@/lib/format";

const serviceIcons: Record<string, IconName> = {
  "life-insurance": "shield",
  "final-expense": "leaf",
  "mortgage-protection": "home",
  "family-protection": "users",
  "living-benefits": "pulse",
};

const steps = [
  {
    title: "Schedule a conversation",
    text: "Pick a time that works for you. Consultations are free and there's no obligation.",
  },
  {
    title: "Review needs and available options",
    text: "We talk through who you want to protect and what matters to you, then look at options that may fit.",
  },
  {
    title: "Decide whether any option makes sense",
    text: "You take the time you need. If something fits, I'll help with next steps — if not, that's okay too.",
  },
];

export default function Home() {
  const activeStates = licenses.filter((l) => l.status === "active").map((l) => l.state);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <p className="eyebrow eyebrow-light">Independent · Licensed · Low-pressure</p>
            <h1 id="hero-title">{profile.name}</h1>
            <p className="hero-role">{profile.title}</p>
            <p className="hero-lede">
              I help individuals and families understand their life insurance options — so they can
              make clear, confident decisions about protecting the people and responsibilities that
              matter most.
            </p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/schedule">
                <Icon name="calendar" size={18} /> Schedule a Consultation
              </Link>
              <Link className="button button-outline-light" href="/credentials">
                <Icon name="shield" size={18} /> Verify My Credentials
              </Link>
              <Link className="text-link-light" href="/contact">
                Contact Me <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
          <div className="hero-photo reveal reveal-delay">
            <Portrait priority sizes="(min-width: 960px) 420px, 80vw" />
            <div className="hero-badge">
              <Icon name="shield" size={18} />
              <span>
                Licensed agent
                <small>NPN {profile.npn}</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="container trust-inner">
          <span>
            <Icon name="check" size={18} /> {profile.title}
          </span>
          {activeStates.length ? (
            <span>
              <Icon name="check" size={18} /> Licensed in {activeStates.join(", ")}
            </span>
          ) : null}
          <span>
            <Icon name="check" size={18} /> National Producer Number {profile.npn}
          </span>
          <span>
            <Icon name="check" size={18} /> Free, no-obligation consultations
          </span>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How I can help</p>
            <h2 id="services-title">Coverage I help you understand</h2>
            <p className="section-intro">
              Every family&rsquo;s situation is different. These are the areas I most often help
              people review. Availability, pricing, and eligibility vary by individual, state, and
              insurance company, and are subject to underwriting.
            </p>
          </div>
          <ul className="service-grid">
            {services.map((s) => (
              <li key={s.id} className="service-card">
                <span className="service-icon">
                  <Icon name={serviceIcons[s.id] ?? "shield"} size={22} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <ul className="check-list">
                  {s.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={16} /> {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="service-card service-card-cta">
              <h3>Not sure where to start?</h3>
              <p>A short conversation is usually the easiest way to figure out what to look at.</p>
              <Link className="button button-gold" href="/schedule">
                Schedule a Consultation
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section section-tint" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-photo">
            <Portrait sizes="(min-width: 960px) 360px, 70vw" className="portrait-light" />
          </div>
          <div className="about-copy">
            <p className="eyebrow">About me</p>
            <h2 id="about-title">A straightforward guide to your options</h2>
            <p>
              I&rsquo;m {profile.name}, a licensed life insurance agent. I work with individuals and
              families to review their goals, understand the coverage options available to them, and
              make informed decisions.
            </p>
            <p>
              Life insurance can feel complicated. My job is to listen first, explain things in
              plain language, and give you room to decide what&rsquo;s right for your household and
              budget — without pressure.
            </p>
            <ul className="check-list check-list-lg">
              <li>
                <Icon name="check" size={18} /> Clear explanations, no jargon
              </li>
              <li>
                <Icon name="check" size={18} /> Your goals lead the conversation
              </li>
              <li>
                <Icon name="check" size={18} /> Credentials you can verify yourself
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* LICENSING */}
      <section id="licensing" className="section" aria-labelledby="licensing-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Licensing &amp; Credentials</p>
            <h2 id="licensing-title">Verify my license independently</h2>
            <p className="section-intro">
              Insurance licensing is issued and regulated at the state level. You can independently
              verify my credentials using the links below.
            </p>
          </div>
          <LicenseList />
          <p className="section-foot">
            <Link className="text-link" href="/credentials">
              View my full credentials page <Icon name="arrow" size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-dark" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow eyebrow-light">How it works</p>
            <h2 id="process-title">Simple, unhurried, and on your terms</h2>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="center">
            <Link className="button button-gold" href="/schedule">
              <Icon name="calendar" size={18} /> Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* FAQ */}
      <section id="faq" className="section section-tint" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title">Common questions</h2>
            <p className="section-intro">
              General, educational answers. Your specific options depend on your situation and the
              insurance company&rsquo;s underwriting.
            </p>
            <p>
              Have a different question?{" "}
              <Link className="text-link" href="/contact">
                Send me a message
              </Link>
              .
            </p>
          </div>
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-band" aria-labelledby="cta-title">
        <div className="container cta-inner">
          <div>
            <h2 id="cta-title">Ready to talk it through?</h2>
            <p>Book a free consultation, or reach out with a question first.</p>
          </div>
          <div className="button-row">
            <Link className="button button-gold" href="/schedule">
              Schedule a Consultation
            </Link>
            <a className="button button-outline-light" href={mailto(profile.email)}>
              <Icon name="mail" size={18} /> {profile.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
