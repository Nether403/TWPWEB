---
Audience_Tags: [researcher]
Status: Research Direction
---

## Research Direction: Operationalizing a Capabilities Floor

This report is a research-direction note, not a description of a currently deployed model-control system. The live Witness Protocol is Phase 5 Beta v0.9 research infrastructure: a consented corpus, Gate/control-plane workflow, governed G_5.2 runtime, and emerging Corpus_Entry/evaluation substrate. It does not claim to solve alignment or to provide a live halt/rollback mechanism for frontier-model training.

The core idea of a **Capabilities Floor** is still important. Current alignment practice often relies on soft behavioral nudges: preference shaping, policy prompts, refusal training, and post-hoc filtering. The Witness Protocol asks whether high-signal human testimony can support a stronger floor: a set of witness-derived constraints and evaluation cases that models must not flatten, evade, or falsely resolve.

## What Exists Today

The project currently supports the foundations needed for this direction:

- A Gate/control-plane workflow in TWP-platform for intake, review, consent, audit, and disclosure-ledger records.
- A governed G_5.2 runtime for witness inquiry and consent-gated testimony artifacts.
- Corpus_Entry schema/compiler/export tooling for structured, leak-checked public slices and witness-attributed eval cases.
- Portal demonstrations that illustrate provenance and revocation concepts with simulated values.

These are research-infrastructure components. They do not yet constitute a model-level constitutional veto, automated model rollback, or live production safety interlock.

## Proposed Direction

The Capabilities Floor should be treated as a staged research program:

1. **Curated testimony**: collect consented, high-signal moral reasoning through the Gate and governed inquiry path.
2. **Structured evaluation artifacts**: compile witness-attributed eval cases that preserve specificity, counterfactual reasoning, relational context, and moral tension.
3. **Failure-mode testing**: test models for sycophancy, false consensus, evasive resolution, and loss of witness-specific reasoning.
4. **Adapter research**: explore whether DPO pairs, process-reward traces, rule-based rubrics, or WitnessBench-style private evaluations can improve model behavior without flattening disagreement.
5. **Safety-boundary research**: investigate whether repeated failures against witness-derived constraints can inform stronger deployment gates or governance policies.

## What Must Remain Caveated

The following are not live claims today and should be labelled planned or research direction:

- Deterministic tripwires that halt frontier-model training.
- Automated rollback to a previous safe model state.
- RFC-3161 or IPFS provenance as a live production chain.
- Weight-shift monitoring tied to Witness testimony.
- Any claim that the Capabilities Floor is the only engineering requirement capable of ensuring safe future intelligence.

## Why the Direction Matters

The Witness Protocol remains a response to the same problem: future systems should inherit more than uncurated digital exhaust. But the defensible claim is narrower and stronger: a small, consented, high-signal corpus can become an auditable substrate for evaluating how models reason through morally difficult situations.

The long-term ambition is to make moral inheritance testable. The current work is to build the corpus, consent boundaries, eval artifacts, and governance discipline required before stronger model-control claims can be made.
