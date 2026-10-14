import { site } from "./site";

const services = [
  {
    title: "Life Insurance",
    text: "Review term and permanent life insurance options to help provide for the people who depend on you.",
  },
  {
    title: "Final Expense Coverage",
    text: "Explore coverage intended to help with funeral costs and other end-of-life expenses.",
  },
  {
    title: "Mortgage Protection",
    text: "Look at life insurance options that can help your family keep up with the home if your income is lost.",
  },
  {
    title: "Family Protection",
    text: "Talk through income replacement, debts, and future costs such as education to find coverage that fits.",
  },
  {
    title: "Living Benefit Options",
    text: "Learn about policies that may offer access to part of the benefit for certain qualifying illnesses while living.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <h1 id="hero-title">{site.name}</h1>
          <p className="hero-role">{site.role}</p>
          <p className="hero-lede">
            I help individuals and families understand life insurance options designed to
            protect their loved ones, income, final expenses, and other financial
            responsibilities.
          </p>
          <div className="hero-actions">
            <a className="button" href={`mailto:${site.email}`}>
              Email Izaak
            </a>
            <a className="button button-secondary" href="#services">
              View services
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <h2 id="services-title">Services</h2>
          <p className="section-intro">
            Areas I can help you review. Coverage availability, pricing, and eligibility vary
            by individual, state, and insurance company, and are subject to underwriting.
          </p>
          <ul className="service-grid">
            {services.map((s) => (
              <li key={s.title} className="service-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="section section-alt" aria-labelledby="about-title">
        <div className="container narrow">
          <h2 id="about-title">About</h2>
          <p>
            I&rsquo;m Izaak Varela, a licensed life insurance agent. I work with individuals
            and families to review their life insurance needs and walk through the options
            available to them.
          </p>
          <p>
            My approach is simple: listen first, explain things in plain language, and help
            you make an informed decision about coverage that fits your situation and budget.
            There is no obligation to purchase anything.
          </p>
        </div>
      </section>

      <section id="contact" className="section" aria-labelledby="contact-title">
        <div className="container narrow">
          <h2 id="contact-title">Contact</h2>
          <p>Have a question or want to review your options? Reach out by email.</p>
          <p className="contact-email">
            <span className="label">Email</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <a className="button" href={`mailto:${site.email}?subject=Life%20insurance%20inquiry`}>
            Send an email
          </a>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="licensing-title">
        <div className="container narrow">
          <h2 id="licensing-title">Licensing</h2>
          <p>
            Izaak Varela is a licensed life insurance agent. Licensing information can be
            verified through the appropriate state Department of Insurance.
          </p>
          <p className="fine-print">
            This website is for general informational purposes only and is not affiliated
            with any government agency. It does not constitute an offer of insurance. Coverage
            is subject to the terms, conditions, and underwriting of the issuing insurance
            company.
          </p>
        </div>
      </section>
    </>
  );
}
