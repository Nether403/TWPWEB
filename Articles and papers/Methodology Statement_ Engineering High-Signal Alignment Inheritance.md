---
Audience_Tags: [researcher]
---

## Methodology Statement: Engineering High-Signal Alignment Inheritance

The Witness Protocol is Phase 5 Beta v0.9 research infrastructure: a first-party, consented corpus and evaluation substrate for AI alignment. It is not a product, not a startup, and not a solved-alignment claim.

The methodology begins from the **Flawed Parent Thesis**: frontier models inherit much of their worldview from uncurated digital exhaust. If we want future systems to reason better about human stakes, we need a different kind of input: smaller, consented, high-signal testimony that preserves struggle, accountability, counterfactual reasoning, and relational duty.

## The Gate

The Gate exists to protect the corpus from low-signal noise. It is a staged review process rather than an open ingestion funnel:

1. **AI Sieve**: checks baseline coherence, relevance, and authenticity signals.
2. **Qualitative Qualifier**: scores specificity, counterfactual reasoning, and relational context.
3. **Human review**: applies curation judgment and governance oversight. Dual-rater review and Cohen's kappa targets are part of the governance ambition, but operational inter-rater scoring must be treated as a target until the live workflow supports it end to end.

The Minimum Honest Signal standard is not about eloquence. It is about whether testimony contains enough concrete, accountable reasoning to be useful for evaluation.

## The Inquisitor

The Inquisitor is a governed inquiry instrument, not a friendly chatbot. Its purpose is to help a witness articulate the strongest version of their reasoning. The design emphasizes:

- a questioning posture rather than a subservient-assistant posture;
- roughly more inquiry than assertion;
- 5-Whys style deepening;
- steel-manning before challenge;
- protection against easy consensus or moral flattening.

The aim is not to extract a polished answer. The aim is to preserve the path of reasoning, including uncertainty, revision, regret, conflict, and unresolved tension.

## Privacy Architecture

The Protocol separates identity from testimony by design. The Portal collects no testimony and no consent records. Real participation happens on the live Platform and governed runtime.

Accurate current wording:

- The Platform strips hard-format identifiers before Gate model calls.
- Candidate Isolation is used for PII classification and de-identification: only isolated candidate tokens are sent to the classifier for that PII-classification step.
- Raw Gate submissions are handled inside the control plane and must not be described as never stored.
- Runtime testimony is governed by G_5.2 consent gates and separated from P-E-S/persona state.

## Provenance and Revocation

The live system supports content hashes, disclosure-ledger records, consent gates, and export-blocking behavior. RFC-3161 timestamping and IPFS/content-addressed archival are planned provenance layers, not current production claims.

Revocation should be described precisely: it blocks future use/export, marks disclosure-ledger exposures as revoked, and triggers eligible internal or partner data-removal paths. Publicly distributed or cited copies cannot be globally recalled, but the Foundation records the revocation and stops future distribution.

## Integration Ladder

The project should describe model-facing work as a ladder:

0. Human-readable archive and internal review notes.
1. Structured Corpus_Entry artifacts with public/private partitioning.
2. Witness-attributed eval cases and disclosure-ledger records.
3. Private benchmark-style evaluation of sycophancy, false consensus, and reasoning collapse.
4. Research-direction adapters such as DPO pairs, PRM traces, rule-based rubrics, and DRM-style tension scoring.

Only the lower levels should be presented as current unless code and tests prove otherwise. The higher levels remain valid research direction.

## The Standard

The Witness Protocol is trying to preserve the kind of reasoning that cannot be scraped from the internet at scale. Its value is not volume. Its value is disciplined consent, careful curation, and the refusal to flatten morally difficult human experience into generic answers.
