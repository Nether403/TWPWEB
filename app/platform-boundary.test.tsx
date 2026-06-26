import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import HomePage from "@/app/page";
import ParticipatePage from "@/app/participate/page";
import { GateSimulator } from "@/components/gate-simulator";
import { InquisitorComparator } from "@/components/inquisitor-comparator";
import { AUDIENCE_CONFIG } from "@/lib/audiences";
import { AUDIENCES } from "@/content/loader";
import {
  PLATFORM_BASE_URL,
  PLATFORM_LINKS,
  platformLink,
  type PlatformIntent,
} from "@/lib/platform-links";

// Unit test for Platform link-outs and the front-of-house boundary (task 4.7).
//
// Two halves, both asserting the actual rendered output / on-disk routes rather
// than internal state:
//
//   1. Link-outs — the landing page, the six audience journeys, the Gate
//      simulator, the Inquisitor comparator, and `/participate` all render
//      OUTBOUND links to the expected live-Platform surfaces sourced from the
//      shared link-out layer (lib/platform-links). Every such link is an
//      absolute Platform URL.
//   2. Boundary — the Portal exposes NO testimony-intake, consent, or auth
//      route of its own: the `app/` route tree contains no `gate`, `intake`,
//      `consent`, `login`, `auth`, or `signin` segment, and `app/api` contains
//      only the Portal-owned `forms` route.
//
// Covers Req 1.1, 1.2, 1.3, 1.4, 1.5, 1.6.

/** The set of absolute Platform hrefs the Portal is allowed to link out to. */
const PLATFORM_HREFS = new Set(
  Object.values(PLATFORM_LINKS).map((l) => l.href),
);

/** Collect every absolute href rendered in the current document. */
function renderedHrefs(): string[] {
  return Array.from(document.querySelectorAll("a[href]")).map(
    (a) => a.getAttribute("href")!,
  );
}

describe("Landing page Platform link-outs (Req 1.5)", () => {
  it("renders the participate CTA as an outbound link to the Platform consent surface", () => {
    render(<HomePage />);
    const consent = platformLink("consent");
    const cta = screen.getByRole("link", { name: /^participate$/i });
    expect(cta).toHaveAttribute("href", consent.href);
    expect(consent.href.startsWith(PLATFORM_BASE_URL)).toBe(true);
  });

  it("routes its real-action CTA out to the Platform, not to a Portal intake route", () => {
    render(<HomePage />);
    // The participate handoff is absolute (off-Portal); the other CTAs
    // ("Read the research", "Support the Foundation") are internal Portal routes.
    expect(renderedHrefs()).toContain(platformLink("consent").href);
  });
});

describe("Audience journeys Platform link-outs (Req 1.3, 1.4, 1.5, 1.6)", () => {
  it("provides a distinct journey config for each of the six audiences", () => {
    for (const audience of AUDIENCES) {
      expect(AUDIENCE_CONFIG[audience]?.id).toBe(audience);
    }
  });

  it("renders every external CTA as a known outbound Platform link, never a Portal-owned action", () => {
    for (const audience of AUDIENCES) {
      const external = AUDIENCE_CONFIG[audience].ctas.filter((c) => c.external);
      for (const cta of external) {
        // Each external CTA must resolve to one of the canonical Platform
        // surfaces and be an absolute off-Portal URL (Req 1).
        expect(PLATFORM_HREFS.has(cta.href)).toBe(true);
        expect(cta.href.startsWith(PLATFORM_BASE_URL)).toBe(true);
      }
    }
  });

  it("surfaces the expected Platform handoffs across the journeys", () => {
    // Aggregate every external CTA href across the six journeys.
    const externalHrefs = new Set(
      AUDIENCES.flatMap((a) =>
        AUDIENCE_CONFIG[a].ctas.filter((c) => c.external).map((c) => c.href),
      ),
    );
    // Witness/professional journeys link to the Gate intake, the consent
    // surface, and the reviewer packet (Req 1.3, 1.4, 1.5); researcher and
    // philosopher journeys link to the real Inquisitor (Req 1.6).
    expect(externalHrefs.has(platformLink("gate").href)).toBe(true);
    expect(externalHrefs.has(platformLink("consent").href)).toBe(true);
    expect(externalHrefs.has(platformLink("packet").href)).toBe(true);
    expect(externalHrefs.has(platformLink("inquisitor").href)).toBe(true);
  });
});

