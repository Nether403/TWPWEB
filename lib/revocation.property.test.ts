// lib/revocation.property.test.ts
//
// Property test for the Revocation_Simulator reset round-trip (task 9.6).
//
// The reducer in lib/revocation.ts drives an explicitly-simulated consent
// revocation cascade. Property 12 guarantees that `reset` is a true escape
// hatch: no matter how the cascade was driven beforehand — partially stepped,
// fully completed, stepped past completion, or already reset — a final `reset`
// always lands back on the initial connected/sealed state with an empty log
// (Req 13.3).

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  INITIAL_REVOCATION_STATE,
  revocationReducer,
  type RevocationAction,
} from "./revocation";

// Arbitrary single action: advance the cascade, or reset it.
const action: fc.Arbitrary<RevocationAction> = fc.oneof(
  fc.constant<RevocationAction>({ type: "step" }),
  fc.constant<RevocationAction>({ type: "reset" }),
);

// An arbitrary trigger/reset sequence of any length (including empty), to which
// we append a final `reset` so the sequence always ends in a reset.
const sequence = fc.array(action, { maxLength: 50 });

describe("Property 12: Revocation reset round-trip", () => {
  // Feature: witness-protocol-portal, Property 12: Revocation reset round-trip
  it("after any trigger/reset sequence, a final reset returns CONNECTED + SEALED with an empty log", () => {
    fc.assert(
      fc.property(sequence, (actions) => {
        const finalState = [...actions, { type: "reset" } as RevocationAction]
          .reduce(revocationReducer, INITIAL_REVOCATION_STATE);

        expect(finalState.bridge).toBe("CONNECTED");
        expect(finalState.vault).toBe("SEALED");
        expect(finalState.log).toEqual([]);
        expect(finalState.step).toBe(0);
      }),
      { numRuns: 200 },
    );
  });
});
