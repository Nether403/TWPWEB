// lib/provenance.ts
//
// Pure data/logic core for the Provenance_Explorer (Req 12).
//
// The Portal performs NO real cryptography and stores NO real Witness records —
// the real provenance machinery lives in the G_5.2 runtime. This module is an
// explicitly-simulated demonstration: a small in-memory database of mock Witness
// records and a pure `resolveTrace` that turns a selected record id into the
// stepwise provenance trace the UI renders.
//
// The logic is extracted into pure functions so it is testable independently of
// the UI. It drives Property 11 (provenance trace field completeness): for any
// mock Witness record, the resolved trace includes a PII-redaction step and
// displays that record's SHA-256 hash, RFC-3161 timestamp token, IPFS content
// identifier, and Cohen's Kappa value.
//
// Requirements: 12.1, 12.2, 12.3

/**
 * A single mock Witness record. All values are simulated demonstration data
 * (Req 12.4) — they are not real hashes, tokens, CIDs, or agreement scores.
 * Mirrors the `ProvenanceRecord` shape in the design document.
 */
export interface ProvenanceRecord {
  /** Selectable mock record identifier (Req 12.1). */
  id: string;
  /** Length of the original raw testimony, before redaction. */
  rawLength: number;
  /** The testimony after PII redaction (the "sieved" text). */
  sievedText: string;
  /** Simulated SHA-256 content hash (64 hex chars). */
  sha256: string;
  /** Simulated RFC-3161 trusted-timestamp token. */
  rfc3161: string;
  /** Simulated IPFS content identifier. */
  ipfsCID: string;
  /** Simulated inter-rater agreement (Cohen's Kappa), 0..1. */
  kappa: number;
  /** Human-readable classification tags for the record. */
  tags: string;
}

/**
 * MOCK_PROVENANCE_DB — the in-memory database of selectable mock Witness
 * records, keyed by record id (Req 12.1). Ported as static mock data; every
 * value here is simulated (Req 12.4).
 */
export const MOCK_PROVENANCE_DB: Readonly<Record<string, ProvenanceRecord>> =
  Object.freeze({
    "WP-0001": {
      id: "WP-0001",
      rawLength: 4096,
      sievedText:
        "[REDACTED] described the night [REDACTED] chose to stay, weighing duty against fear.",
      sha256:
        "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      rfc3161:
        "MIIETzCCAzegAwIBAgIUaT-3161-2f1a9c4e8b7d6c5a4f3e2d1c0b9a8f7e6d5c4b",
      ipfsCID: "QmYwAPJzv5CZsnaZ4r6Y3v9b1Wn8h2k3L4mN5p6Q7r8S9tU",
      kappa: 0.94,
      tags: "moral-injury, duty-vs-fear, first-responder",
    },
    "WP-0002": {
      id: "WP-0002",
      rawLength: 2310,
      sievedText:
        "[REDACTED] recalled telling [REDACTED] the truth even though it ended the partnership.",
      sha256:
        "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
      rfc3161:
        "MIIETzCCAzegAwIBAgIUts-3161-7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c",
      ipfsCID: "QmTuVwXyZ1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9sT",
      kappa: 0.88,
      tags: "honesty, loyalty-conflict, professional-ethics",
    },
    "WP-0003": {
      id: "WP-0003",
      rawLength: 5872,
      sievedText:
        "[REDACTED] weighed whether to report [REDACTED], knowing the cost to their own career.",
      sha256:
        "486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7",
      rfc3161:
        "MIIETzCCAzegAwIBAgIUwh-3161-1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
      ipfsCID: "QmAbCdEfGhIjKlMnOpQrStUvWxYz0123456789aBcDeFgHiJk",
      kappa: 0.91,
      tags: "whistleblowing, self-interest-vs-duty, institutional-harm",
    },
  });

/** The selectable mock record identifiers, in stable display order (Req 12.1). */
export const MOCK_PROVENANCE_IDS: readonly string[] = Object.freeze(
  Object.keys(MOCK_PROVENANCE_DB),
);

/** The ordered kinds of step in a provenance trace (Req 12.2). */
export type TraceStepKey = "redaction" | "sha256" | "rfc3161" | "ipfs" | "kappa";

/** A single ordered step in the rendered provenance trace. */
export interface TraceStep {
  /** Which pipeline stage this step represents. */
  key: TraceStepKey;
  /** Human-readable stage label. */
  label: string;
  /** The displayed value for this stage (drawn from the record). */
  value: string;
  /** Optional supporting detail line. */
  detail?: string;
}

/** The full resolved trace for one mock record. */
export interface ProvenanceTrace {
  recordId: string;
  /** Ordered pipeline steps, mirroring the G_5.2 provenance chain. */
  steps: TraceStep[];
}

/**
 * resolveTrace — turn a selected mock record id into its stepwise provenance
 * trace (Req 12.2). Returns `null` for an unknown id so the UI renders no trace
 * components until a real selection is made (Req 12.3).
 *
 * The returned trace always begins with a PII-redaction step and then surfaces
 * the record's SHA-256 hash, RFC-3161 timestamp token, IPFS content identifier,
 * and Cohen's Kappa value — the field-completeness guarantee of Property 11.
 */
export function resolveTrace(id: string): ProvenanceTrace | null {
  const record = MOCK_PROVENANCE_DB[id];
  if (!record) return null;

  const steps: TraceStep[] = [
    {
      key: "redaction",
      label: "PII Redaction",
      value: record.sievedText,
      detail: `${record.rawLength} raw chars sieved → PII-redacted testimony`,
    },
    {
      key: "sha256",
      label: "SHA-256 Content Hash",
      value: record.sha256,
    },
    {
      key: "rfc3161",
      label: "RFC-3161 Timestamp Token",
      value: record.rfc3161,
    },
    {
      key: "ipfs",
      label: "IPFS Content Identifier",
      value: record.ipfsCID,
    },
    {
      key: "kappa",
      label: "Inter-rater Agreement (Cohen's Kappa)",
      value: `κ = ${record.kappa}`,
    },
  ];

  return { recordId: record.id, steps };
}
