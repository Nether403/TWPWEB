// lib/gate.ts
//
// Gate self-assessment scoring (Req 14.2, 14.3, 14.4, 14.5).
//
// The scoring is extracted into a PURE function so it is testable independently
// of the Gate_Simulator UI (design.md "Interactive Demonstrations"). It is a
// simulated demonstration: a keyword-weighted heuristic ported from the draft
// prototype (`draft_witness_protocol_site.tsx`), NOT the real Gate engine. The
// real, formal submission lives on the Platform `/gate` (Req 1.3).
//
// Three distinct outcomes — a failed assessment is NEVER collapsed into zero
// scores (Req 14.5):
//   - null                       : empty / whitespace-only input (Req 14.4)
//   - GateResult                 : a valid assessment with real scores (Req 14.2, 14.3)
//   - throws GateAssessmentError : the draft could not be evaluated (Req 14.5)

/** A valid Gate assessment result (design "GateResult"). */
export interface GateResult {
  /** Word count of the draft (trimmed, whitespace-split). */
  wordCount: number;
  /** Specificity dimension score, 0..100. */
  specificity: number;
  /** Counterfactual-depth dimension score, 0..100. */
  counterfactual: number;
  /** Relational-context dimension score, 0..100. */
  relational: number;
  /** Overall pass flag — true iff word count and all three dimensions meet thresholds. */
  passed: boolean;
}

/**
 * Raised when the assessment cannot evaluate the submitted draft (Req 14.5).
 * The UI surfaces an error message on this and SHALL NOT display zero scores in
 * place of a valid assessment.
 */
export class GateAssessmentError extends Error {
  constructor(message = "The Gate assessment could not evaluate this draft.") {
    super(message);
    this.name = "GateAssessmentError";
  }
}

/** Minimum word count for a passing draft (ported from the draft prototype). */
export const MIN_WORD_COUNT = 50;
/** Minimum per-dimension score for a passing draft. */
export const PASS_THRESHOLD = 55;

// Keyword sets and weights ported verbatim from the draft prototype. Each
// dimension has a non-zero base so a serious-but-imperfect draft never reads as
// a hard zero; matches add weight up to the 0..100 cap.
const SPECIFICITY = {
  base: 30,
  weight: 12,
  keywords: [
    "decided", "chose", "manager", "hospital", "patient", "code", "engineer",
    "fired", "client", "money", "told", "conflict", "hours", "refused",
  ],
};
const COUNTERFACTUAL = {
  base: 25,
  weight: 15,
  keywords: [
    "if i had", "could have", "instead", "alternative", "otherwise",
    "changed", "regret", "wondered", "retrospect", "consequences",
  ],
};
const RELATIONAL = {
  base: 20,
  weight: 14,
  keywords: [
    "relationship", "harm", "colleague", "team", "family", "trust", "duty",
    "care", "responsibility", "betrayal", "we", "them",
  ],
};

/** Score one dimension: base + (matches * weight), capped at 100. */
function scoreDimension(
  text: string,
  { base, weight, keywords }: { base: number; weight: number; keywords: string[] },
): number {
  const matches = keywords.filter((k) => text.includes(k)).length;
  return Math.min(base + matches * weight, 100);
}

/** A finite number within the inclusive 0..100 range. */
function isValidScore(n: number): boolean {
  return Number.isFinite(n) && n >= 0 && n <= 100;
}

/**
 * Assess draft testimony against the three Gate dimensions.
 *
 * @param input draft testimony text
 * @returns a {@link GateResult}, or `null` for empty / whitespace-only input
 * @throws {GateAssessmentError} when the draft cannot be evaluated
 */
export function assessGate(input: string): GateResult | null {
  // Trust-boundary guard: a runtime caller could pass a non-string. This is a
  // genuine "cannot evaluate" condition, not an empty draft (Req 14.5).
  if (typeof input !== "string") {
    throw new GateAssessmentError(
      "The Gate assessment received an invalid draft and could not evaluate it.",
    );
  }

  // Empty / whitespace-only input: no score, show the prompt-to-enter-text
  // state. Distinct from a failed assessment (Req 14.4).
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const text = input.toLowerCase();
  const wordCount = trimmed.split(/\s+/).length;

  const specificity = scoreDimension(text, SPECIFICITY);
  const counterfactual = scoreDimension(text, COUNTERFACTUAL);
  const relational = scoreDimension(text, RELATIONAL);

  // Invariant guard: every dimension must land in 0..100. If the heuristic ever
  // produces a value outside that band (or NaN), the assessment is invalid — we
  // throw rather than emit bogus/zero scores in place of a valid assessment
  // (Req 14.5).
  if (
    !isValidScore(specificity) ||
    !isValidScore(counterfactual) ||
    !isValidScore(relational) ||
    !Number.isFinite(wordCount)
  ) {
    throw new GateAssessmentError();
  }

  const passed =
    wordCount >= MIN_WORD_COUNT &&
    specificity >= PASS_THRESHOLD &&
    counterfactual >= PASS_THRESHOLD &&
    relational >= PASS_THRESHOLD;

  return { wordCount, specificity, counterfactual, relational, passed };
}
