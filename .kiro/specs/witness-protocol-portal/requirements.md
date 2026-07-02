# Requirements Document

> **Amendment — 2026-07-01: audiences collapsed from six to three.**
> The six original personas overlapped heavily (Researcher and Philosopher were
> effectively identical; Potential Witness and Invited Professional differed by
> one CTA; Legal Expert and Investor mostly routed to the library). They are now
> collapsed into the three destinations the site actually serves. **This note
> supersedes the historic six-persona model** (incl. the Glossary,
> Req 3.2, Req 4.1, and Req 21.6). The canonical set and the mapping:
>
> | Canonical audience (`id`) | Absorbs the former personas | Journey |
> |---|---|---|
> | **Contributor** (`contributor`) | Potential Witness, Invited Professional | Participate + Gate intake + reviewer/MHS packet (Platform link-outs) + Gate self-assessment demo (was Req 4.4) |
> | **Researcher & Scholar** (`researcher`) | Researcher, Philosopher, Legal Expert | Library + real Inquisitor (Platform) + Inquisitor/revocation/provenance demos (was Req 4.5, 4.6) |
> | **Funder** (`funder`) | Investor | Funding CTA + strategic/funding content (was Req 4.7) |
>
> The pre-collapse persona names remain accepted as content front-matter aliases
> (`content/loader.ts`), so existing `Audience_Tags` keep resolving to the right
> journey. Code + tests are the source of truth (`content/types.ts`,
> `lib/audiences.ts`); read the enumerations below through this mapping.

## Introduction

This document specifies the requirements for the **Witness Protocol Portal**: the public information hub and main landing experience for the Witness Protocol, built in the `TWPWEB` workspace. The Portal transforms the existing collection of draft React components, documentation, blog posts, articles, papers, reports, infographics, slides, and videos into a single, professional, publicly accessible website.

The Portal is **front-of-house**: an informational, public-facing surface that tells the story and mission, routes three audience groups to relevant content, presents the full content library and media galleries, presents funding information, and hosts four explicitly-simulated interactive demonstrations. The **Platform** (the existing, live `TWP-platform` control plane) is **back-of-house**: the real instrument that already implements the Gate intake, the reviewer/MHS packet, participation and consent records, authentication, the audit log, and the real Inquisitor dialogue engine. The Portal does not rebuild any of those real actions; it links out to the Platform for all of them. The new value the Portal adds — the content library, media galleries, audience journeys, funding information, and simulated demonstrations — does not exist on the Platform today.

The Portal serves three audience groups — contributors, researchers/scholars, and funders — and provides each with a tailored journey to relevant content and a clear call to action (read research, explore the demonstrations, support the initiative, or hand off to the Platform to participate).

The Portal preserves the austere "gravity over gamification" design language mandated by the project's Product Requirements Document (stark minimalism, EB Garamond and Cinzel typography, near-black "basalt" palette, no accent colors, slow transitions) while delivering a visually striking, cinematic reading and navigation experience. The Portal integrates the project's existing assets: it renders the markdown blog posts, articles, papers, and reports as native site pages, and it embeds or links the PDFs, PNG infographics, PPTX slide decks, and MP4 videos. It carries forward the interactive demonstrations prototyped in the draft files (the Inquisitor transcript comparator, the cryptographic provenance explorer, the consent revocation simulator, and the Gate self-assessment simulator).

### Technology and Integration Decisions (confirmed)

- **Framework:** Next.js (React) with Tailwind CSS, with static generation for content pages and good SEO.
- **Content rendering:** Markdown files are rendered as native HTML pages; PDFs, slides, and videos are embedded or linked.
- **Boundary with the Platform:** The Portal links out to the Platform's existing surfaces for the real Gate intake (`/gate`), the reviewer/MHS packet and passwordless intake (`/packet`, `/api/intake`), participation and consent, and the real Inquisitor (`/api/inquisitor`). The Portal does not reimplement authentication, consent records, testimony intake, or an audit log.
- **Cash funding:** Bank transfer / wire details displayed as donation/grant information, plus a funder/invoice request form.
- **Token funding:** Information-only cryptocurrency contribution guidance. Wallet addresses, QR codes, and copy controls remain disabled until verified contribution addresses are approved and published (no wallet-connect, no on-chain transactions through the Portal, no custody).
- **Backend for the Portal's own forms:** The two Portal-owned forms (funder/invoice and general contact) reuse the Platform's existing Supabase (data persistence) and Resend (transactional email) stack and conventions, rather than standing up a separate parallel data plane.

