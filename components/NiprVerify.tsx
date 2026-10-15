import { profile } from "@/content/profile";
import { Icon } from "./Icon";

/** Primary credential verification: National Producer Number + official NIPR lookup. */
export function NiprVerify({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="nipr-card">
      <div className="nipr-npn">
        <span className="nipr-label">National Producer Number (NPN)</span>
        <span className="nipr-value">{profile.npn}</span>
      </div>
      <div className="nipr-body">
        <Heading className="h3">Verify independently through NIPR</Heading>
        <p>
          Insurance licensing is issued and regulated at the state level. My credentials can be
          independently verified through the National Insurance Producer Registry (NIPR) using my
          National Producer Number.
        </p>
        <a
          className="button button-gold"
          href={profile.niprLookupUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="shield" size={18} /> Verify My Credentials on NIPR
          <span className="sr-only"> (opens nipr.com in a new tab)</span>
        </a>
        <p className="fine-print">
          NIPR is an independent, nonprofit registry of insurance producer information. I am not
          affiliated with or endorsed by NIPR or any Department of Insurance. You may also confirm a
          license directly with your state&rsquo;s Department of Insurance.
        </p>
      </div>
    </div>
  );
}
