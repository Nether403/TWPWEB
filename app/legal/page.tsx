import type { Metadata } from "next";
import Link from "next/link";

/**
 * /legal — Legal notice (fixes the dead footer "Legal" link, which appeared on
 * every page and 404'd).
 *
 * A plain, honest notice covering the entity, the non-commercial nature of the
 * project, use of the site's content, and disclaimers. It deliberately does NOT
 * invent registration numbers or formal terms — where specifics are required it
 * points to /contact. The copy states it is not a substitute for the formal
 * terms so the reviewer/operator can replace it with counsel-approved text.
 */

export const metadata: Metadata = {
  title: "Legal — The Witness Protocol",
  description:
    "Legal notice for Stichting The Witness Protocol Foundation: the entity behind the project, the non-commercial nature of contributions, use of site content, and disclaimers.",
};

export default function LegalPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Legal
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">Legal notice</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          This website is published by <strong>Stichting The Witness Protocol
          Foundation</strong>, a non-profit foundation established in the
          Netherlands and governed by Dutch law.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl tracking-wide sm:text-3xl">
          A non-commercial mission
        </h2>
        <p className="text-base leading-relaxed text-fg">
          The Foundation operates on a purpose-over-profit basis. Any
          contribution — cash or token — is a donation or grant toward a
          non-commercial research mission. It is <strong>not</strong> an
          investment, confers no equity, ownership, or financial return, and
          carries no expectation of profit. See the{" "}
          <Link
            href="/fund"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            funding page
          </Link>{" "}
          for details.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl tracking-wide sm:text-3xl">Use of content</h2>
        <p className="text-base leading-relaxed text-fg">
          The papers, reports, articles, infographics, and other materials
          published here are provided for research and educational purposes.
          Except where a specific licence is stated, content remains the
          property of the Foundation or its respective authors. Please contact
          us before redistributing or reusing material, and cite the source.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl tracking-wide sm:text-3xl">
          Demonstrations and external links
        </h2>
        <p className="text-base leading-relaxed text-fg">
          The interactive demonstrations on this site are explicitly simulated
          illustrations of the Protocol's methodology — they are not the real
          instruments and perform no real submission, review, or consent action.
          Real actions are handled on the separate live Platform, which this
          site links out to. The Foundation is not responsible for the content
          or availability of third-party sites reached through outbound links.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl tracking-wide sm:text-3xl">No warranty</h2>
        <p className="text-base leading-relaxed text-fg">
          This website and its content are provided &ldquo;as is,&rdquo; without
          warranty of any kind. The Foundation makes no guarantee that the
          information is complete or current, and accepts no liability for any
          loss arising from reliance on it.
        </p>
      </section>

      <p className="border-t border-border pt-8 font-mono text-xs leading-relaxed text-muted">
        This notice is a summary, not the Foundation's complete terms. For legal
        enquiries, the formal terms, or registration details, contact Stichting
        The Witness Protocol Foundation via the{" "}
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
