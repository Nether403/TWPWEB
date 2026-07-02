# Implementation Plan: Witness Protocol Portal

## Overview

This plan implements the Witness Protocol Portal as a statically generated Next.js (App Router) site with Tailwind CSS. The Portal is strictly front-of-house: it is informational and public, and it links out to the existing live Platform (`TWP-platform`) for every real action — the real Gate intake (`/gate`), the reviewer/MHS packet and passwordless intake (`/packet`, `/api/intake`), participation and consent, and the real Inquisitor (`/api/inquisitor`). The Portal implements no authentication, testimony intake, consent records, or audit log of its own (Req 1).

Work proceeds in three planes from the design: the build-time content pipeline first (it produces the manifest every page depends on), then the static presentation layer, the shared Platform link-out layer, and the interactive demos that consume them, then the runtime form-submission layer for the two Portal-owned forms, with theming and accessibility woven through. Each task builds on the previous and ends wired into a route or shared module, leaving no orphaned code.

Property-based tests use **fast-check** (minimum 100 iterations each), and every property test is tagged with the comment `Feature: witness-protocol-portal, Property {number}: {property text}`. Test sub-tasks are marked optional with `*` and are not implemented unless explicitly requested.

## Tasks

- [x] 1. Scaffold Next.js project, Tailwind, fonts, and theme tokens
  - Initialize the Next.js App Router project with TypeScript and Tailwind CSS at the workspace root (`TWPWEB`)
  - Configure EB Garamond (body), Cinzel (headings), and JetBrains Mono (technical labels) via `next/font`
  - Define `basalt` (near-black bg / off-white fg) and `paper` theme tokens as Tailwind theme variables keyed off a `data-theme` attribute, no accent hues, no rounded corners
  - Define a single fade transition token (0.5–2s) and confirm no transform-based motion utilities are used
  - Install dependencies: `gray-matter`, `remark`/`rehype` (via `next-mdx-remote` or `react-markdown`), `zod`, `qrcode`, `@supabase/supabase-js`, Resend SDK, `fast-check` (dev)
  - _Requirements: 18.1, 18.2, 18.5, 20.1_

- [x] 2. Build-time content pipeline
  - [x] 2.1 Implement file-name transforms (`fileNameToSlug`, `fileNameToTitle`, `altTextFromFileName`, `videoTitleFromFileName`)
    - Strip extensions, convert `_`/`-` to spaces, title-case for titles; produce URL-safe slugs
    - Place in `content/transforms.ts` as pure functions reused by loader and media viewer
    - _Requirements: 8.2, 9.2, 10.1, 19.1_

  - [x] 2.2 Write property test for file-name transform
    - **Property 7: File-name to human-readable transform** — derived text is non-empty, has no extension, and contains no underscore/dash separators
    - **Validates: Requirements 8.2, 9.2, 10.1, 19.1**

  - [x] 2.3 Implement `deriveMetadata` for front-matter-less files
    - Title = front-matter title → first H1 → humanized file name; summary = front-matter summary → truncated leading paragraph
    - _Requirements: 21.3_

  - [x] 2.4 Write property test for metadata derivation
    - **Property 4: Metadata derivation** — returns non-empty title and non-empty summary for docs lacking front-matter
    - **Validates: Requirements 21.3**

  - [x] 2.5 Implement `loadAllContent` reading `Blog posts`, `Articles and papers`, `reports`
    - Parse markdown with `gray-matter` + remark/rehype, emit `ContentItem[]` with unique slugs and rendered `bodyHtml`
    - Read each item's `Audience_Tags` from front-matter; assign a default tag set when absent so every item stays discoverable through at least one audience journey
    - After loading, emit a build-log warning (via `audienceWarnings`) if any of the three canonical audiences has zero tagged items
    - Exclude unparseable files, recording `{ file, reason }` in the returned `skipped` list and build log; do not fail the build
    - Catalogue PDFs as `format: "pdf"` items with `assetPath`
    - _Requirements: 5.1, 6.1, 7.1, 5.5, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6_

  - [x] 2.6 Write property test for loader completeness
    - **Property 2: Loader completeness** — exactly one published `ContentItem` per well-formed file, each with a unique slug and a non-empty `audienceTags` set (explicit from front-matter, or the default set when none is declared)
    - **Validates: Requirements 5.1, 6.1, 7.1, 21.2, 21.5**

  - [x] 2.7 Write property test for malformed-file exclusion
    - **Property 3: Malformed files are excluded and logged** — published items only for well-formed files; `skipped` names exactly the unparseable files
    - **Validates: Requirements 5.5**

  - [x] 2.8 Implement asset-copy step into `public/assets/{category}/`
    - Copy PDFs, PNG infographics, PPTX decks, and MP4 videos referenced by the manifest; build `MediaAsset[]`
    - Log a warning and omit missing/oversized assets rather than aborting the build
    - _Requirements: 6.2, 8.1, 9.1, 10.1, 21.1_

