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
  title: "Verify My Credentials",
  description: `${profile.name}, ${profile.title}. Verify my licensing credentials independently through NIPR using National Producer Number ${profile.npn}.`,
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
            <p className="cred-statement">Independent licensed insurance agent · Sole Proprietor</p>
            <dl className="cred-facts">
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

      <section className="section section-tight" aria-labelledby="verify-title">
        <div className="container cred-body">
          <h2 id="verify-title" className="sr-only">
            Verify my credentials
          </h2>
          <NiprVerify />
          <LicenseList />
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
