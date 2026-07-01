import type { Metadata } from "next";
import Link from "next/link";
import { platformLink } from "@/lib/platform-links";
import { FOUNDER, SOCIAL_LINKS } from "@/lib/external-links";

/**
 * /about — About & Methodology (fixes the dead "About / Methodology" primary
 * nav link, which previously 404'd).
 *
 * This page is the Portal's credibility anchor: a plain-language account of
 * what the Witness Protocol is (and is not), how the methodology actually works
 * (the Gate, the Inquisitor, the outputs, privacy-by-architecture), and who is
 * behind it. It links OUT to the four simulated demos and the research library
 * so a reader can move from claim → demonstration → source, and hands real
 * actions off to the Platform via the shared link-out layer (Req 1).
 *
 * Grounded framing per project steering: the Protocol is an evaluation
 * substrate and consented corpus — not a "wisdom archive" and it does not claim
 * to "solve alignment." Copy avoids overclaiming.
 */

export const metadata: Metadata = {
  title: "About & Methodology — The Witness Protocol",
  description:
    "What the Witness Protocol is and how it works: the Gate vetting pipeline, the Inquisitor dialogue engine, model-usable alignment outputs, and privacy by architecture — plus the Foundation behind it.",
};

// Current project phase (mirrors the footer/landing PHASE_STATUS constant).
const PHASE_STATUS = "Phase 5 — Beta (v0.9)";

/** The methodology, broken into the four load-bearing pieces, each with a demo. */
const METHODOLOGY: {
  heading: string;
  body: string;
  demo?: { label: string; href: string };
}[] = [
  {
    heading: "The Gate — a multi-tier vetting pipeline",
    body: "Testimony is not accepted wholesale. It passes an automated sieve for coherence, a qualitative assessment that scores specificity, counterfactual reasoning, and relational density, and finally a blind, dual-rater Human Curation Council. The Gate is the defense against low-signal noise entering the corpus.",
    demo: { label: "Try the Gate self-assessment", href: "/demos/gate" },
  },
  {
    heading: "The Inquisitor — Socratic inquiry, not a helpful assistant",
    body: "The dialogue engine drops the subservient-assistant posture for a questioning one: a roughly 70/30 inquiry-to-statement ratio, a 5-Whys forcing function, and steel-manning a witness's position before challenging it. The goal is the strongest version of the reasoning, not a comfortable consensus.",
    demo: { label: "Compare Inquisitor vs. standard LLM", href: "/demos/inquisitor" },
  },
  {
    heading: "The outputs — model-usable supervision",
    body: "The human-readable archive is not the product. Vetted testimony is transformed into preference pairs, process-reward traces, rule-based reward rubrics, and private evaluation cases — the model-facing artifacts that make the corpus an evaluation substrate rather than a reading list.",
    demo: { label: "Trace a record's provenance", href: "/demos/provenance" },
  },
  {
    heading: "Privacy by architecture — consent as a system invariant",
    body: "Identity and testimony are kept in separate rooms. A two-pass de-identification strip removes hard identifiers before any external model sees the text, records are hashed and timestamped for tamper-evidence, and consent revocation cascades through the pipeline as a hardcoded behaviour — not just a legal promise.",
    demo: { label: "Simulate a consent revocation", href: "/demos/revocation" },
  },
];

export default function AboutPage() {
  const participate = platformLink("consent");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-16 px-6 py-24">
      {/* Plain-language framing first (Req: a real introduction). */}
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          About / Methodology · {PHASE_STATUS}
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          A better dataset for AI alignment
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          The Witness Protocol is a first-party, consented corpus of high-signal
          human moral-reasoning testimony, built as an evaluation substrate for
          AI alignment. It preserves how people actually reason through hard
          moral choices — the struggle, not the polished answer — so future
          systems can be tested and shaped against it.
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          It is deliberately small and curated. It is <em>not</em> mass
          collection, not scraped opinion, and it makes no claim to "solve"
          alignment. It is research infrastructure: a rigorous, auditable body
          of testimony and the tools to evaluate models against it.
        </p>
      </header>

      {/* How it works — the four load-bearing pieces, each linking to a demo. */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            How it works
          </p>
          <h2 className="text-2xl tracking-wide sm:text-3xl">
            From testimony to supervision
          </h2>
        </div>
        <ul className="flex flex-col gap-px border border-border bg-border">
          {METHODOLOGY.map((step) => (
            <li key={step.heading} className="flex flex-col gap-3 bg-bg px-6 py-7">
              <h3 className="font-heading text-xl tracking-wide text-fg">
                {step.heading}
              </h3>
              <p className="text-base leading-relaxed text-muted">{step.body}</p>
              {step.demo && (
                <Link
                  href={step.demo.href}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-fg underline underline-offset-4 hover:text-muted"
                >
                  {step.demo.label} →
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="text-base leading-relaxed text-muted">
          The demonstrations above are explicitly simulated illustrations. The
          real instruments — Gate intake, the Inquisitor dialogue engine, and
          consent — live on the live Platform. For the full detail, read the{" "}
          <Link
            href="/library"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            papers and reports
          </Link>{" "}
          in the research library.
        </p>
      </section>

      {/* The Foundation + the founder — the identity/credibility anchor. */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Who is behind it
          </p>
          <h2 className="text-2xl tracking-wide sm:text-3xl">
            The Foundation
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-fg">
          The work is stewarded by <strong>Stichting The Witness Protocol
          Foundation</strong>, a Dutch non-profit legally isolated from
          commercial incentives. Contributions are donations or grants toward an
          auditable public good — never an investment or a financial return.
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          The Protocol was founded by <strong>{FOUNDER.name}</strong>, an AI
          developer and system architect based in the Netherlands, who stepped
          away from commercial AI development to build a high-signal ethical
          inheritance for future intelligence — architected through structured
          dialogue and strict operational constraints rather than uncurated data
          scraping.
        </p>

        {/* Founder contact + personal links, and the Foundation's presence
            elsewhere. Sourced from the shared external-links layer. */}
        <div className="flex flex-col gap-2 border border-border bg-bg px-6 py-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {FOUNDER.role}
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {FOUNDER.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="font-mono text-xs text-fg underline underline-offset-4 hover:text-muted"
              >
                {email}
              </a>
            ))}
            {FOUNDER.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.15em] text-fg underline underline-offset-4 hover:text-muted"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              The Protocol elsewhere
            </span>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.15em] text-fg underline underline-offset-4 hover:text-muted"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/contact"
            className="border border-fg px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg"
          >
            Contact the Foundation
          </Link>
          <a
            href={participate.href}
            className="border border-border px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:border-fg"
          >
            Participate
          </a>
          <Link
            href="/fund"
            className="border border-border px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:border-fg"
          >
            Support the mission
          </Link>
        </div>
      </section>
    </main>
  );
}
