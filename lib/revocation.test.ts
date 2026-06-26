import { describe, it, expect } from "vitest";
import {
  INITIAL_REVOCATION_STATE,
  REVOCATION_STEP_COUNT,
  isRevocationComplete,
  revocationReducer,
  type RevocationState,
} from "./revocation";

/** Run the full cascade from the initial state by dispatching `step` to the end. */
function runToCompletion(): RevocationState {
  let state = INITIAL_REVOCATION_STATE;
  for (let i = 0; i < REVOCATION_STEP_COUNT; i++) {
    state = revocationReducer(state, { type: "step" });
  }
  return state;
}

describe("revocation state machine (Req 13)", () => {
  it("starts connected and sealed with an empty log (Req 13.1)", () => {
    expect(INITIAL_REVOCATION_STATE.bridge).toBe("CONNECTED");
    expect(INITIAL_REVOCATION_STATE.vault).toBe("SEALED");
    expect(INITIAL_REVOCATION_STATE.log).toEqual([]);
  });

  it("first step opens the bridge into REVOKING (Req 13.2)", () => {
    const next = revocationReducer(INITIAL_REVOCATION_STATE, { type: "step" });
    expect(next.bridge).toBe("REVOKING");
    expect(next.log).toHaveLength(1);
  });

  it("culminates in a severed bridge and a purged vault (Req 13.2)", () => {
    const done = runToCompletion();
    expect(done.bridge).toBe("REVOKED");
    expect(done.vault).toBe("PURGED");
    expect(done.log).toHaveLength(REVOCATION_STEP_COUNT);
    expect(isRevocationComplete(done)).toBe(true);
    // Stepping past completion is a no-op.
    expect(revocationReducer(done, { type: "step" })).toBe(done);
  });

  it("reset returns to the initial connected/sealed state (Req 13.3)", () => {
    const reset = revocationReducer(runToCompletion(), { type: "reset" });
    expect(reset.bridge).toBe("CONNECTED");
    expect(reset.vault).toBe("SEALED");
    expect(reset.log).toEqual([]);
    expect(reset.step).toBe(0);
  });
});
