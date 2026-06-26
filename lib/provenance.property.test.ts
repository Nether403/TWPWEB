// lib/provenance.property.test.ts
//
// Property test for the Provenance_Explorer trace completeness (task 9.4).
//
// The pure core in lib/provenance.ts resolves a selected mock Witness record id
// into a stepwise, explicitly-simulated provenance trace. Property 11 guarantees
// field completeness: for ANY mock Witness record, the resolved trace includes a
// PII-redaction step and displays that record's SHA-256 hash, RFC-3161 timestamp
// token, IPFS content identifier, and Cohen's Kappa value (Req 12.2).

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  MOCK_PROVENANCE_DB,
  MOCK_PROVENANCE_IDS,
  resolveTrace,
} from "./provenance";

// Arbitrary mock Witness record id, drawn from the selectable identifiers (Req 12.1).
const recordId = fc.constantFrom(...MOCK_PROVENANCE_IDS);

describe("Property 11: Provenance trace field completeness", () => {
  // Feature: witness-protocol-portal, Property 11: Provenance trace field completeness
  it("for any mock record, the trace includes a redaction step and displays that record's SHA-256, RFC-3161, IPFS CID, and Kappa", () => {
    fc.assert(
      fc.property(recordId, (id) => {
        const record = MOCK_PROVENANCE_DB[id];
        const trace = resolveTrace(id);

        // A selected record always resolves to a trace (Req 12.2).
        expect(trace).not.toBeNull();
        if (!trace) return;

        const stepFor = (key: string) =>
          trace.steps.find((s) => s.key === key);

        // Includes a PII-redaction step (Req 12.2).
        expect(stepFor("redaction")).toBeDefined();

        // Displays that record's SHA-256 hash, RFC-3161 token, and IPFS CID
        // verbatim, and its Cohen's Kappa value (Req 12.2).
        expect(stepFor("sha256")?.value).toContain(record.sha256);
        expect(stepFor("rfc3161")?.value).toContain(record.rfc3161);
        expect(stepFor("ipfs")?.value).toContain(record.ipfsCID);
        expect(stepFor("kappa")?.value).toContain(String(record.kappa));
      }),
      { numRuns: 200 },
    );
  });
});
