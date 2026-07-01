import { describe, it, expect } from "vitest";
import { ECOSYSTEM_LINKS, SOCIAL_LINKS, FOUNDER } from "./external-links";

// Minimal runnable check for the external link-out data. These URLs and emails
// are hand-entered, so the one thing worth guarding is that none is malformed:
// every link is an absolute https URL with a non-empty label/description, and
// every founder email is well-formed. A typo here would ship a dead link on a
// prominently-featured surface (homepage / footer / About).

const isHttpsUrl = (href: string): boolean => {
  try {
    return new URL(href).protocol === "https:";
  } catch {
    return false;
  }
};

describe("external link data", () => {
  it("every ecosystem and social link is a well-formed https URL with copy", () => {
    for (const link of [...ECOSYSTEM_LINKS, ...SOCIAL_LINKS]) {
      expect(isHttpsUrl(link.href), `bad href: ${link.href}`).toBe(true);
      expect(link.label.trim().length).toBeGreaterThan(0);
      expect(link.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("every founder link is a well-formed https URL and every email is valid", () => {
    for (const link of FOUNDER.links) {
      expect(isHttpsUrl(link.href), `bad href: ${link.href}`).toBe(true);
      expect(link.label.trim().length).toBeGreaterThan(0);
    }
    for (const email of FOUNDER.emails) {
      expect(email, `bad email: ${email}`).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });
});
