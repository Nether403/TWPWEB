import type { Metadata } from "next";
import Link from "next/link";

/**
 * /privacy — Privacy notice (fixes the dead footer "Privacy" link, which
 * appeared on every page and 404'd).
 *
 * Two honest parts, reflecting the Portal ↔ Platform boundary:
 *   1. THIS site (the Portal) is front-of-house and collects almost nothing —
 *      only the two Portal-owned forms and a locally-stored theme preference.
 *   2. The Protocol's substantive data architecture (de-identification,
 *      separation of identity from testimony, tamper-evidence, cascading
 *      revocation) governs testimony held on the live Platform, not here.
 *
 * This is a plain-language notice, not a substitute for the formal policy —
 * the copy says so and points legal enquiries to /contact.
 */

export const metadata: Metadata = {
  title: "Privacy — The Witness Protocol",
  description:
    "How the Witness Protocol Portal handles data (almost none), and how the wider Protocol protects witness testimony: separation of identity from testimony, de-identification, tamper-evidence, and cascading consent revocation.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Privacy
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Your story, secured
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Absolute honesty is only possible in a space where identity is
          protected. Privacy here is an architectural constraint, not just a
          legal promise. This notice explains what this website collects and how
          the wider Protocol protects testimony.
        </p>
      </header>

      {/* Part 1 — this website (the Portal). */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl tracking-wide sm:text-3xl">This website</h2>
        <p className="text-base leading-relaxed text-fg">
          This site is an information portal. It hosts no testimony intake, no
          consent records, and no account system — those live on the separate
          live Platform. It collects only:
        </p>
        <ul className="flex flex-col gap-3 border border-border bg-border">
          <li className="flex flex-col gap-1 bg-bg px-6 py-5">
            <span className="font-heading text-lg tracking-wide text-fg">
              What you send us in a form
            </span>
            <span className="text-base leading-relaxed text-muted">
              If you use the contact or funding forms, we receive what you type
              (for example a name, email, and message) solely to reply and to
              keep a record of the enquiry. It is stored in an insert-only table
              and is never added to the witness, consent, or research data.
            </span>
          </li>
          <li className="flex flex-col gap-1 bg-bg px-6 py-5">
            <span className="font-heading text-lg tracking-wide text-fg">
              Your theme preference
            </span>
            <span className="text-base leading-relaxed text-muted">
              Your choice of light or dark theme is stored locally in your own
              browser. It never leaves your device and is not sent to us.
            </span>
          </li>
        </ul>
        <p className="text-base leading-relaxed text-muted">
          We do not sell data, and we do not use it for AI training. To ask
          about or withdraw a form enquiry, use the{" "}
          <Link
            href="/contact"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            contact page
          </Link>
          .
        </p>
      </section>

      {/* Part 2 — the wider Protocol's data architecture (on the Platform). */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl tracking-wide sm:text-3xl">
          How the Protocol protects testimony
        </h2>
        <p className="text-base leading-relaxed text-fg">
          Testimony submitted through the Protocol is governed by a stricter
          architecture, designed to separate the &ldquo;who&rdquo; from the
          &ldquo;what&rdquo;:
        </p>
        <ul className="flex flex-col gap-3 border border-border bg-border">
          <li className="flex flex-col gap-1 bg-bg px-6 py-5">
            <span className="font-heading text-lg tracking-wide text-fg">
              Identity kept apart from testimony
            </span>
            <span className="text-base leading-relaxed text-muted">
              Legal names and contact details live in a restricted identity
              vault; the research corpus holds only de-identified moral
              reasoning. The two never mix.
            </span>
          </li>
          <li className="flex flex-col gap-1 bg-bg px-6 py-5">
            <span className="font-heading text-lg tracking-wide text-fg">
              Two-pass de-identification
            </span>
            <span className="text-base leading-relaxed text-muted">
              A local pass strips hard identifiers (emails, numbers, dates)
              before any external model sees the text; a second pass replaces
              names, institutions, and places with typed placeholders — keeping
              the reasoning intact while removing the trail back to you.
            </span>
          </li>
          <li className="flex flex-col gap-1 bg-bg px-6 py-5">
            <span className="font-heading text-lg tracking-wide text-fg">
              Tamper-evidence
            </span>
            <span className="text-base leading-relaxed text-muted">
              Finalized entries are content-hashed and cryptographically
              timestamped, so the version researchers see is exactly the version
              you consented to — nothing more, nothing less.
            </span>
          </li>
          <li className="flex flex-col gap-1 bg-bg px-6 py-5">
            <span className="font-heading text-lg tracking-wide text-fg">
              Revocation that cascades
            </span>
            <span className="text-base leading-relaxed text-muted">
              Consent can be withdrawn. Because testimony is linked to an
              identity in the vault, revocation purges it across the pipeline —
              a system behaviour, not a manual favour.
            </span>
          </li>
        </ul>
        <p className="text-base leading-relaxed text-muted">
          See this demonstrated in the{" "}
          <Link
            href="/demos/revocation"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            revocation simulator
          </Link>{" "}
          and the{" "}
          <Link
            href="/demos/provenance"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            provenance explorer
          </Link>
          , or read the full detail in the{" "}
          <Link
            href="/library"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            research library
          </Link>
          .
        </p>
      </section>

      <p className="border-t border-border pt-8 font-mono text-xs leading-relaxed text-muted">
        This is a plain-language summary, not the complete legal policy. For the
        formal privacy policy or a data request, contact Stichting The Witness
        Protocol Foundation via the{" "}
        <Link
          href="/contact"
          className="text-fg underline underline-offset-4 hover:text-muted"
        >
          contact page
        </Link>
        .
      </p>
    </main>
  );
}
