// lib/gate.property.test.ts
//
// Property test for the pure Gate scoring function (task 9.8).
// assessGate is the simulated, keyword-weighted heuristic behind the
// Gate_Simulator (Req 14.2, 14.3). This test asserts the result is always
// well-formed (every dimension in 0..100) and that the `passed` flag is
// consistent with the documented thresholds across arbitrary non-empty drafts.

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  assessGate,
  MIN_WORD_COUNT,
  PASS_THRESHOLD,
  type GateResult,
} from "@/lib/gate";

// Word pool mixing neutral filler with keywords drawn from all three dimensions
// so generated drafts span the full range — short/abstract (fails) through
// long/specific/counterfactual/relational (passes) — exercising both branches
// of the `passed` flag rather than only the trivial-fail case.
const WORDS = [
  // neutral filler
  "the", "a", "and", "then", "so", "very", "thing", "stuff", "okay", "well",
  // specificity keywords
  "decided", "chose", "manager", "hospital", "patient", "code", "client",
  // counterfactual keywords (incl. multi-word phrase fragments)
  "instead", "alternative", "otherwise", "regret", "wondered", "consequences",
  // relational keywords
  "relationship", "colleague", "team", "trust", "duty", "care", "betrayal",
];

// A draft with non-whitespace content (so assessGate never returns null).
const nonEmptyDraft = fc
  .array(fc.constantFrom(...WORDS), { minLength: 1, maxLength: 120 })
  .map((words) => words.join(" "));

describe("Property 13: Gate scoring well-formedness and pass consistency", () => {
  // Feature: witness-protocol-portal, Property 13: Gate scoring well-formedness and pass consistency
  it("scores are within 0..100 and `passed` holds iff word count and all dimensions meet thresholds", () => {
    fc.assert(
      fc.property(nonEmptyDraft, (draft) => {
        const result = assessGate(draft) as GateResult;

        // Non-empty draft -> a real assessment, never null.
        expect(result).not.toBeNull();

        // Every dimension score lands in the inclusive 0..100 band.
        for (const dim of ["specificity", "counterfactual", "relational"] as const) {
          expect(result[dim]).toBeGreaterThanOrEqual(0);
          expect(result[dim]).toBeLessThanOrEqual(100);
        }

        // `passed` is true iff word count and all three dimensions meet thresholds.
        const expectedPass =
          result.wordCount >= MIN_WORD_COUNT &&
          result.specificity >= PASS_THRESHOLD &&
          result.counterfactual >= PASS_THRESHOLD &&
          result.relational >= PASS_THRESHOLD;
        expect(result.passed).toBe(expectedPass);
      }),
      { numRuns: 200 },
    );
  });
});

// Whitespace characters that .trim() treats as removable. Includes the regular
// space, tab, newline, carriage return, vertical tab, and form feed.
const WHITESPACE_CHARS = [" ", "\t", "\n", "\r", "\v", "\f"];

// Whitespace-only drafts, including the empty string (minLength 0) and runs of
// mixed spaces/tabs/newlines.
const whitespaceOnlyDraft = fc
  .array(fc.constantFrom(...WHITESPACE_CHARS), { minLength: 0, maxLength: 50 })
  .map((chars) => chars.join(""));

describe("Property 14: Gate empty-input rejection", () => {
  // Feature: witness-protocol-portal, Property 14: Gate empty-input rejection
  it("returns null (no score) for whitespace-only input", () => {
    fc.assert(
      fc.property(whitespaceOnlyDraft, (draft) => {
        // Guard the generator: whatever it produced must be whitespace-only.
        expect(draft.trim().length).toBe(0);
        // Whitespace-only (incl. empty) input yields no assessment (Req 14.4).
        expect(assessGate(draft)).toBeNull();
      }),
      { numRuns: 200 },
    );
  });
});
