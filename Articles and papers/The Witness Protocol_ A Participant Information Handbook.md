---
Audience_Tags: [contributor]
---

## The Witness Protocol: Participant Information Handbook

Welcome to The Witness Protocol. You are being invited to contribute to a non-commercial research initiative: a first-party, consented corpus and evaluation substrate for AI alignment. The initiative is in Phase 5 Beta v0.9 and Dutch Stichting registration is in progress.

The Protocol does not exist to build a social network or commercial product. It exists to preserve high-signal human moral reasoning before future systems inherit only the noise of uncurated digital exhaust.

## What Participation Means

A witness contributes lived moral reasoning: moments of conflict, accountability, uncertainty, care, and consequence. We are not looking for polished opinions. We are looking for reasoning that survives scrutiny.

The current participation path is handled by the live Platform and the governed G_5.2 runtime, not by this public Portal.

## The Gate

Testimony is not accepted wholesale. The Gate is designed to protect the corpus from low-signal noise:

1. An AI Sieve checks baseline coherence, relevance, and authenticity signals.
2. A qualitative qualifier looks for specificity, counterfactual reasoning, and relational context.
3. Human review applies governance judgment before testimony can move deeper into the system.

Dual-rater review and Cohen's kappa targets are part of the governance ambition, but public copy should treat operational kappa scoring as a target until the live workflow supports it end to end.

## The Inquisitor

The Inquisitor is a structured inquiry instrument. It is not a companion chatbot and not a moral authority. Its role is to help you articulate the strongest, most honest version of your reasoning.

The dialogue may ask follow-up questions, press for specificity, explore counterfactuals, and steel-man your own position before challenging it. The goal is not comfort. The goal is fidelity to the reasoning process.

## Privacy and De-Identification

The Protocol separates identity/control-plane data from governed testimony artifacts.

Current implementation uses staged PII handling:

- hard-format identifiers are stripped before Gate model calls;
- Candidate Isolation is used for PII classification and de-identification;
- only isolated candidate tokens are sent to the classifier for that PII-classification step;
- runtime testimony is governed by consent gates and separated from unrelated P-E-S/persona state.

This is a strong privacy architecture, but it should be described precisely. Raw Gate submissions are handled in the control plane and should not be described as never stored.

## Consent and Revocation

Consent is granular. Speaking with the Protocol does not automatically authorize retention, synthesis, annotation, archive review, publication, partner sharing, or public release.

If you withdraw or downgrade consent, revocation blocks future use and export, marks disclosure-ledger exposures as revoked, and triggers eligible internal or partner data-removal paths where technically and contractually possible.

If a public subset has already been downloaded, cited, or redistributed, global deletion of those public copies is technologically impossible. The Foundation records the revocation and stops future distribution, but no system can reach every public copy after release. This limit must be understood before public-publication consent is granted.

## Provenance

The live system uses hashes and disclosure-ledger records to preserve auditability. RFC-3161 timestamping and IPFS/content-addressed archival are planned provenance layers, not current production guarantees.

## Your Role

You are not a data point. You are a witness to human reasoning under pressure. The Protocol's responsibility is to preserve that reasoning with consent, restraint, and technical honesty.

For questions, use the Portal contact page. For real participation, consent, and Gate actions, follow the Platform links from the Participate page.
