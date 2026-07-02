import { describe, it, expect } from "vitest";
import fc from "fast-check";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadAllContent } from "@/content/loader";
import { STATIC_ROUTES, publishedPaths } from "@/lib/sitemap";

// Property test for sitemap completeness (task 12.4).
//
// Property 17: Sitemap completeness — for any content manifest, the generated
// sitemap lists EXACTLY the published page URLs: the static routes plus one
// content route per ContentItem (markdown → /library/{slug}, PDF →
// /library/pdf/{slug}). No published page is omitted, no non-existent URL is
// included, and the set contains no duplicates.
// Validates: Requirements 20.4

const SOURCE_FOLDERS = ["Blog posts", "Articles and papers", "reports"] as const;

// Strip characters illegal in Windows/POSIX file names plus trailing dots/spaces
// (which Windows silently trims). The fixed "f-" prefix below keeps the final
// file name non-empty even when the stem reduces to "".
function safeStem(s: string): string {
  return s
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/[. ]+$/g, "")
    .trim();
}

const stemArb = fc
  .array(
    fc.oneof(
      fc.stringMatching(/^[A-Za-z0-9]{1,8}$/),
      fc.constantFrom("_", "-", " ", "__", "--"),
    ),
    { maxLength: 6 },
  )
  .map((tokens) => safeStem(tokens.join("")));

// A file spec is a folder + stem + extension. The mix of .md and .pdf exercises
// both content-route prefixes; colliding stems exercise slug-suffixing (which
// must still yield unique, non-overlapping URLs).
const fileSpecArb = fc.record({
  folder: fc.constantFrom(...SOURCE_FOLDERS),
  stem: stemArb,
  ext: fc.constantFrom(".md", ".pdf"),
});

describe("Property 17: Sitemap completeness", () => {
  // Feature: witness-protocol-portal, Property 17: Sitemap completeness
  it("publishedPaths equals exactly the static routes plus the manifest content routes, with no duplicates", () => {
    fc.assert(
      fc.property(fc.array(fileSpecArb, { maxLength: 14 }), (specs) => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), "twp-sitemap-"));
        try {
          for (const folder of SOURCE_FOLDERS) {
            fs.mkdirSync(path.join(root, folder));
          }

          // Write each spec, deduping by case-insensitive path (the host FS on
          // Windows is case-insensitive, so "f-Abc.md" and "f-abc.md" are one).
          const writtenPaths = new Set<string>();
          for (const spec of specs) {
            const fileName = `f-${spec.stem}${spec.ext}`;
            const relPath = path.join(spec.folder, fileName);
            const key = relPath.toLowerCase();
            if (writtenPaths.has(key)) continue;
            writtenPaths.add(key);
            const contents =
              spec.ext === ".md" ? "Intro line.\n# Heading\nProse." : "%PDF-1.4";
            fs.writeFileSync(path.join(root, relPath), contents);
          }

          // Oracle: derive the expected content routes from the manifest items
          // by the format→prefix rule, then permute them so the assertion is
          // order-independent (the sitemap is a set of URLs, not a sequence).
          const { items } = loadAllContent(root);
          const expectedContent = items.map((item) =>
            item.format === "pdf"
              ? `/library/pdf/${item.slug}`
              : `/library/${item.slug}`,
          );
          const expected = [...STATIC_ROUTES, ...expectedContent];
          const expectedPermuted = [...expected].reverse();

          const actual = publishedPaths(root);

          // None omitted / none extra: the sets are equal.
          expect(new Set(actual)).toEqual(new Set(expectedPermuted));
          // No duplicates: every URL appears exactly once.
          expect(new Set(actual).size).toBe(actual.length);
          // Counts agree exactly: static routes + one route per manifest item.
          expect(actual.length).toBe(STATIC_ROUTES.length + items.length);

          // Every static route is present, and content routes never collide
          // with the static namespace (all live under /library/...).
          for (const route of STATIC_ROUTES) {
            expect(actual).toContain(route);
          }
          // Per-prefix counts match the markdown/PDF split of the manifest.
          const mdCount = items.filter((i) => i.format === "markdown").length;
          const pdfCount = items.filter((i) => i.format === "pdf").length;
          const pdfUrls = actual.filter((p) => p.startsWith("/library/pdf/"));
          const mdUrls = actual.filter(
            (p) => p.startsWith("/library/") && !p.startsWith("/library/pdf/"),
          );
          expect(pdfUrls.length).toBe(pdfCount);
          expect(mdUrls.length).toBe(mdCount);
        } finally {
          fs.rmSync(root, { recursive: true, force: true });
        }
      }),
      { numRuns: 100 },
    );
  }, 30000);
});
