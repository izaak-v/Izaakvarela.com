import Link from "next/link";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/ContactForm";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";
import { mailto } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Call, email, or message ${profile.name}, ${profile.title}, about life insurance, final expense, mortgage protection, family protection, or living benefits.`,
  path: "/contact",
});

export default function ContactPage() {
  const { phone, email } = profile;
  return (
    <>
      <section className="page-hero" aria-labelledby="contact-title">
        <div className="container narrow-head">
          <p className="eyebrow eyebrow-light">Contact</p>
          <h1 id="contact-title">Let&rsquo;s talk</h1>
          <p className="hero-lede">
            Call, email, send a message, or book a time — whichever is easiest for you.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Contact options">
        <div className="container contact-grid">
          <aside className="contact-card">
            <h2 className="h3">{profile.name}</h2>
            <p className="muted">{profile.title}</p>
            <dl className="contact-details">
              {phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${phone.tel}`}>{phone.display}</a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={mailto(email)}>{email}</a>
                </dd>
              </div>
            </dl>
            <div className="contact-actions">
              {phone ? (
                <a className="btn btn-dark" href={`tel:${phone.tel}`}>
                  <Icon name="phone" size={18} /> Call Izaak
                </a>
              ) : null}
              <a className="btn btn-outline" href={mailto(email)}>
                <Icon name="mail" size={18} /> Email Izaak
              </a>
              <Link className="btn btn-amber" href="/schedule">
                <Icon name="calendar" size={18} /> Schedule Consultation
              </Link>
            </div>
            <p className="fine-print">
              <Link href="/credentials">Verify my credentials</Link> on NIPR before we talk.
            </p>
          </aside>
          <div className="form-card">
            <h2 className="h3">Send a message</h2>
            <ContactForm email={email} name={profile.name} phone={phone} />
          </div>
        </div>
      </section>

      <section className="section section-mist" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div>
            <p className="eyebrow eyebrow-dark">FAQ</p>
            <h2 id="faq-title">Common questions</h2>
            <p className="section-intro">
              General, educational answers. Your specific options depend on your situation and each
              insurance company&rsquo;s underwriting.
            </p>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}
