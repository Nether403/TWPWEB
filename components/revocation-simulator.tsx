"use client";

import { useEffect, useReducer } from "react";
import { platformLink } from "@/lib/platform-links";
import {
  INITIAL_REVOCATION_STATE,
  isRevocationComplete,
  revocationReducer,
} from "@/lib/revocation";

/**
 * Revocation_Simulator (Req 13.1, 13.2, 13.3, 13.4).
 *
 * A simulated demonstration of the consent revocation cascade between the
 * Control Plane bridge and the G_5.2 data vault, ported from the draft
 * prototype. It opens in its initial state — bridge CONNECTED, vault SEALED
 * (Req 13.1). Triggering the sequence plays a stepwise log that culminates in a
 * severed bridge (REVOKED) and a purged vault (PURGED) (Req 13.2). A reset
 * control returns it to the initial connected/sealed state (Req 13.3). All
 * output is explicitly labelled as a simulated demonstration (Req 13.4).
 *
 * All logic lives in the pure reducer in `lib/revocation.ts`; this component
 * only drives the cascade forward on a timer and renders state. The Portal owns
 * no consent records — the real revocation surface is on the Platform (Req 1.5),
 * linked out below.
 *
 * Styling stays within the basalt/paper tokens — no accent hues, no rounded
 * corners, no transform-based motion (Req 18).
 */

/** Delay between cascade steps, in milliseconds (cinematic stepwise reveal). */
const STEP_INTERVAL_MS = 600;

export function RevocationSimulator() {
  const [state, dispatch] = useReducer(
    revocationReducer,
    INITIAL_REVOCATION_STATE,
  );

  const started = state.step > 0;
  const complete = isRevocationComplete(state);

  // Auto-advance the cascade once triggered, one step per tick, until complete.
  // The reducer is the source of truth; this effect only schedules `step`
  // dispatches. Clearing the timer on reset/unmount keeps it tidy.
  useEffect(() => {
    if (!started || complete) return;
    const timer = setTimeout(() => dispatch({ type: "step" }), STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [started, complete, state.step]);

  const consentLink = platformLink("consent");

  return (
    <section className="flex flex-col gap-6">
      {/* Simulated-demonstration label (Req 13.4). */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Simulated demonstration — no real consent records or data are touched.
      </p>

      {/* Status panels — bridge and vault (Req 13.1, 13.2). */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <article className="flex flex-col gap-2 bg-bg p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Control Plane Bridge
          </h2>
          <p
            data-testid="bridge-status"
            className={`font-mono text-lg tracking-wide ${
              state.bridge === "CONNECTED" ? "text-muted" : "font-bold text-fg"
            }`}
          >
            {state.bridge}
          </p>
        </article>
        <article className="flex flex-col gap-2 bg-bg p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            G_5.2 Data Vault
          </h2>
          <p
            data-testid="vault-status"
            className={`font-mono text-lg tracking-wide ${
              state.vault === "SEALED" ? "text-muted" : "font-bold text-fg"
            }`}
          >
            {state.vault}
          </p>
        </article>
      </div>

      {/* Controls — trigger and reset (Req 13.2, 13.3). */}
      <div className="flex flex-wrap gap-px border border-border bg-border font-mono text-xs uppercase tracking-[0.15em]">
        <button
          type="button"
          onClick={() => dispatch({ type: "step" })}
          disabled={started}
          className="flex-1 bg-bg px-4 py-3 text-center text-fg hover:bg-bg/60 disabled:cursor-not-allowed disabled:text-muted"
        >
          Simulate Revocation
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          disabled={!started}
          className="flex-1 bg-bg px-4 py-3 text-center text-fg hover:bg-bg/60 disabled:cursor-not-allowed disabled:text-muted"
        >
          Reset Simulator
        </button>
      </div>

      {/* Stepwise terminal log (Req 13.2). */}
      <div
        aria-live="polite"
        className="flex min-h-[200px] flex-col gap-1 border border-border bg-bg p-5 font-mono text-sm leading-relaxed text-fg"
      >
        {state.log.length === 0 ? (
          <p className="m-auto max-w-sm text-center italic text-muted">
            Trigger the revocation sequence to broadcast delete signals across
            the split-plane boundary.
          </p>
        ) : (
          state.log.map((line, index) => (
            <p
              key={index}
              className="border-b border-border/40 pb-1 text-muted last:border-b-0"
            >
              <span className="text-fg">&bull;</span> {line}
            </p>
          ))
        )}
      </div>

      <p className="text-base italic leading-relaxed text-muted">
        Revocation is a system invariant, not only a legal promise: when consent
        is withdrawn, the Control Plane severs the bridge and the downstream
        vault is purged — the runtime can no longer reach the data.
      </p>

      {/* Visible link-out to the REAL participation & consent surface (Req 1.5). */}
      <div className="flex flex-col gap-2 border border-border p-5">
        <a
          href={consentLink.href}
          className="group flex items-baseline justify-between gap-4"
        >
          <span className="font-heading text-xl tracking-wide text-fg">
            {consentLink.label}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
            {consentLink.path} ↗
          </span>
        </a>
        <p className="text-base leading-relaxed text-muted">
          {consentLink.description}
        </p>
      </div>
    </section>
  );
}
