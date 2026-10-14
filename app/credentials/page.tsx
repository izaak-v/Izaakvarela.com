import Link from "next/link";
import { profile } from "@/content/profile";
import { Portrait } from "@/components/Portrait";
import { LicenseList } from "@/components/LicenseList";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";
import { personJsonLd } from "@/lib/structured-data";
import { mailto } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Licensing & Credentials",
  description: `Verify the insurance license of ${profile.name}, ${profile.title} (NPN ${profile.npn}), with links to official state license lookups.`,
  path: "/credentials",
});

export default function CredentialsPage() {
  const site = profile.website.replace(/^https?:\/\//, "");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <section className="page-hero page-hero-credentials" aria-labelledby="cred-title">
        <div className="container cred-hero">
          <Portrait priority sizes="220px" className="portrait-sm" />
          <div>
            <p className="eyebrow eyebrow-light">Licensing &amp; Credentials</p>
            <h1 id="cred-title">{profile.name}</h1>
            <p className="hero-role">{profile.title}</p>
            <dl className="cred-facts">
              <div>
                <dt>National Producer Number (NPN)</dt>
                <dd>{profile.npn}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={mailto(profile.email)}>{profile.email}</a>
                </dd>
              </div>
              {profile.phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Website</dt>
                <dd>
                  <a href={profile.website}>{site}</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="licenses-title">
        <div className="container">
          <div className="section-head">
            <h2 id="licenses-title">State insurance licenses</h2>
            <p className="section-intro">
              {profile.name} is an independent licensed insurance agent. Insurance licensing is
              issued and regulated at the state level. You can independently verify my credentials
              using the links below.
            </p>
          </div>
          <LicenseList />

          <div className="verify-help">
            <h2 className="h3">How to verify</h2>
            <ol>
              <li>
                Select <strong>Verify License</strong> for the state you live in.
              </li>
              <li>
                On the state&rsquo;s official website, search for an individual licensee by name (
                <strong>{profile.name}</strong>), license number, or NPN{" "}
                <strong>{profile.npn}</strong>.
              </li>
              <li>Confirm the license status and lines of authority shown by the state.</li>
            </ol>
            <p className="fine-print">
              I am an independent agent. I am not employed by, affiliated with, or endorsed by any
              government agency or Department of Insurance. State lookup links are provided so you
              can confirm my license on your own.
            </p>
          </div>

          <div className="button-row center">
            <Link className="button" href="/schedule">
              <Icon name="calendar" size={18} /> Schedule a Consultation
            </Link>
            <Link className="button button-ghost" href="/contact">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
