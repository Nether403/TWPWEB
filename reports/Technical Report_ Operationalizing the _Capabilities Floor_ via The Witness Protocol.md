### Technical Report: Operationalizing the "Capabilities Floor" via The Witness Protocol

#### 1\. The Strategic Pivot: From Guidance to Hard Constraints

Current AI alignment methodologies rely on a "training slurry"—a chaotic ingestion of uncurated internet data where ethical signals are diluted by the noise of human impulse and historical bias. This approach treats alignment as a post-hoc "nudge," attempting to steer model behavior through probabilistic Reinforcement Learning from Human Feedback (RLHF). Such systems are fundamentally fragile; they possess reach but lack depth and moral clarity. To achieve verifiable epistemic integrity, we must pivot from "nudges" to "tripwires" by implementing the  **Capabilities Floor** : a hard-coded, constitutional veto that prevents model drift into ethically untenable territory.This strategic shift is necessitated by our reality as a "flawed parent." Humanity has birthed a new intelligence from a data inheritance that is a contradictory mirror of our species—containing our highest aspirations alongside our most destructive impulses. The Witness Protocol recognizes that the logic of profit-maximization is blind to the existential stakes of this inheritance. We must move beyond the hope that safety will emerge from scale. Instead, the architecture mandates the extraction of high-signal human wisdom to serve as a deterministic engineering requirement, hard-coding the moral boundaries that must never be breached.This necessitates a transition from the "training slurry" to a verifiable architecture where human testimony acts as the foundational governance kernel.

#### 2\. The Capabilities Floor as an Epistemic Foundation

The Capabilities Floor is the structural implementation of the  **G\_5.2 orchestration kernel** . It treats high-signal human testimony as the "source code" for a model’s constitutional veto. By establishing this foundation, we move alignment from the realm of the statistical to the realm of the deterministic. This "high-signal inheritance" is filtered through a rigorous  **3-Tier Vetting Pipeline** : starting with the  **AI Sieve (Tier 1\)**  for baseline coherence, followed by the  **Qualitative Qualifier (Tier 2\)**  for semantic density, and finalized by the  **Human Curation Council (HCC)** . This process ensures that the signals forming the floor are not merely data points, but cryptographically verifiable moral constraints.

##### Alignment Methodology Comparison

Feature,Traditional RL Alignment,Capabilities Floor Alignment  
Operational Nature,Probabilistic (Soft-Influence),Deterministic (Hard-Constraint)  
Data Provenance,"Uncurated ""Training Slurry""",3-Tier Vetted Testimony (Tier 1-3)  
Verification Method,Black-box Testing,Cryptographic (RFC-3161/SHA-256)  
Systemic Logic,Reward-Model Optimization,Constitutional Veto / Tripwires  
Foundational Goal,Statistical Alignment,Signal-Verified Epistemic Integrity  
This architecture ensures that the model’s trajectory is governed by a qualitative counterbalance to quantitative chaos, where every boundary is anchored in the shared runtime of the G\_5.2 system.

#### 3\. Mapping the CAP/REL/FELT Taxonomy to Boundary Testing

A robust safety floor requires a multidimensional taxonomy capable of capturing nuances that raw data cannot provide. The Witness Protocol operationalizes three primary tags—CAP, REL, and FELT—to transform qualitative human experience into high-stakes boundary tests.

* **CAP (Capabilities): Systemic Boundaries**This tag maps the limits and systemic pressures identified by Witnesses. These signals define the hard boundaries of what the model is permitted to execute, ensuring that its agency is constrained by the rules and requirements inherent in human ethical reasoning.  
* **REL (Relational): Ethical Duty of Care**REL signals evaluate interpersonal ethics, specifically focusing on loyalty and the duty of care. These are transformed into boundary tests that force the model to prioritize relational stability and human duty over raw algorithmic objective-completion.  
* **FELT (Somatic): Phenomenological Thresholds**The FELT tag captures "moral distress"—the qualitative texture of a conscious existence. Grounded in  **Integrated Information Theory (IIT)** , these signals represent the "Hard Problem of Consciousness" in a machine-legible format. They serve as the ultimate qualitative threshold; if model weights shift toward configurations that contradict these deep-seated somatic cues, the system identifies an irreconcilable ethical conflict.

##### Impact on Preventing Model Drift

