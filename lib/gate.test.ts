import { describe, it, expect } from "vitest";
import {
  assessGate,
  GateAssessmentError,
  MIN_WORD_COUNT,
  PASS_THRESHOLD,
} from "@/lib/gate";

describe("assessGate", () => {
  it("returns null for empty and whitespace-only input (Req 14.4)", () => {
    expect(assessGate("")).toBeNull();
    expect(assessGate("   ")).toBeNull();
    expect(assessGate("\n\t  \n")).toBeNull();
  });

  it("throws GateAssessmentError for a non-string draft (Req 14.5)", () => {
    // @ts-expect-error — exercising the runtime trust-boundary guard.
    expect(() => assessGate(null)).toThrow(GateAssessmentError);
    // @ts-expect-error — exercising the runtime trust-boundary guard.
    expect(() => assessGate(42)).toThrow(GateAssessmentError);
  });

  it("returns scores within 0..100 for any non-empty draft (Req 14.2)", () => {
    const result = assessGate("hello world this is a short draft");
    expect(result).not.toBeNull();
    for (const dim of ["specificity", "counterfactual", "relational"] as const) {
      expect(result![dim]).toBeGreaterThanOrEqual(0);
      expect(result![dim]).toBeLessThanOrEqual(100);
    }
  });

  it("does not pass a short, abstract draft (Req 14.3)", () => {
    const result = assessGate("Ethics matters and people should be good.");
    expect(result).not.toBeNull();
    expect(result!.passed).toBe(false);
  });

  it("passes a long, specific, counterfactual, relational draft (Req 14.3)", () => {
    // 50+ words hitting keywords across all three dimensions.
    const specific =
      "I decided to refuse when my manager told me to ship the code, the client and the money pulled against the patient hours we owed. ";
    const counterfactual =
      "If I had stayed quiet, I could have shipped instead; in retrospect I regret how the alternative consequences might have changed everything otherwise. ";
    const relational =
      "My colleague and team trusted me, a duty of care and responsibility we carried, and the betrayal we feared would harm them. ";
    const draft = specific + counterfactual + relational + "extra words ".repeat(10);

    const result = assessGate(draft);
    expect(result).not.toBeNull();
    expect(result!.wordCount).toBeGreaterThanOrEqual(MIN_WORD_COUNT);
    expect(result!.specificity).toBeGreaterThanOrEqual(PASS_THRESHOLD);
    expect(result!.counterfactual).toBeGreaterThanOrEqual(PASS_THRESHOLD);
    expect(result!.relational).toBeGreaterThanOrEqual(PASS_THRESHOLD);
    expect(result!.passed).toBe(true);
  });

  it("passed is true iff word count and all three dimensions meet thresholds (Req 14.3)", () => {
    // Strong keywords but too few words — fails on word count alone.
    const short =
      "I decided, chose, refused; if I had, instead, otherwise; team, trust, duty, harm.";
    const result = assessGate(short);
    expect(result).not.toBeNull();
    expect(result!.wordCount).toBeLessThan(MIN_WORD_COUNT);
    expect(result!.passed).toBe(false);
  });
});
