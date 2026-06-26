// app/media/media-gallery.property.test.tsx
//
// Property test for media gallery completeness (task 6.5).
//
// Property 8: Media gallery completeness — for any set of media assets of a
// given kind (infographic, video, or slides), the corresponding gallery/list
// renders exactly one entry per asset, each linking to that asset's served path.
// Validates: Requirements 8.1, 10.1
//
// The three media galleries (`/media/infographics`, `/media/videos`,
// `/media/slides`) are statically rendered server components whose single source
// of truth is the `MediaAsset[]` manifest from the asset-copy step
// (content/assets.ts `copyAssets()`). Each page's mapping is the same shape:
//
//     copyAssets().media.filter((asset) => asset.kind === KIND)  -> one entry each
//
// rendering each surviving asset's `assetPath` as the served link
// (`<img src>` for infographics, `<a download href>` for slides, `<source src>`
// for videos). Rather than re-implement that filter in the test (which would be
// tautological), we render the REAL page components against arbitrary manifests
// and assert the produced DOM: the rendered links for a kind equal exactly that
// kind's asset paths, in order — i.e. one entry per asset, each linking to its
// served path. `copyAssets` is mocked only to inject the arbitrary manifest the
// property quantifies over; the gallery rendering under test is the real thing.

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import type { MediaAsset, MediaKind } from "@/content/assets";

// Inject the arbitrary MediaAsset[] the property quantifies over. The galleries
// call `copyAssets()` with no args (it reads the workspace at build time); the
// mock lets each iteration feed a generated manifest instead of the file system.
vi.mock("@/content/assets", () => ({ copyAssets: vi.fn() }));

import { copyAssets } from "@/content/assets";
import InfographicsPage from "@/app/media/infographics/page";
import VideosPage from "@/app/media/videos/page";
import SlidesPage from "@/app/media/slides/page";

afterEach(cleanup);

const KIND_META: Record<MediaKind, { category: string; ext: string }> = {
  infographic: { category: "infographics", ext: "png" },
  video: { category: "videos", ext: "mp4" },
  slides: { category: "slides", ext: "pptx" },
};

// A human-readable, always-non-empty title (mirrors copyAssets' derived titles).
const titleArb = fc
  .string({ minLength: 1, maxLength: 24 })
  .map((s) => s.replace(/[\r\n]/g, " ").trim() || "Asset");

// Arbitrary manifest: a mix of the three kinds. The served `assetPath` is made
// globally unique via the array index, mirroring the real manifest (one served
// path per source file) so the galleries' assetPath-keyed lists never collide.
const manifestArb: fc.Arbitrary<MediaAsset[]> = fc
  .array(
    fc.record({
      kind: fc.constantFrom<MediaKind>("infographic", "video", "slides"),
      title: titleArb,
    }),
    { maxLength: 12 },
  )
  .map((rows) =>
    rows.map((row, i): MediaAsset => {
      const meta = KIND_META[row.kind];
      return {
        kind: row.kind,
        title: row.title,
        ...(row.kind === "infographic" ? { alt: row.title } : {}),
        assetPath: `/assets/${meta.category}/asset-${i}-${row.kind}.${meta.ext}`,
      };
    }),
  );

describe("Property 8: Media gallery completeness", () => {
  // Feature: witness-protocol-portal, Property 8: Media gallery completeness
  it("each gallery renders exactly one entry per asset of its kind, linking to the served path", () => {
    const mockedCopyAssets = vi.mocked(copyAssets);

    fc.assert(
      fc.property(manifestArb, (media) => {
        mockedCopyAssets.mockReturnValue({ media, copied: [], skipped: [] });

        // Expected served paths for a kind, in manifest order (one per asset).
        const pathsFor = (kind: MediaKind) =>
          media.filter((m) => m.kind === kind).map((m) => m.assetPath);

        // Infographics gallery: one <img> tile per infographic, src = served path
        // (lightbox is closed on initial render, so only grid tiles exist).
        const infographics = render(<InfographicsPage />);
        const renderedInfographics = [
          ...infographics.container.querySelectorAll("img"),
        ].map((img) => img.getAttribute("src"));
        expect(renderedInfographics).toEqual(pathsFor("infographic"));
        cleanup();

        // Slides list: one download <a> per deck, href = served path.
        const slides = render(<SlidesPage />);
        const renderedSlides = [
          ...slides.container.querySelectorAll("a[download]"),
        ].map((a) => a.getAttribute("href"));
        expect(renderedSlides).toEqual(pathsFor("slides"));
        cleanup();

        // Video gallery: one <video><source> per clip, src = served path.
        const videos = render(<VideosPage />);
        const renderedVideos = [
          ...videos.container.querySelectorAll("video source"),
        ].map((s) => s.getAttribute("src"));
        expect(renderedVideos).toEqual(pathsFor("video"));
        cleanup();
      }),
      { numRuns: 100 },
    );
  });
});
