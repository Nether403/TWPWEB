// content/types.ts
//
// Pure content-manifest types and the canonical Audience list. Kept free of any
// node-only imports (no `node:fs`, no markdown toolchain) so it is safe to import
// from BOTH the build-time loader (server) and `"use client"` components such as
// the Content_Index. `content/loader.ts` re-exports everything here, so existing
// `@/content/loader` imports keep working unchanged.

export type ContentCategory = "blog" | "article" | "paper" | "report";

export type Audience = "contributor" | "researcher" | "funder";

/**
 * The three audience journeys, in canonical order (Req 4.1, 21.6).
 *
 * These collapse the earlier six personas into the three real destinations the
 * site actually serves: contribute testimony (witnesses + invited
 * professionals), study & scrutinize the work (researchers, philosophers, legal
 * experts), and fund the mission (funders/investors). The older, finer-grained
 * persona names remain accepted as front-matter aliases in the loader, so
 * existing tagged content keeps surfacing under the right journey.
 */
export const AUDIENCES: readonly Audience[] = [
  "contributor",
  "researcher",
  "funder",
];

export interface ContentItem {
  slug: string;
  title: string;
  summary: string;
  type: ContentCategory;
  format: "markdown" | "pdf";
  audienceTags: Audience[];
  author?: string;
  date?: string;
  sourcePath: string;
  assetPath?: string;
  bodyHtml?: string;
}

export interface LoadResult {
  items: ContentItem[];
  skipped: { file: string; reason: string }[]; // recorded in build log (Req 5.5)
  audienceWarnings: Audience[]; // audiences with zero tagged items (Req 21.6)
}
