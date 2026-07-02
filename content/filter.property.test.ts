import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { filterContent } from "./filter";
import {
  AUDIENCES,
  type Audience,
  type ContentCategory,
  type ContentItem,
} from "./loader";

// Property test for filter-by-type-and-audience correctness (task 5.5).
//
// Property 6: Filter by type and audience correctness — filterContent(items,
// type, audience) returns exactly the items matching BOTH the type selector and
// the audience selector; "all"/"all" returns the list unchanged.
// Validates: Requirements 21.7

const CATEGORIES: readonly ContentCategory[] = [
  "blog",
  "article",
  "paper",
  "report",
];

// Generators constrained to the real input space: types and audiences are drawn
// from the manifest unions, and selectors include the "all" sentinel.
const categoryArb = fc.constantFrom(...CATEGORIES);
const audienceArb = fc.constantFrom(...AUDIENCES);

const typeSelectorArb = fc.oneof(
  fc.constant<ContentCategory | "all">("all"),
  categoryArb,
);
const audienceSelectorArb = fc.oneof(
  fc.constant<Audience | "all">("all"),
  audienceArb,
);

// A minimal ContentItem: only the fields filterContent inspects (type,
// audienceTags) need to vary; the rest are filled with valid placeholders. The
// audienceTags set is a (possibly empty) subset of the three canonical audiences.
const itemArb: fc.Arbitrary<ContentItem> = fc.record({
  type: categoryArb,
  audienceTags: fc.subarray([...AUDIENCES]),
  slug: fc.string({ minLength: 1, maxLength: 8 }),
}).map(({ type, audienceTags, slug }) => ({
  slug,
  title: `Title ${slug}`,
  summary: `Summary ${slug}`,
  type,
  format: "markdown" as const,
  audienceTags,
  sourcePath: `Blog posts/${slug}.md`,
}));

describe("Property 6: Filter by type and audience correctness", () => {
  // Feature: witness-protocol-portal, Property 6: Filter by type and audience correctness
  it("returns exactly the items matching BOTH selectors, and all/all unchanged", () => {
    fc.assert(
      fc.property(
        fc.array(itemArb, { maxLength: 30 }),
        typeSelectorArb,
        audienceSelectorArb,
        (items, type, audience) => {
          const result = filterContent(items, type, audience);

          // Reference predicate: an item matches iff it satisfies BOTH selectors.
          const matches = (item: ContentItem) =>
            (type === "all" || item.type === type) &&
            (audience === "all" || item.audienceTags.includes(audience));

          const expected = items.filter(matches);

          // Exactly the matching items, in original order (no extras, none missing).
          expect(result).toEqual(expected);

          // Every returned item genuinely matches both selectors.
          for (const item of result) {
            expect(matches(item)).toBe(true);
          }

          // No matching item is dropped.
          expect(result).toHaveLength(expected.length);

          // "all"/"all" returns the list unchanged (same reference, untouched).
          if (type === "all" && audience === "all") {
            expect(result).toBe(items);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
