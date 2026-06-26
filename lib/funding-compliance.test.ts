import { describe, it, expect } from "vitest";
import { containsProhibitedInvestmentLanguage } from "./funding-compliance";
import {
  TOKEN_FUNDING_COPY,
  CRYPTO_DISCLAIMER,
  TOKEN_OPTIONS,
} from "@/content/token-funding";
import { CURATORIAL_NEUTRALITY_PARAGRAPHS } from "@/components/curatorial-neutrality-statement";

// Core check for the build-time compliance guard (Req 16.7). The interesting
// behavior is negation-awareness: the shipped donation-only / neutrality copy
// uses words like "investment" and "rights" inside negated sentences and MUST
// read as compliant, while affirmative investment framing MUST be flagged.
describe("containsProhibitedInvestmentLanguage", () => {
  it("flags affirmative investment framing", () => {
    expect(
      containsProhibitedInvestmentLanguage([
        "Invest now and earn a financial return.",
      ]),
    ).toBe(true);
    expect(
      containsProhibitedInvestmentLanguage([
        "Contributors receive governance rights and a share of profits.",
      ]),
    ).toBe(true);
  });

  it("passes the shipped donation-only token funding copy", () => {
    const view = [
      TOKEN_FUNDING_COPY.heading,
      TOKEN_FUNDING_COPY.intro,
      CRYPTO_DISCLAIMER,
      ...TOKEN_OPTIONS.flatMap((t) => [t.name, t.network]),
      ...CURATORIAL_NEUTRALITY_PARAGRAPHS,
    ];
    expect(containsProhibitedInvestmentLanguage(view)).toBe(false);
  });

  it("passes neutral / empty copy", () => {
    expect(containsProhibitedInvestmentLanguage([])).toBe(false);
    expect(
      containsProhibitedInvestmentLanguage(["Bitcoin", "Ethereum mainnet"]),
    ).toBe(false);
  });
});
