import type { Metadata } from "next";
import { copyAssets } from "@/content/assets";

/**
 * /media/slides — Slide deck list (Req 10.1, 10.2).
 *
 * Statically rendered: at build time `copyAssets()` copies the source PPTX decks
 * into `public/assets/slides/` and returns the `MediaAsset[]` manifest. This page
 * reuses that manifest as the single source of truth — it does NOT re-scan the
 * `slides` folder or re-derive titles; `title` already carries the
 * file-name-derived, humanized deck name (Req 10.1). It renders exactly one entry
 * per slides asset, each with a download link to the served PPTX (Req 10.2).
 *
 * No client interaction is needed: a PPTX cannot be previewed inline in the
 * browser, so the only affordance is the download link. The native `download`
 * attribute hands the file to the visitor's download manager.
 */

export const metadata: Metadata = {
  title: "Slides — The Witness Protocol",
  description:
    "Downloadable Witness Protocol presentation decks covering the alignment infrastructure, blueprint, and overview.",
};

export default function SlidesPage() {
  // Build-time manifest; keep only slide decks. Order is the manifest's
  // deterministic (sorted) order from copyAssets.
  const slides = copyAssets().media.filter((asset) => asset.kind === "slides");

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Media — Slides
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">Slide Decks</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Presentation decks covering the Witness Protocol&rsquo;s mission,
          architecture, and roadmap. Select a deck to download the PowerPoint
          file.
        </p>
      </header>

      {slides.length === 0 ? (
        <p className="text-muted">No slide decks are available.</p>
      ) : (
        <ul className="flex flex-col border-t border-border">
          {slides.map((deck) => (
            <li
              key={deck.assetPath}
              className="flex flex-col gap-3 border-b border-border py-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-xl tracking-wide">{deck.title}</span>
              <a
                href={deck.assetPath}
                download
                className="self-start font-mono text-xs uppercase tracking-[0.3em] text-fg underline decoration-border underline-offset-8 transition-colors hover:text-muted sm:self-auto"
              >
                Download .pptx
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