describe("Gate simulator Platform link-out (Req 1.3)", () => {
  it("links out to the Platform Gate intake for real submission", () => {
    render(<GateSimulator />);
    const gate = platformLink("gate");
    expect(renderedHrefs()).toContain(gate.href);
    // Confirm the visible CTA carries that href.
    const link = screen.getByRole("link", { name: new RegExp(gate.label, "i") });
    expect(link).toHaveAttribute("href", gate.href);
  });
});

describe("Inquisitor comparator Platform link-out (Req 1.6)", () => {
  it("links out to the real Inquisitor engine on the Platform", () => {
    render(<InquisitorComparator />);
    const inquisitor = platformLink("inquisitor");
    expect(renderedHrefs()).toContain(inquisitor.href);
    const link = screen.getByRole("link", {
      name: new RegExp(inquisitor.label, "i"),
    });
    expect(link).toHaveAttribute("href", inquisitor.href);
  });
});

describe("/participate Platform link-outs (Req 1.3, 1.4, 1.5)", () => {
  it("links out to the Gate, packet, intake, and consent Platform surfaces with no Portal-owned form", () => {
    const { container } = render(<ParticipatePage />);
    const hrefs = renderedHrefs();
    for (const intent of ["gate", "packet", "intake", "consent"] as PlatformIntent[]) {
      expect(hrefs).toContain(platformLink(intent).href);
    }
    // The page is informational: it owns no form and collects nothing (Req 1.8).
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("input")).toBeNull();
    expect(container.querySelector("textarea")).toBeNull();
  });
});

describe("Portal boundary — no intake/consent/auth route (Req 1.1, 1.2)", () => {
  const appDir = path.join(process.cwd(), "app");

  /** Collect every directory (route-segment) name under `app/`, recursively. */
  function routeSegments(dir: string): string[] {
    const out: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      out.push(entry.name);
      out.push(...routeSegments(path.join(dir, entry.name)));
    }
    return out;
  }

  /** Top-level route segments directly under `app/`. */
  function topLevelSegments(): string[] {
    return fs
      .readdirSync(appDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name.toLowerCase());
  }

  it("exposes no top-level Gate, intake, consent, login, or auth route (Req 1.1, 1.2)", () => {
    // The real Gate intake, the reviewer intake, consent records, and
    // authentication all live on the Platform — the Portal must not reimplement
    // any of them as a route of its own (`app/gate`, `app/intake`, …).
    const top = topLevelSegments();
    for (const name of ["gate", "intake", "consent", "login", "auth", "signin", "sign-in"]) {
      expect(top).not.toContain(name);
    }
  });

  it("contains no consent, intake, or auth route segment anywhere in the tree (Req 1.1, 1.2)", () => {
    // These have no legitimate Portal use, simulated or otherwise. (The only
    // `gate` segment that may exist is the simulated `app/demos/gate`
    // self-assessment demo — a non-binding demonstration, never real intake —
    // so `gate` is checked at the top level above, not banned tree-wide.)
    const segments = routeSegments(appDir).map((s) => s.toLowerCase());
    for (const name of ["intake", "consent", "login", "auth", "signin", "sign-in", "testimony"]) {
      expect(segments).not.toContain(name);
    }
  });

  it("exposes only the Portal-owned forms route under /api", () => {
    const apiDir = path.join(appDir, "api");
    const apiChildren = fs
      .readdirSync(apiDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    expect(apiChildren).toEqual(["forms"]);
  });
});