## Glossary

- **Portal**: The complete Witness Protocol Portal website, the informational, public-facing front-of-house system being specified by this document.
- **Platform**: The existing, live `TWP-platform` control plane — a separate Next.js + Supabase + Drizzle application (Phase 5 Beta v0.9 live) that implements the real Gate intake, the reviewer/MHS packet and passwordless intake, participation and consent records, authentication, the audit log, and the real Inquisitor dialogue engine. The Portal links out to the Platform for all real actions and does not reimplement it.
- **Visitor**: Any person browsing the Portal who has not authenticated.
- **Audience_Router**: The Portal subsystem that presents audience-specific entry paths and routes a Visitor to content and calls to action relevant to a selected audience.
- **Audience**: One of the three canonical visitor groups: Contributor, Researcher, or Funder. Older persona names remain accepted as content aliases.
- **Navigation_System**: The Portal subsystem providing the global header, menu, footer, and in-page navigation.
- **Content_Renderer**: The Portal subsystem that converts source markdown files into styled HTML pages at build time.
- **Content_Index**: The Portal subsystem that lists, filters, and sorts published content items (blog posts, articles, papers, reports).
- **Content_Item**: A single published piece of content (a blog post, article, paper, or report) with metadata (title, type, author, date, summary, and audience tags).
- **Audience_Tag**: A metadata value, declared in a Content_Item's front-matter, that associates the item with one of the three canonical Audiences.
- **Media_Viewer**: The Portal subsystem that displays PDFs, infographics, slide decks, and videos.
- **Inquisitor_Comparator**: The interactive component that shows a side-by-side comparison of a standard LLM response versus a G_5.2 Inquisitor response.
- **Provenance_Explorer**: The interactive component that displays a simulated cryptographic provenance trace for a mock Witness record.
- **Revocation_Simulator**: The interactive component that demonstrates the consent revocation cascade between the Control Plane and the G_5.2 runtime.
- **Gate_Simulator**: The interactive component that gives a Visitor a non-binding self-assessment of draft testimony against the Gate thresholds.
- **Funding_Module**: The Portal subsystem presenting cash and token donation options and capturing funder/invoice interest.
- **Form_Handler**: The Portal subsystem that validates the Portal-owned funder/invoice and contact forms, persists their submissions using the Platform's Supabase stack, and triggers Resend email notifications.
- **Theme_Controller**: The Portal subsystem that switches between the dark ("basalt") and light ("paper") visual themes.
- **MHS_Packet**: The Minimum Honest Signal information packet (the reviewer packet) that experts can request from the Platform.
- **CTA**: A call to action, a primary action link or button (for example, "Request the MHS Packet", "Read the research", "Support the Foundation").
- **Curatorial_Neutrality_Statement**: The Foundation's published statement of curatorial independence and funder isolation, affirming that funding sources confer no influence over the corpus, methodology, or governance, and confer no programmatic rights or financial return.
- **Source_Asset**: Any existing file in the workspace (markdown, PDF, PNG, PPTX, MP4) that the Portal integrates.

## Requirements

### Requirement 1: Scope and Boundary with the Platform

**User Story:** As the Foundation, I want the Portal to be a purely informational front-of-house that hands off all real actions to the existing Platform, so that the live control plane is never duplicated, forked, or contradicted.

#### Acceptance Criteria

1. THE Portal SHALL serve only public, informational, front-of-house content, and SHALL NOT implement testimony intake, consent records, an audit log, or contributor and reviewer authentication.
2. THE Portal SHALL NOT implement its own authentication system.
3. WHEN a Visitor initiates the real Gate intake (testimony submission), THE Portal SHALL direct the Visitor to the Platform's Gate intake surface (the Platform `/gate` route) rather than collecting testimony within the Portal.
4. WHEN a Visitor requests the reviewer/MHS packet, THE Portal SHALL direct the Visitor to the Platform's reviewer packet and passwordless intake surfaces (the Platform `/packet` and `/api/intake` routes) rather than collecting the request within the Portal.
5. WHEN a Visitor chooses to participate or to provide consent, THE Portal SHALL direct the Visitor to the Platform's participation and consent surface.
6. WHEN a Visitor chooses to engage the real Inquisitor dialogue, THE Portal SHALL direct the Visitor to the Platform's Inquisitor surface (the Platform `/api/inquisitor` engine) rather than running a dialogue engine within the Portal.
7. THE Portal SHALL provide navigation paths to the key Platform services (the Gate intake, the reviewer/MHS packet, and participation and consent) so that a Visitor can take action after reading informational content.
8. WHERE the Portal collects preliminary information before handing off to the Platform's Gate intake, THE Portal SHALL limit that collection to non-testimony details such as contact information or case category, and SHALL NOT collect testimony within the Portal.

