import { profile } from "@/content/profile";
import { Icon } from "./Icon";

/** Primary credential verification: National Producer Number + official NIPR lookup. */
export function NiprVerify({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="nipr-card">
      <div className="nipr-npn">
        <span className="nipr-label">National Producer Number</span>
        <span className="nipr-value">{profile.npn}</span>
      </div>
      <div className="nipr-body">
        <Heading className="h3">Verify through NIPR</Heading>
        <p>
          Insurance licenses are issued and regulated at the state level. My licensing credentials
          can be independently verified through the National Insurance Producer Registry (NIPR)
          using my National Producer Number.
        </p>
        <a
          className="button button-gold button-lg"
          href={profile.niprLookupUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="shield" size={18} /> Verify My Credentials on NIPR
          <span className="sr-only"> (opens nipr.com in a new tab)</span>
        </a>
        <p className="fine-print">
          Independent verification link provided for convenience. I am not affiliated with or
          endorsed by NIPR, NAIC, or any state Department of Insurance.
        </p>
      </div>
    </div>
  );
}
