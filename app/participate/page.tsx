import type { Metadata } from "next";
import Link from "next/link";
import { platformLink, type PlatformIntent } from "@/lib/platform-links";

/**
 * /participate — Platform link-out page (Req 1.3, 1.4, 1.5, 4.4).
 *
 * The Portal is strictly front-of-house: this page owns NO form, no testimony
 * intake, and no consent collection. Every real action is an OUTBOUND link to
 * the live Platform, sourced from the shared link-out layer (lib/platform-links)
 * so the URLs/CTAs stay in one place. The four handoffs surfaced here:
 *   gate    → the real Gate intake / testimony submission   (Req 1.3)
 *   packet  → the reviewer / MHS packet                     (Req 1.4)
 *   intake  → passwordless intake / sign-in                 (Req 1.4)
 *   consent → participation & consent surface               (Req 1.5)
 * Plus a link to the Portal's own simulated Gate self-assessment (Req 4.4).
 */

export const metadata: Metadata = {
  title: "Participate — The Witness Protocol",
  description:
    "Take part in the Witness Protocol. Every action — submitting testimony, requesting the reviewer packet, or managing consent — is handled on the live Platform.",
};

// The Platform handoffs surfaced on this page, in journey order (Req 1.3–1.5).
const PARTICIPATE_INTENTS: readonly PlatformIntent[] = [
  "gate",
  "packet",
  "intake",
  "consent",
] as const;

export default function ParticipatePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Participate
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Take part in the Witness Protocol
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Every real action happens on the live Platform — the instrument that
          holds testimony, consent, and review. This page is informational; it
          collects nothing and links you out to the Platform for each step.
        </p>
      </header>

      {/* Outbound Platform handoffs (Req 1.3, 1.4, 1.5). Each descriptor — its
          label, href, and description — comes from the shared link-out layer. */}
      <ul className="flex flex-col gap-px border border-border bg-border">
        {PARTICIPATE_INTENTS.map((intent) => {
          const link = platformLink(intent);
          return (
            <li key={link.intent} className="bg-bg">
              <a
                href={link.href}
                className="group flex flex-col gap-2 px-6 py-6 hover:bg-border/30"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-heading text-xl tracking-wide text-fg">
                    {link.label}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
                    {link.path} ↗
                  </span>
                </span>
                <span className="text-base leading-relaxed text-muted">
                  {link.description}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Req 4.4 — a witness can self-assess against the Gate before formally
          submitting on the Platform. This is the Portal's own simulated demo,
          not a real submission, so it's an internal route. */}
      <p className="text-base leading-relaxed text-muted">
        Unsure if your testimony is ready? Try the{" "}
        <Link
          href="/demos/gate"
          className="text-fg underline underline-offset-4 hover:text-muted"
        >
          Gate self-assessment
        </Link>{" "}
        first — a non-binding, simulated demonstration that does not submit
        anything.
      </p>
    </main>
  );
}
