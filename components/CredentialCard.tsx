import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { mailto } from "@/lib/format";
import { Icon } from "./Icon";
import { QrCode } from "./QrCode";

/**
 * Agent credential card — the identity view a prospect can open (or screenshot) during a call:
 * photo, name, title, NPN, contact details, QR code to the site, and one-tap actions.
 */
export async function CredentialCard({
  headingLevel = "h3",
}: {
  headingLevel?: "h1" | "h2" | "h3";
}) {
  const H = headingLevel;
  const site = profile.website.replace(/^https?:\/\//, "");
  return (
    <article className="cred-card" aria-labelledby="cred-card-name">
      <div className="cred-card-top">
        <div className="cred-card-photo">
          {profile.photo ? (
            <Image
              src={profile.photo.src}
              width={profile.photo.width}
              height={profile.photo.height}
              alt={profile.photo.alt}
              sizes="120px"
            />
          ) : (
            <span aria-hidden="true">IV</span>
          )}
        </div>
        <div className="cred-card-id">
          <p className="cred-card-kicker">
            <Icon name="badge" size={16} /> Licensed agent
          </p>
          <H id="cred-card-name" className="cred-card-name">
            {profile.name}
          </H>
          <p className="cred-card-title">{profile.title}</p>
        </div>
      </div>

      <dl className="cred-card-facts">
        <div className="cred-card-npn">
          <dt>National Producer Number</dt>
          <dd>{profile.npn}</dd>
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

      <div className="cred-card-qr">
        <QrCode value={profile.website} label={`QR code linking to ${site}`} />
        <p>
          Scan to open <strong>{site}</strong>
        </p>
      </div>

      <div className="cred-card-actions">
        <a
          className="btn btn-amber btn-block"
          href={profile.niprLookupUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="shield" size={18} /> Verify Credentials
          <span className="sr-only"> on NIPR (opens nipr.com in a new tab)</span>
        </a>
        <div className="cred-card-grid">
          {profile.phone ? (
            <a className="btn btn-dark" href={`tel:${profile.phone.tel}`}>
              <Icon name="phone" size={18} /> Call
            </a>
          ) : null}
          <a className="btn btn-dark" href={mailto(profile.email)}>
            <Icon name="mail" size={18} /> Email
          </a>
          <Link className="btn btn-dark" href="/schedule">
            <Icon name="calendar" size={18} /> Schedule
          </Link>
          <a className="btn btn-dark" href="/izaak-varela.vcf" download>
            <Icon name="download" size={18} /> Save contact
          </a>
        </div>
      </div>
      <p className="cred-card-note">
        Independent licensed agent. Not affiliated with or endorsed by NIPR, NAIC, or any state
        Department of Insurance.
      </p>
    </article>
  );
}
