import type { Metadata } from "next";
import { copyAssets } from "@/content/assets";
import {
  InfographicsGallery,
  type GalleryInfographic,
} from "@/components/infographics-gallery";

/**
 * /media/infographics — Infographics gallery (Req 8.1, 8.2, 8.3).
 *
 * Statically rendered: at build time `copyAssets()` copies the source PNGs into
 * `public/assets/infographics/` and returns the `MediaAsset[]` manifest. This
 * page reuses that manifest as the single source of truth — it does NOT re-scan
 * the `infographs` folder or re-derive alt text; `alt` already carries the
 * file-name-derived description (Req 8.2). It renders exactly one tile per
 * infographic asset (Req 8.1) and hands the list to the client gallery, which
 * owns the select-to-enlarge lightbox interaction (Req 8.3).
 */

export const metadata: Metadata = {
  title: "Infographics — The Witness Protocol",
  description:
    "Visual infographics explaining the Witness Protocol's architecture and framework.",
};

export default function InfographicsPage() {
  // Build-time manifest; keep only infographics and project to the gallery's
  // shape. `alt` is guaranteed for infographics by copyAssets, but fall back to
  // the title to stay type-safe and never render an empty alt.
  const infographics: GalleryInfographic[] = copyAssets()
    .media.filter((asset) => asset.kind === "infographic")
    .map((asset) => ({
      title: asset.title,
      alt: asset.alt ?? asset.title,
      assetPath: asset.assetPath,
    }));

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Media — Infographics
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">Infographics</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Visual explanations of the Witness Protocol&rsquo;s architecture and
          framework. Select any infographic to view it enlarged.
        </p>
      </header>

      <InfographicsGallery infographics={infographics} />
    </main>
  );
}
