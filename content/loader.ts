// content/loader.ts
//
// Build-time content loader for the Witness Protocol Portal. This module reads
// the source folders, parses each markdown file, derives metadata, and emits the
// content manifest (see design.md "Content Loader").
//
// This file implements `deriveMetadata` (task 2.3) plus `loadAllContent`,
// `resolveAudienceTags`, and the markdown renderer (task 2.5). The asset-copy
// step (task 2.8) lands later and consumes the `assetPath` values catalogued here.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { fileNameToSlug, fileNameToTitle } from "./transforms";

/** Maximum summary length before truncation, in characters (Req 21.3). */
const SUMMARY_MAX = 200;

/**
 * Pull the first level-1 heading (`# Heading`) out of a markdown body, if any.
 * Matches a line that begins with exactly one `#` followed by whitespace, so
 * `## Subheading` is ignored. Trailing closing `#` (ATX style) are stripped.
 * Returns the trimmed heading text, or "" when no H1 is present.
 */
function firstH1(raw: string): string {
  const match = raw.match(/^#[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  return match ? match[1].trim() : "";
}

/**
 * Strip the inline markdown that would otherwise leak into a plain-text summary:
 * links/images collapse to their visible text, and emphasis/code markers drop.
 * Whitespace is collapsed so the result reads as a single tidy line.
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/[*_~`]+/g, "") // emphasis / code markers
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Find the first prose paragraph in a markdown body: the first run of contiguous
 * non-blank lines that is not a heading, list item, block quote, table row, or
 * code fence. Returns the joined, inline-stripped paragraph text, or "" when the
 * body has no prose (e.g. only headings).
 */
function leadingParagraph(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const collected: string[] = [];
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      if (collected.length > 0) break; // fence ends the paragraph we were building
      continue;
    }
    if (inFence) continue;

    const isStructural =
      trimmed === "" ||
      trimmed.startsWith("#") || // heading
      trimmed.startsWith(">") || // block quote
      trimmed.startsWith("|") || // table row
      /^([-*+]|\d+\.)\s/.test(trimmed); // list item

    if (isStructural) {
      if (collected.length > 0) break; // blank/structural line ends the paragraph
      continue; // still searching for the start of prose
    }

    collected.push(trimmed);
  }

  return stripInlineMarkdown(collected.join(" "));
}

/**
 * Truncate to at most SUMMARY_MAX characters, breaking on a word boundary and
 * appending an ellipsis. Shorter text is returned unchanged.
 */
function truncate(text: string): string {
  if (text.length <= SUMMARY_MAX) return text;

  const slice = text.slice(0, SUMMARY_MAX);
  const lastSpace = slice.lastIndexOf(" ");
  // Prefer a word boundary, but fall back to a hard cut if the first "word" is
  // already longer than the limit.
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s.,;:!?-]+$/, "") + "…";
}

/**
 * Derive a title and summary for a markdown document that lacks explicit
 * front-matter metadata (Req 21.3). The loader handles the front-matter
 * precedence; this works on the raw body and file name as a fallback.
 *
 * - title:   first H1 in the body, else the humanized file name.
 * - summary: the truncated leading prose paragraph, else the title.
 *
 * Both fields are guaranteed non-empty (`fileNameToTitle` never returns "",
 * and the summary falls back to the title), which Property 4 (task 2.4) checks.
 */
export function deriveMetadata(
  raw: string,
  fileName: string,
): { title: string; summary: string } {
  const heading = firstH1(raw);
  const title = heading !== "" ? heading : fileNameToTitle(fileName);

  const paragraph = leadingParagraph(raw);
  const summary = paragraph !== "" ? truncate(paragraph) : title;

  return { title, summary };
}

// ---------------------------------------------------------------------------
// Content manifest types (design.md "Data Models")
//
// The type/value definitions live in the node-free `./types` module so client
// components can import them without dragging `node:fs` into the browser bundle.
// They are re-exported here so existing `@/content/loader` imports keep working.
// ---------------------------------------------------------------------------

import {
  AUDIENCES,
  type Audience,
  type ContentCategory,
  type ContentItem,
  type LoadResult,
} from "./types";

export {
  AUDIENCES,
  type Audience,
  type ContentCategory,
  type ContentItem,
  type LoadResult,
};

/** Source folder → content category (Req 21.1). */
const FOLDERS: { dir: string; category: ContentCategory }[] = [
  { dir: "Blog posts", category: "blog" },
  { dir: "Articles and papers", category: "article" },
  { dir: "reports", category: "report" },
];

