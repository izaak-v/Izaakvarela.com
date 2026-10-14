import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { site } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#14171a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              <span className="brand-name">{site.name}</span>
              <span className="brand-role">{site.role}</span>
            </Link>
            <nav aria-label="Primary">
              <ul className="nav-list">
                <li><Link href="/#services">Services</Link></li>
                <li><Link href="/#about">About</Link></li>
                <li><Link href="/#contact">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <div>
              <p className="footer-name">{site.name}</p>
              <p className="footer-role">{site.role}</p>
            </div>
            <nav aria-label="Legal">
              <ul className="footer-links">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Use</Link></li>
                <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              </ul>
            </nav>
            <p className="footer-copy">
              &copy; {year} {site.name}. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
