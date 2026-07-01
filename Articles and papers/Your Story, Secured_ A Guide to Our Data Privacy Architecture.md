---
Audience_Tags: [contributor, researcher]
---
### Your Story, Secured: A Guide to Our Data Privacy Architecture

##### 1\. The Core Promise: Why Privacy is the Foundation

The primary mission of this platform is to act as a "lifeboat" for human wisdom in an era of rapid AI expansion. To understand why this requires such rigorous privacy, we must look at the  **Flawed Parent Thesis** : current AI systems are trained on "uncurated digital exhaust"—the messy, contradictory, and often toxic data scraped indiscriminately from the open internet. To create a corrective alignment, we need high-signal truth.Absolute honesty from our contributors is only possible in a space where identity is mathematically and architecturally protected. Our goal is to preserve the  *ethical reasoning*  and  *moral depth*  of your testimony, not the identifiers of the storyteller. By anchoring our data to a tamper-evident ledger using SHA-256 content hashing and RFC-3161 timestamps, we ensure the integrity of the wisdom while sealing the identity of the witness.**Core Principle**   *"The intelligence we birth must inherit more than our chaos."*This commitment to safety creates a structural firewall designed to separate your identity from your insights, ensuring that the "who" never compromises the "what."

##### 2\. The Identity Firewall: Separating the "Who" from the "What"

To prevent identity bleed, our architecture utilizes a "two-room" system. This deterministic separation ensures that personal details required for account management never interact with the data used for research.**The Two-Room System**| **The Identity Vault** | **The Research Corpus** || \------ | \------ || **Contents:**  Legal names, email addresses, and authentication records. | **Contents:**  Moral dilemmas, transcripts of ethical reasoning, and CAP/REL/FELT annotations. || **Usage:**  Strictly restricted to  **System Administrators**  for account management and consent revocation. | **Usage:**  The primary dataset for researchers studying human values and moral logic. || **Privacy Rule:**  This data is never distributed, never used for training, and is stored in an access-controlled vault. | **Privacy Rule:**  Data only enters this room after being "scrubbed" and replaced with typed placeholders. |  
The most critical part of this firewall is the rigorous, multi-pass process used to move information from the first room to the second.

##### 3\. The Two-Pass De-identification Process: Scrubbing the Script

Before any testimony enters the Research Corpus, it undergoes a tiered de-identification process. This is not a simple "search and replace"; it is a sophisticated filtering pipeline:

1. **Pass 1: The Local Regex Strip:**  This is a fast local filter that catches obvious patterns. It removes phone numbers, email addresses, Social Security Numbers (SSNs), IP addresses, URLs, and  **specific dates**  before any external AI sees the text.  
2. **Pass 2: The Smart Classifier:**  Using Named Entity Recognition (NER), the system scans the text for qualitative identifiers like names, specific institutions, or locations.By replacing these specifics with typed placeholders—such as REDACTED\_NAME or REDACTED\_LOCATION—the system preserves the logical structure and moral "signal" of your sentence while permanently destroying the identifier. This transformation allows the ethical reasoning to remain intact for research without leaving a trail back to the witness.

##### 4\. Candidate Isolation: The "Envelope" Strategy

To ensure your story remains private even during AI analysis, we utilize  **Privacy through Isolation** . Standard systems often send entire documents to an external AI to find secrets, which risks exposure. We use a more secure "envelope" strategy.

* **Standard Method:**  The entire story is sent to an external AI to find identifiers. (Risk: Exposure of the full narrative).  
* **Candidate Isolation:**  Our system identifies a "candidate" (e.g., "Paris" or "John"). It places  *only that single word*  in a metaphorical envelope and sends it to a  **frontier model**  to ask: "Is this a location or a name?" (Benefit: The context of your story never leaves our server).This architecture ensures that the "Smart Classifier" can do its job without ever seeing the sensitive narrative surrounding the candidates it evaluates.

##### 5\. The Human Guardrail: Tier 3 Curation

While automation is fast, the final layer of safety is the  **Human Curation Council (HCC)** . This body provides a "blind, dual-rater review" to ensure the highest standards of data safety and research quality.The HCC performs three vital duties:

* **Manual Redaction:**  Reviewers perform a final pass to scrub any nuanced identifiers the automated passes might have missed.  
* **Semantic Tagging:**  They apply the  **CAP/REL/FELT**  framework, tagging the testimony for Capabilities, Relational ethics, and Embodied experience to make it machine-usable for alignment.  
* **Inter-Rater Reliability:**  Every story is reviewed by at least two human experts who must reach a high level of consensus (measured by Cohen’s Kappa). This ensures the de-identification is successful and the testimony meets the "Specificity Floor."

##### 6\. Summary: The Anatomy of a Safe Story

Through these layers, a sensitive personal account is transformed into a valuable, de-identified research artifact.**Transformation Example**  
Original: "I worked as a lead surgeon at St. Jude’s Hospital in Memphis on June 12th."

Scrubbed: "I worked as a \[REDACTED\_ROLE\] at \[REDACTED\_INSTITUTION\] in \[REDACTED\_LOCATION\] during \[REDACTED\_DATE\]."

This structured architecture puts you in permanent control. Should you choose to change your mind, our  **Revocation Coordinator**  is designed to handle "cascading deletions." Because your identity is linked to a specific ID in the vault, the system can instantly purge your testimony across all research tiers. Finally, every finalized entry is sealed on a tamper-evident ledger, ensuring that the version researchers see is exactly the version you consented to provide—nothing more, and nothing less.  
