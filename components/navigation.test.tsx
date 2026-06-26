import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { SiteHeader, SiteFooter, PRIMARY_NAV } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import NotFound from "@/app/not-found";

// Unit tests for the Navigation_System (header, footer, responsive menu) and
// the styled 404 page (task 4.4). Covers Req 2.1, 2.2, 2.4, 2.5, 2.6.
//
// jsdom does not evaluate CSS media queries, so the ≤768px collapsible control
// is verified structurally: the MobileMenu is the control scoped to ≤768px
// (its root carries `min-[769px]:hidden`, i.e. shown at/below 768px), it
// exposes every PRIMARY_NAV entry when opened, and the desktop nav is the
// counterpart scoped to ≥769px (`min-[769px]:flex`). Together these assert the
// boundary control exists and exposes all primary entries.

describe("SiteHeader (Req 2.1, 2.2)", () => {
  // SiteHeader mounts the ThemeController, whose mount effect reads
  // localStorage. The runtime's global shim is partial, so install a clean
  // in-memory store (mirrors theme-controller.test.tsx).
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
    });
    document.documentElement.setAttribute("data-theme", "basalt");
  });

  it("renders a persistent header with the wordmark linking Home", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");
    const wordmark = within(header).getByRole("link", {
      name: /the witness protocol/i,
    });
    expect(wordmark).toHaveAttribute("href", "/");
  });

  it("renders every primary navigation entry in the desktop nav", () => {
    render(<SiteHeader />);
    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    for (const item of PRIMARY_NAV) {
      const link = within(primaryNav).getByRole("link", {
        name: item.label,
      });
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("provides the expected primary entries: Home, About/Methodology, Research & Library, Participate, Fund, Contact", () => {
    expect(PRIMARY_NAV.map((i) => i.label)).toEqual([
      "Home",
      "About / Methodology",
      "Research & Library",
      "Participate",
      "Fund",
      "Contact",
    ]);
  });
});

describe("SiteFooter (Req 2.4)", () => {
  it("renders the footer on every page with Foundation identity, phase status, and legal/privacy links", () => {
    render(<SiteFooter />);
    const footer = screen.getByRole("contentinfo");

    // Foundation identity.
    expect(
      within(footer).getByText("Stichting The Witness Protocol Foundation"),
    ).toBeInTheDocument();

    // Current project phase status.
    expect(within(footer).getByText(/Phase 5 — Beta/i)).toBeInTheDocument();

    // Legal / privacy links.
    expect(
      within(footer).getByRole("link", { name: /legal/i }),
    ).toHaveAttribute("href", "/legal");
    expect(
      within(footer).getByRole("link", { name: /privacy/i }),
    ).toHaveAttribute("href", "/privacy");
  });
});

describe("Responsive collapsible menu at ≤768px (Req 2.5)", () => {
  it("renders a collapsible menu control scoped to ≤768px viewports", () => {
    const { container } = render(<MobileMenu items={PRIMARY_NAV} />);

    // The control is present as a toggle button, collapsed by default.
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Its root is scoped to ≤768px (shown there, hidden from 769px up).
    expect(container.firstChild).toHaveClass("min-[769px]:hidden");

    // Panel is collapsed (hidden) until the control is activated.
    expect(document.getElementById("mobile-nav-panel")).not.toBeVisible();
  });

  it("exposes all primary navigation entries when the control is activated", () => {
    render(<MobileMenu items={PRIMARY_NAV} />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    const toggle = screen.getByRole("button", { name: /close menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByRole("navigation", {
      name: "Primary (mobile)",
    });
    for (const item of PRIMARY_NAV) {
      const link = within(mobileNav).getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("collapses again when an entry is selected", () => {
    render(<MobileMenu items={PRIMARY_NAV} />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    const mobileNav = screen.getByRole("navigation", {
      name: "Primary (mobile)",
    });
    fireEvent.click(within(mobileNav).getByRole("link", { name: "Fund" }));

    expect(
      screen.getByRole("button", { name: /open menu/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Not-found page (Req 2.6)", () => {
  it("renders a styled 404 with a link back to Home", () => {
    render(<NotFound />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    const homeLink = screen.getByRole("link", { name: /return to home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
