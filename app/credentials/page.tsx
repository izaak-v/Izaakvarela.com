import Link from "next/link";
import { profile } from "@/content/profile";
import { CredentialCard } from "@/components/CredentialCard";
import { LicenseList } from "@/components/LicenseList";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";
import { personJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Verify My Credentials",
  description: `${profile.name}, ${profile.title}. Verify my licensing credentials independently through NIPR using National Producer Number ${profile.npn}.`,
  path: "/credentials",
  image: "/credentials/opengraph-image",
});

export default function CredentialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <section className="section section-dark cred-page" aria-labelledby="cred-card-name">
        <div className="container cred-page-grid">
          <div className="cred-page-card">
            <CredentialCard headingLevel="h1" />
          </div>
          <div className="cred-page-copy">
            <p className="eyebrow">Licensing &amp; credentials</p>
            <h2 className="h2-sm">How to verify my license</h2>
            <p className="on-dark">
              Insurance licenses are issued and regulated at the state level. Current licensing
              credentials can be independently verified through the National Insurance Producer
              Registry (NIPR) using my National Producer Number.
            </p>
            <div className="npn-callout">
              <span>National Producer Number</span>
              <strong className="nipr-value">{profile.npn}</strong>
            </div>
            <a
              className="btn btn-amber btn-lg btn-block"
              href={profile.niprLookupUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="shield" size={18} /> Verify My Credentials on NIPR
              <span className="sr-only"> (opens nipr.com in a new tab)</span>
            </a>
            <p className="fine-print on-dark">
              {profile.serviceArea}. Independent verification link provided for convenience. I am
              not affiliated with or endorsed by NIPR, NAIC, or any state Department of Insurance.
            </p>
            <LicenseList />
            <p className="cred-page-back">
              <Link href="/">
                <Icon name="arrow" size={16} /> Back to izaakvarela.com
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
