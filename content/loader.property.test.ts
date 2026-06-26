import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { deriveMetadata } from "./loader";

// Property test for metadata derivation (task 2.4).
//
// deriveMetadata is the front-matter-less fallback: given a raw markdown body
// and a file name, it must always return a non-empty title and a non-empty
// summary (Req 21.3). Title comes from the first H1 or the humanized file name;
// summary comes from the truncated leading prose paragraph or falls back to the
// title. We generate markdown bodies that lack front-matter across the full
// shape space — with/without an H1, with/without prose, empty, only-heading,
// and very long paragraphs — paired with arbitrary file names.

// A single line's worth of inline text. We mix printable-ASCII and unicode to
// exercise mixed case, digits, accents, and emphasis markers; newlines are
// stripped so a generated "line" never silently splits into several.
const inlineText = fc
  .oneof(
    fc.string({ maxLength: 40 }),
    fc.string({ unit: "grapheme", maxLength: 40 }),
  )
  .map((s) => s.replace(/[\r\n]/g, " "));

// Markdown line kinds spanning prose and every structural element the summary
// extractor must skip over (headings, sub-headings, lists, block quotes, blank
// lines). H1 lines feed the title path; prose lines feed the summary path.
const h1Line = inlineText.map((t) => `# ${t}`);
const h2Line = inlineText.map((t) => `## ${t}`);
const proseLine = inlineText;
const listLine = inlineText.map((t) => `- ${t}`);
const quoteLine = inlineText.map((t) => `> ${t}`);
const blankLine = fc.constant("");

const anyLine = fc.oneof(
  proseLine,
  h1Line,
  h2Line,
  listLine,
  quoteLine,
  blankLine,
);

// A general mixed body: any interleaving of the line kinds above.
const mixedBody = fc
  .array(anyLine, { maxLength: 12 })
  .map((lines) => lines.join("\n"));

// An only-heading body: headings and blank lines, no prose paragraph at all,
// which forces the summary to fall back to the title.
const onlyHeadingBody = fc
  .array(fc.oneof(h1Line, h2Line, blankLine), { minLength: 1, maxLength: 6 })
  .map((lines) => lines.join("\n"));

// A long paragraph that exceeds the summary truncation threshold (~200 chars).
const longParagraphBody = fc
  .array(inlineText.filter((t) => t.trim().length > 0), {
    minLength: 30,
    maxLength: 60,
  })
  .map((words) => words.join(" "));

// The full body space, including explicitly empty and heading-only bodies.
const rawBody = fc.oneof(
  fc.constant(""),
  mixedBody,
  onlyHeadingBody,
  longParagraphBody,
);

// Arbitrary file names: a stem (possibly empty, exercising the "Untitled"
// fallback) made of words and separators, plus an optional extension.
const fileNameWord = fc
  .oneof(fc.string({ maxLength: 10 }), fc.string({ unit: "grapheme", maxLength: 10 }))
  .map((s) => s.replace(/[.\\/]/g, ""));
const fileNameSep = fc.constantFrom("_", "-", "__", "--", " ");
const fileNameStem = fc
  .array(fc.oneof(fileNameWord, fileNameSep), { maxLength: 8 })
  .map((tokens) => tokens.join(""));
const fileExt = fc
  .option(fc.constantFrom("md", "mdx", "markdown", "txt"), { nil: "" })
  .map((ext) => (ext ? `.${ext}` : ""));
const fileName = fc.tuple(fileNameStem, fileExt).map(([s, e]) => `${s}${e}`);

