import type { Metadata } from "next";
import Link from "next/link";
import { loadAllContent, type Audience, type ContentItem } from "@/content/loader";
import { platformLink } from "@/lib/platform-links";

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
const PHASE_STATUS = "Phase 5 — Alpha";

/**
 * The six Audience entry paths shown on the landing page (Req 3.2). Each links
 * to its audience journey at `/audience/[audience]` (built in task 7.2). The
 * full per-audience CTA/demo config lives there; the landing page only needs a
 * label and a one-line blurb to route a Visitor to the right journey, so this
 * stays a minimal local list rather than duplicating that config.
 */
const AUDIENCE_ENTRIES: { id: Audience; label: string; blurb: string }[] = [
  {
    id: "potential-witness",
    label: "Potential Witness",
    blurb: "Consider contributing your moral-reasoning testimony to the corpus.",
  },
  {
    id: "invited-professional",
    label: "Invited Professional",
    blurb: "Review the Minimum Honest Signal packet and the participation path.",
  },
  {
    id: "researcher",
    label: "Researcher",
    blurb: "Read the papers and reports; compare the Inquisitor methodology.",
  },
  {
    id: "philosopher",
    label: "Philosopher",
    blurb: "Engage the framework behind high-signal moral inheritance.",
  },
  {
    id: "legal-expert",
    label: "Legal Expert",
    blurb: "Examine the privacy architecture, governance, and consent revocation.",
  },
  {
    id: "investor",
    label: "Investor",
    blurb: "Assess the strategy and support the Foundation's non-commercial mission.",
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
          The Witness Protocol
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          A first-party, consented corpus of high-signal human moral-reasoning
          testimony, built as an evaluation substrate and post-training
          adaptation source for AI alignment. We preserve how people actually
          reason through hard moral choices — the struggle, not the polished
          answer — so that future systems can inherit it.
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

      {/* Six Audience entry paths (Req 3.2). */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Find your path
          </p>
          <h2 className="text-2xl tracking-wide sm:text-3xl">
            Six ways in
          </h2>
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
