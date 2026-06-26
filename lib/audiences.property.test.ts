// lib/audiences.property.test.ts
//
// Property test for the Audience_Router journey config and tag-based content
// surfacing (task 7.3).
//
// Property 9 has two halves:
//   (a) Journey invariant — each of the six audiences resolves a distinct
//       AudienceConfig (distinct ids AND distinct titles) carrying at least one
//       CTA (Req 4.1, 4.2).
//   (b) Tag-based surfacing — for any array of ContentItems and any audience,
//       contentForAudience(items, audience) returns EXACTLY the items whose
//       audienceTags include that audience, in order, without mutating the input
//       (Req 4.3, surfacing per Audience_Tag membership, Req 21.5).

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  AUDIENCE_CONFIG,
  contentForAudience,
  type AudienceConfig,
} from "@/lib/audiences";
import {
  AUDIENCES,
  type Audience,
  type ContentItem,
  type ContentCategory,
} from "@/content/loader";

// --- Part (a): static journey invariant ------------------------------------

describe("Property 9 (a): audience journey invariant", () => {
  // Feature: witness-protocol-portal, Property 9: Audience journey invariant and tag-based surfacing
  it("resolves a distinct config with at least one CTA for each of the six audiences", () => {
    // There are exactly six canonical audiences (Req 4.1, 21.6).
    expect(AUDIENCES.length).toBe(6);

    const configs: AudienceConfig[] = AUDIENCES.map((a) => {
      const config = AUDIENCE_CONFIG[a];
      // Every audience resolves to a config keyed by its own id.
      expect(config).toBeDefined();
      expect(config.id).toBe(a);
      // At least one CTA per audience (Req 4.2).
      expect(config.ctas.length).toBeGreaterThanOrEqual(1);
      // Each CTA is well-formed (non-empty label + href).
      for (const cta of config.ctas) {
        expect(cta.label.trim().length).toBeGreaterThan(0);
        expect(cta.href.trim().length).toBeGreaterThan(0);
      }
      return config;
    });

    // Configs are distinct: ids and titles are pairwise unique.
    const ids = configs.map((c) => c.id);
    const titles = configs.map((c) => c.title);
    expect(new Set(ids).size).toBe(AUDIENCES.length);
    expect(new Set(titles).size).toBe(AUDIENCES.length);
  });
});

// --- Part (b): tag-based surfacing ------------------------------------------

const CATEGORIES: ContentCategory[] = ["blog", "article", "paper", "report"];

// A ContentItem arbitrary. Only `audienceTags` drives contentForAudience, so the
// other fields are kept minimal but type-faithful. audienceTags is a (possibly
// empty) subset of the six audiences with no duplicates, mirroring the loader's
// output shape.
const contentItem: fc.Arbitrary<ContentItem> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 12 }),
  title: fc.string({ maxLength: 20 }),
  summary: fc.string({ maxLength: 20 }),
  type: fc.constantFrom(...CATEGORIES),
  format: fc.constantFrom("markdown" as const, "pdf" as const),
  audienceTags: fc
    .subarray([...AUDIENCES] as Audience[])
    .map((tags) => [...new Set(tags)]),
  sourcePath: fc.string({ minLength: 1, maxLength: 20 }),
});

const items = fc.array(contentItem, { maxLength: 20 });
const anyAudience = fc.constantFrom(...AUDIENCES);

describe("Property 9 (b): tag-based surfacing", () => {
  // Feature: witness-protocol-portal, Property 9: Audience journey invariant and tag-based surfacing
  it("returns exactly the items whose audienceTags include the audience, order preserved, input untouched", () => {
    fc.assert(
      fc.property(items, anyAudience, (list, audience) => {
        const snapshot = JSON.stringify(list);
        const result = contentForAudience(list, audience);

        // Exactly the matching items, in original order (filter preserves order).
        const expected = list.filter((it) => it.audienceTags.includes(audience));
        expect(result).toEqual(expected);

        // Every returned item genuinely carries the tag; nothing extra slips in.
        for (const it of result) {
          expect(it.audienceTags).toContain(audience);
        }
        // No matching item is dropped: returned count equals the true match count.
        expect(result.length).toBe(
          list.filter((it) => it.audienceTags.includes(audience)).length,
        );

        // Pure: the input array is not mutated.
        expect(JSON.stringify(list)).toBe(snapshot);
      }),
      { numRuns: 200 },
    );
  });
});
