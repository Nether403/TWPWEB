// lib/funding-compliance.ts
//
// Build-time / render-time compliance guard for the Funding_Module (Req 16.7).
//
// The token funding view must never present a contribution path (wallet
// address, QR code, copy control) alongside prohibited investment framing.
// Prohibited framing is language that describes a token contribution as an
// investment, as conferring a financial return, or as conferring programmatic,
// governance, or other rights (Req 16.1). If such language is detected anywhere
// in the rendered token funding copy, the module fails closed: the wallet
// addresses, QR codes, and copy controls are disabled (Req 16.7).
//
// This is deliberately a HEURISTIC guard, not a legal NLP classifier.
// ponytail: negation is scoped at the sentence level — a single negation
// ("no" / "not" / "never" / "without") anywhere in a sentence neutralizes the
// prohibited terms in that same sentence. Ceiling: a sentence that BOTH negates
// and affirms (e.g. "not a donation but an investment") could be misclassified
// as compliant. Upgrade path: clause-level dependency parsing. For the alpha,
// keep each compliance disclaimer to single, clearly-negated sentences (as the
// shipped copy in content/token-funding.ts does) and the guard is exact.

/**
 * Prohibited investment terms. Each entry is matched as a word-boundary regex
 * fragment (case-insensitive). These cover the three prohibited categories from
 * Req 16.1: investment, financial return, and conferred rights.
 */
const PROHIBITED_TERMS: readonly string[] = [
  "invest",
  "investment",
  "investor",
  "financial return",
  "return on investment",
  "roi",
  "dividend",
  "dividends",
  "profit",
  "profits",
  "equity",
  "shares",
  "shareholder",
  "stake in",
  "yield",
  "appreciation",
  "governance rights",
  "voting rights",
  "programmatic rights",
  "token rights",
  "ownership rights",
];

/** Negation tokens that, present in a sentence, neutralize prohibited terms there. */
const NEGATION_TOKENS: readonly string[] = [
  "no",
  "not",
  "never",
  "without",
  "neither",
  "nor",
  "cannot",
  "isn't",
  "aren't",
  "doesn't",
  "don't",
  "won't",
  "no programmatic",
];

const PROHIBITED_REGEXPS = PROHIBITED_TERMS.map(
  (term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
);

const NEGATION_REGEXP = new RegExp(
  `\\b(?:${NEGATION_TOKENS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "i",
);

/** Split text into sentences for sentence-scoped negation analysis. */
function splitSentences(text: string): string[] {
  return text
    .split(/[.!?;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Returns true if any of the supplied strings contains prohibited investment
 * language that is NOT negated within its sentence.
 *
 * Compliant disclaimers ("...are donations and are not an investment, confer no
 * financial return, and grant no programmatic, governance, or other rights")
 * pass because the prohibited terms share a sentence with a negation. Affirmative
 * framing ("Invest now for a financial return") is flagged.
 */
export function containsProhibitedInvestmentLanguage(
  texts: readonly string[],
): boolean {
  for (const text of texts) {
    if (!text) continue;
    for (const sentence of splitSentences(text)) {
      const hasProhibited = PROHIBITED_REGEXPS.some((re) => re.test(sentence));
      if (!hasProhibited) continue;
      // A prohibited term is present; only a flag if the sentence does not negate it.
      if (!NEGATION_REGEXP.test(sentence)) {
        return true;
      }
    }
  }
  return false;
}