/**
 * Deliberate audience tags for PDF binaries. PDFs carry no front-matter, so
 * unlike markdown they cannot declare `Audience_Tags` themselves; this map is
 * their equivalent, keyed by exact file name. An unmapped PDF falls back to all
 * audiences so a newly-added binary stays broadly discoverable until curated.
 *
 * ponytail: a hand-maintained map is the lazy alternative to a sidecar metadata
 * file per PDF — add an entry when a PDF is added or its audience changes.
 * Upgrade path: per-file `.meta.json` sidecars if the set grows unwieldy.
 */
const PDF_AUDIENCE_TAGS: Record<string, Audience[]> = {
  "Architecting Moral Inheritance_ The Witness Protocol and the Shift from Behavioral Mimicry to Process-Supervised AI Alignment.pdf":
    ["researcher"],
  "Witness Protocol as High-Signal Alignment Data Infrastructure.pdf": [
    "researcher",
    "funder",
  ],
  "Witness Protocol in the AI Alignment Landscape.pdf": ["researcher", "funder"],
  "Witness_Protocol_Whitepaper_v0_9.pdf": ["researcher", "funder"],
  "witness-protocol-alignment-paper.pdf": ["researcher"],
};

// ---------------------------------------------------------------------------
// Audience tag resolution (Req 21.4, 21.5)
// ---------------------------------------------------------------------------

// Friendly aliases authors might write in front-matter, normalized to the union.
// The three canonical audiences each accept the older, finer-grained persona
// names as aliases (so content tagged before the 6→3 collapse still resolves):
//   contributor ← witnesses + invited professionals
//   researcher  ← researchers, philosophers, legal experts
//   funder      ← funders / investors
const AUDIENCE_ALIASES: Record<string, Audience> = {
  // Contributor — witnesses and invited professionals.
  contributor: "contributor",
  "potential-witness": "contributor",
  witness: "contributor",
  "potential-participant": "contributor",
  participant: "contributor",
  "invited-professional": "contributor",
  professional: "contributor",
  invited: "contributor",
  // Researcher — researchers, philosophers, and legal experts (study & scrutiny).
  researcher: "researcher",
  research: "researcher",
  scholar: "researcher",
  philosopher: "researcher",
  philosophy: "researcher",
  "legal-expert": "researcher",
  legal: "researcher",
  lawyer: "researcher",
  // Funder — funders / investors.
  funder: "funder",
  investor: "funder",
  funding: "funder",
};

/** Normalize one raw tag value to an Audience, or null when unrecognized. */
function normalizeAudience(value: string): Audience | null {
  const key = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return AUDIENCE_ALIASES[key] ?? null;
}

/** Find the Audience_Tags field tolerating key casing/separator variations. */
function findAudienceField(frontMatter: Record<string, unknown>): unknown {
  for (const [key, val] of Object.entries(frontMatter)) {
    if (key.toLowerCase().replace(/[\s_]+/g, "") === "audiencetags") return val;
  }
  return undefined;
}

/** Coerce a front-matter value into a flat list of candidate tag strings. */
function toStringList(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((v) => String(v));
  if (typeof raw === "string") return raw.split(/[,;]+/);
  return [];
}

/**
 * Read `Audience_Tags` from front-matter and normalize to the Audience union,
 * tolerating key variations (`audience_tags`, `audienceTags`), array or
 * comma/semicolon-string values, and friendly aliases (Req 21.4).
 *
 * ponytail: when no valid tag is declared, the default set is ALL THREE
 * audiences rather than a single catch-all. The catch-all alternative is one
 * line shorter but would leave two journeys unable to surface untagged content,
 * violating "remains discoverable through at least one Audience journey"
 * (Req 21.5) for everyone except the catch-all audience. Tagging broadly keeps
 * every item reachable from every journey; the upgrade path is per-folder
 * default sets if broad tagging proves too noisy for a given audience.
 */
export function resolveAudienceTags(
  frontMatter: Record<string, unknown>,
): Audience[] {
  const resolved = toStringList(findAudienceField(frontMatter))
    .map(normalizeAudience)
    .filter((a): a is Audience => a !== null);

  const unique = [...new Set(resolved)];
  return unique.length > 0 ? unique : [...AUDIENCES];
}

// ---------------------------------------------------------------------------
// Markdown rendering (Req 5.2 — preserve headings/paragraphs/lists/emphasis/
// links/blockquotes; sanitized). Property 1 (task 5.2) tests preservation.
// ---------------------------------------------------------------------------

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

/** Render a markdown body to sanitized HTML. All plugins are synchronous. */
export function renderMarkdown(body: string): string {
  return String(markdownProcessor.processSync(body));
}

