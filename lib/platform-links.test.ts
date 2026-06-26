import { describe, it, expect } from "vitest";
import {
  PLATFORM_BASE_URL,
  PLATFORM_LINKS,
  platformUrl,
  platformLink,
  type PlatformIntent,
} from "./platform-links";

// Minimal runnable check for the shared Platform link-out layer (task 4.5).
// The broader boundary/integration test (landing, journeys, demos, /participate)
// is task 4.7. This file only asserts each descriptor resolves to the expected
// Platform path and respects the base URL.

// Expected Platform path per intent (Req 1.3–1.6).
const EXPECTED_PATHS: Record<PlatformIntent, string> = {
  gate: "/gate",
  packet: "/packet",
  intake: "/api/intake",
  consent: "/dashboard/consent",
  inquisitor: "/api/inquisitor",
};

describe("platformUrl", () => {
  it("joins the base URL and path with exactly one slash", () => {
    expect(platformUrl("/gate")).toBe(`${PLATFORM_BASE_URL}/gate`);
    expect(platformUrl("gate")).toBe(`${PLATFORM_BASE_URL}/gate`);
  });

  it("uses an env-sourced base URL with no trailing slash", () => {
    expect(PLATFORM_BASE_URL.endsWith("/")).toBe(false);
    expect(PLATFORM_BASE_URL).toMatch(/^https?:\/\//);
  });
});

describe("PLATFORM_LINKS descriptors", () => {
  for (const intent of Object.keys(EXPECTED_PATHS) as PlatformIntent[]) {
    it(`'${intent}' resolves to ${EXPECTED_PATHS[intent]} and respects the base URL`, () => {
      const link = PLATFORM_LINKS[intent];
      expect(link.intent).toBe(intent);
      expect(link.path).toBe(EXPECTED_PATHS[intent]);
      expect(link.href).toBe(`${PLATFORM_BASE_URL}${EXPECTED_PATHS[intent]}`);
      // Each descriptor renders as a consistent CTA: label + description present.
      expect(link.label.length).toBeGreaterThan(0);
      expect(link.description.length).toBeGreaterThan(0);
      // platformLink() accessor returns the same descriptor.
      expect(platformLink(intent)).toBe(link);
    });
  }

  it("covers exactly the five Platform handoffs (Req 1.3–1.6)", () => {
    expect(Object.keys(PLATFORM_LINKS).sort()).toEqual(
      ["consent", "gate", "inquisitor", "intake", "packet"].sort(),
    );
  });
});
