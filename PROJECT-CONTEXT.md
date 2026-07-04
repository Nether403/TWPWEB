# TWPWEB Project Context

**Status:** Current as of 2026-07-04.

This repo is the public Portal for the Witness Protocol. If you are working here, you are working on front-of-house explanation, navigation, content, media, funding, and simulated demos. You are not working on real Gate, consent, auth, testimony, admin, or runtime operations.

Read this alongside the umbrella context: [`../PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md).

## Where this repo fits

`TWPWEB` is the public information hub. It explains what the Witness Protocol is, routes audiences to relevant material, presents articles/reports/media, hosts explicitly-simulated demos, and hands users off to the Platform when they want to participate.

The Portal is intentionally front-of-house. The real control-plane work lives in `TWP-platform`, and the governed runtime lives in `G_5.2`.

## Primary responsibilities

This repo owns:

- Public mission pages, audience journeys, about/creators framing, research library, media galleries, funding pages, contact/funder forms, and SEO/site-map style presentation.
- Explicitly-simulated demos for Gate, Inquisitor, provenance, and revocation concepts.
- A single outbound Platform handoff layer for real participation, consent, Gate, packet, and Inquisitor actions.
- Static/content-heavy web experience that can be deployed independently from the Platform control plane.

## What belongs here

Put code in `TWPWEB` when the change is primarily about:

- Public information architecture or copy for the Witness Protocol.
- Content loading/rendering for articles, reports, media, slides, or infographics.
- Simulated educational demos that clearly say they are not the real instruments.
- Portal-only forms such as contact or funder/invoice requests.
- Public CTA routing to the live Platform.

## What does not belong here

Do not use this repo for:

- Real Gate intake, witness submission, consent, auth, admin, or reviewer flows. Those belong in `TWP-platform`.
- Real Inquisitor runtime dialogue or testimony persistence. Those belong in `G_5.2`, reached through the Platform for Witness use.
- P-E-S persona chat or G_5.0 public pages. Those belong in `P-E-S`.
- Any client-side secret or server action that can write Witness testimony, consent, audit, or Platform admin state.

## Integration seams

| Connected repo | Direction | Concrete seam |
|---|---|---|
| `TWP-platform` | Portal -> Platform | `lib/platform-links.ts` defines all real action links. It defaults to a production Platform origin and can be overridden by `NEXT_PUBLIC_PLATFORM_BASE_URL`. |
| `G_5.2` | Indirect | The Portal does not call the runtime directly. Real Witness runtime interaction happens through Platform bridge routes. |
| `P-E-S` | Separate public project | P-E-S is a different public experience. Link or reference it only as a separate persona/research project, not as Witness testimony infrastructure. |

Key local files and folders:

- `app/` - public routes and pages.
- `app/demos/` - simulated demos. Keep simulation labels visible.
- `content/` plus source material folders - content loader and source assets.
- `lib/platform-links.ts` - single source of truth for Platform handoff URLs.
- `app/api/forms/` - Portal-only form handling.
- `.kiro/specs/witness-protocol-portal/` - Portal requirements/design/tasks.

## Boundary rules

- The Portal collects no Witness testimony and no Witness consent.
- The Portal owns no auth gate, admin role, reviewer action, or audit-log mutation.
- Portal forms may write only Portal submission data, not Witness/consent/audit tables.
- Any interactive demo must be labelled as simulated and must not reuse real Platform endpoints as if they were demo endpoints.
- CTA URLs for real actions must come from `lib/platform-links.ts`; do not scatter hardcoded Platform paths through pages.

## Common cross-repo changes

- Platform route/domain change: update `lib/platform-links.ts`, `.env.example` if needed, and `lib/platform-links.test.ts`.
- New public claim, stage wording, or audience framing: check `../Docs/PUBLIC_CLAIMS_GUIDE.md`, `../GATE-PORTAL-BOUNDARY.md`, and current Platform language.
- New participation or consent flow: implement the real flow in `TWP-platform`; add only explanatory copy and outbound links here.
- New runtime demo: keep it simulated here, or build the real runtime feature in `G_5.2`/`TWP-platform` and link out.

## Canonical docs for this repo

- `README.md` - Portal role, stack, boundary, and setup.
- `.kiro/specs/witness-protocol-portal/requirements.md` - Portal scope.
- `.kiro/specs/witness-protocol-portal/design.md` - Portal architecture and handoff design.
- `.kiro/specs/witness-protocol-portal/tasks.md` - implementation state.
- `../GATE-PORTAL-BOUNDARY.md` - accepted division of labor between Portal and Platform.
- `../TWP-platform/docs/PROJECT-ATLAS.md` - whole-workspace architecture.

## Verification expectation

Use the narrowest relevant verification:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Boundary tests when changing Platform links or demo behavior.
- Browser verification for visible UI changes.
