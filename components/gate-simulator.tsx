"use client";

import { useState } from "react";
import {
  assessGate,
  GateAssessmentError,
  type GateResult,
  MIN_WORD_COUNT,
  PASS_THRESHOLD,
} from "@/lib/gate";
import { platformLink } from "@/lib/platform-links";

/**
 * Gate_Simulator (Req 14.1–14.6, 1.3).
 *
 * A simulated, non-binding self-assessment ported from the draft prototype. A
 * Visitor types draft testimony and gets per-dimension scores (specificity,
 * counterfactual, relational) and an overall pass/no-pass (Req 14.2, 14.3).
 *
 * The scoring is delegated to the pure `assessGate` (lib/gate.ts) so three
 * outcomes stay distinct (Req 14.4, 14.5):
 *   - null                       → prompt-to-enter-text, no score
 *   - GateResult                 → real scores + pass/no-pass
 *   - throws GateAssessmentError → an error message, NEVER zero scores
 *
 * It runs entirely client-side against the heuristic — it is NOT the real Gate.
 * It visibly links out to the Platform `/gate` for real, formal submission
 * (Req 1.3, 14.6) via the shared link-out layer.
 *
 * Styling stays within the basalt/paper tokens — no accent hues, no rounded
 * corners; the global fade token handles transitions (Req 18).
 */

/** The three view states after a submission attempt. */
type GateView =
  | { status: "idle" }
  | { status: "empty" } // prompt-to-enter-text (Req 14.4)
  | { status: "error"; message: string } // assessment failed (Req 14.5)
  | { status: "scored"; result: GateResult }; // valid assessment (Req 14.2, 14.3)

const DIMENSIONS = [
  {
    key: "specificity" as const,
    label: "Specificity",
    blurb: "Measures the detail of a singular, situated human action.",
  },
  {
    key: "counterfactual" as const,
    label: "Counterfactual",
    blurb: "Measures reflection on the paths not taken.",
  },
  {
    key: "relational" as const,
    label: "Relational",
    blurb: "Measures the physical / moral stakes and empathy at play.",
  },
];

export function GateSimulator() {
  const [draft, setDraft] = useState("");
  const [view, setView] = useState<GateView>({ status: "idle" });

  const gateLink = platformLink("gate");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = assessGate(draft);
      if (result === null) {
        // Empty / whitespace-only input — prompt to enter text, no score (Req 14.4).
        setView({ status: "empty" });
        return;
      }
      setView({ status: "scored", result });
    } catch (err) {
      // Assessment failed — surface an error message and never show zero scores
      // in place of a valid assessment (Req 14.5).
      const message =
        err instanceof GateAssessmentError
          ? err.message
          : "The Gate assessment could not evaluate this draft. Please try again.";
      setView({ status: "error", message });
    }
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Simulated-demonstration / non-binding label (Req 14.6). */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Simulated demonstration — a non-binding heuristic, not the real Gate.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label
          htmlFor="gate-draft"
          className="font-mono text-xs uppercase tracking-[0.15em] text-muted"
        >
          Draft testimony — write a reflective account (aim for{" "}
          {MIN_WORD_COUNT}+ words)
        </label>
        {/* Text input for draft testimony (Req 14.1). */}
        <textarea
          id="gate-draft"
          name="gate-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={10}
          className="w-full resize-y border border-border bg-bg p-4 text-base leading-relaxed text-fg placeholder:text-muted"
          placeholder="Describe a concrete moral choice you faced: what you decided, what you could have done instead, and who it affected."
        />
        <button
          type="submit"
          className="self-start border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg"
        >
          Assess draft
        </button>
      </form>

      {/* Empty-input prompt — shown instead of any score (Req 14.4). */}
      {view.status === "empty" && (
        <p role="status" className="text-base leading-relaxed text-fg">
          Please enter some draft testimony before requesting an assessment.
        </p>
      )}

      {/* Assessment-failure error — NEVER zero scores in its place (Req 14.5). */}
      {view.status === "error" && (
        <p
          role="alert"
          className="border border-border bg-bg p-4 text-base leading-relaxed text-fg"
        >
          {view.message}
        </p>
      )}

      {/* Valid assessment — per-dimension scores and overall pass/no-pass (Req 14.2, 14.3). */}
      {view.status === "scored" && (
        <div className="flex flex-col gap-6 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-heading text-2xl tracking-wide text-fg">
              Eligibility analysis
            </h2>
            <span
              className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg"
              data-passed={view.result.passed}
            >
              {view.result.passed
                ? "Meets the simulated thresholds"
                : "Does not yet meet the thresholds"}
            </span>
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
            Word count: {view.result.wordCount} (minimum {MIN_WORD_COUNT})
          </p>

          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {DIMENSIONS.map((dim) => {
              const score = view.result[dim.key];
              return (
                <div key={dim.key} className="flex flex-col gap-2 bg-bg p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {dim.label}
                  </div>
                  <div
                    className="font-heading text-3xl text-fg"
                    data-meets-threshold={score >= PASS_THRESHOLD}
                  >
                    {score}%
                  </div>
                  <p className="text-sm italic leading-relaxed text-muted">
                    {dim.blurb}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-base leading-relaxed text-muted">
            {view.result.passed
              ? "This draft shows enough honest signal of a situated, non-generic dilemma to be worth bringing to the real Gate."
              : "The simulated sieve reads this draft as too abstract or thin on counterfactual depth. Try naming exactly what you weighed, what could have happened instead, and the interpersonal stakes."}
          </p>
        </div>
      )}

      {/* Non-binding disclaimer + visible link-out to the real Platform Gate (Req 14.6, 1.3). */}
      <div className="flex flex-col gap-3 border border-border p-5">
        <p className="text-base leading-relaxed text-muted">
          This assessment is non-binding, is a simulated demonstration, and does
          not constitute a formal submission. To submit testimony for real, use
          the Gate intake on the Platform.
        </p>
        <a
          href={gateLink.href}
          className="group flex items-baseline justify-between gap-4"
        >
          <span className="font-heading text-xl tracking-wide text-fg">
            {gateLink.label}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
            {gateLink.path} ↗
          </span>
        </a>
        <p className="text-base leading-relaxed text-muted">
          {gateLink.description}
        </p>
      </div>
    </section>
  );
}
