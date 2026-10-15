"use client";

import Link from "next/link";
import { profile } from "@/content/profile";

/** Friendly error screen — visitors never see technical details. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container narrow-head center">
        <h1>Something went wrong</h1>
        <p>
          Sorry — this page didn&rsquo;t load correctly. Please try again, or reach me directly
          {profile.phone ? (
            <>
              {" "}
              at <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a> or
            </>
          ) : null}{" "}
          at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
        <div className="button-row center">
          <button type="button" className="button" onClick={reset}>
            Try again
          </button>
          <Link className="button button-ghost" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
