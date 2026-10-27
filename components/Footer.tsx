import Link from "next/link";
import { profile } from "@/content/profile";
import { mailto } from "@/lib/format";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-row">
          <div className="footer-id">
            <p className="footer-name">{profile.name}</p>
            <p className="footer-role">
              {profile.title} · NPN {profile.npn}
            </p>
          </div>
          <ul className="footer-contact">
            {profile.phone ? (
              <li>
                <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a>
              </li>
            ) : null}
            <li>
              <a href={mailto(profile.email)}>{profile.email}</a>
            </li>
          </ul>
          <nav aria-label="Footer">
            <ul className="footer-links">
              <li>
                <Link href="/credentials">Credentials</Link>
              </li>
              <li>
                <Link href="/schedule">Schedule</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              {profile.socialLinks.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer me">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="footer-disclosure">
          {profile.name} is an independent licensed life insurance agent ({profile.legalName}).
          Insurance products, features and availability vary by state, carrier, eligibility and
          underwriting; approval and rates are not guaranteed. Carrier availability varies by state
          and product, and no carrier endorses this website. Information here is general and not
          legal, tax or financial advice. Not affiliated with any government agency. Credentials may
          be verified through{" "}
          <Link href="/credentials">NIPR or the appropriate state regulator</Link>.
        </p>
        <div className="footer-legal">
          <p>
            &copy; {year} {profile.legalName}
          </p>
          <ul>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Use</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