// ---------------------------------------------------------------------------
// loadAllContent (Req 5.1, 6.1, 7.1, 5.5, 21.1, 21.2, 21.5, 21.6)
// ---------------------------------------------------------------------------

/** First non-empty string field among the given front-matter keys. */
function frontMatterString(
  data: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const val = data[key];
    if (typeof val === "string" && val.trim() !== "") return val.trim();
  }
  return undefined;
}

/** Resolve article-vs-paper from front-matter; other categories pass through. */
function resolveType(
  category: ContentCategory,
  data: Record<string, unknown>,
): ContentCategory {
  if (category !== "article") return category;
  const declared = frontMatterString(data, "type")?.toLowerCase();
  return declared === "paper" ? "paper" : "article";
}

/** Make a slug unique within the manifest by appending -2, -3, … on collision. */
function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;
  used.add(slug);
  return slug;
}

/**
 * Read the recognized source folders at build time and produce the content
 * manifest. Pure with respect to file bytes: the same files yield the same
 * items. Files that throw during parse go to `skipped` (Req 5.5) instead of
 * crashing the build; a missing folder is treated as empty with a warning.
 *
 * @param rootDir workspace root holding the source folders. Defaults to the
 *   process working directory (the Next.js build runs from the project root);
 *   the parameter exists so tests can point at a temp fixture directory.
 */
export function loadAllContent(rootDir: string = process.cwd()): LoadResult {
  const items: ContentItem[] = [];
  const skipped: { file: string; reason: string }[] = [];
  const usedSlugs = new Set<string>();

  for (const { dir, category } of FOLDERS) {
    const folderPath = path.join(rootDir, dir);

    if (!fs.existsSync(folderPath)) {
      console.warn(`[content] source folder missing, treating as empty: ${dir}`);
      continue;
    }

    const entries = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort(); // deterministic order so slug-collision suffixes are stable

    for (const fileName of entries) {
      const ext = path.extname(fileName).toLowerCase();
      const sourcePath = path.join(dir, fileName);

      // PDFs are catalogued as downloadable assets, not rendered (Req 6.2).
      if (ext === ".pdf") {
        items.push({
          slug: uniqueSlug(fileNameToSlug(fileName), usedSlugs),
          title: fileNameToTitle(fileName),
          summary: fileNameToTitle(fileName),
          type: category === "article" ? "paper" : category,
          format: "pdf",
          audienceTags: PDF_AUDIENCE_TAGS[fileName] ?? [...AUDIENCES], // curated map; unmapped binaries stay broadly discoverable
          sourcePath,
          assetPath: `/assets/${category}/${fileName}`,
        });
        continue;
      }

      // Only markdown is rendered; other files (e.g. PNGs in reports/) belong
      // to the media pipeline and are ignored here, not flagged as skipped.
      if (ext !== ".md" && ext !== ".markdown") continue;

      try {
        const raw = fs.readFileSync(path.join(folderPath, fileName), "utf8");
        // ponytail: pass an options object so gray-matter (4.0.3) skips its
        // content cache. That cache stores the file object BEFORE parseMatter
        // runs, so a thrown parse (malformed YAML) leaves a poisoned, unparsed
        // entry; a later call with identical content then returns it as valid
        // empty front-matter instead of throwing — silently publishing a
        // malformed file. Any truthy options disables the cache path entirely.
        const { data, content } = matter(raw, {});

        const derived = deriveMetadata(content, fileName);
        const title = frontMatterString(data, "title") ?? derived.title;
        const summary =
          frontMatterString(data, "summary", "description") ?? derived.summary;

        items.push({
          slug: uniqueSlug(fileNameToSlug(fileName), usedSlugs),
          title,
          summary,
          type: resolveType(category, data),
          format: "markdown",
          audienceTags: resolveAudienceTags(data),
          author: frontMatterString(data, "author"),
          date: frontMatterString(data, "date"),
          sourcePath,
          bodyHtml: renderMarkdown(content),
        });
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        skipped.push({ file: sourcePath, reason });
        console.warn(`[content] skipped unparseable file: ${sourcePath} — ${reason}`);
      }
    }
  }

  // Tag-coverage check: warn for any audience with zero tagged items (Req 21.6).
  const covered = new Set<Audience>();
  for (const item of items) for (const tag of item.audienceTags) covered.add(tag);
  const audienceWarnings = AUDIENCES.filter((a) => !covered.has(a));
  for (const a of audienceWarnings) {
    console.warn(`[content] no content tagged for audience journey: ${a}`);
  }

  return { items, skipped, audienceWarnings };
}
