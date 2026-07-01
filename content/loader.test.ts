// Minimal unit check for deriveMetadata (task 2.3). The full property test for
// metadata derivation (Property 4) lives in task 2.4.
import { describe, expect, it } from "vitest";
import { deriveMetadata } from "./loader";

describe("deriveMetadata", () => {
  it("uses the first H1 as the title", () => {
    const { title } = deriveMetadata("# Real Title\n\nBody text.", "some_file.md");
    expect(title).toBe("Real Title");
  });

  it("ignores ## subheadings and falls back to the humanized file name", () => {
    const { title } = deriveMetadata("## Not An H1\n\nBody.", "my_great-post.md");
    expect(title).toBe("My Great Post");
  });

  it("draws the summary from the leading prose paragraph, skipping headings", () => {
    const { summary } = deriveMetadata(
      "# Heading\n\nThis is the first paragraph with a [link](https://x).",
      "f.md",
    );
    expect(summary).toBe("This is the first paragraph with a link.");
  });

  it("truncates long paragraphs on a word boundary with an ellipsis", () => {
    const word = "alpha ".repeat(60); // ~360 chars
    const { summary } = deriveMetadata(word.trim(), "f.md");
    expect(summary.length).toBeLessThanOrEqual(201); // 200 + ellipsis
    expect(summary.endsWith("…")).toBe(true);
    expect(summary).not.toContain("  ");
  });

  it("always returns a non-empty title and summary, even for empty bodies", () => {
    const { title, summary } = deriveMetadata("", "untitled-doc.md");
    expect(title.length).toBeGreaterThan(0);
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).toBe(title); // summary falls back to title when no prose
  });
});

// ---------------------------------------------------------------------------
// loadAllContent / resolveAudienceTags / renderMarkdown (task 2.5).
// The full property tests (loader completeness, malformed exclusion) are tasks
// 2.6 / 2.7; these are the minimal runnable checks for task 2.5.
// ---------------------------------------------------------------------------
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll } from "vitest";
import {
  AUDIENCES,
  loadAllContent,
  renderMarkdown,
  resolveAudienceTags,
  type Audience,
} from "./loader";

describe("resolveAudienceTags", () => {
  it("defaults to all three audiences when none are declared", () => {
    expect(resolveAudienceTags({})).toEqual([...AUDIENCES]);
  });

  it("reads an array under the canonical Audience_Tags key", () => {
    expect(resolveAudienceTags({ Audience_Tags: ["researcher", "investor"] })).toEqual([
      "researcher",
      "funder",
    ]);
  });

  it("tolerates key/casing/separator variations and comma strings", () => {
    expect(resolveAudienceTags({ audienceTags: "Potential Witness, Legal" })).toEqual([
      "contributor",
      "researcher",
    ]);
  });

  it("falls back to the default set when declared tags are all unrecognized", () => {
    expect(resolveAudienceTags({ audience_tags: ["martian"] })).toEqual([...AUDIENCES]);
  });
});

describe("renderMarkdown", () => {
  it("preserves headings, lists, emphasis, links, and block quotes", () => {
    const html = renderMarkdown(
      "# Title\n\n- one\n- two\n\n*em* and **strong**\n\n[link](https://x.test)\n\n> quote",
    );
    expect(html).toMatch(/<h1>/);
    expect(html).toMatch(/<ul>[\s\S]*<li>/);
    expect(html).toMatch(/<em>em<\/em>/);
    expect(html).toMatch(/<strong>strong<\/strong>/);
    expect(html).toContain('href="https://x.test"');
    expect(html).toMatch(/<blockquote>/);
  });
});

describe("loadAllContent (temp fixture)", () => {
  let root: string;

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "twp-loader-"));
    fs.mkdirSync(path.join(root, "Blog posts"));
    fs.mkdirSync(path.join(root, "Articles and papers"));
    // reports/ intentionally omitted to exercise the missing-folder path.

    fs.writeFileSync(
      path.join(root, "Blog posts", "first_post.md"),
      "---\nAudience_Tags: [researcher]\n---\n# First\n\nHello world.",
    );
    fs.writeFileSync(
      path.join(root, "Articles and papers", "no_frontmatter.md"),
      "### Heading only\n\nBody prose here.",
    );
    // Malformed YAML front-matter (unterminated quote) -> excluded + logged (Req 5.5).
    fs.writeFileSync(
      path.join(root, "Articles and papers", "broken.md"),
      '---\ntitle: "unterminated\ntags: [1, 2\n---\nbody',
    );
    // A PDF catalogued as a downloadable asset (Req 6.2).
    fs.writeFileSync(path.join(root, "Articles and papers", "paper.pdf"), "%PDF-1.4");
  });

  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  it("loads one ContentItem per well-formed file with unique slugs and tags", () => {
    const { items } = loadAllContent(root);
    const markdownItems = items.filter((i) => i.format === "markdown");
    expect(markdownItems).toHaveLength(2);

    const slugs = items.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length); // unique
    for (const item of items) expect(item.audienceTags.length).toBeGreaterThan(0);

    const tagged = markdownItems.find((i) => i.slug === "first-post");
    expect(tagged?.audienceTags).toEqual(["researcher"]);
    expect(tagged?.bodyHtml).toMatch(/<h1>First<\/h1>/);
  });

  it("catalogues PDFs as format:pdf with an assetPath", () => {
    const pdf = loadAllContent(root).items.find((i) => i.format === "pdf");
    expect(pdf).toBeDefined();
    expect(pdf?.assetPath).toBe("/assets/article/paper.pdf");
  });

  it("excludes unparseable files and records them in skipped", () => {
    const { skipped } = loadAllContent(root);
    expect(skipped).toHaveLength(1);
    expect(skipped[0].file).toContain("broken.md");
  });
});

describe("loadAllContent (real source folders)", () => {
  it("loads the workspace content without crashing", () => {
    // process.cwd() is the TWPWEB project root under both vitest and next build.
    const { items, audienceWarnings } = loadAllContent();
    expect(items.length).toBeGreaterThan(0);
    // Default tag set guarantees every audience journey is covered.
    expect(audienceWarnings as Audience[]).toEqual([]);
  });
});
