import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { SiteHeader, SiteFooter } from "@/components/navigation";

/**
 * Accessibility checks for keyboard operability and focus order (Req 19.2,
 * 19.4), via axe-core (jest-axe) plus a tab-traversal assertion.
 *
 * The root layout (app/layout.tsx) renders, in order: the skip-to-content link
 * (first focusable element, Req 19.2), the persistent header, a programmatically
 * focusable #main-content wrapper, then the footer. layout.tsx renders <html>/
 * <body>, which cannot be mounted directly in jsdom, so this harness reproduces
 * that exact focusable order around the real SiteHeader/SiteFooter components
 * and the same skip-link markup, then audits it.
 */

expect.extend(toHaveNoViolations);

/** Mirror of the root layout's landmark + focus-order structure. */
function LayoutHarness() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>
        <main>
          <h1>Page heading</h1>
          <p>
            Body content with a <a href="/library">library link</a>.
          </p>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}

// SiteHeader mounts ThemeController, whose effect reads localStorage; install a
// clean in-memory store (mirrors navigation.test.tsx / theme-controller.test.tsx).
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

const FOCUSABLE =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

describe("Keyboard operability and focus order (Req 19.2, 19.4)", () => {
  it("has no axe-core accessibility violations on the page shell", async () => {
    const { container } = render(<LayoutHarness />);
    // color-contrast is verified separately (theme-contrast.test.ts) and is not
    // reliably evaluable in jsdom (no layout/canvas), so scope axe to the
    // keyboard/structure rules this test owns.
    const results = await axe(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });

  it("makes the skip-to-content link the first focusable element (Req 19.2)", () => {
    const { container } = render(<LayoutHarness />);
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    // Elements without a positive tabindex are tabbed in DOM order, so the
    // first focusable in document order is the first stop in the tab sequence.
    expect(focusables.length).toBeGreaterThan(0);
    const first = focusables[0];
    expect(first.tagName).toBe("A");
    expect(first).toHaveTextContent(/skip to main content/i);
    expect(first).toHaveAttribute("href", "#main-content");
  });

  it("places the header wordmark and nav before main content in tab order", () => {
    const { container } = render(<LayoutHarness />);
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    const labels = focusables.map((el) => el.textContent?.trim() ?? "");

    const skipIdx = labels.findIndex((t) => /skip to main content/i.test(t));
    const wordmarkIdx = labels.findIndex((t) => /the witness protocol/i.test(t));
    const libraryIdx = focusables.findIndex(
      (el) => el.getAttribute("href") === "/library",
    );

    // Logical order: skip link → header (wordmark) → main content link.
    expect(skipIdx).toBe(0);
    expect(wordmarkIdx).toBeGreaterThan(skipIdx);
    expect(libraryIdx).toBeGreaterThan(wordmarkIdx);
  });

  it("exposes #main-content as a programmatic focus target for the skip link", () => {
    render(<LayoutHarness />);
    const target = document.getElementById("main-content");
    expect(target).not.toBeNull();
    // tabIndex=-1 lets the browser move focus here when the skip link is
    // activated (fragment navigation), without adding it to the tab sequence.
    expect(target).toHaveAttribute("tabindex", "-1");

    target!.focus();
    expect(document.activeElement).toBe(target);
  });

  it("keeps every interactive control keyboard-reachable (no positive tabindex traps)", () => {
    const { container } = render(<LayoutHarness />);
    const positiveTabindex = Array.from(
      container.querySelectorAll<HTMLElement>("[tabindex]"),
    ).filter((el) => Number(el.getAttribute("tabindex")) > 0);
    // Positive tabindex values override DOM order and create fragile, illogical
    // focus sequences; the Portal must rely on natural DOM order (Req 19.2).
    expect(positiveTabindex).toEqual([]);
  });
});