describe("Property 4: metadata derivation", () => {
  // Feature: witness-protocol-portal, Property 4: Metadata derivation
  it("returns a non-empty title and non-empty summary for docs lacking front-matter", () => {
    fc.assert(
      fc.property(rawBody, fileName, (raw, name) => {
        const { title, summary } = deriveMetadata(raw, name);

        expect(title.trim().length).toBeGreaterThan(0);
        expect(summary.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 200 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3: Malformed files are excluded and logged (task 2.7).
//
// For any set of files mixing well-formed and unparseable markdown,
// loadAllContent returns published items only for the well-formed files, and
// its `skipped` list names exactly the unparseable files (Req 5.5).
//
// We generate file specs each tagged well-formed or malformed, write them to a
// throwaway fixture tree spread across the three recognized source folders, run
// the real loader, and check the two sets exactly: published markdown items map
// to the well-formed source paths, and `skipped` maps to the malformed ones.
// ---------------------------------------------------------------------------
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadAllContent } from "./loader";

// The three recognized source folders (loader FOLDERS), used round-robin so the
// property exercises exclusion across every folder, not just one.
const SOURCE_FOLDERS = ["Blog posts", "Articles and papers", "reports"] as const;

// Well-formed markdown: optional VALID front-matter, then a body that always
// starts with "# Doc" so it can never be mistaken for a front-matter fence.
// Arbitrary prose lines are harmless — only the YAML parse can throw.
const proseBody = fc
  .array(fc.string({ maxLength: 40 }).map((s) => s.replace(/[\r\n]/g, " ")), {
    maxLength: 6,
  })
  .map((lines) => lines.join("\n"));

const wellFormedFile = fc.record({
  malformed: fc.constant(false),
  content: fc
    .tuple(
      fc.option(
        fc.constant("---\ntitle: Valid Title\nAudience_Tags: [researcher]\n---\n"),
        { nil: "" },
      ),
      proseBody,
    )
    .map(([frontMatter, body]) => `${frontMatter}# Doc\n\n${body}`),
});

// Unparseable markdown: a front-matter block whose YAML is invalid, so
// gray-matter throws during parse and the loader routes the file to `skipped`.
// Each snippet is independently invalid YAML (unterminated quote/flow
// collection, illegal nested mapping value).
const badYaml = fc.constantFrom(
  'title: "unterminated',
  "name: 'unterminated",
  "tags: [1, 2",
  "map: {a: 1",
  "a: b: c",
);

const malformedFile = fc.record({
  malformed: fc.constant(true),
  content: badYaml.map((yaml) => `---\n${yaml}\n---\nbody text`),
});

const fileSpecs = fc.array(fc.oneof(wellFormedFile, malformedFile), {
  maxLength: 12,
});

describe("Property 3: malformed files are excluded and logged", () => {
  // Feature: witness-protocol-portal, Property 3: Malformed files are excluded and logged
  let nonce = 0; // monotonic, makes every written file's bytes globally unique
  it("publishes only well-formed files; `skipped` names exactly the unparseable ones", () => {
    fc.assert(
      fc.property(fileSpecs, (specs) => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), "twp-malformed-"));
        try {
          for (const folder of SOURCE_FOLDERS) {
            fs.mkdirSync(path.join(root, folder));
          }

          // Write each spec to a uniquely named .md file, round-robin across
          // folders, and record where each well-formed / malformed file landed.
          const expectedPublished = new Set<string>();
          const expectedSkipped = new Set<string>();

          specs.forEach((spec, i) => {
            const folder = SOURCE_FOLDERS[i % SOURCE_FOLDERS.length];
            const fileName = `doc-${i}.md`;
            const sourcePath = path.join(folder, fileName); // loader records this
            // Append a globally-unique marker so every file's bytes are distinct.
            // The loader now disables gray-matter's content cache (see loader.ts),
            // so duplicate malformed content already parses deterministically; the
            // nonce is kept as cheap defence-in-depth against any future caching.
            const unique = `${spec.content}\n<!-- ${nonce++} -->`;
            fs.writeFileSync(path.join(root, folder, fileName), unique);
            (spec.malformed ? expectedSkipped : expectedPublished).add(sourcePath);
          });

          const { items, skipped } = loadAllContent(root);

          const publishedPaths = new Set(
            items.filter((i) => i.format === "markdown").map((i) => i.sourcePath),
          );
          const skippedPaths = new Set(skipped.map((s) => s.file));

          // Published items correspond exactly to the well-formed files...
          expect(publishedPaths).toEqual(expectedPublished);
          // ...and `skipped` names exactly the unparseable files.
          expect(skippedPaths).toEqual(expectedSkipped);
          // The two sets are disjoint and together account for every file.
          expect(skippedPaths.size + publishedPaths.size).toBe(specs.length);
        } finally {
          fs.rmSync(root, { recursive: true, force: true });
        }
      }),
      { numRuns: 100 },
    );
  });
});
