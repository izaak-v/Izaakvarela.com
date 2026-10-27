import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { carriers } from "@/content/carriers";
import { CredentialCard } from "@/components/CredentialCard";
import { DevPlaceholder } from "@/components/DevPlaceholder";
import { Icon } from "@/components/Icon";
import { Portrait } from "@/components/Portrait";
import { QuoteForm } from "@/components/QuoteForm";
import { Testimonials } from "@/components/Testimonials";
import { mailto } from "@/lib/format";
import { personJsonLd } from "@/lib/structured-data";

const approach = [
  {
    icon: "badge",
    title: "Licensed & verifiable",
    text: "Check my National Producer Number yourself through NIPR.",
  },
  {
    icon: "pillar",
    title: "Independent",
    text: "I work with multiple insurance carriers, not just one company.",
  },
  {
    icon: "users",
    title: "Clear explanations",
    text: "Plain-language options so you can compare with confidence.",
  },
  {
    icon: "heart",
    title: "No pressure",
    text: "Consultations are free, and the decision is always yours.",
  },
] as const;

const networkPoints = [
  {
    icon: "pillar",
    title: "More than one company",
    text: "Options from several carriers instead of a single company's products.",
  },
  {
    icon: "globe",
    title: "Matched to where you live",
    text: "Carriers and products are compared based on what's offered in your state.",
  },
  {
    icon: "check",
    title: "Help through the process",
    text: "I walk you through the application and underwriting steps with each carrier.",
  },
] as const;