- [x] 3. Checkpoint - content pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Theme controller, global layout shell, and Platform link-out layer
  - [x] 4.1 Implement `Theme_Controller` provider
    - Toggle `data-theme` (`basalt` | `paper`) on the document root, persist to `localStorage`, apply globally
    - Provide a switch control; use the fade transition token only
    - Set the default `basalt` theme as a static `data-theme` attribute on the server-rendered root so the Portal renders and stays usable in its default theme even if the Theme_Controller fails to load; the controller only layers the toggle and persistence on top
    - _Requirements: 18.3, 18.4, 18.5, 18.6_

  - [x] 4.2 Implement `Navigation_System` (header, footer, responsive menu) and root layout
    - Persistent header with wordmark + `PRIMARY_NAV`; footer with Foundation identity, phase status, legal/privacy links
    - Collapsible menu at viewports ≤ 768px exposing all primary entries; wrap app in Theme_Controller
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [x] 4.3 Implement styled not-found (`not-found.tsx`)
    - Render a styled 404 with a link back to Home
    - _Requirements: 2.6_

  - [x] 4.4 Write unit tests for navigation and 404
    - Assert header/footer presence and nav entries on a page, responsive menu control at ≤768px, and 404 home link
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

  - [x] 4.5 Implement the shared Platform link-out layer (`lib/platform-links.ts`)
    - A single configurable set of outbound Platform URLs/CTAs — real Gate intake (`/gate`), reviewer/MHS packet and passwordless intake (`/packet`, `/api/intake`), participation & consent surface, and the real Inquisitor (`/api/inquisitor`) — with the Platform base URL sourced from env
    - Reused by the landing page, audience journeys, the Gate simulator, the Inquisitor comparator, and the `/participate` page; the Portal collects nothing for these actions and exposes no intake/consent/auth route
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 4.6 Implement the `/participate` link-out page
    - Page links out (via the shared link-out layer) to the Platform Gate, the reviewer/MHS packet, and the participation & consent surfaces; no Portal-owned form
    - _Requirements: 1.3, 1.4, 1.5, 4.4_

  - [x] 4.7 Write unit test for Platform link-outs and boundary
    - Assert the landing page, audience journeys, Gate simulator, Inquisitor comparator, and `/participate` render outbound Platform links to the expected surfaces, and assert the Portal exposes no testimony-intake, consent, or auth route
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 5. Content rendering and index
  - [x] 5.1 Implement `Content_Renderer` dynamic route `/library/[slug]`
    - Use `generateStaticParams` from the manifest; render sanitized HTML preserving headings, paragraphs, lists, emphasis, links, and block quotes
    - _Requirements: 5.1, 5.2, 5.4, 6.1, 6.4, 7.1, 7.3_

  - [x] 5.2 Write property test for markdown structural preservation
    - **Property 1: Markdown structural preservation** — each heading/list/emphasis/link/block quote maps to the corresponding HTML element (link href preserved)
    - **Validates: Requirements 5.1, 5.2, 6.1, 7.1**

  - [x] 5.3 Implement `Content_Index` at `/library` with `filterContent`
    - Render every item with title, summary, and type label; client-side filter by type (blog/article/paper/report/all) **and** by audience (three audiences/all)
    - _Requirements: 5.3, 6.3, 7.2, 21.7_

  - [x] 5.4 Write property test for content index completeness
    - **Property 5: Content index completeness** — every `ContentItem` appears with non-empty title, non-empty summary, and type label equal to its `type`
    - **Validates: Requirements 5.3, 6.3, 7.2**

  - [x] 5.5 Write property test for filter-by-type-and-audience correctness
    - **Property 6: Filter by type and audience correctness** — `filterContent(items, type, audience)` returns exactly the items matching BOTH the type selector and the audience selector; `"all"`/`"all"` returns the list unchanged
    - **Validates: Requirements 21.7**