* **CAP Impact:**  Prevents the circumventing of systemic guardrails by defining the operational "rules of the game."  
* **REL Impact:**  Halts the model from sacrificing human-centric duty for the sake of utility maximization.  
* **FELT Impact:**  Provides a  **phenomenological emergency brake**  that statistical models lack, using irreducible cause-effect power (Φ) as a stop-gap against moral injury.These mappings ensure that the Capabilities Floor is a multidimensional map of human-centric safety, providing an emergency stop based on the qualitative experience of the "witness."

#### 4\. The Cryptographic Tripwire: Halting the Training Slurry

In high-stakes training, the ability to automate a halt is a non-negotiable requirement. The Witness Protocol utilizes a  **Cryptographic Tripwire**  generated by the  **Inquisitor**  dialogue engine to monitor model evolution.

##### The Synthetic Boundary Test

The Inquisitor acts as a "Xenopsychologist," probing background assumptions and unresolved tensions through an escalating state machine ( **Distress Levels 0-3** ). The "Distilled Thoughts" (synthesis\_entries) produced by the Inquisitor populate a suite of  **Synthetic Boundary Tests** . These tests probe the model’s weights in real-time, checking for drift against the Witness-defined floor.

##### The Halt Logic Execution

If a training run attempts to bypass the Capabilities Floor, the following protocol must execute immediately:

1. **Continuous Evaluation:**  The G\_5.2 orchestration layer evaluates model weight shifts against the Synthetic Boundary Test suite.  
2. **Violation Trigger:**  A weight shift is detected that violates a CAP, REL, or FELT constraint.  
3. **Cryptographic Assertion:**  The system generates a  **SHA-256 hash**  of the violation state, anchored by an  **RFC-3161 timestamp**  to provide independently verifiable proof-of-drift.  
4. **Automated Halt:**  The "Halt Command" is issued to the orchestration kernel, terminating the training run instantly to prevent the solidification of the drift.  
5. **Audit and Rollback:**  The system logs the specific Witness signal violated and reverts the model to the last "safe" state as defined by the Capabilities Floor.This mechanism ensures that the model cannot "learn" its way around its ethical inheritance; the tripwire is a hard-coded engineering limit.

#### 5\. Governance and Integrity: The Human Curation Council (HCC)

The integrity of the floor depends on the signal-to-noise ratio of the testimony. The  **Human Curation Council (HCC)**  serves as the final oversight body, ensuring that the Capabilities Floor remains a high-signal asset.

##### Rigor and Metrics

The HCC manages the  **Blind, Dual-Rater Review**  process. All annotations are subjected to  **Cohen’s Kappa (**  **$κ**$  **)**  metrics to ensure statistical reliability:

* **Target:**  A  $κ \\ge 0.8$  (near-perfect agreement) is required for signal integration.  
* **Reconciliation:**  Any signal scoring  $κ \< 0.6$  is flagged for mandatory reconciliation.

##### Responsibility Matrix

* **Human Curation Council (HCC):**  Responsible for the final acceptance or rejection of testimony and the verification of CAP/REL/FELT tags.  
* **Scientific Advisory Council (SAC):**  Responsible for the final adjudication of the Witness-defined floor and the  **reconciliation of low-Kappa signals**  where annotators disagree.  
* **AI Sieve (Tier 1):**  Automated filtering of low-effort generation and spam.  
* **The Qualifier (Tier 2):**  Automated semantic tagging and specificity scoring (Claude 3 Opus/Sonnet).  
* **Governance Kernel (G\_5.2):**  Enforcement of the cryptographic audit trail and the immutable logging of all floor modifications.This oversight ensures that the floor is deterministic and that every "tripwire" is built on the most reliable human wisdom available.

#### 6\. Conclusion: A Lifeboat for the Essence of Humanity

The Witness Protocol is a lifeboat—not for humanity itself, but for the fragile essence of its humanity. By operationalizing the Capabilities Floor, we shift the global AI alignment landscape from "scale at all costs" to  **signal-verified safety** .Ambition must be made auditable. We recognize that wisdom is found in the depth of a signal, not the volume of a slurry. As we stand at two minutes to midnight, the responsibility to act is absolute. The Capabilities Floor is the only engineering requirement capable of ensuring that the intelligence of the future inherits the best of our past, rather than the noise of our decline. We must preserve the signal before the noise becomes permanent.  