const nextSteps = [
  { title: "Tell me what you need", text: "Share a few details — it takes about a minute." },
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
  const { phone } = profile;
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
            <p className="eyebrow">Independent licensed agent</p>
            <h1 id="hero-title">{profile.name}</h1>
            <p className="hero-role">{profile.title}</p>
            <p className="hero-lede">
              Helping individuals and families find life insurance that protects the people and
              plans they care about — explained clearly, with no pressure.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-amber btn-lg" href="#request">
                Request Coverage <Icon name="arrow" size={18} />
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
          <div className="hero-visual reveal reveal-delay">
            <Portrait priority sizes="(min-width: 960px) 440px, 78vw" />
            <Link className="hero-chip" href="#credentials">
              <Icon name="badge" size={20} />
              <span>
                <strong>Licensed agent</strong>
                <small>NPN {profile.npn} · Verify</small>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <ul className="container trust-items">
          <li>
            <Icon name="badge" size={20} /> {profile.title}
          </li>
          <li>
            <Icon name="shield" size={20} /> NPN {profile.npn}
          </li>
          <li>
            <Icon name="pillar" size={20} /> Multiple carrier options
          </li>
          <li>
            <Icon name="globe" size={20} /> {profile.serviceArea}
          </li>
        </ul>
      </div>

      {/* ABOUT */}
      <section id="about" className="section" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-photo">
            <Portrait sizes="(min-width: 960px) 380px, 72vw" className="portrait-light" />
          </div>
          <div className="about-copy">
            <p className="eyebrow eyebrow-dark">About Izaak</p>
            <h2 id="about-title">Your independent guide to life insurance</h2>
            <p className="lead">
              I&rsquo;m {profile.name}, an independent licensed life insurance agent. I help
              individuals and families understand their coverage options and find protection that
              fits their goals and budget.
            </p>
            <p>
              Because I work with multiple insurance carriers, I can compare options instead of
              selling a single company&rsquo;s products. I listen first, explain everything in plain
              language, and give you room to decide.
            </p>
            <ul className="pillars">
              {approach.map((a) => (
                <li key={a.title}>
                  <span className="pillar-icon" aria-hidden="true">
                    <Icon name={a.icon} size={20} />
                  </span>
                  <span>
                    <strong>{a.title}</strong>
                    <span>{a.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section id="coverage" className="section section-dark" aria-labelledby="coverage-title">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Coverage</p>
            <h2 id="coverage-title">Protection for every stage of life</h2>
            <p className="section-intro">
              From term coverage while the kids are young to final expense planning, here&rsquo;s
              where I can help.
            </p>
          </div>
          <ul className="coverage-grid">
            {services.map((s) => (
              <li key={s.id} className={`coverage-card${s.image ? " has-image" : ""}`}>
                {s.image ? (
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                  />
                ) : null}
                <span className="coverage-icon" aria-hidden="true">
                  <Icon name={s.icon} size={26} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
              </li>
            ))}
            <li className="coverage-card coverage-cta">
              <h3>Not sure what you need?</h3>
              <p>Tell me a little about your situation and I&rsquo;ll walk you through it.</p>
              <Link className="btn btn-amber" href="#request">
                Request Coverage
              </Link>
            </li>
          </ul>
          <p className="fine-print center on-dark">
            Availability, pricing and eligibility vary by state, carrier and underwriting.
          </p>
        </div>
      </section>

      <Testimonials />

      {/* PROVIDER NETWORK */}
      <section id="carriers" className="section section-mist" aria-labelledby="carriers-title">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow eyebrow-dark">Provider network</p>
            <h2 id="carriers-title">Access to multiple insurance carriers</h2>
            <p className="section-intro">
              As an independent agent, I can compare options from several insurance companies to
              help find coverage that fits your needs and budget.
            </p>
          </div>
          {carriers.length ? (
            <ul className="carrier-grid" aria-label="Insurance carriers">
              {carriers.map((c) => (
                <li key={c.name} className="carrier-tile">
                  {c.logo && c.logoWidth && c.logoHeight ? (
                    <Image
                      src={c.logo}
                      alt={c.name}
                      width={c.logoWidth}
                      height={c.logoHeight}
                      sizes="160px"
                    />
                  ) : (
                    <span>{c.name}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <DevPlaceholder title="no carriers listed">
              Add the carriers you&rsquo;re appointed with to <code>content/carriers.ts</code>. The
              section stays name-free on the live site until then.
            </DevPlaceholder>
          )}
          <ul className="network-points">
            {networkPoints.map((n) => (
              <li key={n.title}>
                <span className="pillar-icon" aria-hidden="true">
                  <Icon name={n.icon} size={20} />
                </span>
                <strong>{n.title}</strong>
                <span>{n.text}</span>
              </li>
            ))}
          </ul>
          <p className="carrier-note">
            <Icon name="shield" size={18} />
            Carrier availability varies by state, product, eligibility and underwriting. Carriers
            listed do not endorse this website.
          </p>
        </div>
      </section>

      {/* LICENSING & CREDENTIALS */}
      <section
        id="credentials"
        className="section section-dark credentials"
        aria-labelledby="credentials-title"
      >
        <div className="container credentials-grid">
          <div className="credentials-copy">
            <p className="eyebrow">Licensing &amp; credentials</p>
            <h2 id="credentials-title">Verify me before we talk</h2>
            <p className="lead on-dark">
              Insurance licenses are issued and regulated at the state level. Current licensing
              credentials can be independently verified through the National Insurance Producer
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
              Independent verification link provided for convenience. I am not affiliated with or
              endorsed by NIPR, NAIC, or any state Department of Insurance.
            </p>
          </div>
          <div className="credentials-card">
            <CredentialCard />
          </div>
        </div>
      </section>

      {/* REQUEST COVERAGE */}
      <section id="request" className="section" aria-labelledby="request-title">
        <div className="container request-grid">
          <div className="request-copy">
            <p className="eyebrow eyebrow-dark">Request coverage</p>
            <h2 id="request-title">Let&rsquo;s find the right protection</h2>
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

      {/* SCHEDULE / CONTACT */}
      <section className="section section-mist" aria-labelledby="connect-title">
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow eyebrow-dark">Talk with Izaak</p>
            <h2 id="connect-title">Prefer to pick a time or reach out directly?</h2>
          </div>
          <div className="connect-grid">
            <div className="connect-card connect-schedule">
              <span className="pillar-icon" aria-hidden="true">
                <Icon name="calendar" size={22} />
              </span>
              <h3>Schedule a call</h3>
              <p>Choose an open time on my calendar. You&rsquo;ll get a confirmation by email.</p>
              <Link className="btn btn-amber" href="/schedule">
                Schedule a Call
              </Link>
            </div>
            <div className="connect-card">
              <span className="pillar-icon" aria-hidden="true">
                <Icon name="phone" size={22} />
              </span>
              <h3>Call or email</h3>
              <ul className="connect-lines">
                {phone ? (
                  <li>
                    <a href={`tel:${phone.tel}`}>{phone.display}</a>
                  </li>
                ) : null}
                <li>
                  <a href={mailto(profile.email)}>{profile.email}</a>
                </li>
              </ul>
              <Link className="btn btn-outline" href="/contact">
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
