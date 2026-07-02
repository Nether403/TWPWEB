import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

/**
 * /contact — the general contact form, one of the TWO Portal-owned forms
 * (task 10.4, Req 17.1). This is the ONLY form the Portal mounts here; every
 * real action (testimony, MHS packet, participation, consent) is a Platform
 * link-out, not a Portal form (Req 1, 17.2) — surfaced via /participate.
 *
 * Statically rendered shell: the page owns the heading/intro copy and the
 * boundary note; the client ContactForm owns validation, field-level errors,
 * the success confirmation, and the retry-on-failure messaging.
 */

export const metadata: Metadata = {
  title: "Contact — The Witness Protocol",
  description:
    "Send a general message to The Witness Protocol Foundation initiative. For testimony, the reviewer packet, participation, or consent, the Portal hands you off to the live Platform.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Contact
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">
          Get in touch with the Foundation
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          Use this form for general enquiries about the Witness Protocol, the
          Foundation, or its research. We read every message.
        </p>
      </header>

      <ContactForm />

      {/* Boundary note (Req 1, 17.2): real actions are Platform handoffs, not
          this form. Point Visitors to /participate for those. */}
      <p className="text-base leading-relaxed text-muted">
        Looking to submit testimony, request the reviewer packet, or manage your
        consent? Those happen on the live Platform —&nbsp;start from the{" "}
        <Link
          href="/participate"
          className="text-fg underline underline-offset-4 hover:text-muted"
        >
          Participate
        </Link>{" "}
        page.
      </p>
    </main>
  );
}
