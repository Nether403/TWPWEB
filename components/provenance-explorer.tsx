"use client";

import { useState } from "react";
import {
  MOCK_PROVENANCE_IDS,
  resolveTrace,
  type ProvenanceTrace,
} from "@/lib/provenance";

/**
 * Provenance_Explorer (Req 12.1, 12.2, 12.3, 12.4).
 *
 * A simulated demonstration of the cryptographic provenance trace for a mock
 * Witness record. The Portal performs NO real cryptography and stores NO real
 * records — all logic lives in the pure core `lib/provenance.ts`; this client
 * component only tracks the selected record id and renders the resolved trace.
 *
 *   - Selectable mock record ids (Req 12.1).
 *   - On selection, a stepwise trace with a PII-redaction step plus the
 *     record's SHA-256 hash, RFC-3161 token, IPFS CID, and Cohen's Kappa
 *     (Req 12.2).
 *   - NO trace components render before a record is selected (Req 12.3) — the
 *     initial `selectedId` is null, so `resolveTrace` is never called and the
 *     trace region shows only a prompt.
 *   - Every displayed value is labelled simulated demonstration data (Req 12.4).
 *
 * Styling stays within the basalt/paper tokens — no accent hues, no rounded
 * corners; the global fade token handles transitions (Req 18).
 */

export function ProvenanceExplorer() {
  // No record selected initially — keeps the trace region empty (Req 12.3).
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Only resolve once a real selection is made; null id yields no trace.
  const trace: ProvenanceTrace | null =
    selectedId === null ? null : resolveTrace(selectedId);

  return (
    <section className="flex flex-col gap-6">
      {/* Simulated-demonstration label (Req 12.4). */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Simulated demonstration — every value below is mock provenance data, not
        a real hash, token, CID, or agreement score.
      </p>

      {/* Selectable mock Witness record identifiers (Req 12.1). */}
      <div
        role="tablist"
        aria-label="Mock Witness record"
        className="flex flex-wrap gap-px border border-border bg-border font-mono text-xs uppercase tracking-[0.15em]"
      >
        {MOCK_PROVENANCE_IDS.map((id) => {
          const selected = id === selectedId;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSelectedId(id)}
              className={`flex-1 px-4 py-3 text-center ${
                selected
                  ? "bg-bg font-bold text-fg"
                  : "bg-bg/60 text-muted hover:text-fg"
              }`}
            >
              {id}
            </button>
          );
        })}
      </div>

      {/* Trace region. Before a selection, NO trace components render — only a
          prompt to choose a record (Req 12.3). */}
      {trace === null ? (
        <p
          data-testid="provenance-empty-prompt"
          className="border border-border bg-bg p-5 text-base italic leading-relaxed text-muted"
        >
          Select a mock Witness record above to resolve its simulated provenance
          trace.
        </p>
      ) : (
        <ol
          data-testid="provenance-trace"
          aria-label={`Provenance trace for ${trace.recordId}`}
          className="flex flex-col gap-px border border-border bg-border"
        >
          {trace.steps.map((step, index) => (
            <li
              key={step.key}
              data-step={step.key}
              className="flex flex-col gap-2 bg-bg p-5"
            >
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                <span className="text-fg">{index + 1}.</span> {step.label}
              </h2>
              <p className="whitespace-pre-line break-words font-mono text-sm leading-relaxed text-fg">
                {step.value}
              </p>
              {step.detail && (
                <p className="text-sm italic leading-relaxed text-muted">
                  {step.detail}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      <p className="text-base italic leading-relaxed text-muted">
        Each accepted Witness record carries a verifiable provenance chain: PII
        is sieved out, the redacted content is hashed, the hash is anchored to a
        trusted timestamp and pinned to content-addressed storage, and the
        annotation is scored for inter-rater agreement — so integrity can be
        checked without exposing the witness.
      </p>
    </section>
  );
}
