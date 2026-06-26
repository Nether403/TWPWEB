"use client";

// app/library/content-index.tsx
//
// Client component for the Content_Index (task 5.3). Receives the full manifest
// from the statically-rendered page and filters it in the browser via the shared
// pure `filterContent` (content/filter.ts) — no refetch, no server round-trip.

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AUDIENCES,
  type Audience,
  type ContentCategory,
  type ContentItem,
} from "@/content/types";
import { filterContent } from "@/content/filter";

// Type selector options (Req 7.3, 21.7). Values match ContentCategory exactly.
const TYPES: readonly ContentCategory[] = ["blog", "article", "paper", "report"];

// Human-readable audience labels for the control; values stay the Audience union.
const AUDIENCE_LABELS: Record<Audience, string> = {
  "potential-witness": "Potential Witness",
  "invited-professional": "Invited Professional",
  researcher: "Researcher",
  philosopher: "Philosopher",
  "legal-expert": "Legal Expert",
  investor: "Investor",
};

/** Destination route for an item: PDFs preview, markdown renders (Req 6.2). */
function itemHref(item: ContentItem): string {
  return item.format === "pdf"
    ? `/library/pdf/${item.slug}`
    : `/library/${item.slug}`;
}

export function ContentIndex({ items }: { items: ContentItem[] }) {
  const [type, setType] = useState<ContentCategory | "all">("all");
  const [audience, setAudience] = useState<Audience | "all">("all");

  const filtered = useMemo(
    () => filterContent(items, type, audience),
    [items, type, audience],
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Filter controls (Req 21.7): by type AND by audience. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Type
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContentCategory | "all")}
            className="border border-border bg-bg px-3 py-2 text-fg"
          >
            <option value="all">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Audience
          </span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience | "all")}
            className="border border-border bg-bg px-3 py-2 text-fg"
          >
            <option value="all">All audiences</option>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABELS[a]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-base leading-relaxed text-muted">
          No content matches the selected filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-px border border-border bg-border">
          {filtered.map((item) => (
            <li key={item.slug} className="bg-bg">
              <Link
                href={itemHref(item)}
                className="group flex flex-col gap-2 px-6 py-6 hover:bg-border/30"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-heading text-xl tracking-wide text-fg">
                    {item.title}
                  </span>
                  {/* Type label equal to the item's `type` (Req 6.3, 7.2,
                      Property 5). CSS uppercases for display; textContent stays
                      the literal type string. */}
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
                    {item.type}
                  </span>
                </span>
                <span className="text-base leading-relaxed text-muted">
                  {item.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