- [x] 6. Media viewer
  - [x] 6.1 Implement PDF preview route `/library/pdf/[slug]`
    - Embed via `<iframe>`/`<object>` with a download link
    - _Requirements: 6.2_

  - [x] 6.2 Implement infographics gallery `/media/infographics` with lightbox
    - Grid of PNGs with alt text from file name; selecting one opens an enlarged lightbox view
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 6.3 Implement video gallery `/media/videos`
    - HTML5 `<video controls preload="none">` so media loads only on play; titles derived from file name
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 6.4 Implement slides list `/media/slides`
    - List PPTX decks with humanized titles and download links
    - _Requirements: 10.1, 10.2_

  - [x] 6.5 Write property test for media gallery completeness
    - **Property 8: Media gallery completeness** — exactly one entry per asset of a given kind, each linking to its served path
    - **Validates: Requirements 8.1, 10.1**

  - [x] 6.6 Write unit tests for media interactions
    - Infographic lightbox open, video `preload="none"` and controls present, slide download link
    - _Requirements: 8.3, 9.1, 9.3, 10.2_

- [x] 7. Landing page and audience journeys
  - [x] 7.1 Implement landing page `/`
    - State mission and current phase; show six audience entry paths; at least three CTAs (participate, read research, fund); curated recent Content_Items
    - The participate CTA links out to the Platform via the shared link-out layer (task 4.5)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 7.2 Implement `Audience_Router` config and routes `/audience/[audience]`
    - Static config map for the three canonical audiences with intro, CTAs (≥1 each; real-action CTAs link out to the Platform via the shared link-out layer), and demo links per Req 4.4–4.7
    - Surface the content for each audience via `contentForAudience` by `Audience_Tag` membership
    - Entry paths filter and surface content but do not gate it: the open `/library` index lets any Visitor reach Content_Items for any Audience regardless of the entry path selected
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [x] 7.3 Write property test for audience journey invariant and tag-based surfacing
    - **Property 9: Audience journey invariant and tag-based surfacing** — each canonical audience resolves a distinct config with ≥1 CTA, and `contentForAudience(items, audience)` returns exactly the items whose `audienceTags` include that audience
    - **Validates: Requirements 4.1, 4.2, 4.3, 21.5**

  - [x] 7.4 Write unit tests for landing and audience-specific links
    - Landing CTAs/navigation; per-audience expected links (Gate, Inquisitor, Revocation, funding) and Platform link-outs
    - _Requirements: 3.3, 3.4, 4.4, 4.5, 4.6, 4.7_

