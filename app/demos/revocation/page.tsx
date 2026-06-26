import type { Metadata } from "next";
import { RevocationSimulator } from "@/components/revocation-simulator";

/**
 * /demos/revocation — Consent revocation simulator (Req 13, 1.5).
 *
 * Statically rendered shell around the client simulator. The page owns the
 * heading/intro copy; the client component owns the bridge/vault state machine,
 * the stepwise log, the reset control, and the visible link-out to the real
 * participation & consent surface on the Platform. This is an
 * explicitly-simulated demonstration — the Portal owns no consent records of
 * its own (Req 1.5).
 */

export const metadata: Metadata = {
  title: "Revocation Simulator — The Witness Protocol",
  description:
    "A simulated demonstration of the consent revocation cascade: how withdrawing consent severs the Control Plane bridge and purges the G_5.2 data vault.",
};

export default function RevocationDemoPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Demonstration — Revocation Simulator
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Consent revocation, as a system invariant
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Revocation is enforced by architecture, not only by policy. Trigger
          the sequence to watch the Control Plane bridge move from connected to
          severed while the G_5.2 data vault moves from sealed to purged — then
          reset to return to the initial state.
        </p>
      </header>

      <RevocationSimulator />
    </main>
  );
}
