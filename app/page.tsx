import type { Metadata } from "next";
import Link from "next/link";
import { loadAllContent, type Audience, type ContentItem } from "@/content/loader";
import { platformLink } from "@/lib/platform-links";
import { ECOSYSTEM_LINKS } from "@/lib/external-links";

// Per-page metadata (Req 20.2). The root layout supplies the bare
// "The Witness Protocol" title as a fallback for any page without its own; the
// landing page gets a distinct, descriptive title so it never collides with
// that fallback or with the "{title} — The Witness Protocol" pattern every
// other route uses. Property 16 (task 12.2) checks pairwise-unique titles.
export const metadata: Metadata = {
  title: "The Witness Protocol — Moral-Reasoning Testimony for AI Alignment",
  description:
    "The Witness Protocol is a first-party, consented corpus of high-signal human moral-reasoning testimony, built as an evaluation substrate for AI alignment. Explore the research library, demonstrations, and how to take part.",
};

// Current project phase (Req 3.1). Mirrors the footer's PHASE_STATUS.
const PHASE_STATUS = "Phase 5 — Beta (v0.9)";

/**
 * The three Audience entry paths shown on the landing page (Req 3.2). Each links
 * to its audience journey at `/audience/[audience]`. The full per-audience
 * CTA/demo config lives there; the landing page only needs a label and a
 * one-line blurb to route a Visitor to the right journey, so this stays a
 * minimal local list rather than duplicating that config.
 */
const AUDIENCE_ENTRIES: { id: Audience; label: string; blurb: string }[] = [
  {
    id: "contributor",
    label: "Contribute testimony",
    blurb:
      "Share your moral-reasoning testimony — as an individual witness or an invited professional.",
  },
  {
    id: "researcher",
    label: "Study & scrutinize",
    blurb:
      "For researchers, philosophers, and legal experts: the papers, the methodology, and the privacy architecture.",
  },
  {
    id: "funder",
    label: "Fund the mission",
    blurb:
      "Support the Foundation's non-commercial mission and review its strategy and integrity guarantees.",
  },
];

/**
 * The four simulated demonstrations (Req 11). Promoted onto the landing page so
 * the Portal's most distinctive, non-technical-friendly asset — seeing the
 * methodology work rather than only reading about it — is a centerpiece rather
 * than a footer-only link. Each routes to its explicitly-simulated demo.
 */
const DEMO_ENTRIES: { label: string; href: string; blurb: string }[] = [
  {
    label: "The Gate",
    href: "/demos/gate",
    blurb: "Self-assess draft testimony against the acceptance thresholds.",
  },
  {
    label: "The Inquisitor",
    href: "/demos/inquisitor",
    blurb: "See a questioning dialogue beside a standard, flattening LLM reply.",
  },
  {
    label: "Provenance",
    href: "/demos/provenance",
    blurb: "Trace a record's de-identification, hash, and timestamp.",
  },
  {
    label: "Revocation",
    href: "/demos/revocation",
    blurb: "Watch consent withdrawal cascade across the split-plane boundary.",
  },
];

/** Number of curated recent items surfaced on the landing page (Req 3.5). */
const RECENT_COUNT = 3;

/** Destination route for an item: PDFs preview, markdown renders (Req 6.2). */
function itemHref(item: ContentItem): string {
  return item.format === "pdf"
    ? `/library/pdf/${item.slug}`
    : `/library/${item.slug}`;
}

/**
 * Curate the most recent Content_Items for the landing page (Req 3.5). Items
 * carrying an ISO date sort newest-first; undated items fall to the back in
 * stable (loader) order so the selection is deterministic across builds.
 */
function recentItems(items: ContentItem[]): ContentItem[] {
  return [...items]
    .sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    })
    .slice(0, RECENT_COUNT);
}

