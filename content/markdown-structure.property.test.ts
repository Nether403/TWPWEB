import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { renderMarkdown } from "./loader";

// Property test for markdown structural preservation (task 5.2).
//
// Property 1: Markdown structural preservation (design.md).
// For any markdown document composed of headings, paragraphs, lists, emphasis,
// links, and block quotes, `renderMarkdown` produces sanitized HTML containing a
// corresponding structural element for each:
//   heading    -> <h1>..<h6>
//   list       -> <ul>/<ol> with <li>
//   emphasis   -> <em> / <strong>
//   link       -> <a ... href="<original href>">  (href preserved)
//   block quote-> <blockquote>
//
// renderMarkdown is the renderer used by the content loader to emit `bodyHtml`
// (gray-matter + remark/rehype, with rehypeSanitize). We build a document that
// deliberately contains one of every element kind, render it, and assert each
// kind maps to its HTML element — with the link href surviving sanitization
// unchanged. Validates: Requirements 5.1, 5.2, 6.1, 7.1.

// A single non-empty word of letters/digits only. Keeping content to the
// alphanumeric range means the generated text can never be mistaken for
// markdown syntax (no `#`, `*`, `[`, `>`, backticks, etc.), so the only
// structure in each document is the structure we put there on purpose.
const ALNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const safeWord = fc
  .array(fc.constantFrom(...ALNUM), { minLength: 1, maxLength: 20 })
  .map((cs) => cs.join(""));

// A phrase: one or more safe words joined by single spaces (single line).
const safePhrase = fc
  .array(safeWord, { minLength: 1, maxLength: 6 })
  .map((words) => words.join(" "));

// Heading level 1..6 -> the matching number of leading `#`.
const headingLevel = fc.integer({ min: 1, max: 6 });

// A link href that passes through both remark and rehype-sanitize unchanged:
// an https URL whose path uses only URL-safe characters that need no encoding.
const hrefPath = fc
  .array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-_".split("")), {
    minLength: 1,
    maxLength: 15,
  })
  .map((cs) => cs.join(""));
const linkHref = hrefPath.map((p) => `https://example.com/${p}`);

// One markdown document carrying every element kind, plus the pieces we need to
// assert against (heading level, list ordering, emphasis/strong/link text, href).
const markdownDoc = fc.record({
  level: headingLevel,
  headingText: safePhrase,
  paragraph: safePhrase,
  ordered: fc.boolean(),
  listItems: fc.array(safeWord, { minLength: 1, maxLength: 4 }),
  emText: safeWord,
  strongText: safeWord,
  linkText: safePhrase,
  href: linkHref,
  quoteText: safePhrase,
});

function buildMarkdown(d: {
  level: number;
  headingText: string;
  paragraph: string;
  ordered: boolean;
  listItems: string[];
  emText: string;
  strongText: string;
  linkText: string;
  href: string;
  quoteText: string;
}): string {
  const heading = `${"#".repeat(d.level)} ${d.headingText}`;
  const list = d.listItems
    .map((item, i) => (d.ordered ? `${i + 1}. ${item}` : `- ${item}`))
    .join("\n");
  const emphasis = `*${d.emText}* and **${d.strongText}**`;
  const link = `[${d.linkText}](${d.href})`;
  const quote = `> ${d.quoteText}`;

  // Blocks separated by blank lines so each renders as its own structure.
  return [heading, d.paragraph, list, emphasis, link, quote].join("\n\n");
}

describe("Property 1: Markdown structural preservation", () => {
  // Feature: witness-protocol-portal, Property 1: Markdown structural preservation
  it("maps each heading/list/emphasis/link/block quote to its HTML element, preserving link href", () => {
    fc.assert(
      fc.property(markdownDoc, (d) => {
        const html = renderMarkdown(buildMarkdown(d));

        // Heading -> <hN> for the exact level used.
        expect(html).toContain(`<h${d.level}>`);

        // Paragraph -> <p> (the standalone prose block).
        expect(html).toMatch(/<p>/);

        // List -> <ul>/<ol> with <li> items.
        expect(html).toContain(d.ordered ? "<ol>" : "<ul>");
        expect(html).toContain("<li>");

        // Emphasis -> <em> and <strong>, with their text intact.
        expect(html).toContain(`<em>${d.emText}</em>`);
        expect(html).toContain(`<strong>${d.strongText}</strong>`);

        // Link -> <a> with the ORIGINAL href preserved through sanitization.
        expect(html).toContain("<a ");
        expect(html).toContain(`href="${d.href}"`);

        // Block quote -> <blockquote>.
        expect(html).toContain("<blockquote>");
      }),
      { numRuns: 200 },
    );
  });
});
