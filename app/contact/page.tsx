import Link from "next/link";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";
import { mailto } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${profile.name}, ${profile.title}, with questions about life insurance, final expense, mortgage protection, or living benefits.`,
  path: "/contact",
});

export default function ContactPage() {
  const serverEnabled = Boolean(process.env.RESEND_API_KEY);
  return (
    <>
      <section className="page-hero" aria-labelledby="contact-title">
        <div className="container narrow-head">
          <p className="eyebrow eyebrow-light">Contact</p>
          <h1 id="contact-title">Let&rsquo;s talk</h1>
          <p className="hero-lede">
            Have a question about coverage, or want to set up a time to review your options? Send a
            message and I&rsquo;ll get back to you.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Contact options">
        <div className="container contact-grid">
          <aside className="contact-card">
            <h2 className="h3">{profile.name}</h2>
            <p className="muted">{profile.title}</p>
            <ul className="contact-lines">
              <li>
                <Icon name="mail" size={20} />
                <a href={mailto(profile.email)}>{profile.email}</a>
              </li>
              {profile.phone ? (
                <li>
                  <Icon name="phone" size={20} />
                  <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a>
                </li>
              ) : null}
              <li>
                <Icon name="calendar" size={20} />
                <Link href="/schedule">Schedule a consultation</Link>
              </li>
              <li>
                <Icon name="shield" size={20} />
                <Link href="/credentials">Verify my license</Link>
              </li>
            </ul>
          </aside>
          <div className="form-card">
            <h2 className="h3">Send a message</h2>
            <ContactForm email={profile.email} name={profile.name} serverEnabled={serverEnabled} />
          </div>
        </div>
      </section>
    </>
  );
}
