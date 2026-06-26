import type { MetadataRoute } from "next";
import { publishedPaths, siteUrl } from "@/lib/sitemap";

/**
 * Portal sitemap (Req 20.4). Next.js App Router serves this at `/sitemap.xml`,
 * generated at build time.
 *
 * It lists EXACTLY the published page URLs — the static routes plus one entry
 * per ContentItem in the build-time manifest (markdown at `/library/{slug}`,
 * PDFs at `/library/pdf/{slug}`). All enumeration lives in `lib/sitemap.ts`
 * (reusing the content loader); this file only maps those paths to sitemap
 * entries, so the sitemap can never list a route the manifest doesn't publish
 * or omit one it does (Property 17).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return publishedPaths().map((path) => ({
    url: siteUrl(path),
    // The home page is the primary entry point; content/section pages rank below it.
    priority: path === "/" ? 1 : 0.7,
    changeFrequency: "monthly",
  }));
}
