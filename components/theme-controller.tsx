"use client";

import { useEffect, useState } from "react";

/**
 * Theme_Controller (Req 18.3–18.6).
 *
 * Toggles the `data-theme` attribute (`basalt` | `paper`) on the document root,
 * persists the choice to localStorage, and applies it globally. The default
 * `basalt` theme is set statically on the server-rendered <html> in app/layout.tsx,
 * so the Portal renders and stays usable in its default theme even if this
 * controller fails to load — the controller only layers the toggle + persistence
 * on top of an already-usable default (Req 18.6).
 *
 * Transitions use only the global fade token in globals.css (Req 18.5); this
 * component applies no transform-based motion.
 */

export type Theme = "basalt" | "paper";

export const THEME_STORAGE_KEY = "twp-theme";
const DEFAULT_THEME: Theme = "basalt";

/** Narrow an unknown stored value to a valid Theme, or null. */
export function parseTheme(value: unknown): Theme | null {
  return value === "basalt" || value === "paper" ? value : null;
}

/** The other theme — toggling is a pure flip between the two. */
export function oppositeTheme(theme: Theme): Theme {
  return theme === "basalt" ? "paper" : "basalt";
}

/**
 * Blocking inline script applied before paint in <head> (mounted from layout).
 * Reads the persisted theme and sets it on <html> so a returning Visitor who
 * chose `paper` never sees a basalt flash. Kept dependency-free and wrapped in
 * try/catch so a blocked localStorage never breaks rendering (Req 18.6).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="basalt"||t==="paper"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

export function ThemeController() {
  // Initialize to the server-rendered default so the first client render matches
  // SSR markup (no hydration mismatch). The real persisted/applied theme is read
  // from the DOM after mount, below.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    // A persisted choice is the source of truth. Normally the inline init script
    // applies it to <html> before paint; apply it here too so the controller is
    // self-sufficient even if that script didn't run. Fall back to whatever is
    // currently on <html> (the static default), then to DEFAULT_THEME.
    const current =
      parseTheme(document.documentElement.getAttribute("data-theme")) ??
      DEFAULT_THEME;
    const applied = parseTheme(localStorage.getItem(THEME_STORAGE_KEY)) ?? current;
    if (applied !== current) {
      document.documentElement.setAttribute("data-theme", applied);
    }
    setTheme(applied);
  }, []);

  function toggle() {
    const next = oppositeTheme(theme);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ponytail: persistence is best-effort — a blocked localStorage still
      // applies the theme for this session, it just won't survive a reload.
    }
    setTheme(next);
  }

  const next = oppositeTheme(theme);

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={theme === "paper"}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg border border-border px-3 py-2"
    >
      {theme === "basalt" ? "Basalt" : "Paper"}
    </button>
  );
}
