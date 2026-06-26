// app/library/content-index.property.test.tsx
//
// Property test for content index completeness (task 5.4).
//
// Property 5: Content index completeness — for any content manifest, every
// ContentItem is represented in the index with a non-empty title, a non-empty
// summary, and a type label equal to the item's `type` (Req 5.3, 6.3, 7.2).
//
// We verify against the ACTUAL rendered DOM, not the projection logic: render
// the ContentIndex with an arbitrary array of ContentItems and assert each item
// surfaces exactly one card carrying its title, its summary, and a label element
// whose text is exactly its `type`.

import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import { ContentIndex } from "./content-index";
import {
  AUDIENCES,
  type ContentCategory,
  type ContentItem,
} from "@/content/loader";

afterEach(cleanup);

const CATEGORIES: readonly ContentCategory[] = [
  "blog",
  "article",
  "paper",
  "report",
];

// Arbitrary text with whitespace collapsed/trimmed. A unique per-index prefix is
// layered on in the test so the final title/summary are always non-empty.
const textArb = fc
  .string({ maxLength: 40 })
  .map((s) => s.replace(/\s+/g, " ").trim());

// Seed for one item; uniqueness (slug/title/summary/href) is layered on by index
// in the test so each rendered card is independently locatable.
const itemSeedArb = fc.record({
  title: textArb,
  summary: textArb,
  type: fc.constantFrom(...CATEGORIES),
  format: fc.constantFrom<"markdown" | "pdf">("markdown", "pdf"),
  audienceTags: fc.array(fc.constantFrom(...AUDIENCES), { maxLength: 6 }),
});

/** Mirror of the component's destination route, used to locate each card. */
function itemHref(item: ContentItem): string {
  return item.format === "pdf"
    ? `/library/pdf/${item.slug}`
    : `/library/${item.slug}`;
}

describe("Property 5: Content index completeness", () => {
  // Feature: witness-protocol-portal, Property 5: Content index completeness
  it("renders every ContentItem with a non-empty title, non-empty summary, and a type label equal to its type", () => {
    fc.assert(
      fc.property(fc.array(itemSeedArb, { maxLength: 12 }), (seeds) => {
        // Layer per-index uniqueness so each card has a distinct slug, title,
        // summary, and a unique destination href to locate it by.
        const items: ContentItem[] = seeds.map((seed, i) => ({
          slug: `item-${i}`,
          title: `Title ${i} ${seed.title}`.trim(),
          summary: `Summary ${i} ${seed.summary}`.trim(),
          type: seed.type,
          format: seed.format,
          audienceTags: seed.audienceTags,
          sourcePath: `src/item-${i}.md`,
        }));

        const { container } = render(<ContentIndex items={items} />);

        // Exactly one card (link) per item — none omitted, none duplicated.
        const links = Array.from(container.querySelectorAll("a[href]"));
        expect(links).toHaveLength(items.length);

        for (const item of items) {
          const card = links.find(
            (a) => a.getAttribute("href") === itemHref(item),
          );
          expect(card, `card for ${item.slug}`).toBeTruthy();

          const text = card!.textContent ?? "";

          // The manifest item itself carries a non-empty title and summary, and
          // both are surfaced verbatim in the rendered card (Req 5.3, 7.2).
          expect(item.title.length).toBeGreaterThan(0);
          expect(item.summary.length).toBeGreaterThan(0);
          expect(text).toContain(item.title);
          expect(text).toContain(item.summary);

          // The card carries a label element whose text is EXACTLY the item's
          // `type` — the type label equals the item's type (Req 6.3, 7.2).
          const hasTypeLabel = Array.from(card!.querySelectorAll("*")).some(
            (el) => (el.textContent ?? "").trim() === item.type,
          );
          expect(hasTypeLabel, `type label for ${item.slug}`).toBe(true);
        }

        cleanup();
      }),
      { numRuns: 100 },
    );
  });
});
