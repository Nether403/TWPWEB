// lib/sitemap.test.ts
//
// Guards the sitemap enumeration (Req 20.4): the published-path list must equal
// EXACTLY the static routes plus the manifest content routes — none omitted,
// none extra. The static-route drift guard independently scans `app/` so the
// list in `lib/sitemap.ts` cannot silently fall out of sync with the routes
// that actually exist.

import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { loadAllContent } from "@/content/loader";
import {
  STATIC_ROUTES,
  publishedPaths,
  siteUrl,
  SITE_URL,
} from "@/lib/sitemap";

const APP_DIR = path.join(process.cwd(), "app");

/**
 * Independently discover the static (fixed-path) page routes under `app/` by
 * scanning for `page.tsx` files, skipping dynamic `[param]` segments, route
 * groups `(group)`, and the `api/` tree (route handlers are not pages).
 */
function scanStaticPageRoutes(dir: string, segments: string[] = []): string[] {
  const routes: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile()) {
      if (/^page\.(t|j)sx?$/.test(entry.name)) {
        const route = "/" + segments.join("/");
        routes.push(route === "/" ? "/" : route);
      }
      continue;
    }
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name === "api") continue; // route handlers, not pages
    if (name.startsWith("[")) continue; // dynamic — covered by the manifest
    const nextSegments = name.startsWith("(") ? segments : [...segments, name]; // route groups don't add a path segment
    routes.push(...scanStaticPageRoutes(path.join(dir, name), nextSegments));
  }
  return routes;
}

describe("sitemap enumeration", () => {
  it("STATIC_ROUTES matches exactly the static page routes under app/ (no drift)", () => {
    const discovered = scanStaticPageRoutes(APP_DIR).sort();
    expect([...STATIC_ROUTES].sort()).toEqual(discovered);
  });

  it("publishedPaths lists exactly the static routes plus the manifest content routes", () => {
    const { items } = loadAllContent();
    const expectedContent = items.map((item) =>
      item.format === "pdf"
        ? `/library/pdf/${item.slug}`
        : `/library/${item.slug}`,
    );
    const expected = [...STATIC_ROUTES, ...expectedContent].sort();

    const actual = publishedPaths().sort();

    expect(actual).toEqual(expected);
    // none extra / none omitted ⇒ counts agree with no duplicates
    expect(new Set(actual).size).toBe(actual.length);
    expect(actual.length).toBe(STATIC_ROUTES.length + items.length);
  });

  it("every published path resolves to an absolute URL under the site origin", () => {
    for (const p of publishedPaths()) {
      expect(siteUrl(p)).toBe(`${SITE_URL}${p}`);
      expect(siteUrl(p).startsWith("https://")).toBe(true);
    }
  });
});
