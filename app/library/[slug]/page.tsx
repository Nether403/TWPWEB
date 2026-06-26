import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadAllContent,
  type ContentItem,
  type ContentCategory,
} from "@/content/loader";

/**
 * Content_Renderer — dynamic route `/library/[slug]` (Req 5.1, 5.2, 5.4, 6.1,
 * 6.4, 7.1, 7.3).
 *
 * Statically generated from the build-time content manifest. Each markdown
 * ContentItem becomes one page; the loader already rendered and SANITIZED the
 * body to HTML (`bodyHtml`, via remark/rehype + rehype-sanitize), preserving
 * headings, paragraphs, lists, emphasis, links, and block quotes (Req 5.2).
 * This route just injects that trusted HTML and styles it to the theme — it
 * does not re-parse markdown.
 *
 * PDF items are served by a separate route (`/library/pdf/[slug]`, task 6.1),
 * so this route handles `format: "markdown"` items only.
 */

// Built once at module load (build time). Filtering to markdown here keeps PDFs
// out of generateStaticParams so they don't shadow the dedicated PDF route.
const MARKDOWN_ITEMS: ContentItem[] = loadAllContent().items.filter(
  (item) => item.format === "markdown",
);

const TYPE_LABELS: Record<ContentCategory, string> = {
  blog: "Blog post",
  article: "Article",
  paper: "Paper",
  report: "Report",
};

function findItem(slug: string): ContentItem | undefined {
  return MARKDOWN_ITEMS.find((item) => item.slug === slug);
}

// One param per markdown ContentItem slug (Req 5.1, 6.1, 7.1).
export function generateStaticParams(): { slug: string }[] {
  return MARKDOWN_ITEMS.map((item) => ({ slug: item.slug }));
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

export default async function ContentItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findItem(slug);
  // bodyHtml is present for every markdown item; guard keeps the type honest.
  if (!item || !item.bodyHtml) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6 border-b border-border pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {TYPE_LABELS[item.type]}
          {item.date ? ` · ${item.date}` : ""}
          {item.author ? ` · ${item.author}` : ""}
        </p>
        <h1 className="text-4xl leading-tight tracking-wide sm:text-5xl">
          {item.title}
        </h1>
        {item.summary ? (
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {item.summary}
          </p>
        ) : null}
      </header>

      {/* bodyHtml was sanitized at build time by rehype-sanitize in the loader
          (Req 5.2). It is trusted, first-party content, not Visitor input. */}
      <article
        className="content-body"
        dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
      />

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
