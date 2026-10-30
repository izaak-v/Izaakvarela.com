import Link from "next/link";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";
import { mailto } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: `Terms of use for izaakvarela.com, the website of ${profile.name}, ${profile.title}.`,
  path: "/terms",
});

const UPDATED = "October 30, 2026";

export default function Terms() {
  const site = profile.website.replace(/^https?:\/\//, "");
  const email = <a href={mailto(profile.email)}>{profile.email}</a>;
  return (
    <article className="section legal">
      <div className="container prose">
        <h1>Terms of Use</h1>
        <p className="fine-print">Last updated: {UPDATED}</p>

        <p>
          {site} is the website of {profile.legalName}, a licensed life insurance agent. By using
          this website, you agree to these Terms of Use.
        </p>

        <h2>General information only</h2>
        <p>
          Content on this website is general, educational information about life insurance. It is
          not legal, tax, or financial advice, and it is not an offer to sell, or a solicitation of,
          any specific insurance product.
        </p>

        <h2>No guarantee of coverage or rates</h2>
        <p>
          Insurance products, features, and availability vary by state and insurance company.
          Approval, coverage, and premiums depend on underwriting and carrier requirements. Nothing
          on this website guarantees eligibility, approval, a particular rate, or any savings. The
          terms of any policy are set by the issuing insurance company.
        </p>

        <h2>Licensing</h2>
        <p>
          {profile.name} is a licensed life insurance agent. Licensing credentials can be
          independently verified through the National Insurance Producer Registry (NIPR) using
          National Producer Number {profile.npn}, or through the appropriate state Department of
          Insurance; see the <Link href="/credentials">Credentials</Link> page. This website is not
          affiliated with or endorsed by NIPR, NAIC, or any government agency.
        </p>

        <h2>Contacting me</h2>
        <p>
          Calling, requesting coverage, submitting the contact form, sending an email, or booking a
          consultation does not create an obligation for either of us, does not constitute an
          application for insurance, and does not bind coverage. Please do not send Social Security
          numbers, bank or payment information, or medical information through this website or by
          email.
        </p>

        <h2 id="sms">SMS Messaging Terms</h2>
        <p>
          By voluntarily opting in, you agree to receive recurring text messages from {profile.name}{" "}
          regarding life insurance inquiries, requested coverage options, appointment scheduling and
          reminders, follow-up, and related client service.
        </p>
        <p>
          Message frequency varies. Message and data rates may apply. Consent to receive SMS
          messages is not a condition of purchasing any product or service.
        </p>
        <p>
          You may reply STOP at any time to unsubscribe from SMS communications. After opting out,
          you will receive no further marketing or informational SMS messages unless you
          subsequently provide consent again. Reply HELP for assistance or contact {profile.name}{" "}
          through the contact information provided on this website.
        </p>
        <p>
          Wireless carriers are not liable for delayed or undelivered messages. Your use of SMS
          communications is also subject to the <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Third-party services and links</h2>
        <p>
          This website links to third-party services, such as Google Calendar for scheduling and
          NIPR or state websites for license lookups. Those services are governed by their own terms
          and privacy policies, and I am not responsible for their content.
        </p>

        <h2>Website content</h2>
        <p>
          The website and its content are provided &ldquo;as is&rdquo; without warranties of any
          kind. To the fullest extent permitted by law, I am not liable for any loss arising from
          your use of, or reliance on, this website. Content may not be copied or reused without
          permission.
        </p>

        <h2>Changes</h2>
        <p>
          I may update these terms from time to time. The date at the top shows when they were last
          revised.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: {email}. See also the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </article>
  );
}
