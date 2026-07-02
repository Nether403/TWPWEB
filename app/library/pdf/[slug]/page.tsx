import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadAllContent,
  type ContentItem,
  type ContentCategory,
} from "@/content/loader";

/**
 * Media_Viewer — PDF preview route `/library/pdf/[slug]` (Req 6.2).
 *
 * The companion to the markdown route (`/library/[slug]`): that route renders
 * `format: "markdown"` items, this one renders `format: "pdf"` items. PDFs are
 * catalogued by the build-time content loader as ContentItems carrying an
 * `assetPath` (the served path under `public/`, e.g. `/assets/paper/foo.pdf`);
 * the asset-copy step already placed the file there. This page provides an
 * in-page preview embedded via `<object>` (with an `<iframe>` fallback for
 * browsers that decline the object) and a download link (Req 6.2). It performs
 * no parsing or runtime I/O — just static delivery of the pre-copied asset.
 */

// Built once at module load (build time). Only PDF items belong to this route;
// markdown items are served by `/library/[slug]`.
const PDF_ITEMS: ContentItem[] = loadAllContent().items.filter(
  (item) => item.format === "pdf" && Boolean(item.assetPath),
);

const TYPE_LABELS: Record<ContentCategory, string> = {
  blog: "Blog post",
  article: "Article",
  paper: "Paper",
  report: "Report",
};

function findItem(slug: string): ContentItem | undefined {
  return PDF_ITEMS.find((item) => item.slug === slug);
}

// One param per PDF ContentItem slug (Req 6.2).
export function generateStaticParams(): { slug: string }[] {
  return PDF_ITEMS.map((item) => ({ slug: item.slug }));
}

// Only manifest slugs resolve to a page; anything else is a styled 404 (Req 2.6).
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return {};
  return {
    title: `${item.title} — The Witness Protocol`,
    description: item.summary,
  };
}

export default async function PdfPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findItem(slug);
  // assetPath is present for every PDF item in PDF_ITEMS; guard keeps types honest.
  if (!item || !item.assetPath) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6 border-b border-border pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {TYPE_LABELS[item.type]} · PDF
        </p>
        <h1 className="text-4xl leading-tight tracking-wide sm:text-5xl">
          {item.title}
        </h1>
        <a
          href={item.assetPath}
          download
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg"
        >
          ↓ Download PDF
        </a>
      </header>

      <aside className="border border-border bg-bg p-5 text-sm leading-relaxed text-muted">
        PDF files are preserved as source documents and may contain older or
        research-direction language. Current public claims are governed by the
        live Portal copy and the public claims guide: Phase 5 Beta v0.9 research
        infrastructure, not a product and not a solved-alignment claim. Treat
        RFC-3161/IPFS provenance, WitnessBench-style adapter outputs, and similar
        model-control mechanisms as planned or research direction unless a live
        status page says otherwise.
      </aside>

      {/* In-page preview (Req 6.2). `<object>` is the primary embed; the nested
          `<iframe>` is the fallback for browsers that decline to render the
          object, and the inner link is the last-resort fallback for browsers
          that embed neither. The asset was copied to public/ at build time. */}
      <object
        data={item.assetPath}
        type="application/pdf"
        className="h-[80vh] w-full border border-border"
        aria-label={`PDF preview of ${item.title}`}
      >
        <iframe
          src={item.assetPath}
          title={`PDF preview of ${item.title}`}
          className="h-[80vh] w-full border border-border"
        >
          <p className="text-muted">
            Your browser cannot display this PDF inline.{" "}
            <a href={item.assetPath} download className="underline">
              Download it instead
            </a>
            .
          </p>
        </iframe>
      </object>

      <footer className="border-t border-border pt-10">
        <Link
          href="/library"
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg"
        >
          ← Back to the library
        </Link>
      </footer>
    </main>
  );
}