### Requirement 2: Information Architecture and Global Navigation

**User Story:** As a Visitor, I want a clear, consistent site structure and navigation, so that I can locate any section of the Portal regardless of where I land.

#### Acceptance Criteria

1. THE Navigation_System SHALL present a persistent global header containing the Witness Protocol wordmark and primary navigation links on every page.
2. THE Navigation_System SHALL provide primary navigation entries for Home, About/Methodology, Research & Library, Participate, Fund, and Contact.
3. WHEN a Visitor selects a primary navigation entry, THE Navigation_System SHALL load the corresponding section within 1 second on a broadband connection.
4. THE Navigation_System SHALL present a footer on every page containing the Foundation initiative identity, the current project phase status, and links to legal and privacy information.
5. WHEN a Visitor views any page on a viewport width of 768 pixels or less, THE Navigation_System SHALL present a collapsible menu control that exposes all primary navigation entries.
6. WHEN a Visitor requests a URL that does not resolve to a published page, THE Portal SHALL display a styled not-found page that includes navigation back to the Home section.

### Requirement 3: Landing Page

**User Story:** As a Visitor, I want a landing page that immediately communicates the mission and directs me to my area of interest, so that I understand the Witness Protocol and know where to go next.

#### Acceptance Criteria

1. THE Portal SHALL present a landing page at the root URL that states the Witness Protocol mission statement and the current project phase.
2. THE Portal SHALL display at least the six Audience entry paths on the landing page, and MAY display additional Audience entry paths where they exist in the system.
3. THE Portal SHALL display at least three primary CTAs on the landing page: one to participate, one to read research, and one to support the Foundation.
4. WHEN a Visitor activates a CTA on the landing page, THE Portal SHALL navigate to the corresponding destination section.
5. THE Portal SHALL display a curated selection of recent Content_Items on the landing page.

### Requirement 4: Audience-Specific Journeys

**User Story:** As a Visitor belonging to a specific audience, I want a journey tailored to my role, so that I see the content and calls to action that are most relevant to me.

#### Acceptance Criteria

1. THE Audience_Router SHALL provide a distinct entry path for each of the six Audiences: Potential_Witness, Invited_Professional, Researcher, Philosopher, Legal_Expert, and Investor.
2. WHEN a Visitor selects an Audience entry path, THE Audience_Router SHALL display a view containing content relevant to that Audience and at least one CTA relevant to that Audience, and MAY display additional CTAs and links beyond the required relevant ones.
3. WHEN a Visitor selects an Audience entry path, THE Audience_Router SHALL surface the set of Content_Items whose Audience_Tags include the selected Audience.
4. WHERE the selected Audience is Potential_Witness or Invited_Professional, THE Audience_Router SHALL present the participation CTA (which directs the Visitor to the Platform per Requirement 1) and a link to the Gate_Simulator.
5. WHERE the selected Audience is Researcher or Philosopher, THE Audience_Router SHALL present links to the papers, reports, and the Inquisitor_Comparator.
6. WHERE the selected Audience is Legal_Expert, THE Audience_Router SHALL present links to the privacy architecture content, the governance content, and the Revocation_Simulator.
7. WHERE the selected Audience is Investor, THE Audience_Router SHALL present the funding CTA and links to the strategic and funding-related content.
8. THE Audience_Router SHALL allow a Visitor to access Content_Items associated with any Audience, regardless of the Audience entry path the Visitor selected.

### Requirement 5: Blog Post Rendering

**User Story:** As a Visitor, I want to read the blog posts as native web pages, so that I can engage with them without downloading files.

#### Acceptance Criteria

1. THE Content_Renderer SHALL render each markdown file in the "Blog posts" source folder as an individual HTML page.
2. THE Content_Renderer SHALL preserve headings, paragraphs, lists, emphasis, links, and block quotes from each source markdown file in the rendered page.
3. THE Content_Index SHALL display a list of all blog posts with each post's title and summary.
4. WHEN a Visitor selects a blog post from the Content_Index, THE Portal SHALL display the full rendered blog post page.
5. IF a source markdown file cannot be parsed, THEN THE Content_Renderer SHALL exclude that file from the published output and SHALL record the affected file name in the build log.

