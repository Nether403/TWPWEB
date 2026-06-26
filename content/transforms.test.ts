import { describe, it, expect } from "vitest";
import {
  fileNameToSlug,
  fileNameToTitle,
  altTextFromFileName,
  videoTitleFromFileName,
} from "./transforms";

// Example-based unit tests for the file-name transforms (task 2.1).
// The universal Property 7 check lives in task 2.2.

describe("fileNameToTitle", () => {
  it("strips the extension and converts separators to spaces", () => {
    expect(fileNameToTitle("The_Witness_Protocol_Framework.png")).toBe(
      "The Witness Protocol Framework",
    );
    expect(fileNameToTitle("consent-revocation-cascade.md")).toBe(
      "Consent Revocation Cascade",
    );
  });

  it("preserves existing inner casing (acronyms survive)", () => {
    expect(fileNameToTitle("PII_redaction.md")).toBe("PII Redaction");
  });

  it("falls back to a non-empty title when nothing readable remains", () => {
    expect(fileNameToTitle("___.png")).toBe("Untitled");
  });

  it("drops directory segments", () => {
    expect(fileNameToTitle("infographs/witness_map.png")).toBe("Witness Map");
  });
});

describe("fileNameToSlug", () => {
  it("produces a lower-case, dash-separated, URL-safe slug", () => {
    expect(fileNameToSlug("The_Witness_Protocol_Framework.png")).toBe(
      "the-witness-protocol-framework",
    );
  });

  it("collapses runs of non-alphanumerics and trims edges", () => {
    expect(fileNameToSlug("  Gate -- self  assessment .md")).toBe(
      "gate-self-assessment",
    );
  });

  it("falls back to a non-empty slug", () => {
    expect(fileNameToSlug("___.png")).toBe("untitled");
  });
});

describe("altTextFromFileName / videoTitleFromFileName", () => {
  it("humanize file names the same way as titles", () => {
    expect(altTextFromFileName("system_architecture.png")).toBe(
      "System Architecture",
    );
    expect(videoTitleFromFileName("protocol-intro-clip.mp4")).toBe(
      "Protocol Intro Clip",
    );
  });
});
