import { describe, it, expect } from "vitest";
import fc from "fast-check";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadAllContent, AUDIENCES } from "./loader";

// Property test for loader completeness (task 2.6).
//
// Property 2: Loader completeness — given a set of well-formed markdown files in
// the recognized source folders ("Blog posts", "Articles and papers", "reports"),
// loadAllContent produces exactly one published ContentItem per file, each with a
// unique slug and a non-empty audienceTags set (explicit from front-matter, or the
// default set when none is declared).
// Validates: Requirements 5.1, 6.1, 7.1, 21.2, 21.5

const SOURCE_FOLDERS = ["Blog posts", "Articles and papers", "reports"] as const;

// Strip characters that are illegal in Windows/POSIX file names plus trailing
// dots/spaces (which Windows silently trims). The stem may end up empty — the
// fixed "f-" prefix below guarantees the final file name is still non-empty.
function safeStem(s: string): string {
  return s
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/[. ]+$/g, "")
    .trim();
}

// File-name stem: words and human separators, exercising the slug derivation and
// the loader's slug-collision suffixing (distinct stems can humanize to the same
// slug, which the unique-slug guarantee must still hold for).
const stemArb = fc
  .array(
    fc.oneof(
      fc.stringMatching(/^[A-Za-z0-9]{1,8}$/),
      fc.constantFrom("_", "-", " ", "__", "--"),
    ),
    { maxLength: 6 },
  )
  .map((tokens) => safeStem(tokens.join("")));

// Recognized audience values: the three canonical names plus a spread of the
// friendly aliases (including the pre-collapse persona names) authors might
// write in front-matter. Every one of these must normalize to a member of the
// canonical AUDIENCES set, which the property below asserts.
const audienceValue = fc.constantFrom(
  "contributor",
  "researcher",
  "funder",
  "witness",
  "invited-professional",
  "professional",
  "philosopher",
  "legal",
  "investor",
  "scholar",
);

// Front-matter mode: no front-matter (-> default all-three tag set), an explicit
// recognized tag list, an empty list, or only-unrecognized tags. The latter two
// also fall back to the default set — every branch yields a non-empty tag set.
type FrontMatter = string[] | null;
const frontMatterArb: fc.Arbitrary<FrontMatter> = fc.oneof(
  fc.constant<FrontMatter>(null),
  fc.array(audienceValue, { minLength: 1, maxLength: 3 }),
  fc.constant<FrontMatter>([]),
  fc.array(fc.constantFrom("martian", "alien", "xyzzy"), {
    minLength: 1,
    maxLength: 2,
  }),
);

// A well-formed markdown body. A fixed leading prose line keeps the file from
// ever being mistaken for front-matter (a body that begins with "---") and keeps
// the document well-formed regardless of the generated tail.
const bodyArb = fc
  .array(
    fc.oneof(
      fc.constantFrom("# Heading", "## Sub", "- item", "> quote", "Prose.", ""),
      fc.string({ maxLength: 30 }).map((s) => s.replace(/[\r\n]/g, " ")),
    ),
    { maxLength: 6 },
  )
  .map((lines) => `Intro line.\n${lines.join("\n")}`);

const fileSpecArb = fc.record({
  folder: fc.constantFrom(...SOURCE_FOLDERS),
  stem: stemArb,
  fm: frontMatterArb,
  body: bodyArb,
});

function buildFileContent(fm: FrontMatter, body: string): string {
  if (fm === null) return body;
  // JSON.stringify yields safely-quoted YAML flow-scalar entries.
  const yaml = `Audience_Tags: [${fm.map((t) => JSON.stringify(t)).join(", ")}]`;
  return `---\n${yaml}\n---\n${body}`;
}

describe("Property 2: Loader completeness", () => {
  // Feature: witness-protocol-portal, Property 2: Loader completeness
  it("produces exactly one ContentItem per well-formed file with unique slugs and non-empty audienceTags", () => {
    fc.assert(
      fc.property(
        fc.array(fileSpecArb, { maxLength: 12 }),
        (specs) => {
          const root = fs.mkdtempSync(
            path.join(os.tmpdir(), "twp-completeness-"),
          );
          try {
            for (const folder of SOURCE_FOLDERS) {
              fs.mkdirSync(path.join(root, folder));
            }

            // Write each spec, deduping by file path. The dedupe key is
            // lower-cased because the host file system (Windows) is
            // case-insensitive, so "f-Abc.md" and "f-abc.md" are one file.
            const writtenPaths = new Set<string>();
            for (const spec of specs) {
              const fileName = `f-${spec.stem}.md`;
              const relPath = path.join(spec.folder, fileName);
              const key = relPath.toLowerCase();
              if (writtenPaths.has(key)) continue;
              writtenPaths.add(key);
              fs.writeFileSync(
                path.join(root, relPath),
                buildFileContent(spec.fm, spec.body),
              );
            }

            const expectedCount = writtenPaths.size;

            const { items, skipped } = loadAllContent(root);
            const markdownItems = items.filter((i) => i.format === "markdown");

            // Exactly one published item per well-formed file; none skipped.
            expect(skipped).toHaveLength(0);
            expect(markdownItems).toHaveLength(expectedCount);

            // Slugs are unique across the whole manifest.
            const slugs = markdownItems.map((i) => i.slug);
            expect(new Set(slugs).size).toBe(slugs.length);

            // Every item carries a non-empty audienceTags set drawn from the
            // recognized audience union.
            for (const item of markdownItems) {
              expect(item.audienceTags.length).toBeGreaterThan(0);
              for (const tag of item.audienceTags) {
                expect(AUDIENCES).toContain(tag);
              }
            }
          } finally {
            fs.rmSync(root, { recursive: true, force: true });
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
