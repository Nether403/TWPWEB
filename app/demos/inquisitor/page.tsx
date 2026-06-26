import type { Metadata } from "next";
import { InquisitorComparator } from "@/components/inquisitor-comparator";

/**
 * /demos/inquisitor — Inquisitor transcript comparator (Req 11, 1.6).
 *
 * Statically rendered shell around the client comparator. The page owns the
 * heading/intro copy; the client component owns scenario selection, the
 * side-by-side render, and the visible link-out to the real Inquisitor on the
 * Platform (`/api/inquisitor`). This is an explicitly-simulated demonstration —
 * the Portal runs no dialogue engine of its own (Req 1.6).
 */

export const metadata: Metadata = {
  title: "Inquisitor Comparator — The Witness Protocol",
  description:
    "A simulated, side-by-side comparison of a standard LLM response and the G_5.2 Inquisitor's tension-preserving probe across three dilemma scenarios.",
};

export default function InquisitorDemoPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Demonstration — Inquisitor Comparator
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          The Inquisitor, side by side
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          See the methodology demonstrated rather than described. Each scenario
          pairs a standard helpful/sycophantic LLM reply with the G_5.2
          Inquisitor&rsquo;s response — a 70/30 question-to-statement probe that
          preserves the tension of a moral choice instead of smoothing it away.
        </p>
      </header>

      <InquisitorComparator />
    </main>
  );
}
