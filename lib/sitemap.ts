// lib/sitemap.ts
//
// Published-URL enumeration for the Portal sitemap (Req 20.4).
//
// The sitemap must list EXACTLY the published pages — none omitted, none extra
// (Property 17). Published pages are of two kinds:
//
//   1. Static routes — pages with a fixed path (`app/.../page.tsx`, no dynamic
//      `[param]` segment). These are listed explicitly in STATIC_ROUTES below.
//      The companion `lib/sitemap.test.ts` scans `app/` and fails if this list
//      drifts from the routes that actually exist (so "none omitted, none
//      extra" stays true as pages are added or removed).
//   2. Content routes — one page per published ContentItem in the build-time
//      manifest. These are DERIVED from `loadAllContent()` rather than
//      re-listed, so the sitemap stays in lockstep with the content pipeline:
//      markdown items render at `/library/{slug}` and PDF items at
//      `/library/pdf/{slug}`, matching the two dynamic routes' generateStaticParams.
//
// This module is pure with respect to the manifest and the static list, so it
// is testable without rendering anything.

import { loadAllContent } from "@/content/loader";

/**
 * The Portal's own public origin, used to form absolute sitemap URLs. Sourced
 * from env with a production default so the build works without configuration.
 *
 * ponytail: hardcoded production default; a wrong origin ships if the env is
 * unset in a non-production environment. Upgrade path: set NEXT_PUBLIC_SITE_URL
 * per deployment (documented in `.env.example`). Trailing slashes are trimmed
 * so `siteUrl` joins cleanly.
 */
const DEFAULT_SITE_URL = "https://twpf.online";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/+$/, "");

/**
 * Static (fixed-path) published routes. Each MUST correspond to an existing
 * `app/.../page.tsx` with no dynamic segment. Dynamic content routes
 * (`/library/[slug]`, `/library/pdf/[slug]`) are intentionally NOT listed here
 * — they are derived from the content manifest in `publishedPaths`.
 *
 * Kept in canonical, stable order so the emitted sitemap is deterministic.
 */
export const STATIC_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/library",
  "/media/infographics",
  "/media/videos",
  "/media/slides",
  "/demos/inquisitor",
  "/demos/provenance",
  "/demos/revocation",
  "/demos/gate",
  "/participate",
  "/fund",
  "/contact",
  "/legal",
  "/privacy",
];

/** Join the site origin with a root-relative path into one absolute URL. */
export function siteUrl(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Every published page path, exactly: the static routes plus one content route
 * per ContentItem in the manifest (markdown → `/library/{slug}`, PDF →
 * `/library/pdf/{slug}`). Reuses `loadAllContent` rather than re-deriving URLs,
 * so it cannot drift from what the dynamic routes actually generate.
 *
 * @param rootDir workspace root for the content loader; defaults to the build
 *   working directory. Overridable so the self-check can target a fixture.
 */
export function publishedPaths(rootDir?: string): string[] {
  const { items } = loadAllContent(rootDir);
  const contentPaths = items.map((item) =>
    item.format === "pdf"
      ? `/library/pdf/${item.slug}`
      : `/library/${item.slug}`,
  );
  return [...STATIC_ROUTES, ...contentPaths];
}
