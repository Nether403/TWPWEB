import type { Metadata } from "next";
import { ProvenanceExplorer } from "@/components/provenance-explorer";

/**
 * /demos/provenance — Cryptographic provenance explorer (Req 12).
 *
 * Statically rendered shell around the client explorer. The page owns the
 * heading/intro copy; the client component owns record selection and the
 * stepwise trace render (PII redaction, SHA-256, RFC-3161, IPFS CID, Cohen's
 * Kappa). This is an explicitly-simulated demonstration — the Portal performs
 * no real cryptography and stores no real Witness records; the real provenance
 * machinery lives in the G_5.2 runtime.
 */

export const metadata: Metadata = {
  title: "Provenance Explorer — The Witness Protocol",
  description:
    "A simulated demonstration of a Witness record's cryptographic provenance trace: PII redaction, SHA-256 content hash, RFC-3161 timestamp, IPFS content identifier, and Cohen's Kappa inter-rater agreement.",
};

export default function ProvenanceDemoPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Demonstration — Provenance Explorer
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Provenance you can inspect
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Integrity claims should be checkable, not taken on faith. Select a
          mock Witness record to walk its provenance chain — from PII redaction
          through content hashing, trusted timestamping, content-addressed
          pinning, and inter-rater agreement scoring. Every value shown is
          simulated demonstration data.
        </p>
      </header>

      <ProvenanceExplorer />
    </main>
  );
}
