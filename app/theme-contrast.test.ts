import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * WCAG contrast checks for the theme tokens (Req 19.3).
 *
 * Req 19.3 requires a contrast ratio of at least 4.5:1 between body text and
 * its background in BOTH themes. The basalt/paper tokens are the single source
 * of truth in app/globals.css, so this test reads the actual hex values from
 * that file (rather than hard-coding them) and computes the WCAG 2.1 contrast
 * ratio for each theme's text/background pairs:
 *   - --fg on --bg  (primary body text — asserted ≥ 4.5:1, the Req 19.3 floor)
 *   - --muted on --bg (secondary text — asserted ≥ 3:1, the AA large/secondary
 *     floor; informational and not the primary body-text pair)
 *
 * The contrast math follows the WCAG definition: relative luminance with the
 * sRGB gamma expansion, ratio = (L_lighter + 0.05) / (L_darker + 0.05).
 */

const cssPath = join(dirname(fileURLToPath(import.meta.url)), "globals.css");
const css = readFileSync(cssPath, "utf8");

/** Extract the four theme tokens declared inside a [data-theme="<name>"] block. */
function readThemeTokens(theme: string): Record<string, string> {
  // Match the rule whose selector list includes [data-theme="<theme>"], up to
  // its closing brace. The basalt block is shared with `:root`, so anchor on
  // the data-theme selector itself and capture the declaration body.
  const block = new RegExp(
    `\\[data-theme="${theme}"\\][^{]*\\{([^}]*)\\}`,
  ).exec(css);
  if (!block) throw new Error(`No [data-theme="${theme}"] block in globals.css`);
  const body = block[1];

  const tokens: Record<string, string> = {};
  const decl = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = decl.exec(body)) !== null) {
    tokens[m[1]] = m[2];
  }
  return tokens;
}

/** Parse #rgb / #rrggbb into [r, g, b] (0–255). */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h.slice(0, 6), 16);
  return [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff];
}

/** WCAG relative luminance of an sRGB color. */
function relativeLuminance(hex: string): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two colors (≥ 1, larger = more contrast). */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Theme token contrast (Req 19.3)", () => {
  for (const theme of ["basalt", "paper"]) {
    describe(`${theme} theme`, () => {
      const tokens = readThemeTokens(theme);

      it("declares --bg, --fg, and --muted as hex colors", () => {
        expect(tokens["--bg"]).toMatch(/^#[0-9a-fA-F]{3,8}$/);
        expect(tokens["--fg"]).toMatch(/^#[0-9a-fA-F]{3,8}$/);
        expect(tokens["--muted"]).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      });

      it("has body text (--fg on --bg) contrast ≥ 4.5:1", () => {
        const ratio = contrastRatio(tokens["--fg"], tokens["--bg"]);
        // Surface the computed value so a failure shows the actual ratio.
        expect(
          ratio,
          `${theme}: --fg ${tokens["--fg"]} on --bg ${tokens["--bg"]} = ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(4.5);
      });

      it("has secondary text (--muted on --bg) contrast ≥ 3:1", () => {
        const ratio = contrastRatio(tokens["--muted"], tokens["--bg"]);
        expect(
          ratio,
          `${theme}: --muted ${tokens["--muted"]} on --bg ${tokens["--bg"]} = ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(3);
      });
    });
  }

  it("sanity-checks the contrast math against known reference pairs", () => {
    // Black on white is the canonical 21:1 maximum; identical colors are 1:1.
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });
});
