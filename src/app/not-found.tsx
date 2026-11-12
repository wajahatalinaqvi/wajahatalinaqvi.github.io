import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found container">
      <p className="eyebrow">404 / A small detour</p>
      <h1>This page isn’t here.</h1>
      <p>Let’s get you back to something worth exploring.</p>
      <Link className="button button-primary" href="/">
        Back to the portfolio ↗
      </Link>
    </main>
  );
}
