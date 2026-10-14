import { licenses } from "@/content/licenses";
import { formatDate } from "@/lib/format";
import { DevPlaceholder } from "./DevPlaceholder";
import { Icon } from "./Icon";

export function LicenseList() {
  if (licenses.length === 0) {
    return (
      <DevPlaceholder title="no licenses configured">
        Add your licenses in <code>content/licenses.ts</code>.
      </DevPlaceholder>
    );
  }

  return (
    <ul className="license-list">
      {licenses.map((l) => (
        <li key={`${l.stateCode}-${l.licenseNumber}`} className="license-card">
          <div className="license-head">
            <div>
              <h3>{l.state}</h3>
              <p className="license-type">
                {[l.residency, l.licenseType].filter(Boolean).join(" ")}
              </p>
            </div>
            <span className={`status status-${l.status}`}>
              {l.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <dl className="license-meta">
            <div>
              <dt>License number</dt>
              <dd>{l.licenseNumber}</dd>
            </div>
            {l.linesOfAuthority?.length ? (
              <div>
                <dt>Line of authority</dt>
                <dd>{l.linesOfAuthority.join(", ")}</dd>
              </div>
            ) : null}
            {l.effectiveDate ? (
              <div>
                <dt>Effective</dt>
                <dd>{formatDate(l.effectiveDate)}</dd>
              </div>
            ) : null}
            {l.expirationDate ? (
              <div>
                <dt>Expires</dt>
                <dd>{formatDate(l.expirationDate)}</dd>
              </div>
            ) : null}
          </dl>
          {l.verificationUrl ? (
            <div className="license-verify">
              <a
                className="button button-small"
                href={l.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Verify License
                <Icon name="external" size={16} />
                <span className="sr-only">
                  {" "}
                  for {l.state} (opens the state website in a new tab)
                </span>
              </a>
              {l.verificationNote ? <p className="fine-print">{l.verificationNote}</p> : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
