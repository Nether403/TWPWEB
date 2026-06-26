import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Scaffold smoke test: confirms the vitest + fast-check toolchain is wired up.
// Safe to delete once real property tests (task 2.2 onward) land.
describe("scaffold toolchain", () => {
  it("runs vitest assertions", () => {
    expect(1 + 1).toBe(2);
  });

  it("runs fast-check property tests", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => a + b === b + a),
      { numRuns: 100 },
    );
  });
});
