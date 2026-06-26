import Link from "next/link";

// Styled 404 with navigation back to Home (Req 2.6). Uses the basalt/paper
// theme tokens; no accent hues, no rounded corners.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Error 404
      </p>
      <h1 className="text-4xl tracking-wide sm:text-5xl">Page not found</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-fg">
        The page you requested does not exist or has not been published.
      </p>
      <p>
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-[0.2em] text-fg underline underline-offset-4 hover:text-muted"
        >
          Return to Home
        </Link>
      </p>
    </main>
  );
}
