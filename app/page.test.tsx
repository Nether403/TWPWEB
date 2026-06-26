import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { AUDIENCES } from "@/content/loader";
import { platformLink } from "@/lib/platform-links";

// Unit tests for the landing page CTAs and audience entry navigation (task 7.4).
// Covers Req 3.3 (≥3 primary CTAs: participate, read research, fund) and Req 3.4
// (each CTA points at its corresponding destination). The participate CTA is an
// outbound Platform link-out (Req 1), the other two route within the Portal.
//
// HomePage is a synchronous server component that reads the build-time content
// manifest via loadAllContent(); it renders directly under jsdom.

describe("Landing page primary CTAs (Req 3.3, 3.4)", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "basalt");
  });

  // Exact accessible-name matches: the investor audience entry blurb also
  // contains "support the Foundation", so a loose regex would be ambiguous.
  it("renders all three primary CTAs: participate, read research, fund", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("link", { name: "Participate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the research" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Support the Foundation" }),
    ).toBeInTheDocument();
  });

  it("links the participate CTA OUT to the Platform consent surface (Req 1, 3.4)", () => {
    render(<HomePage />);
    const consent = platformLink("consent");
    const participate = screen.getByRole("link", { name: "Participate" });
    // Absolute outbound Platform URL, not an internal Portal route.
    expect(participate).toHaveAttribute("href", consent.href);
    expect(consent.href).toMatch(/^https?:\/\//);
  });

  it("routes 'read the research' to the library and 'support the foundation' to fund (Req 3.4)", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("link", { name: "Read the research" }),
    ).toHaveAttribute("href", "/library");
    expect(
      screen.getByRole("link", { name: "Support the Foundation" }),
    ).toHaveAttribute("href", "/fund");
  });
});

describe("Landing page audience entry navigation (Req 3.2)", () => {
  it("renders an entry path linking to each of the six audience journeys", () => {
    render(<HomePage />);
    for (const audience of AUDIENCES) {
      const link = document.querySelector(`a[href="/audience/${audience}"]`);
      expect(link, `entry link for ${audience}`).not.toBeNull();
    }
  });
});