export default function HomePage() {
  // Static generation: the manifest is read at build time (Req 20.1).
  const { items } = loadAllContent();
  const recent = recentItems(items);

  // Req 3.3 — at least three primary CTAs: participate, read research, fund.
  // The participate CTA links OUT to the Platform via the shared link-out
  // layer (task 4.5) — the Portal owns no participation/consent surface (Req 1).
  const participate = platformLink("consent");

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-20 px-6 py-24">
      {/* Mission + current phase (Req 3.1). */}
      <section className="flex max-w-3xl flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Stichting The Witness Protocol Foundation · {PHASE_STATUS}
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          A better dataset for AI alignment
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          The Witness Protocol is a first-party, consented corpus of high-signal
          human moral-reasoning testimony, built as an evaluation substrate for
          AI alignment. We preserve how people actually reason through hard moral
          choices — the struggle, not the polished answer — so that future
          systems can be tested and shaped against it.
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Not mass collection. Not scraped opinion. A smaller, deliberate body of
          reflective human reasoning — and the tools to evaluate models against
          it.{" "}
          <Link
            href="/about"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            Read what it is and how it works →
          </Link>
        </p>

        {/* Primary CTAs (Req 3.3, 3.4). Participate is an outbound Platform
            link; the other two route within the Portal. */}
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <a
            href={participate.href}
            className="border border-fg px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg"
          >
            Participate
          </a>
          <Link
            href="/library"
            className="border border-border px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:border-fg"
          >
            Read the research
          </Link>
          <Link
            href="/fund"
            className="border border-border px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:border-fg"
          >
            Support the Foundation
          </Link>
        </div>
        <p className="font-mono text-xs leading-relaxed text-muted">
          Participation hands off to the live Platform at{" "}
          <span className="text-fg">{participate.path}</span>; the Portal
          collects no testimony or consent itself.
        </p>
      </section>

      {/* See it work — the four simulated demos, promoted from footer-only so
          the Portal's most accessible asset is a landing-page centerpiece. */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            See it work
          </p>
          <h2 className="text-2xl tracking-wide sm:text-3xl">
            The methodology, demonstrated
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
            Four short, explicitly-simulated demonstrations turn the core claims
            into something you can watch happen — no technical background needed.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
          {DEMO_ENTRIES.map((demo) => (
            <li key={demo.href} className="bg-bg">
              <Link
                href={demo.href}
                className="group flex h-full flex-col gap-3 px-6 py-7 hover:bg-border/30"
              >
                <span className="font-heading text-lg tracking-wide text-fg">
                  {demo.label}
                </span>
                <span className="text-base leading-relaxed text-muted">
                  {demo.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Explore the wider project — the sibling public web properties in the
          Witness Protocol family. Featured here (not just the footer) so the
          accessible on-ramps — the Disalignment field guide and the P-E-S
          persona — are a prominent path, and so P-E-S is no longer absent from
          the front door. External links, sourced from the shared layer. */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Explore the wider project
          </p>
          <h2 className="text-2xl tracking-wide sm:text-3xl">
            More ways to understand it
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
          {ECOSYSTEM_LINKS.map((site) => (
            <li key={site.href} className="bg-bg">
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-3 px-6 py-7 hover:bg-border/30"
              >
                <span className="font-heading text-lg tracking-wide text-fg">
                  {site.label} ↗
                </span>
                <span className="text-base leading-relaxed text-muted">
                  {site.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Audience entry paths (Req 3.2). Framed as an optional lens now, not the
          site's primary organizing principle — everything stays open to all. */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Not sure where to start?
          </p>
          <h2 className="text-2xl tracking-wide sm:text-3xl">
            Explore by interest
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
            These paths surface the material most relevant to you. Nothing is
            gated — the full library is open to everyone, whichever you pick.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE_ENTRIES.map((entry) => (
            <li key={entry.id} className="bg-bg">
              <Link
                href={`/audience/${entry.id}`}
                className="group flex h-full flex-col gap-3 px-6 py-7 hover:bg-border/30"
              >
                <span className="font-heading text-lg tracking-wide text-fg">
                  {entry.label}
                </span>
                <span className="text-base leading-relaxed text-muted">
                  {entry.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Curated recent Content_Items (Req 3.5). */}
      {recent.length > 0 && (
        <section className="flex flex-col gap-8">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                From the library
              </p>
              <h2 className="text-2xl tracking-wide sm:text-3xl">
                Recent writing
              </h2>
            </div>
            <Link
              href="/library"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg"
            >
              All →
            </Link>
          </div>
          <ul className="flex flex-col gap-px border border-border bg-border">
            {recent.map((item) => (
              <li key={item.slug} className="bg-bg">
                <Link
                  href={itemHref(item)}
                  className="group flex flex-col gap-2 px-6 py-6 hover:bg-border/30"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-heading text-xl tracking-wide text-fg">
                      {item.title}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
                      {item.type}
                    </span>
                  </span>
                  <span className="text-base leading-relaxed text-muted">
                    {item.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
