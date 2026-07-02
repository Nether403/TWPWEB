---
Audience_Tags: [contributor, researcher]
---

## Your Story, Secured: A Guide to Our Data Privacy Architecture

The Witness Protocol asks for unusually honest moral reasoning. That only makes sense if the architecture treats privacy as a technical constraint, not a decorative promise.

This guide distinguishes three things:

- what the public Portal collects;
- what the live Platform/control plane handles;
- which stronger provenance mechanisms are planned but not yet live.

## The Portal Collects Almost Nothing

This website is a public information hub. It does not host testimony intake, consent records, authentication, the real Gate, or the real Inquisitor. Those actions live on the separate Platform.

The Portal owns only two forms: general contact and funder/invoice requests. Those submissions are stored in an isolated `portal_submissions` table and are not added to witness, consent, audit, or research data.

## The Two-Room Model

The Protocol separates the **who** from the **what**.

| Space | Contains | Purpose |
|---|---|---|
| Identity/control plane | Names, contact details, authentication state, consent records, audit records | Account, consent, review, and legal/control-plane obligations |
| Governed testimony/runtime plane | De-identified moral reasoning, witness dialogue state, consent-gated artifacts | Research and evaluation substrate |

This separation is not a claim that no raw data ever exists. Gate submissions are handled inside the control plane. The claim is narrower and more important: sensitive identity/control data must not be duplicated into research-facing runtime artifacts, and runtime testimony must not bleed into unrelated persona or P-E-S state.

## PII Handling

The current implementation uses staged de-identification:

1. Hard-format identifiers such as emails, phone numbers, URLs, IDs, IP addresses, and specific dates are stripped by local regex before Gate model calls.
2. Candidate Isolation is used for PII classification and de-identification: candidate tokens are extracted and sent to the classifier without the full testimony context for that PII-classification step.
3. Classified candidates are replaced locally with typed placeholders such as `[REDACTED_NAME]`, `[REDACTED_INSTITUTION]`, or `[REDACTED_LOCATION]`.

This means the accurate privacy claim is not “no text ever reaches an LLM.” The accurate claim is that the system strips hard identifiers before Gate model calls, and that the PII-classification step sends only isolated candidate tokens rather than full testimony context.

## Provenance

The live system uses content hashes and disclosure-ledger records to make sharing auditable. RFC-3161 timestamping and IPFS/content-addressed archival are planned provenance layers. Portal provenance demos use simulated timestamp and CID values until those layers are implemented.

## Revocation

Consent can be withdrawn. Revocation blocks future use and export, marks disclosure-ledger exposures as revoked, and triggers eligible internal or partner data-removal paths where technically and contractually possible.

There is one honest limitation: if a public subset has already been downloaded, cited, or redistributed under its public terms, no organization can globally recall every copy from the world. In that case the Foundation records the revocation, stops future distribution, and documents the limit clearly.

## Current Entity Status

This work is stewarded by The Witness Protocol Foundation initiative, with Dutch Stichting registration in progress. Until registration is finalized, public claims should not imply completed Stichting, ANBI, fiscal-sponsor, or tax status.

## The Principle

The Protocol exists because future intelligence should inherit more than our digital exhaust. But preserving high-signal testimony requires restraint: precise consent, careful de-identification, auditable disclosure, and honest limits around what technology can and cannot retract.