### Requirement 6: Articles and Papers Rendering

**User Story:** As a Researcher, I want to access the articles and papers, including PDF documents, so that I can study the technical and academic material.

#### Acceptance Criteria

1. THE Content_Renderer SHALL render each markdown file in the "Articles and papers" source folder as an individual HTML page.
2. WHERE a Content_Item in the "Articles and papers" source folder is a PDF document, THE Media_Viewer SHALL provide an in-page PDF preview and a download link for that document.
3. THE Content_Index SHALL display a type label for every article and paper Content_Item regardless of its file type, distinguishing articles, papers, PDF documents, and any other file types present in the "Articles and papers" source folder.
4. WHEN a Visitor selects an article or paper, THE Portal SHALL display the rendered page or the PDF preview corresponding to that Content_Item.

### Requirement 7: Reports Rendering

**User Story:** As an Investor or Researcher, I want to read the project reports, so that I can assess the project's strategy and technical progress.

#### Acceptance Criteria

1. THE Content_Renderer SHALL render each markdown file in the "reports" source folder as an individual HTML page.
2. THE Content_Index SHALL display a list of all reports with each report's title and summary.
3. WHEN a Visitor selects a report, THE Portal SHALL display the full rendered report page.

### Requirement 8: Infographics Gallery

**User Story:** As a Visitor, I want to view the project infographics, so that I can understand the architecture and framework visually.

#### Acceptance Criteria

1. THE Media_Viewer SHALL display every PNG image in the "infographs" source folder in a gallery view.
2. THE Media_Viewer SHALL render each infographic with descriptive alternative text derived from the image file name.
3. WHEN a Visitor selects an infographic in the gallery, THE Media_Viewer SHALL display an enlarged view of that infographic.

### Requirement 9: Video Integration

**User Story:** As a Visitor, I want to watch the project videos within the Portal, so that I can learn about the protocol through video.

#### Acceptance Criteria

1. THE Media_Viewer SHALL embed each MP4 file in the "Video" source folder using a standard HTML5 video player with playback controls.
2. THE Media_Viewer SHALL display a human-readable title for each video derived from the video file name.
3. WHILE a video has not been played, THE Media_Viewer SHALL defer loading of that video's media data until the Visitor initiates playback.

### Requirement 10: Slide Deck Integration

**User Story:** As a Visitor, I want access to the project slide decks, so that I can review presentation material.

#### Acceptance Criteria

1. THE Media_Viewer SHALL display a list of every PPTX file in the "slides" source folder with a human-readable title for each deck.
2. WHEN a Visitor selects a slide deck, THE Media_Viewer SHALL provide a download link for the corresponding PPTX file.

### Requirement 11: Inquisitor Transcript Comparator

**User Story:** As a Researcher, I want to compare a standard LLM response with the Inquisitor's response, so that I can see the methodology demonstrated rather than only described.

#### Acceptance Criteria

1. THE Inquisitor_Comparator SHALL display a standard LLM response and a G_5.2 Inquisitor response side by side for a selected dilemma scenario.
2. THE Inquisitor_Comparator SHALL provide at least three selectable dilemma scenarios.
3. WHEN a Visitor selects a dilemma scenario, THE Inquisitor_Comparator SHALL display the standard response and the Inquisitor response corresponding to that scenario.

### Requirement 12: Cryptographic Provenance Explorer

**User Story:** As a Legal_Expert or Investor, I want to see a simulated provenance trace, so that I can evaluate the integrity claims of the data pipeline.

#### Acceptance Criteria