- [x] 8. Checkpoint - static presentation layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Interactive demonstrations
  - [x] 9.1 Implement `Inquisitor_Comparator` `/demos/inquisitor`
    - Port `COMPARATOR_CONVERSATIONS` (≥3 scenarios); render standard vs. Inquisitor responses side by side for the selected scenario
    - Visibly link out to the real Inquisitor at the Platform `/api/inquisitor` (shared link-out layer)
    - _Requirements: 11.1, 11.2, 11.3, 1.6_

  - [x] 9.2 Write property test for Inquisitor scenario fidelity
    - **Property 10: Inquisitor scenario selection fidelity** — selecting a scenario renders the standard and Inquisitor responses belonging to it
    - **Validates: Requirements 11.3**

  - [x] 9.3 Implement `Provenance_Explorer` `/demos/provenance`
    - Selectable mock record ids; stepwise trace with PII redaction, SHA-256, RFC-3161 token, IPFS CID, Cohen's Kappa; label all values simulated
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 9.4 Write property test for provenance trace completeness
    - **Property 11: Provenance trace field completeness** — trace includes redaction step and displays that record's SHA-256, RFC-3161, IPFS CID, and Kappa
    - **Validates: Requirements 12.2**

  - [x] 9.5 Implement `Revocation_Simulator` `/demos/revocation`
    - State machine `bridgeStatus` (CONNECTED→REVOKING→REVOKED) and `vaultStatus` (SEALED→PURGED); initial connected/sealed; stepwise log; reset control; simulated label
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 9.6 Write property test for revocation reset round-trip
    - **Property 12: Revocation reset round-trip** — after any trigger/reset sequence, reset returns to bridge CONNECTED and vault SEALED
    - **Validates: Requirements 13.3**

  - [x] 9.7 Implement Gate scoring `assessGate` and `Gate_Simulator` `/demos/gate`
    - Pure `assessGate(input)` returning specificity/counterfactual/relational (0–100) and pass flag; returns null for whitespace-only input; throws `GateAssessmentError` when the draft cannot be evaluated
    - UI: text input, per-dimension scores, overall pass/no-pass, empty-input prompt, non-binding disclaimer
    - On assessment failure (`GateAssessmentError`), surface an error message and never display zero scores in place of a valid assessment
    - Visibly link out to the Platform `/gate` for real, formal submission (shared link-out layer)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 1.3_

  - [x] 9.8 Write property test for Gate scoring well-formedness
    - **Property 13: Gate scoring well-formedness and pass consistency** — scores in 0–100; `passed` true iff word count and all three dimensions meet thresholds
    - **Validates: Requirements 14.2, 14.3**

  - [x] 9.9 Write property test for Gate empty-input rejection
    - **Property 14: Gate empty-input rejection** — whitespace-only input returns null (no score)
    - **Validates: Requirements 14.4**

  - [x] 9.10 Write unit tests for demo disclaimers and initial states
    - Comparator panel/scenario count, provenance/revocation/gate disclaimers and initial states
    - Assert the Provenance_Explorer renders no trace components before a record is selected (initial state) and labels displayed values as simulated; assert the Gate non-binding disclaimer
    - _Requirements: 11.1, 11.2, 12.1, 12.3, 12.4, 13.1, 13.4, 14.1, 14.6_

- [x] 10. Form submission layer (two Portal-owned forms)
  - [x] 10.1 Implement shared Zod schemas and `validateForm`
    - Schemas for the **two** Portal-owned form types only: funder/invoice and general contact; discriminated `ValidationResult` with field-level errors
    - _Requirements: 17.1, 17.3, 17.4_

  - [x] 10.2 Write property test for form validation correctness
    - **Property 15: Form validation correctness** — for either Portal-owned form (funder/invoice or contact), `validateForm` accepts iff all required fields present and any email field is syntactically valid; otherwise field-level errors and no persisted data
    - **Validates: Requirements 17.3, 17.4**

  - [x] 10.3 Implement route handler `POST /api/forms/[type]` (type ∈ { invoice, contact })
    - Re-validate server-side (422 + fieldErrors, no persist); insert into the Platform's Supabase using a server-only service role (500 + retry message on failure, no success); trigger Resend; return 200 confirmation
    - Reuse the Platform's existing Supabase + Resend stack and conventions (shared tables, RLS); treat Resend as best-effort after successful persist (`// ponytail:` email best-effort, persistence is source of truth); keep secrets server-only
    - _Requirements: 17.3, 17.4, 17.5, 17.6, 17.7, 17.8_

  - [x] 10.4 Build form UI components wired to the route handler
    - Client-side validation via shared Zod schemas; render field-level errors, success confirmation, and retry-on-failure messaging
    - Mount only the general contact form on `/contact`; the funder/invoice form mounts in the Funding module (`/fund`). `/participate` is a Platform link-out page (task 4.6), not a Portal-owned form
    - _Requirements: 17.1, 17.4, 17.7, 17.8_

  - [x] 10.5 Write integration test for valid submission wiring
    - With Supabase and Resend mocked, assert a valid submission inserts once into the Platform Supabase and triggers one Resend email with the validated payload
    - _Requirements: 17.5, 17.6_

