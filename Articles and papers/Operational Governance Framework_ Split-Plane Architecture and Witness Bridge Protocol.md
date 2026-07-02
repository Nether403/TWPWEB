---
Audience_Tags: [researcher]
---

## Operational Governance Framework: Split-Plane Architecture and Witness Bridge Protocol

The Witness Protocol uses a split-plane architecture so public intake, identity, consent, governed inquiry, and publication artifacts do not collapse into one undifferentiated application.

The guiding invariant is:

> Same engine, different identity. Reference across boundaries; never duplicate sensitive bodies.

## Planes and Responsibilities

| Plane | Role | Owns |
|---|---|---|
| TWPWEB / Portal | Public front-of-house | Mission copy, library, media, funding information, simulated demos, contact and invoice forms |
| TWP-platform / control plane | Live back-of-house Platform | Gate intake, auth, consent records, review/admin flow, audit log, disclosure ledger, witness bridge linkage |
| G_5.2 / governed runtime | Runtime and artifact plane | Governed inquiry, runtime consent, witness testimony artifacts, synthesis/annotation/archive/publication tooling |
| P-E-S | Separate persona/research-data path | P-E-S chat and its own consented research data, never Witness testimony |

The Portal owns no testimony, consent, auth, audit, Gate, or real Inquisitor action. It links out to the Platform for real actions.

## Linkage-Only Posture

The control plane should hold the minimum linkage required to route an accepted witness into the governed runtime. It must not become the source of truth for governed dialogue bodies, runtime testimony artifacts, or G_5.2 publication bundles.

The `witnessId` is the bridge handle. It lets the control plane route a witness without exposing real-world identity to the governed runtime as the primary operating key.

## Witness Bridge

The witness bridge is an authenticated server-to-server boundary. Public browser pages must not call G_5.2 directly for Witness runtime actions.

Current bridge principles:

- TWP-platform calls G_5.2 over the bridge, not through Portal client code.
- Requests carry bridge-auth headers such as a shared secret and caller marker.
- The runtime validates bridge auth and fails closed on missing or invalid configuration.
- TWP-platform stores references and status; G_5.2 remains the runtime source of truth for governed witness artifacts.

## Consent Model

Consent is layered. Platform distribution consent and G_5.2 runtime consent are related but not identical.

Useful distinction:

- **Platform/control-plane consent**: participation records, legal/distribution choices, disclosure terms, and public/partner sharing boundaries.
- **Runtime consent**: conversational, retention, synthesis, annotation, archive-review, and publication scopes used by G_5.2 to decide what can be stored or transformed.

No public copy should imply that speaking once authorizes all downstream uses. Publication, partner sharing, and public release require explicit scope.

## PII Handling

The current Platform strips hard-format identifiers before Gate model calls. Candidate Isolation is used for PII classification and de-identification: only isolated candidate tokens are sent to the classifier for that PII-classification step.

Do not overstate this as “no text ever reaches a model.” The accurate claim is that hard identifiers are stripped before Gate model calls and the PII-classification step avoids sending full testimony context.

## Revocation

Revocation is a use/export control and disclosure-state transition, not a magic global eraser.

Current and planned behavior should be described as:

- block future use and export;
- mark disclosure-ledger exposures as revoked;
- sever or block the active bridge linkage where applicable;
- trigger eligible internal or partner data-removal paths where technically and contractually possible;
- preserve audit/ledger records needed to prove what happened;
- acknowledge that already public, downloaded, cited, or redistributed copies cannot be globally recalled.

The current revocation coordinator flips disclosure-ledger state and expects a runtime signal port. A live G_5.2 runtime-revocation endpoint should be treated as planned until implemented.

## Provenance

The live system uses content hashes and disclosure-ledger records. RFC-3161 timestamping and IPFS/content-addressed archival are planned provenance layers and should be labelled as such until implementation is live.

## Operational Standard

The governance framework is credible only if it remains falsifiable:

- public copy distinguishes live, simulated, planned, and research-direction features;
- audit and disclosure state are preserved rather than overwritten;
- Portal demos stay visibly simulated;
- P-E-S and Witness data remain separate;
- implementation claims are traceable to code, tests, or current docs.

The point of the split-plane architecture is not theatrical complexity. It is disciplined separation: identity, testimony, consent, and publication must each live in the place where the system can enforce the right boundary.
