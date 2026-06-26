import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AUDIENCES, loadAllContent, type ContentItem } from "@/content/loader";
import {
  AUDIENCE_CONFIG,
  AUDIENCE_LABELS,
  contentForAudience,
  isAudience,
} from "@/lib/audiences";

/**
 * Audience_Router — dynamic route `/audience/[audience]` (Req 4.1–4.8).
 *
 * One statically generated page per audience (Req 4.1). Each renders its journey
 * config from the shared map (lib/audiences): an intro, ≥1 relevant CTA (Req 4.2,
 * 4.4–4.7), links to the relevant simulated demos, and the Content_Items whose
 * `audienceTags` include this audience, surfaced via `contentForAudience` (Req 4.3).
 *
 * Real-action CTAs (participate, MHS packet, real Inquisitor) link OUT to the
 * Platform via the shared link-out layer (Req 1) and render as `<a href>`;
 * internal Portal routes render via `next/link`.
 *
 * Entry paths filter but do NOT gate: a prominent link to the open `/library`
 * lets any Visitor reach content for any audience regardless of entry path (Req 4.8).
 */

// Built once at build time; surfaced per-audience by tag membership.
const ALL_ITEMS: ContentItem[] = loadAllContent().items;

/** Destination route for an item: PDFs preview, markdown renders (Req 6.2). */
function itemHref(item: ContentItem): string {
  return item.format === "pdf"
    ? `/library/pdf/${item.slug}`
    : `/library/${item.slug}`;
}

// One param per audience (Req 4.1); nothing else resolves (styled 404, Req 2.6).
export function generateStaticParams(): { audience: string }[] {
  return AUDIENCES.map((audience) => ({ audience }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ audience: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { audience } = await params;
  if (!isAudience(audience)) return {};
  const config = AUDIENCE_CONFIG[audience];
  return {
    title: `${config.title} — The Witness Protocol`,
    description: config.intro,
  };
}

export default async function AudiencePage({ params }: PageProps) {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();

  const config = AUDIENCE_CONFIG[audience];
  const items = contentForAudience(ALL_ITEMS, audience);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {AUDIENCE_LABELS[audience]}
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">{config.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          {config.intro}
        </p>
      </header>

      {/* Calls to action (Req 4.2, 4.4–4.7). Real-action CTAs link OUT to the
          Platform (`<a>` with ↗); internal Portal routes use next/link. */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Take action
        </h2>
        <ul className="flex flex-col gap-px border border-border bg-border">
          {config.ctas.map((cta) =>
            cta.external ? (
              <li key={cta.href} className="bg-bg">
                <a
                  href={cta.href}
                  className="group flex flex-col gap-2 px-6 py-6 hover:bg-border/30"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-heading text-xl tracking-wide text-fg">
                      {cta.label}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
                      Platform ↗
                    </span>
                  </span>
                  <span className="text-base leading-relaxed text-muted">
                    {cta.description}
                  </span>
                </a>
              </li>
            ) : (
              <li key={cta.href} className="bg-bg">
                <Link
                  href={cta.href}
                  className="group flex flex-col gap-2 px-6 py-6 hover:bg-border/30"
                >
                  <span className="font-heading text-xl tracking-wide text-fg">
                    {cta.label}
                  </span>
                  <span className="text-base leading-relaxed text-muted">
                    {cta.description}
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* Relevant simulated demonstrations (Req 4.4 Gate, 4.5 Inquisitor,
          4.6 Revocation). Internal Portal routes. */}
      {config.demoLinks.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Demonstrations
          </h2>
          <ul className="flex flex-col gap-2">
            {config.demoLinks.map((demo) => (
              <li key={demo.href}>
                <Link
                  href={demo.href}
                  className="text-fg underline underline-offset-4 hover:text-muted"
                >
                  {demo.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Content surfaced by Audience_Tag membership (Req 4.3). */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Reading for this audience
        </h2>
        {items.length === 0 ? (
          <p className="text-base leading-relaxed text-muted">
            No content is tagged for this audience yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-px border border-border bg-border">
            {items.map((item) => (
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
        )}
      </section>

      {/* Req 4.8 — entry paths filter but do not gate: any Visitor can reach
          Content_Items for any audience via the open library index. */}
      <footer className="border-t border-border pt-10">
        <p className="text-base leading-relaxed text-muted">
          This journey surfaces content tagged for {AUDIENCE_LABELS[audience]}s,
          but nothing is gated. The full{" "}
          <Link
            href="/library"
            className="text-fg underline underline-offset-4 hover:text-muted"
          >
            library
          </Link>{" "}
          is open to everyone — browse content for any audience regardless of
          where you started.
        </p>
      </footer>
    </main>
  );
}