1. THE Provenance_Explorer SHALL present a set of selectable mock Witness record identifiers.
2. WHEN a Visitor selects a mock Witness record identifier, THE Provenance_Explorer SHALL display a stepwise trace that includes a PII-redaction step, a SHA-256 content hash, an RFC-3161 timestamp token, an IPFS content identifier, and an inter-rater agreement (Cohen's Kappa) value.
3. THE Provenance_Explorer SHALL NOT display any trace components before a Visitor selects a mock Witness record identifier.
4. THE Provenance_Explorer SHALL label all displayed values as simulated demonstration data.

### Requirement 13: Consent Revocation Simulator

**User Story:** As a Potential_Witness, I want to see how consent revocation works, so that I can trust that revocation is a system invariant and not only a legal promise.

#### Acceptance Criteria

1. THE Revocation_Simulator SHALL display the initial state of the Control Plane bridge as connected and the data vault as sealed.
2. WHEN a Visitor triggers the revocation sequence, THE Revocation_Simulator SHALL display a stepwise log culminating in a severed bridge state and a purged vault state.
3. WHEN a Visitor triggers the reset control, THE Revocation_Simulator SHALL return to its initial state by setting the Control Plane bridge to connected and the data vault to sealed.
4. THE Revocation_Simulator SHALL label its output as a simulated demonstration.

### Requirement 14: Gate Self-Assessment Simulator

**User Story:** As a Potential_Witness, I want a non-binding self-assessment of my draft testimony, so that I can understand what the Gate evaluates before I formally submit on the Platform.

#### Acceptance Criteria

1. THE Gate_Simulator SHALL provide a text input for a Visitor to enter draft testimony.
2. WHEN a Visitor submits draft testimony for assessment, THE Gate_Simulator SHALL display a score for each of the specificity, counterfactual, and relational dimensions.
3. WHEN a Visitor submits draft testimony for assessment, THE Gate_Simulator SHALL display an overall pass or no-pass indication based on the dimension scores.
4. IF a Visitor submits empty draft testimony, THEN THE Gate_Simulator SHALL display a prompt to enter text and SHALL NOT produce a score.
5. IF the assessment fails to evaluate submitted draft testimony, THEN THE Gate_Simulator SHALL display an error message and SHALL NOT display zero scores in place of a valid assessment.
6. THE Gate_Simulator SHALL display a statement that the assessment is non-binding, is a simulated demonstration, and does not constitute a formal submission, and SHALL direct a Visitor who wishes to submit formally to the Platform per Requirement 1.

### Requirement 15: Cash Funding

**User Story:** As a supporter, I want to make a cash donation or grant to the Foundation, so that I can support its non-commercial research mission.

#### Acceptance Criteria

1. THE Funding_Module SHALL present cash contributions exclusively as donations or grants, and SHALL NOT describe any contribution as an investment or as conferring a financial return.
2. THE Funding_Module SHALL display bank transfer and wire details for cash donations.
3. THE Funding_Module SHALL display the Curatorial_Neutrality_Statement adjacent to the cash funding options.
4. THE Funding_Module SHALL provide a funder/invoice request form that captures the contributor's name, email address, organization, and requested amount.
5. WHEN a Visitor submits the funder/invoice request form with valid input, THE Form_Handler SHALL persist the submission and SHALL trigger a notification email.
6. WHEN the Form_Handler successfully records a funder/invoice request, THE Funding_Module SHALL display a confirmation message to the Visitor.

### Requirement 16: Token Funding

**User Story:** As a supporter, I want to contribute via cryptocurrency, so that I can support the Foundation with a token-based donation.

#### Acceptance Criteria

1. THE Funding_Module SHALL present token contributions exclusively as donations, and SHALL NOT describe any token contribution as an investment, as conferring a financial return, or as conferring any programmatic, governance, or other rights.
2. THE Funding_Module SHALL display the cryptocurrency wallet address for each supported token together with the token name and network.
3. THE Funding_Module SHALL display a scannable QR code for each displayed wallet address.
4. WHEN a Visitor activates the copy control for a wallet address, THE Funding_Module SHALL copy that wallet address to the Visitor's clipboard and SHALL display a copy confirmation.
5. THE Funding_Module SHALL display a statement that token contributions are made directly on-chain and that the Portal does not connect wallets, process transactions, or custody funds.
6. THE Funding_Module SHALL display the Curatorial_Neutrality_Statement adjacent to the token funding options.
7. IF prohibited investment language (language describing a token contribution as an investment, as conferring a financial return, or as conferring programmatic, governance, or other rights) is present in the token funding view, THEN THE Funding_Module SHALL disable the wallet addresses, QR codes, and copy controls.

### Requirement 17: Portal-Owned Forms, Persistence, and Notification

**User Story:** As a Visitor, I want to submit the Portal's own funder and contact forms reliably, and to be handed off to the Platform for every real action, so that the Foundation receives my information without the Portal duplicating the control plane.

#### Acceptance Criteria

1. THE Form_Handler SHALL provide only two Portal-owned forms: the funder/invoice request form and the general contact form.
2. WHEN a Visitor seeks to submit testimony, request the reviewer/MHS packet, register participation interest, provide consent, or request research-corpus access, THE Portal SHALL direct the Visitor to the corresponding Platform surface (per Requirement 1) rather than collecting the request through a Portal-owned form.
3. WHEN a Visitor submits a Portal-owned form, THE Form_Handler SHALL validate that all required fields are present and that any email field contains a syntactically valid email address.
4. IF form validation fails, THEN THE Form_Handler SHALL display a field-level error message for each invalid field and SHALL NOT persist the submission.
5. WHERE a Portal-owned form persists submission data, THE Form_Handler SHALL use the Platform's existing Supabase and Resend stack and conventions rather than a separate Portal-owned data store.
6. WHEN form validation succeeds, THE Form_Handler SHALL persist the submission and SHALL trigger a Resend notification email.
7. IF persistence fails, THEN THE Form_Handler SHALL display an error message that invites the Visitor to retry and SHALL NOT display a success confirmation.
8. WHEN a submission is persisted successfully, THE Form_Handler SHALL display a success confirmation to the Visitor.

### Requirement 18: Visual Design and Theme

**User Story:** As a Visitor, I want a serious, austere, and visually striking presentation, so that the Portal conveys the gravity of the Foundation's mission.

#### Acceptance Criteria

1. THE Portal SHALL apply EB Garamond as the body typeface and Cinzel as the heading typeface across all pages.
2. THE Portal SHALL render the dark theme using a near-black background and an off-white foreground, with no accent hue applied to text or surfaces.
3. THE Theme_Controller SHALL provide a control to switch between the dark theme and the light theme.
4. WHEN a Visitor switches the theme, THE Theme_Controller SHALL apply the selected theme to all visible content.
5. WHILE a content or navigation transition is in progress, THE Portal SHALL apply a fade transition of between 0.5 and 2 seconds and SHALL NOT apply bounce, spin, or scale-based motion effects.
6. IF the Theme_Controller fails to load or is otherwise unavailable, THEN THE Portal SHALL remain usable in its default theme.

### Requirement 19: Accessibility

**User Story:** As a Visitor using assistive technology, I want the Portal to be accessible, so that I can use it regardless of ability.

#### Acceptance Criteria

1. THE Portal SHALL provide a text alternative for every non-text content element.
2. THE Portal SHALL expose all interactive controls to keyboard operation in a logical focus order.
3. THE Portal SHALL maintain a contrast ratio of at least 4.5 to 1 between body text and its background in both themes.
4. WHEN a Visitor navigates with a keyboard, THE Portal SHALL display a visible focus indicator on the focused control.

### Requirement 20: Performance and SEO

**User Story:** As a Visitor and as a search engine, I want pages to load quickly and to be discoverable, so that the Portal reaches and serves its audiences effectively.

#### Acceptance Criteria

1. THE Portal SHALL generate static HTML for all content pages at build time.
2. THE Portal SHALL include a unique title and meta description for every page.
3. WHEN a content page is requested on a broadband connection, THE Portal SHALL render the primary content within 2 seconds.
4. THE Portal SHALL generate a sitemap that lists all published pages.

### Requirement 21: Content Pipeline and Asset Integration

**User Story:** As a maintainer, I want the Portal to build its content from the existing source folders with per-item audience tags, so that content stays consistent with the workspace assets, can be updated by editing source files, and surfaces correctly for each of the six audience journeys.

#### Acceptance Criteria

1. THE Content_Renderer SHALL read its content from the existing "Blog posts", "Articles and papers", and "reports" source folders.
2. WHEN a new markdown file is added to a recognized source folder and the Portal is rebuilt, THE Content_Renderer SHALL include the new file as a published page.
3. WHERE a source markdown file lacks explicit metadata, THE Content_Renderer SHALL derive the title from the file name or the first heading and SHALL derive the summary from the leading content.
4. THE Content_Renderer SHALL read each Content_Item's set of Audience_Tags from the source file's front-matter metadata.
5. WHERE a source markdown file declares no Audience_Tags, THE Content_Renderer SHALL assign a default Audience_Tag set so that the Content_Item remains discoverable through at least one Audience journey.
6. WHEN the Portal is built, IF any of the six Audiences has no Content_Item carrying its Audience_Tag, THEN THE Content_Renderer SHALL record a warning naming that Audience in the build log.
7. THE Content_Index SHALL allow a Visitor to filter Content_Items by type (blog post, article, paper, report) and by Audience.
