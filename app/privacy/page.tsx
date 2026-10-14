import type { Metadata } from "next";
import { site } from "../site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${site.name}`,
  description: `Privacy policy for ${site.url.replace("https://", "")}.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <article className="section legal">
      <div className="container narrow">
        <h1>Privacy Policy</h1>
        <p className="fine-print">Last updated: October 14, 2026</p>

        <p>
          This Privacy Policy explains how {site.name}, {site.role} (&ldquo;I,&rdquo;
          &ldquo;me&rdquo;), handles information in connection with this website,{" "}
          {site.url.replace("https://", "")}.
        </p>

        <h2>Information I collect</h2>
        <p>
          This website does not have accounts, sign-up forms, or online applications. I only
          receive personal information that you choose to send me, for example when you email
          me. That may include your name, email address, phone number, and any details you
          include in your message.
        </p>
        <p>
          Like most websites, the hosting provider may automatically record basic technical
          information such as IP address, browser type, and pages requested, for security and
          performance purposes. This site does not use advertising cookies or third-party
          tracking.
        </p>

        <h2>How I use information</h2>
        <ul>
          <li>To respond to your questions and requests.</li>
          <li>To discuss life insurance options you have asked about.</li>
          <li>To comply with legal and regulatory obligations.</li>
        </ul>

        <h2>Text messages</h2>
        <p>
          If you provide your phone number and agree to receive text messages from me, I will
          use it only to communicate with you about your inquiry or policy. Message frequency
          varies, and message and data rates may apply. You can reply STOP at any time to opt
          out, or HELP for help. Your mobile information and consent will not be sold or shared
          with third parties for their marketing purposes.
        </p>

        <h2>Sharing</h2>
        <p>
          I do not sell your personal information. With your permission, I may share
          information with insurance companies when you request a quote or apply for coverage.
          I may also disclose information when required by law.
        </p>

        <h2>Security and retention</h2>
        <p>
          I take reasonable steps to protect information I receive and keep it only as long
          as needed for the purposes described above or as required by law.
        </p>

        <h2>Your choices</h2>
        <p>
          You may ask me to access, correct, or delete personal information you have sent me,
          subject to any legal requirements, by emailing{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2>Changes</h2>
        <p>
          I may update this policy from time to time. The date above shows when it was last
          revised.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </article>
  );
}
