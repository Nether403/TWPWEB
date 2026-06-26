### Operational Governance Framework: Split-Plane Architecture and Witness Bridge Protocol

##### 1\. Strategic Mandate for Split-Plane Architecture

The Witness Protocol operates under a fundamental strategic mandate: the intelligence we birth must inherit more than our chaos. To ensure the high-signal moral wisdom of our contributors is not corrupted by the quantitative noise of standard platform operations, we enforce a strict separation between the "Control Plane" (The Witness Platform, or TWP) and the "Governed Runtime" (G\_5.2). This split-plane architecture is G\_5.2’s primary defense against identity bleed and data poisoning. By isolating administrative intake from the execution of governed inquiry, we transform the system from a mere chatbot into a disciplined cognitive instrument designed to preserve the qualitative texture of conscious human existence.

###### *The "Same Repo ≠ Same Identity" Principle*

While TWP and G\_5.2 may share a physical repository for development efficiency, they never share identity or memory pools. This relationship is best understood through a  **Game Engine metaphor** : G\_5.2 is the governed inquiry engine, providing the core logic and orchestration, while TWP and the public-facing P-E-S are distinct "games." These products share the engine’s kernel, but they maintain entirely separate world-states and save files. In this architecture, G\_5.2 treats identity as a maintained system property rather than an improvisational accident, ensuring that serious Witness testimony is never cross-contaminated by the lighter, educational P-E-S persona.

###### *Core Invariants*

To protect the integrity of the protocol, the following three non-negotiable boundaries are enforced as constitutional constraints:

* **Artifact Approval ≠ Canon Approval:**  The flow for reflection artifacts remains distinct from canon updates; artifacts only link to canon through explicit, human-approved proposals.  
* **Witness Data Isolation:**  Testimony, consent states, and annotations belong exclusively to the Witness side and are forbidden from bleeding into general persona memory pools.  
* **Runtime Neutrality:**  The shared kernel must remain neutral; all application-specific rules (e.g., Witness questioning modes) reside in their respective packages rather than being hardcoded into the core engine.

##### 2\. Functional Plane Responsibilities and Data Boundaries

Clear domain ownership is the bedrock of our security posture. Ambiguity in ownership is a critical failure mode that leads to PII leakage and the corruption of metadata. By establishing a rigid ownership matrix, we ensure that the "platform shell" (TWP) and the "governed brain" (G\_5.2) maintain an absolute firewall between real-world identity and research data.

###### *Ownership Matrix*

Category,TWP (Control Plane),G\_5.2 (Governed Runtime)  
Primary Responsibility,"Intake, vetting, authentication, and platform routing.","Governed inquiry execution, dialogue behavior, and artifact synthesis."  
Data Owned (Source of Truth),"Witness profiles, Identity Vault, Gate assessments, and Platform/Legal Consent.","Runtime Consent, dialogue turns, testimony segments, and synthesis/annotations."  
Restricted Data (Mirror Only),"High-level consent summary, witness status (invited/active), and bridge heartbeats.",Minimal de-identified linkage records required for session resumption.

###### *The Linkage-Only Posture*

The Control Plane (TWP) maintains a strict "linkage-only" posture. It is explicitly forbidden from storing dialogue turns, testimony bodies, annotations, synthesis content, or publication bundles. TWP acts merely as the shell that facilitates the user journey, while G\_5.2 handles all governed content within its own isolated storage roots. This boundary ensures that even if the platform shell is compromised, the research corpus remains secure. Communication between these planes is restricted to the witnessId, the singular handle that bridges the two domains safely.

##### 3\. Identity Management and the witnessId Lifecycle

The witnessId is the unique, de-identified handle that prevents the governed runtime from ever knowing a contributor's real-world identity. This prevents identity-based bias during the inquiry process and ensures contributor privacy is protected at the architectural level.

###### *Identity Vault Isolation: Candidate-Isolation Architecture*

The Identity Vault (containing names and emails) remains strictly within TWP. Before any text is passed across the bridge, it undergoes a two-pass de-identification process. High-format identifiers (emails, phone numbers) are stripped via local regex. In the second pass, the system utilizes a  **Candidate-Isolation**  process: it heuristically identifies PII candidates (names, institutions) and sends  *only those candidates* —never the full text—to an AI classifier for redaction typing. This prevents PII leakage to sub-processors like OpenRouter or Anthropic.

###### *witnessId Creation and Handoff*

The generation of an identity handle follows a four-step protocol:

1. **Intake/Auth:**  Contributor enters the TWP platform and authenticates via the Identity Vault.  
2. **Gate Vetting:**  The submission undergoes Tier 1-3 vetting (AI Sieve, Qualitative Analysis, and Human Curation).  
3. **Creation of witnessId:**  Upon acceptance by the Human Curation Council, TWP generates a unique witnessId.  
4. **Linkage:**  The witnessId is linked to a G\_5.2 session state via the Bridge, commencing the governed dialogue.

