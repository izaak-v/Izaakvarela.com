import Link from "next/link";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";
import { mailto } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${profile.name} handles information submitted through izaakvarela.com.`,
  path: "/privacy",
});

const UPDATED = "October 15, 2026";

export default function Privacy() {
  const site = profile.website.replace(/^https?:\/\//, "");
  const email = <a href={mailto(profile.email)}>{profile.email}</a>;
  return (
    <article className="section legal">
      <div className="container prose">
        <h1>Privacy Policy</h1>
        <p className="fine-print">Last updated: {UPDATED}</p>

        <p>
          This Privacy Policy explains how {profile.legalName} (&ldquo;I,&rdquo; &ldquo;me&rdquo;),
          a licensed life insurance agent, collects and uses information through this website,{" "}
          {site}. It applies only to this website.
        </p>

        <h2>Information you choose to give me</h2>
        <ul>
          <li>
            <strong>Contact form.</strong> If you use the contact form, I receive the information
            you enter: first and last name, email address, and, if you choose, phone number, state,
            the topic you&rsquo;re interested in, and your message. The submission is delivered to
            my email inbox through Resend, an email delivery service. (If online delivery is
            unavailable, the form instead opens your own email app so you can send it yourself.)
            This website does not store form submissions in a database.
          </li>
          <li>
            <strong>Phone and email.</strong> If you call or email me, I receive your phone number
            or email address and whatever you choose to share in the conversation or message.
          </li>
          <li>
            <strong>Scheduling.</strong> Online appointments are booked through Google Calendar
            appointment scheduling, on a booking page hosted by Google. When you book, Google
            collects the details you enter (such as your name, email address, and any notes) and
            shares them with me so I can hold the appointment. Google&rsquo;s handling of that
            information is governed by Google&rsquo;s own privacy policy.
          </li>
        </ul>
        <p>
          The website does not ask for, and you should not send, Social Security numbers, bank or
          payment information, or medical information.
        </p>

        <h2>Information collected automatically</h2>
        <p>
          This website is hosted by Vercel. Like most web hosts, Vercel automatically processes
          basic technical information such as IP address, browser type, and the pages requested, in
          order to deliver the site and protect it from abuse. This website does not use cookies,
          analytics, advertising trackers, or social media pixels.
        </p>

        <h2>Links to other websites</h2>
        <p>
          This website links to other sites, such as the National Insurance Producer Registry (NIPR)
          for license verification and Google for appointment booking. Those sites are operated
          independently and are governed by their own privacy policies.
        </p>

        <h2>How I use information</h2>
        <ul>
          <li>To respond to your inquiry and communicate with you about it.</li>
          <li>To schedule and hold consultations you request.</li>
          <li>To discuss insurance options you have asked about.</li>
          <li>
            To meet legal, regulatory, and recordkeeping obligations that apply to licensed
            insurance agents.
          </li>
        </ul>

        {profile.smsEnabled ? (
          <>
            <h2>Text messages</h2>
            <p>
              If you give me your mobile number and agree to receive text messages, I will use it
              only to communicate with you about your inquiry, appointments, or policy. Message
              frequency varies. Message and data rates may apply. Reply STOP to opt out at any time
              or HELP for help. Mobile phone numbers and text messaging consent are not sold or
              shared with third parties for their marketing purposes.
            </p>
          </>
        ) : null}

        <h2>How information is shared</h2>
        <p>I do not sell your personal information. I share it only:</p>
        <ul>
          <li>
            With insurance companies, if you ask me to request a quote or help you apply for
            coverage.
          </li>
          <li>
            With service providers that help me operate this website and communicate with you
            (website hosting by Vercel, email delivery by Resend, and appointment scheduling by
            Google), only as needed for those services.
          </li>
          <li>When required by law or to protect rights and safety.</li>
        </ul>

        <h2>Retention and security</h2>
        <p>
          I keep information only as long as needed for the purposes above or as required by law,
          and I take reasonable steps to protect it. No method of transmitting information over the
          internet is completely secure.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask me to access, correct, or delete information you have provided, subject to
          legal and regulatory requirements, by emailing {email}. Depending on where you live, you
          may have additional rights under state law.
        </p>

        <h2>Children</h2>
        <p>This website is intended for adults and is not directed to children under 18.</p>

        <h2>Changes</h2>
        <p>
          I may update this policy from time to time. The date at the top shows when it was last
          revised.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy: {email}. See also the <Link href="/terms">Terms of Use</Link>
          .
        </p>
      </div>
    </article>
  );
}
