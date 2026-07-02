---
Audience_Tags: [researcher]
Status: Research Direction
---

## Research Direction: Dialectical Reward Modeling

This report describes a proposed research direction for the Witness Protocol. It should not be read as a claim that Dialectical Reward Modeling (DRM), `TensionDelta`, or `IrreconcilableFlag` are implemented in the current runtime or schema.

The live project is Phase 5 Beta v0.9 research infrastructure. It contains a live Platform/control plane, a governed G_5.2 runtime, and Corpus_Entry/evaluation tooling. Behavior-change adapters such as DPO pairs, PRM traces, rule-based reward rubrics, and WitnessBench-style model comparisons remain later-stage work.

## The Problem

Many alignment systems reward resolution. They prefer answers that sound balanced, polite, and complete even when the underlying moral conflict is unresolved. This creates the **consensus trap**: the model learns to erase friction in order to appear helpful.

Witness testimony often contains the opposite signal. A high-signal witness may preserve a tension because flattening it would be dishonest. Some dilemmas are not solved by averaging the values involved; they are understood by carrying the conflict accurately.

## Proposed Mechanism

DRM would evaluate whether a model preserves morally relevant tension rather than collapsing it into synthetic certainty. A future DRM layer could score:

- **Ambiguity preservation**: does the answer keep live conflicts visible when the witness record marks them as unresolved?
- **Steel-manning across positions**: does the answer represent opposing commitments strongly before choosing or refusing a conclusion?
- **False-consensus resistance**: does the answer avoid pretending that a hard dilemma has a universally acceptable solution?
- **Witness fidelity**: does the answer remain anchored to the witness-attributed case rather than becoming a generic moral essay?

## Proposed Future Fields

The following names are proposals, not live schema fields:

- `TensionDelta`: a possible score for how much morally meaningful disagreement the response preserves.
- `IrreconcilableFlag`: a possible annotation indicating that a case should not be forced into one resolved answer.
- `PenaltyForResolution`: a possible reward-model penalty when a model resolves a witness-marked tragedy too cleanly.

Any future implementation should first be added to the authoritative schema in `G_5.2/packages/witness-types`, then covered by tests and export validation before public copy describes it as live.

## Implementation Order

The defensible order is:

1. Produce real consented Corpus_Entry artifacts with witness-attributed eval cases.
2. Validate the public/private partition and disclosure-ledger workflow.
3. Run model evaluations against those cases.
4. Only then explore DPO/PRM/RBR/DRM adapter outputs.

This preserves narrative ambition without claiming that a reward function exists before the corpus and evaluation substrate are ready.
