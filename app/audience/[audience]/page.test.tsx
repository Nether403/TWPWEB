import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AudiencePage from "./page";
import { AUDIENCE_CONFIG } from "@/lib/audiences";
import { platformLink } from "@/lib/platform-links";
import type { Audience } from "@/content/loader";

// Unit tests for the audience-specific links exposed by each AUDIENCE_CONFIG
// (lib/audiences.ts), rendered via the `/audience/[audience]` route (task 7.4).
//
// Covers the per-audience link rules for the three collapsed journeys:
//   Req 4.4     — contributor → Gate + participation + reviewer packet
//   Req 4.5/4.6 — researcher  → Inquisitor + library + revocation/provenance
//   Req 4.7     — funder      → funding
// and the invariant that real-action CTAs are outbound Platform link-outs (Req 1).
//
// AudiencePage is an async server component; awaiting it yields the element tree,
// which renders under jsdom. The config is the source of truth, so each rule is
// asserted both on AUDIENCE_CONFIG and on the rendered DOM (the hrefs that ship).

// Outbound Platform hrefs, resolved from the shared link-out layer.
const PLATFORM = {
  consent: platformLink("consent").href,
  gate: platformLink("gate").href,
  packet: platformLink("packet").href,
  inquisitor: platformLink("inquisitor").href,
};

async function renderAudience(audience: Audience) {
  const ui = await AudiencePage({ params: Promise.resolve({ audience }) });
  return render(ui);
}

/** Collect every anchor href in the rendered audience page. */
function hrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("a")).map(
    (a) => a.getAttribute("href") ?? "",
  );
}

describe("Audience real-action CTAs are Platform link-outs (Req 1)", () => {
  it("marks external CTAs with an absolute Platform href and internal CTAs with a Portal path", () => {
    for (const config of Object.values(AUDIENCE_CONFIG)) {
      for (const cta of config.ctas) {
        if (cta.external) {
          expect(cta.href, `${config.id} external CTA`).toMatch(/^https?:\/\//);
        } else {
          expect(cta.href, `${config.id} internal CTA`).toMatch(/^\//);
        }
      }
      // Every audience exposes at least one CTA (Req 4.2).
      expect(config.ctas.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("contributor → Gate + participation + packet (Req 4.4)", () => {
  it("exposes a Gate link and outbound participation + packet CTAs", async () => {
    const config = AUDIENCE_CONFIG.contributor;
    // Gate self-assessment demo link present in config.
    expect(config.demoLinks.some((d) => d.href === "/demos/gate")).toBe(true);
    // Participation and reviewer-packet handoffs = outbound Platform CTAs.
    expect(config.ctas.some((c) => c.external && c.href === PLATFORM.consent)).toBe(
      true,
    );
    expect(config.ctas.some((c) => c.external && c.href === PLATFORM.packet)).toBe(
      true,
    );

    const { container } = await renderAudience("contributor");
    const rendered = hrefs(container);
    expect(rendered).toContain("/demos/gate");
    expect(rendered).toContain(PLATFORM.consent);
    expect(rendered).toContain(PLATFORM.gate);
    expect(rendered).toContain(PLATFORM.packet);
  });
});

describe("researcher → Inquisitor + library + scrutiny demos (Req 4.5, 4.6)", () => {
  it("exposes the Inquisitor, a library link, and the revocation + provenance demos", async () => {
    const config = AUDIENCE_CONFIG.researcher;
    // Inquisitor comparator demo + the two scrutiny demos present.
    expect(config.demoLinks.some((d) => d.href === "/demos/inquisitor")).toBe(true);
    expect(config.demoLinks.some((d) => d.href === "/demos/revocation")).toBe(true);
    expect(config.demoLinks.some((d) => d.href === "/demos/provenance")).toBe(true);
    // Library CTA (internal) present.
    expect(config.ctas.some((c) => !c.external && c.href === "/library")).toBe(true);

    const { container } = await renderAudience("researcher");
    const rendered = hrefs(container);
    expect(rendered).toContain("/demos/inquisitor");
    expect(rendered).toContain("/demos/revocation");
    expect(rendered).toContain("/demos/provenance");
    expect(rendered).toContain("/library");
    // The real Inquisitor handoff is an outbound Platform CTA (Req 1, 1.6).
    expect(rendered).toContain(PLATFORM.inquisitor);
  });
});

describe("funder → funding (Req 4.7)", () => {
  it("exposes the funding CTA", async () => {
    const config = AUDIENCE_CONFIG.funder;
    expect(config.ctas.some((c) => !c.external && c.href === "/fund")).toBe(true);

    const { container } = await renderAudience("funder");
    expect(hrefs(container)).toContain("/fund");
  });
});
