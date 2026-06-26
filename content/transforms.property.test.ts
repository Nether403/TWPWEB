import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  fileNameToTitle,
  altTextFromFileName,
  videoTitleFromFileName,
} from "./transforms";

// Property test for the file-name → human-readable transforms (task 2.2).
// The three transforms under test all route through the shared `humanize`
// helper, so Property 7 must hold for each of them. `fileNameToSlug` is
// intentionally excluded: it uses dashes as the URL separator.

// The three human-readable transforms Property 7 applies to.
const humanReadableTransforms = [
  { name: "fileNameToTitle", fn: fileNameToTitle },
  { name: "altTextFromFileName", fn: altTextFromFileName },
  { name: "videoTitleFromFileName", fn: videoTitleFromFileName },
] as const;

// A "word" of file-name content. We mix printable-ASCII and unicode strings to
// exercise mixed case, digits, accents, and other edge cases, then strip the
// characters we control explicitly elsewhere: dots (reserved for the single
// trailing extension, which the transform strips by design) and path
// separators (generated via the prefix arbitrary below).
const rawWord = fc
  .oneof(
    fc.string({ maxLength: 10 }),
    fc.string({ unit: "grapheme", maxLength: 10 }),
  )
  .map((s) => s.replace(/[.\\/]/g, ""));

// File-name separators, including underscores, dashes, and runs of them.
const separator = fc.constantFrom("_", "-", "__", "--", "-_", "_-", " ");

// A file stem: an interleaving of words and separators (may begin/end with a
// separator and may be empty, which exercises the "Untitled" fallback).
const stem = fc
  .array(fc.oneof(rawWord, separator), { maxLength: 10 })
  .map((tokens) => tokens.join(""));

// An optional single trailing extension, sometimes upper-cased.
const extension = fc
  .option(
    fc.constantFrom("png", "md", "mdx", "mp4", "pdf", "pptx", "txt", "webp", "JPG", "PNG"),
    { nil: undefined },
  )
  .map((ext) => (ext ? `.${ext}` : ""));

// An optional leading directory path (POSIX or Windows separators).
const prefix = fc.option(fc.constantFrom("infographs/", "media/videos/", "a\\b\\"), {
  nil: "",
});

const fileName = fc
  .tuple(prefix, stem, extension)
  .map(([p, s, e]) => `${p}${s}${e}`);

describe("Property 7: file-name to human-readable transform", () => {
  // Feature: witness-protocol-portal, Property 7: File-name to human-readable transform
  it("derives non-empty text with no extension and no underscore/dash separators", () => {
    fc.assert(
      fc.property(fileName, (name) => {
        for (const { fn } of humanReadableTransforms) {
          const result = fn(name);

          // Non-empty (after trimming) — the transform never yields a blank.
          expect(result.trim().length).toBeGreaterThan(0);

          // No trailing file-extension pattern survived the transform.
          expect(/\.[^.\s]+$/.test(result)).toBe(false);

          // No underscore or dash separators remain.
          expect(/[_-]/.test(result)).toBe(false);
        }
      }),
      { numRuns: 200 },
    );
  });
});
