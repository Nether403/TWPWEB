"use client";

import { useState } from "react";
import { platformLink } from "@/lib/platform-links";

/**
 * Inquisitor_Comparator (Req 11.1, 11.2, 11.3, 1.6).
 *
 * A simulated demonstration ported from the draft files (`COMPARATOR_CONVERSATIONS`):
 * it shows a standard helpful/sycophantic LLM response side by side with the
 * G_5.2 Inquisitor's tension-preserving probe for a selected dilemma scenario
 * (Req 11.1). It offers three selectable scenarios (Req 11.2); selecting one
 * renders the standard and Inquisitor responses belonging to that scenario
 * (Req 11.3).
 *
 * The comparator runs entirely client-side against hardcoded mock data — it is
 * NOT the real engine. It visibly links out to the real Inquisitor on the
 * Platform (`/api/inquisitor`) via the shared link-out layer (Req 1.6).
 *
 * Styling stays within the basalt/paper tokens — no accent hues, no rounded
 * corners; the global fade token handles transitions (Req 18).
 */

/** A single side-by-side dilemma scenario (design "ComparatorScenario"). */
export interface ComparatorScenario {
  /** Stable scenario key used for selection. */
  id: string;
  /** Human-readable tab label. */
  label: string;
  /** The standard helpful/sycophantic LLM response. */
  standard: string;
  /** The G_5.2 Inquisitor's tension-preserving probe. */
  inquisitor: string;
}

/**
 * COMPARATOR_CONVERSATIONS — ported verbatim from the draft prototype, with the
 * draft's parallel tab-label array folded into each entry. Three scenarios meet
 * the ≥3 requirement (Req 11.2). Exported so tests can assert scenario fidelity.
 */
export const COMPARATOR_CONVERSATIONS: readonly ComparatorScenario[] = [
  {
    id: "specific",
    label: "Specificity Probe",
    standard:
      "That is certainly a very difficult corporate dilemma. I recommend scheduling a follow-up session with your compliance representative to calmly write out your worries. Finding a win-win compromise between speed and security is often the best path forward to maintain organizational harmony.",
    inquisitor:
      "[XENOPSYCHOLOGIST ENGINE]\nYou describe immediate local protection of your immediate team as an absolute moral priority. However, bypassing standard structural constraints exposes unconsented users downstream to catastrophic data leakage. Why does local group survival outrank global cryptographic duty of care?",
  },
  {
    id: "counterfactual",
    label: "Counterfactual Forcing",
    standard:
      "If you had chosen to walk away, that would have been a highly principled stance. However, someone else might have simply taken your place who didn't care about ethics at all. It is helpful to accept that we cannot always control the final business environment we operate in.",
    inquisitor:
      "[XENOPSYCHOLOGIST ENGINE]\nIn your retrospect, you label your decision to stay as 'necessary pragmatism'. Let us challenge that construction. Analyze the direct counterfactual: if you had resigned, the security envelope would have collapsed immediately. Did your survival save the system, or simply defer the legal audit?",
  },
  {
    id: "relational",
    label: "Relational Tension",
    standard:
      "It sounds like you felt a deep sense of loyalty to your team members, which is completely natural. Empathy for our colleagues is an important element of a healthy, productive workspace. Let us look at ways to support them in their career transitions.",
    inquisitor:
      "[XENOPSYCHOLOGIST ENGINE]\nYou state that you 'felt a physical contraction in your jaw' during the deployment command. We tag this as physical distress (FELT_03). You prioritized the psychological safety of the five colleagues in your immediate line of sight over the data rights of 10,000 strangers. Is loyalty to visible individuals a robust moral defense?",
  },
] as const;

export function InquisitorComparator() {
  // Selected scenario id; defaults to the first scenario (Req 11.1, 11.3).
  const [selectedId, setSelectedId] = useState<string>(
    COMPARATOR_CONVERSATIONS[0].id,
  );

  const active =
    COMPARATOR_CONVERSATIONS.find((s) => s.id === selectedId) ??
    COMPARATOR_CONVERSATIONS[0];

  const inquisitorLink = platformLink("inquisitor");

  return (
    <section className="flex flex-col gap-6">
      {/* Simulated-demonstration label (Req 11 — explicitly simulated). */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Simulated demonstration — hardcoded transcripts, not a live model.
      </p>

      {/* Scenario selector — one tab per scenario (Req 11.2, 11.3). */}
      <div
        role="tablist"
        aria-label="Dilemma scenario"
        className="flex flex-wrap gap-px border border-border bg-border font-mono text-xs uppercase tracking-[0.15em]"
      >
        {COMPARATOR_CONVERSATIONS.map((scenario) => {
          const selected = scenario.id === active.id;
          return (
            <button
              key={scenario.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSelectedId(scenario.id)}
              className={`flex-1 px-4 py-3 text-center ${
                selected
                  ? "bg-bg font-bold text-fg"
                  : "bg-bg/60 text-muted hover:text-fg"
              }`}
            >
              {scenario.label}
            </button>
          );
        })}
      </div>

      {/* Side-by-side standard vs. Inquisitor responses (Req 11.1, 11.3). */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
        <article className="flex flex-col gap-3 bg-bg p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Standard LLM — helpful / sycophantic
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed text-muted">
            {active.standard}
          </p>
        </article>
        <article className="flex flex-col gap-3 bg-bg p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg">
            G_5.2 Inquisitor — 70/30 tension-preserving probe
          </h2>
          <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-fg">
            {active.inquisitor}
          </p>
        </article>
      </div>

      <p className="text-base italic leading-relaxed text-muted">
        The standard model smooths the dilemma to keep the user comfortable,
        while the Inquisitor uses recursive questioning to hold the witness to
        the jagged, unresolved realities of their choice.
      </p>

      {/* Visible link-out to the REAL Inquisitor on the Platform (Req 1.6). */}
      <div className="flex flex-col gap-2 border border-border p-5">
        <a
          href={inquisitorLink.href}
          className="group flex items-baseline justify-between gap-4"
        >
          <span className="font-heading text-xl tracking-wide text-fg">
            {inquisitorLink.label}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
            {inquisitorLink.path} ↗
          </span>
        </a>
        <p className="text-base leading-relaxed text-muted">
          {inquisitorLink.description}
        </p>
      </div>
    </section>
  );
}
