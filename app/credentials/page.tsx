import Link from "next/link";
import { profile } from "@/content/profile";
import { Portrait } from "@/components/Portrait";
import { LicenseList } from "@/components/LicenseList";
import { NiprVerify } from "@/components/NiprVerify";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";
import { personJsonLd } from "@/lib/structured-data";
import { mailto } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Credentials",
  description: `Verify ${profile.name}, ${profile.title}. National Producer Number ${profile.npn} — independently verifiable through NIPR.`,
  path: "/credentials",
  image: "/credentials/opengraph-image",
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
            <p className="eyebrow eyebrow-light">Credentials</p>
            <h1 id="cred-title">{profile.name}</h1>
            <p className="hero-role">{profile.title}</p>
            <p className="cred-statement">
              Independent licensed insurance agent · {profile.legalName}
            </p>
            <dl className="cred-facts">
              <div>
                <dt>National Producer Number (NPN)</dt>
                <dd className="cred-npn">{profile.npn}</dd>
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
                <dt>Email</dt>
                <dd>
                  <a href={mailto(profile.email)}>{profile.email}</a>
                </dd>
              </div>
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

      <section className="section" aria-labelledby="verify-title">
        <div className="container">
          <h2 id="verify-title" className="sr-only">
            Verify my credentials
          </h2>
          <NiprVerify />
          <LicenseList />

          <div className="verify-help">
            <h2 className="h3">How to verify</h2>
            <ol>
              <li>
                Select <strong>Verify My Credentials on NIPR</strong> to open the official NIPR
                lookup at nipr.com.
              </li>
              <li>
                Follow NIPR&rsquo;s on-screen steps to look up the producer, and confirm the
                National Producer Number matches <strong>{profile.npn}</strong> for{" "}
                <strong>{profile.name}</strong>.
              </li>
              <li>
                For license status and lines of authority in your state, you can also check your
                state Department of Insurance&rsquo;s license lookup using my name or NPN.
              </li>
            </ol>
            <p className="fine-print">
              I am an independent licensed insurance agent. I am not employed by, affiliated with,
              or endorsed by NIPR, any Department of Insurance, or any government agency. These
              links are provided so you can confirm my credentials on your own.
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
