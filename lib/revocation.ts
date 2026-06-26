// lib/revocation.ts
//
// Pure state machine for the Revocation_Simulator (Req 13).
//
// The Portal owns NO consent records and performs NO real revocation — the real
// participation & consent surface lives on the Platform (Req 1.5). This module
// is an explicitly-simulated demonstration of the consent revocation cascade
// between the Control Plane bridge and the G_5.2 data vault.
//
// The logic is extracted into a pure reducer so it is testable independently of
// the UI (drives Property 12: revocation reset round-trip — after any
// trigger/reset sequence, reset returns to bridge CONNECTED and vault SEALED).
//
// Requirements: 13.1, 13.2, 13.3, 13.4

/** Control Plane bridge status: CONNECTED → REVOKING → REVOKED (Req 13.1, 13.2). */
export type BridgeStatus = "CONNECTED" | "REVOKING" | "REVOKED";

/** G_5.2 data vault status: SEALED → PURGED (Req 13.1, 13.2). */
export type VaultStatus = "SEALED" | "PURGED";

/** The full simulator state. */
export interface RevocationState {
  /** Control Plane bridge status. */
  bridge: BridgeStatus;
  /** G_5.2 data vault status. */
  vault: VaultStatus;
  /** Append-only stepwise log of the cascade (Req 13.2). */
  log: string[];
  /** Index of the next cascade step to apply (0 = not started). */
  step: number;
}

/**
 * The initial state: bridge connected, vault sealed, empty log (Req 13.1).
 * Frozen so the shared reference can never be mutated in place — every state
 * the reducer returns is a fresh object.
 */
export const INITIAL_REVOCATION_STATE: RevocationState = Object.freeze({
  bridge: "CONNECTED",
  vault: "SEALED",
  log: [],
  step: 0,
});

/** A single ordered cascade step: a log line plus optional status transitions. */
export interface CascadeStep {
  /** The terminal log line appended when this step is applied. */
  text: string;
  /** Bridge status after this step, if it changes here. */
  bridge?: BridgeStatus;
  /** Vault status after this step, if it changes here. */
  vault?: VaultStatus;
}

/**
 * REVOCATION_CASCADE — the ordered cascade ported from the draft prototype
 * (`triggerRevocationCascade`). The first step opens the bridge into REVOKING;
 * the final step severs it (REVOKED) and purges the vault (PURGED), satisfying
 * "culminating in a severed bridge state and a purged vault state" (Req 13.2).
 */
export const REVOCATION_CASCADE: readonly CascadeStep[] = [
  {
    text: "WARNING: Consent Revocation Sequence initiated on Control Plane.",
    bridge: "REVOKING",
  },
  { text: "Step 1: Locating witness metadata keys in isolated Identity Vault." },
  { text: "Step 2: Generating cryptographic purge vectors for related traces." },
  { text: "Step 3: Broadcasting delete triggers across the split-plane boundary." },
  {
    text: "G_5.2: Anonymized transcript entries deleted. Cascade completed successfully.",
  },
  {
    text: "Step 4: Invalidating session bridge authorization key (requireWitnessBridgeAuth → false).",
  },
  { text: "Step 5: Revoking all downstream partner DUAs. Hard veto compiled." },
  {
    text: "CRITICAL EXCEPTION: Bridge Link Severed. G_5.2 Runtime returned code 403 (FORBIDDEN).",
    bridge: "REVOKED",
    vault: "PURGED",
  },
] as const;

/** Total number of cascade steps. */
export const REVOCATION_STEP_COUNT = REVOCATION_CASCADE.length;

/** Reducer actions: advance one cascade step, or reset to the initial state. */
export type RevocationAction = { type: "step" } | { type: "reset" };

/** True once the cascade has run to completion (bridge severed, vault purged). */
export function isRevocationComplete(state: RevocationState): boolean {
  return state.step >= REVOCATION_STEP_COUNT;
}

/**
 * Pure reducer for the revocation simulator.
 *
 *  - `step`  : apply the next cascade step (no-op once complete). The first step
 *              moves the bridge to REVOKING; the last severs the bridge and
 *              purges the vault (Req 13.2).
 *  - `reset` : return to the initial connected/sealed state with an empty log,
 *              regardless of how far the cascade progressed (Req 13.3). This is
 *              what guarantees the reset round-trip property (Property 12).
 */
export function revocationReducer(
  state: RevocationState,
  action: RevocationAction,
): RevocationState {
  switch (action.type) {
    case "reset":
      // ponytail: spread the frozen initial state into a fresh, mutable object
      // (with a new log array) so callers never share the frozen reference.
      return { ...INITIAL_REVOCATION_STATE, log: [] };

    case "step": {
      if (isRevocationComplete(state)) return state;
      const next = REVOCATION_CASCADE[state.step];
      return {
        bridge: next.bridge ?? state.bridge,
        vault: next.vault ?? state.vault,
        log: [...state.log, next.text],
        step: state.step + 1,
      };
    }

    default:
      return state;
  }
}
