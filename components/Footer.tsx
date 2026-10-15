import Link from "next/link";
import { profile } from "@/content/profile";
import { mailto } from "@/lib/format";
import { Icon } from "./Icon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-id">
            <p className="footer-name">{profile.name}</p>
            <p className="footer-role">{profile.title}</p>
            <p className="footer-meta">NPN {profile.npn}</p>
            <ul className="footer-contact">
              {profile.phone ? (
                <li>
                  <Icon name="phone" size={16} />
                  <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a>
                </li>
              ) : null}
              <li>
                <Icon name="mail" size={16} />
                <a href={mailto(profile.email)}>{profile.email}</a>
              </li>
            </ul>
          </div>
          <nav aria-label="Footer" className="footer-nav">
            <ul>
              <li>
                <Link href="/#services">Services</Link>
              </li>
              <li>
                <Link href="/credentials">Credentials</Link>
              </li>
              <li>
                <Link href="/schedule">Schedule</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
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

        <div className="footer-disclosure">
          <p>
            <strong>Disclosure.</strong> {profile.name} is a licensed life insurance agent and an
            independent sole proprietor. Insurance products, features, and availability vary by
            state and insurance company. Approval, coverage, and rates depend on underwriting and
            carrier requirements. Information on this website is general in nature and is not legal,
            tax, or financial advice. This website is not affiliated with or endorsed by any
            government agency. Credentials can be independently verified through NIPR or the
            appropriate state Department of Insurance — see{" "}
            <Link href="/credentials">Credentials</Link>.
          </p>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} {profile.legalName}. All rights reserved.
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
