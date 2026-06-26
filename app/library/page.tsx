import type { Metadata } from "next";
import { loadAllContent } from "@/content/loader";
import { ContentIndex } from "./content-index";

/**
 * /library — Content_Index (task 5.3, Req 5.3, 6.3, 7.2, 21.7).
 *
 * Statically rendered: `loadAllContent()` runs at build time and the full
 * manifest is handed to a client component that filters it in the browser by
 * type AND by audience. The index lists every published Content_Item with its
 * title, summary, and type label, and links each item to its page
 * (`/library/[slug]`, or `/library/pdf/[slug]` for PDFs). The index is open: it
 * surfaces content for every audience regardless of any entry path (Req 4.8).
 */

export const metadata: Metadata = {
  title: "Library — The Witness Protocol",
  description:
    "Browse the Witness Protocol's blog posts, articles, papers, and reports. Filter by type and by audience.",
};

export default function LibraryPage() {
  const { items } = loadAllContent();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Library
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Writing &amp; research
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Blog posts, articles, papers, and reports from the Witness Protocol.
          Filter by type or by the audience a piece is written for.
        </p>
      </header>

      <ContentIndex items={items} />
    </main>
  );
}
