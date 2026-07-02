import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  loadAllContent,
  AUDIENCES,
  type Audience,
  type ContentItem,
  type ContentCategory,
} from "@/content/loader";
import { AUDIENCE_CONFIG } from "@/lib/audiences";

// Property test for page metadata uniqueness (task 12.2).
//
// Property 16: Page metadata uniqueness — for any set of generated pages
// derived from the content manifest, every page has a non-empty title and a
// non-empty meta description, and all page titles are pairwise unique.
// Validates: Requirements 20.2
//
// Task 12.1 implemented per-page metadata via the Next.js Metadata API:
//   - static routes export `const metadata` (fixed title + description);
//   - the dynamic content routes /library/[slug] and /library/pdf/[slug] derive
//     `${item.title} — The Witness Protocol` + `item.summary` from the manifest;
//   - the dynamic /audience/[audience] route derives
//     `${AUDIENCE_CONFIG[a].title} — The Witness Protocol` + `config.intro`.
//
// This test collects the metadata for ALL generated pages (static + the dynamic
// pages derived from a manifest) and asserts the three invariants. The dynamic
// derivations below mirror the route handlers exactly; the audience derivation
// reuses the real AUDIENCE_CONFIG and the content derivation reuses the real
// manifest shape, so they cannot drift from what the routes generate.

interface PageMeta {
  // The route the page is served at — used only to make assertion failures
  // legible; uniqueness is asserted on `title`, not `path`.
  path: string;
  title: string;
  description: string;
}

const SITE = "The Witness Protocol";

/**
 * Static (fixed-path) pages and the exact title + description each route's
 * `export const metadata` declares (task 12.1). Maintained here the same way
 * `lib/sitemap.ts` maintains STATIC_ROUTES: a hand-kept mirror of the routes,
 * kept in sync when a static page is added or its metadata changes. The landing
 * title is intentionally distinct from the "{title} — The Witness Protocol"
 * pattern so it never collides with a content/audience page (see app/page.tsx).
 */
const STATIC_PAGES: readonly PageMeta[] = [
  {
    path: "/",
    title: "The Witness Protocol — Moral-Reasoning Testimony for AI Alignment",
    description:
      "The Witness Protocol is a first-party, consented corpus of high-signal human moral-reasoning testimony, built as an evaluation substrate for AI alignment. Explore the research library, demonstrations, and how to take part.",
  },
  {
    path: "/about",
    title: "About & Methodology — The Witness Protocol",
    description:
      "What the Witness Protocol is and how it works: the Gate vetting pipeline, the Inquisitor dialogue engine, model-usable alignment outputs, and privacy by architecture — plus the Foundation behind it.",
  },
  {
    path: "/library",
    title: "Library — The Witness Protocol",
    description:
      "The Witness Protocol research library — blog posts, articles, papers, and reports, filterable by type and audience.",
  },
  {
    path: "/legal",
    title: "Legal — The Witness Protocol",
    description:
      "Legal notice for The Witness Protocol Foundation initiative: the entity status, non-commercial nature of contributions, use of site content, and disclaimers.",
  },
  {
    path: "/privacy",
    title: "Privacy — The Witness Protocol",
    description:
      "How the Witness Protocol Portal handles data (almost none), and how the wider Protocol protects witness testimony: separation of identity from testimony, de-identification, tamper-evidence, and consent revocation.",
  },
  {
    path: "/media/infographics",
    title: "Infographics — The Witness Protocol",
    description:
      "Infographics illustrating the Witness Protocol architecture and alignment pipeline.",
  },
  {
    path: "/media/videos",
    title: "Videos — The Witness Protocol",
    description:
      "Video explainers of the Witness Protocol and its alignment methodology.",
  },
  {
    path: "/media/slides",
    title: "Slides — The Witness Protocol",
    description: "Slide decks presenting the Witness Protocol.",
  },
  {
    path: "/demos/inquisitor",
    title: "Inquisitor Comparator — The Witness Protocol",
    description:
      "A side-by-side comparison of a standard LLM response and a G_5.2 Inquisitor response, with a link out to the real Inquisitor on the Platform.",
  },
  {
    path: "/demos/provenance",
    title: "Provenance Explorer — The Witness Protocol",
    description:
      "A simulated, stepwise trace of a testimony record's cryptographic provenance.",
  },
  {
    path: "/demos/revocation",
    title: "Revocation Simulator — The Witness Protocol",
    description:
      "A simulated demonstration of the consent revocation cascade across the split-plane boundary.",
  },
  {
    path: "/demos/gate",
    title: "Gate Self-Assessment — The Witness Protocol",
    description:
      "A simulated, non-binding self-assessment of draft testimony against the Gate's specificity, counterfactual, and relational thresholds. The real, formal submission lives on the Platform.",
  },
  {
    path: "/participate",
    title: "Participate — The Witness Protocol",
    description:
      "How to take part in the Witness Protocol. Participation, the reviewer packet, and consent all happen on the live Platform.",
  },
  {
    path: "/fund",
    title: "Fund the Foundation — The Witness Protocol",
    description:
      "Support the Witness Protocol Foundation with a donation. Cash and token contributions are gifts to a non-commercial research mission — never an investment.",
  },
  {
    path: "/contact",
    title: "Contact — The Witness Protocol",
    description:
      "Send a general message to The Witness Protocol Foundation initiative. For testimony, the reviewer packet, participation, or consent, the Portal hands you off to the live Platform.",
  },
];

