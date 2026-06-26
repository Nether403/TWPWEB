import type { Metadata } from "next";
import { GateSimulator } from "@/components/gate-simulator";

/**
 * /demos/gate — Gate self-assessment simulator (Req 14, 1.3).
 *
 * Statically rendered shell around the client simulator. The page owns the
 * heading/intro copy; the client component owns the text input, the pure
 * `assessGate` scoring, the empty-input prompt, the assessment-failure error
 * path, the non-binding disclaimer, and the visible link-out to the real Gate
 * intake on the Platform (`/gate`). This is an explicitly-simulated, non-binding
 * demonstration — the Portal collects no testimony (Req 1.3).
 */

export const metadata: Metadata = {
  title: "Gate Self-Assessment — The Witness Protocol",
  description:
    "A simulated, non-binding self-assessment of draft testimony against the Gate's specificity, counterfactual, and relational thresholds. The real, formal submission lives on the Platform.",
};

export default function GateDemoPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Demonstration — Gate Self-Assessment
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Test your draft against the Gate
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          The Gate rejects most public submissions because it does not solicit
          abstract opinions or polite generalities. Accepted testimony names
          concrete actions, wrestles with the paths not taken, and surfaces the
          personal stakes. Use this simulator to see what the Gate evaluates
          before you submit formally on the Platform.
        </p>
      </header>

      <GateSimulator />
    </main>
  );
}
