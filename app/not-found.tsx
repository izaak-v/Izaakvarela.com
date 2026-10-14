import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow-head center">
        <h1>Page not found</h1>
        <p>The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <Link className="button" href="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