/** Audience pages, derived from the real AUDIENCE_CONFIG exactly as the route does. */
function audiencePages(): PageMeta[] {
  return AUDIENCES.map((a: Audience) => {
    const config = AUDIENCE_CONFIG[a];
    return {
      path: `/audience/${a}`,
      title: `${config.title} — ${SITE}`,
      description: config.intro,
    };
  });
}

/**
 * Content pages, derived from a manifest exactly as the /library/[slug] and
 * /library/pdf/[slug] routes do: title = `${item.title} — The Witness Protocol`,
 * description = item.summary. PDFs preview under /library/pdf/, markdown under
 * /library/.
 */
function contentPages(items: ContentItem[]): PageMeta[] {
  return items.map((item) => ({
    path:
      item.format === "pdf"
        ? `/library/pdf/${item.slug}`
        : `/library/${item.slug}`,
    title: `${item.title} — ${SITE}`,
    description: item.summary,
  }));
}

/** The complete set of generated pages for a given content manifest. */
function allPages(items: ContentItem[]): PageMeta[] {
  return [...STATIC_PAGES, ...audiencePages(), ...contentPages(items)];
}

/** Assert Property 16 over a set of pages: non-empty fields + unique titles. */
function assertMetadataUniqueness(pages: PageMeta[]): void {
  for (const page of pages) {
    expect(page.title.trim(), `empty title for ${page.path}`).not.toBe("");
    expect(
      page.description.trim(),
      `empty description for ${page.path}`,
    ).not.toBe("");
  }
  const titles = pages.map((p) => p.title);
  // Pairwise unique <=> the deduplicated set has the same size as the list.
  expect(new Set(titles).size, "duplicate page titles").toBe(titles.length);
}

// A ContentItem generator focused on the fields page metadata reads (slug,
// title, summary, format). Titles are made unique-by-index, modeling the
// realistic corpus contract: distinct published documents carry distinct
// titles, and the slug is the structural unique key (the loader already
// dedups slugs). The "Document {i}:" prefix also keeps generated content
// titles disjoint from the fixed static/audience titles, so the assertion
// still genuinely tests that the static and audience title sets are internally
// unique and never collide with the content-page "{title} — ..." pattern.
//
// ponytail: this assumes no two source documents share an exact title. If they
// ever did, their <title> tags would collide (Req 20.2). Upgrade path:
// disambiguate content page titles by the already-unique slug.
const CATEGORIES: ContentCategory[] = ["blog", "article", "paper", "report"];

const itemSeedArb = fc.record({
  titleBase: fc.string({ maxLength: 40 }),
  summaryBase: fc.string({ maxLength: 80 }),
  format: fc.constantFrom<"markdown" | "pdf">("markdown", "pdf"),
  category: fc.constantFrom(...CATEGORIES),
  tags: fc.subarray([...AUDIENCES], { minLength: 1 }),
});

describe("Property 16: Page metadata uniqueness", () => {
  // Feature: witness-protocol-portal, Property 16: Page metadata uniqueness
  it("every generated page (static + audience + content) has a non-empty title and description, and all titles are unique — across arbitrary manifests", () => {
    fc.assert(
      fc.property(fc.array(itemSeedArb, { maxLength: 20 }), (seeds) => {
        const items: ContentItem[] = seeds.map((seed, i) => {
          const titleBase = seed.titleBase.trim();
          const summaryBase = seed.summaryBase.trim();
          return {
            // Unique slug (the loader's structural guarantee).
            slug: `doc-${i}`,
            // Unique, non-empty title modeling a distinct document.
            title: `Document ${i}: ${titleBase || "Untitled"}`,
            // Non-empty summary (the loader guarantees this).
            summary: summaryBase || `Summary for document ${i}.`,
            type: seed.category,
            format: seed.format,
            audienceTags: seed.tags as Audience[],
            sourcePath: `generated/doc-${i}`,
            ...(seed.format === "pdf"
              ? { assetPath: `/assets/${seed.category}/doc-${i}.pdf` }
              : { bodyHtml: "<p>body</p>" }),
          };
        });

        assertMetadataUniqueness(allPages(items));
      }),
      { numRuns: 200 },
    );
  });

  // Real-output check: the ACTUAL deployed pages (the live static routes, the
  // six audience pages, and one page per item in the real content manifest)
  // must satisfy Property 16. This is the evidence that the shipped site meets
  // Req 20.2, not just that the derivation is injective over synthetic input.
  it("the real generated site (static + audience + real manifest) satisfies the property", () => {
    const { items } = loadAllContent();
    expect(items.length, "expected a non-empty real content manifest").toBeGreaterThan(0);
    assertMetadataUniqueness(allPages(items));
  });
});