###### *Minimal Linkage Record Specification*

To prevent data duplication, the linkage record in TWP contains only:

* **witnessId:**  The primary de-identified handle.  
* **status:**  Current lifecycle state (e.g., invited, active, completed).  
* **consentSummary:**  A high-level mirror of the contributor's legal consent status.  
* **lastBridgeAt:**  Timestamp of the most recent synchronization event.

##### 4\. The Witness Bridge Protocol: Technical Contract and Security

The Bridge is a "narrow, high-value slice" that facilitates governed dialogue without risking full platform convergence. Its narrowness is its primary security feature, functioning as a gatekeeper for the protocol's integrity.

###### *RESTful Service Boundary and Authentication*

The bridge follows a strict technical contract:

* **Synchronous Direct REST:**  Communication occurs via server-to-server REST calls over a local, private service boundary.  
* **Browser Prohibition:**  Public pages are absolutely prohibited from making direct calls to the G\_5.2 runtime; all traffic must pass through the TWP Control Plane.  
* **Internal Authentication:**  Access requires mandatory headers: X-TWP-Bridge-Key (a shared secret) and X-TWP-Bridge-Caller (confirming the request originated from TWP).  
* **Constant-Time Check:**  The G\_5.2 runtime performs a  **constant-time shared-secret check**  on these headers to prevent unauthorized access and timing attacks.

###### *Fail-Closed Logic: The Constitutional Mirror*

The system operates on "fail-closed" logic. If the bridge configuration is missing, authentication fails, or a consent mismatch is detected, the session is terminated immediately. This logic ensures that the runtime remains a "constitutional mirror" of the protocol's values: security and data isolation are always prioritized over continuous uptime.

###### *Bridge Actions*

1. **Create/Resume Session:**  Sends witnessId; returns a session pointer and current gate state.  
2. **Record Consent:**  Sends witnessId and explicit consent scope; returns a confirmation of the decision.  
3. **Submit Turn:**  Sends witnessId, sessionId, and userMessage; returns the governed response.  
4. **Read Status:**  Requests runtime state by witnessId; returns consent mirrors and session metadata for the UI.

##### 5\. Consent Synchronization and Privacy Invariants

In a non-profit research context, consent is a "constitutional constraint" rather than a legal formality. We utilize granular, event-based consent to ensure that the intelligence we birth respects human agency at every turn.

###### *The Dual-Consent Model*

The protocol distinguishes between:

* **Conversational Consent:**  Permission to engage in immediate dialogue.  
* **Retention Consent:**  Permission to store testimony and metadata for the corpus. G\_5.2 is the  **system of record**  for these states. This ensures the runtime is "consent-aware" during dialogue and can block persistence if retention consent is absent.

###### *The Revocation Cascade*

Consent revocation triggers a "linkage flip" in the TWP Control Plane. This action immediately blocks the G\_5.2 runtime from further interaction with that witnessId and initiates the purging of all associated testimony artifacts and session data from G\_5.2’s storage roots. Revocation is a terminal event for the active bridge linkage.

##### 6\. Operational Audit and Lifecycle Verification

Our governance is built on the commitment of "Falsifiability over Marketing." We do not ask for trust; we provide a provable technical state documented through audit trails and public logs.

###### *The Accepted-Witness Lifecycle*

Operator Lifecycle,Trigger into State,Expected Audit Effect  
Accepted,Tier 3 Human Curation Council acceptance.,witnessId generation; gate.tier3.accept  
Invited,TWP issues access release/notification.,Record of invite issuance and access unlock.  
Active,Successful bridge bootstrap or first turn.,witness.bridge.bootstrap; witness.bridge.consent\_granted  
Completed,"Testimony reaches a ""sealed"" state.",Finalization record; terminal state mirror.  
Failed,Bridge request or runtime sync failure.,Error classification logged in the Failure Log.  
Revoked,Operator or contributor revoke action.,witness.lifecycle.revoked; immediate bridge block.

###### *The Failure Log Protocol*

The Foundation maintains an append-only, public transparency feed: the  **Failure Log** . This protocol documents methodological weaknesses, design flaws, and system bugs. It is a core commitment to the project's falsifiability, ensuring that our limitations are as visible to the public as our successes.

###### *Compliance Scorecard: Definition of Done*

A change to the governance framework is only "Done" when it meets the following criteria:

* **Canon Coherence:**  Does not break existing canon or identity rules.  
* **Eval Updates:**  Passes all system evaluations and regression tests.  
* **System Simplification:**  The change must leave the system clearer or simpler than it was before; complexity without clarity is a failure.

##### Concluding Summary

The Operational Governance Framework ensures that G\_5.2 remains the "shared brain" and TWP the "platform shell." This separation is the only guarantee that the Witness Protocol can fulfill its mission: creating a lifeboat for human wisdom that remains uncorrupted by the very chaos it was designed to alignment.  
