// content/filter.ts
//
// Pure client-side filtering for the Content_Index (`/library`). Kept in its own
// module so both the index page and the Property 6 test (task 5.5) import the
// same function. Reuses the manifest types from the loader — no re-definition.

import type { Audience, ContentCategory, ContentItem } from "./types";

/**
 * Return exactly the items matching BOTH selectors (Req 21.7):
 *   - type:     the item's `type` equals `type`, or `type` is "all"
 *   - audience: the item's `audienceTags` include `audience`, or `audience` is "all"
 *
 * Selecting "all"/"all" matches every item, so the original list is returned
 * unchanged (Property 6). The input array is never mutated.
 */
export function filterContent(
  items: ContentItem[],
  type: ContentCategory | "all",
  audience: Audience | "all",
): ContentItem[] {
  if (type === "all" && audience === "all") return items;

  return items.filter(
    (item) =>
      (type === "all" || item.type === type) &&
      (audience === "all" || item.audienceTags.includes(audience)),
  );
}