- [x] 11. Funding module
  - [x] 11.1 Implement `/fund` cash section and invoice request form
    - Display bank/wire **donation/grant** details (never investment or financial-return language); render the `Curatorial_Neutrality_Statement` adjacent to the cash options; invoice form capturing name, email, organization, amount; on success show confirmation (delegates to Form_Handler)
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 11.2 Implement token funding cards with QR and copy-to-clipboard
    - Per-token cards (name, network, address, build-time `qrcode` data URL); copy control with confirmation and selectable-text fallback when the Clipboard API is unavailable
    - Donation-only framing (no investment, no financial return, no programmatic/governance/other rights); render the `Curatorial_Neutrality_Statement` adjacent to the token options; information-only crypto disclaimer (no wallet-connect, no on-chain transactions, no custody)
    - Build-time/render-time compliance guard: if prohibited investment language (describing a token contribution as an investment, as conferring a financial return, or as conferring programmatic/governance/other rights) is detected in the token funding view, disable the wallet addresses, QR codes, and copy controls so no contribution path renders alongside non-compliant framing
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [x] 11.3 Write unit tests for funding content and clipboard copy
    - Bank/wire and token content present, donation/grant framing, `Curatorial_Neutrality_Statement` adjacent to **both** cash and token options, copy confirmation behavior, on-chain/no-custody disclaimer
    - Assert the compliance guard disables wallet addresses, QR codes, and copy controls when prohibited investment language is present in the token funding view
    - _Requirements: 15.1, 15.3, 16.1, 16.4, 16.5, 16.6, 16.7_

- [x] 12. SEO, sitemap, and accessibility
  - [x] 12.1 Implement per-page metadata generation
    - Unique title and meta description for every generated page from the manifest
    - _Requirements: 20.2_

  - [x] 12.2 Write property test for page metadata uniqueness
    - **Property 16: Page metadata uniqueness** — every page has non-empty title and meta description; all titles pairwise unique
    - **Validates: Requirements 20.2**

  - [x] 12.3 Implement sitemap generation
    - Generate a sitemap listing exactly the published page URLs from the manifest
    - _Requirements: 20.4_

  - [x] 12.4 Write property test for sitemap completeness
    - **Property 17: Sitemap completeness** — sitemap lists exactly the published page URLs (none omitted, none extra)
    - **Validates: Requirements 20.4**

  - [x] 12.5 Apply accessibility affordances
    - Text alternatives for all non-text content, logical keyboard focus order, visible focus indicator in both themes
    - _Requirements: 19.1, 19.2, 19.4_

  - [x] 12.6 Write accessibility and contrast checks
    - Compute WCAG contrast ≥ 4.5:1 for each theme's text/background token pairs; keyboard operability/focus order via axe + tab traversal
    - _Requirements: 19.2, 19.3, 19.4_

- [x] 13. Final checkpoint - integration and build
  - [x] 13.1 Wire all routes into navigation and verify static build output
    - Confirm header/footer links resolve to all sections; run the production build and smoke-check that static HTML is emitted for all content routes
    - _Requirements: 2.3, 20.1, 20.3, 21.1_

  - [x] 13.2 Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional (tests) and can be skipped for a faster MVP.
- Each task references specific requirement sub-clauses for traceability.
- Property tests use fast-check (≥100 iterations) and are tagged `Feature: witness-protocol-portal, Property {number}: {property text}`.
- All real actions (testimony intake, MHS packet, participation, consent, real Inquisitor) are outbound links to the Platform via the shared link-out layer (task 4.5); the Portal owns only the funder/invoice and contact forms (Req 1, Req 17).
- Performance budgets (Req 2.3, 20.3) are validated against the built site via Lighthouse, not via property tests.
- Full WCAG 2.1 AA conformance requires manual testing with assistive technologies beyond the automated checks here.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "2.3", "4.1", "4.3"] },
    { "id": 2, "tasks": ["2.4", "2.5", "4.2", "4.5"] },
    { "id": 3, "tasks": ["2.6", "2.7", "2.8", "4.4", "4.6", "10.1"] },
    { "id": 4, "tasks": ["5.1", "5.3", "6.1", "6.2", "6.3", "6.4", "9.1", "9.3", "9.5", "9.7", "10.2", "10.3", "11.2", "12.1", "12.3", "12.5"] },
    { "id": 5, "tasks": ["5.2", "5.4", "5.5", "6.5", "6.6", "7.1", "7.2", "9.2", "9.4", "9.6", "9.8", "9.9", "9.10", "10.4", "11.1", "12.2", "12.4", "12.6"] },
    { "id": 6, "tasks": ["4.7", "7.3", "7.4", "10.5", "11.3", "13.1"] }
  ]
}
```
