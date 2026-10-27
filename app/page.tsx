import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { carriers } from "@/content/carriers";
import { CarrierMarquee } from "@/components/CarrierMarquee";
import { CoverageCta } from "@/components/CoverageCta";
import { CredentialCard } from "@/components/CredentialCard";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { mailto } from "@/lib/format";
import { personJsonLd } from "@/lib/structured-data";

const expectations = [
  {
    title: "Independent and licensed",
    text: "Access to multiple carriers, not one company's products.",
  },
  { title: "Straightforward guidance", text: "Your options explained in plain language." },
  {
    title: "Protection that fits",
    text: "Income, final expenses, your mortgage and the people you love.",
  },
  { title: "No pressure", text: "Free consultations, and the decision is always yours." },
];

const nextSteps = [
  { title: "Tell me what you need", text: "A few details — it takes about a minute." },
  {
    title: "We talk it through",
    text: "I'll reach out to review your goals and answer questions.",
  },
  {
    title: "Compare your options",
    text: "See coverage that may fit, then decide on your timeline.",
  },
];

export default function Home() {
  const { phone, photo } = profile;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      {/* 1. HERO */}
      <section className="hero" aria-labelledby="hero-title">
        {photo ? (
          <div className="hero-media" aria-hidden="true">
            <Image
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt=""
              priority
              sizes="(min-width: 960px) 50vw, 100vw"
            />
          </div>
        ) : null}
        <div className="container hero-inner">
          <div className="hero-copy reveal">
            <p className="hero-kicker">{profile.title}</p>
            <h1 id="hero-title">{profile.name}</h1>
            <p className="hero-statement">Protecting the people and plans you care about most.</p>
            <p className="hero-lede">
              Independent life insurance guidance for individuals and families — straightforward
              options from multiple carriers, explained clearly and without pressure.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-amber btn-lg" href="#request">
                Request Coverage
              </Link>
              <Link className="btn btn-outline-light btn-lg" href="#credentials">
                <Icon name="shield" size={18} /> Verify Credentials
              </Link>
            </div>
            <ul className="hero-links">
              <li>
                <Link href="/schedule">
                  <Icon name="calendar" size={18} /> Schedule a Call
                </Link>
              </li>
              {phone ? (
                <li>
                  <a href={`tel:${phone.tel}`}>
                    <Icon name="phone" size={18} /> Call Izaak{" "}
                    <span className="hero-phone">{phone.display}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <div className="trust-bar">
        <ul className="container trust-items" aria-label="Credentials at a glance">
          <li>{profile.title}</li>
          <li>NPN {profile.npn}</li>
          <li>Independent verification</li>
          <li>Multiple carrier access</li>
        </ul>
      </div>

      {/* 3. ABOUT */}
      <section id="about" className="section about" aria-labelledby="about-title">
        <div className="container about-grid">
          <figure className="about-photo">
            {photo ? (
              <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                sizes="(min-width: 960px) 440px, 90vw"
              />
            ) : null}
            <figcaption>
              <strong>{profile.name}</strong>
              <span>
                {profile.title} · NPN {profile.npn}
              </span>
            </figcaption>
          </figure>
          <div className="about-copy">
            <p className="eyebrow eyebrow-dark">About Izaak</p>
            <h2 id="about-title">An independent agent in your corner</h2>
            <p className="lead">
              I&rsquo;m {profile.name}, an independent licensed life insurance agent. I help
              individuals and families understand their options and choose coverage that protects
              their income, final expenses, mortgage and loved ones.
            </p>
            <h3 className="list-title">What you can expect</h3>
            <ul className="expect-list">
              {expectations.map((e) => (
                <li key={e.title}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>{e.title}.</strong> {e.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="button-row">
              <Link className="btn btn-dark" href="#request">
                Request Coverage
              </Link>
              <Link className="btn btn-outline" href="#credentials">
                Verify Credentials
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COVERAGE */}
      <section
        id="coverage"
        className="section section-dark coverage"
        aria-labelledby="coverage-title"
      >
        <div className="container coverage-layout">
          <div className="coverage-head">
            <p className="eyebrow">Coverage</p>
            <h2 id="coverage-title">Coverage for every stage of life</h2>
            <p className="section-intro">
              Simple, clear options to protect your family — from term coverage while the kids are
              young to final expense planning. Open any option for a short, plain-language overview.
            </p>
            <Link className="btn btn-amber" href="#request">
              Request Coverage
            </Link>
            <p className="fine-print on-dark coverage-disclosure">
              Coverage features, riders, availability, eligibility, and underwriting vary by
              carrier, product, and state. This overview is general information, not personal
              advice.
            </p>
          </div>
          <ol className="coverage-list">
            {services.map((s, i) => (
              <li key={s.id} className={s.image ? "has-image" : undefined}>
                {s.image ? (
                  <span className="coverage-thumb">
                    <Image src={s.image} alt="" fill sizes="96px" />
                  </span>
                ) : null}
                <span className="coverage-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="coverage-text">
                  <h3 id={`cov-${s.id}`}>{s.title}</h3>
                  <p>{s.summary}</p>
                  <details className="coverage-more">
                    <summary>
                      <span className="more-closed">Learn more</span>
                      <span className="more-open">Show less</span>
                      <span className="sr-only"> about {s.title}</span>
                      <Icon name="chevron" size={16} />
                    </summary>
                    <div className="coverage-detail">
                      <dl>
                        <div>
                          <dt>What it is</dt>
                          <dd>{s.details.what}</dd>
                        </div>
                        <div>
                          <dt>Often used for</dt>
                          <dd>{s.details.oftenFor}</dd>
                        </div>
                        <div>
                          <dt>Why people consider it</dt>
                          <dd>{s.details.why}</dd>
                        </div>
                        <div>
                          <dt>Key points</dt>
                          <dd>
                            <ul>
                              {s.details.keyPoints.map((k) => (
                                <li key={k}>{k}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                      <CoverageCta interest={s.title}>{s.cta}</CoverageCta>
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Testimonials />

      {/* 5. CARRIER / PROVIDER NETWORK */}
      <section id="carriers" className="section carriers" aria-labelledby="carriers-title">
        <div className="container section-head center">
          <p className="eyebrow eyebrow-dark">Provider network</p>
          <h2 id="carriers-title">Access to multiple established carriers</h2>
          <p className="section-intro">
            As an independent agent, I compare options across insurance companies to help find
            coverage that fits your needs and budget.
          </p>
        </div>
        <CarrierMarquee carriers={carriers} />
        <p className="container carrier-disclosure">
          Carrier availability varies by state, product, eligibility, and underwriting. Carriers
          shown do not endorse this website.
        </p>
      </section>

      {/* 6–7. LICENSING & CREDENTIALS + CREDENTIAL CARD */}
      <section
        id="credentials"
        className="section section-dark credentials"
        aria-labelledby="credentials-title"
      >
        <div className="container">
          <div className="credentials-head">
            <p className="eyebrow">Verification</p>
            <h2 id="credentials-title" className="title-caps">
              Licensing &amp; Credentials
            </h2>
          </div>
          <div className="credentials-grid">
            <div className="credentials-copy">
              <p className="lead on-dark">
                Verify my current licensing credentials through the National Insurance Producer
                Registry.
              </p>
              <dl className="cred-list">
                <div>
                  <dt>Agent</dt>
                  <dd>{profile.name}</dd>
                </div>
                <div>
                  <dt>Title</dt>
                  <dd>{profile.title}</dd>
                </div>
                <div>
                  <dt>National Producer Number</dt>
                  <dd className="cred-npn">{profile.npn}</dd>
                </div>
                <div>
                  <dt>Service area</dt>
                  <dd>{profile.serviceArea}</dd>
                </div>
              </dl>
              <div className="button-row">
                <a
                  className="btn btn-amber btn-lg"
                  href={profile.niprLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="shield" size={18} /> Verify My Credentials
                  <span className="sr-only"> on NIPR (opens nipr.com in a new tab)</span>
                </a>
                <Link className="btn btn-outline-light btn-lg" href="/credentials">
                  Open credential card
                </Link>
              </div>
              <p className="fine-print on-dark">
                Insurance licenses are issued and regulated at the state level. Current credentials
                may be independently verified through NIPR or the appropriate state regulator.
                Independent verification link provided for convenience. I am not affiliated with or
                endorsed by NIPR, NAIC, or any state Department of Insurance.
              </p>
            </div>
            <div className="credentials-card">
              <CredentialCard />
            </div>
          </div>
        </div>
      </section>

      {/* 8. REQUEST COVERAGE */}
      <section id="request" className="section request" aria-labelledby="request-title">
        <div className="container request-grid">
          <div className="request-copy">
            <p className="eyebrow eyebrow-dark">Request coverage</p>
            <h2 id="request-title">Request your coverage review</h2>
            <p className="lead">
              Share a few details and I&rsquo;ll follow up personally. There&rsquo;s no cost and no
              obligation.
            </p>
            <ol className="steps">
              {nextSteps.map((s, i) => (
                <li key={s.title}>
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    <strong>{s.title}</strong>
                    <span>{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="form-card">
            <QuoteForm email={profile.email} phone={phone} />
          </div>
        </div>
      </section>

      {/* 9. SCHEDULE / CONTACT */}
      <section className="connect-band" aria-labelledby="connect-title">
        <div className="container connect-inner">
          <div>
            <p className="eyebrow">Talk with Izaak</p>
            <h2 id="connect-title">Prefer to pick a time or reach out directly?</h2>
          </div>
          <ul className="connect-actions">
            <li>
              <Link className="btn btn-amber btn-lg" href="/schedule">
                <Icon name="calendar" size={18} /> Schedule a Call
              </Link>
            </li>
            {phone ? (
              <li>
                <a className="btn btn-outline-light btn-lg" href={`tel:${phone.tel}`}>
                  <Icon name="phone" size={18} /> {phone.display}
                </a>
              </li>
            ) : null}
            <li>
              <a className="btn btn-outline-light btn-lg" href={mailto(profile.email)}>
                <Icon name="mail" size={18} /> Email Izaak
              </a>
            </li>
            <li>
              <Link className="connect-link" href="/contact">
                Send a message <Icon name="arrow" size={16} />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
