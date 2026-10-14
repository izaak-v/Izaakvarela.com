import type { Metadata } from "next";
import { site } from "../site";

export const metadata: Metadata = {
  title: `Terms of Use | ${site.name}`,
  description: `Terms of use for ${site.url.replace("https://", "")}.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <article className="section legal">
      <div className="container narrow">
        <h1>Terms of Use</h1>
        <p className="fine-print">Last updated: October 14, 2026</p>

        <p>
          These Terms of Use apply to {site.url.replace("https://", "")}, the personal
          website of {site.name}, {site.role}. By using this website, you agree to these
          terms.
        </p>

        <h2>Informational purposes only</h2>
        <p>
          Content on this website is general information about life insurance. It is not
          legal, tax, or financial advice, and it is not an offer to sell or a solicitation
          of any specific insurance product.
        </p>

        <h2>No guarantee of coverage</h2>
        <p>
          Insurance availability, pricing, eligibility, and benefits vary by individual,
          state, and insurance company. All coverage is subject to the terms, conditions, and
          underwriting of the issuing insurance company. Nothing on this website guarantees
          approval or any particular rate.
        </p>

        <h2>Licensing</h2>
        <p>
          {site.name} is a licensed life insurance agent. Licensing information can be
          verified through the appropriate state Department of Insurance. This website is not
          affiliated with or endorsed by any government agency.
        </p>

        <h2>Communications</h2>
        <p>
          Contacting me through this website or by email does not create a client
          relationship or bind any coverage. Please do not send sensitive information such as
          Social Security or bank account numbers by email.
        </p>

        <h2>Website content</h2>
        <p>
          The content of this website is provided &ldquo;as is&rdquo; without warranties of
          any kind. I am not liable for any loss arising from your use of this website, to the
          fullest extent permitted by law.
        </p>

        <h2>Changes</h2>
        <p>
          I may update these terms from time to time. The date above shows when they were
          last revised.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </article>
  );
}
