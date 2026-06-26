import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ThemeController,
  parseTheme,
  oppositeTheme,
  THEME_STORAGE_KEY,
} from "./theme-controller";

describe("theme-controller pure logic", () => {
  it("parseTheme accepts only the two valid themes", () => {
    expect(parseTheme("basalt")).toBe("basalt");
    expect(parseTheme("paper")).toBe("paper");
    expect(parseTheme("neon")).toBeNull();
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme(undefined)).toBeNull();
  });

  it("oppositeTheme flips between the two themes", () => {
    expect(oppositeTheme("basalt")).toBe("paper");
    expect(oppositeTheme("paper")).toBe("basalt");
  });
});

describe("ThemeController component", () => {
  beforeEach(() => {
    // The runtime's global localStorage shim is partial; use a clean in-memory
    // store so the test exercises the component's real getItem/setItem path.
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
    });
    document.documentElement.setAttribute("data-theme", "basalt");
  });

  it("toggles data-theme on the document root and persists the choice", () => {
    render(<ThemeController />);
    const btn = screen.getByRole("switch");

    // Starts in the static default.
    expect(document.documentElement.getAttribute("data-theme")).toBe("basalt");
    expect(btn).toHaveAttribute("aria-checked", "false");

    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("paper");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("paper");
    expect(btn).toHaveAttribute("aria-checked", "true");

    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("basalt");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("basalt");
  });

  it("adopts a persisted theme on mount", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "paper");
    render(<ThemeController />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("paper");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("exposes an accessible label for the switch", () => {
    render(<ThemeController />);
    expect(
      screen.getByRole("switch", { name: /switch to paper theme/i }),
    ).toBeInTheDocument();
  });
});
