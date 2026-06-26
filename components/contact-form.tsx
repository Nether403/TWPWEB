"use client";

// components/contact-form.tsx
//
// General contact form — one of the TWO Portal-owned forms (task 10.4, Req
// 17.1). Mounted on /contact. Validates client-side against the SHARED
// ContactSchema (lib/forms), renders field-level errors, POSTs to
// /api/forms/contact, and shows a success confirmation (200) or a
// retry-on-failure message (500) via the shared usePortalForm hook.
//
// Styling stays within the basalt/paper tokens — no accent hues, no rounded
// corners; transitions use the global fade token (Req 18).
//
// Requirements: 17.1, 17.4, 17.7, 17.8

import { useState } from "react";
import { ContactSchema } from "@/lib/forms";
import { usePortalForm } from "@/components/use-portal-form";
import { FormField } from "@/components/form-field";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { status, fieldErrors, submit, reset } = usePortalForm(
    "contact",
    ContactSchema,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void submit({ name, email, message });
  }

  // Success confirmation (Req 17.8). The form is replaced by the confirmation;
  // a Visitor can start a fresh message from here.
  if (status === "success") {
    return (
      <section
        role="status"
        className="flex flex-col gap-4 border border-border p-6"
      >
        <h2 className="font-heading text-2xl tracking-wide text-fg">
          Message received
        </h2>
        <p className="text-base leading-relaxed text-fg">
          Thank you — your message has been received. We&rsquo;ll be in touch.
        </p>
        <button
          type="button"
          onClick={() => {
            setName("");
            setEmail("");
            setMessage("");
            reset();
          }}
          className="self-start border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg"
        >
          Send another message
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <FormField id="contact-name" label="Name" error={fieldErrors.name}>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          className="w-full border border-border bg-bg p-3 text-base text-fg placeholder:text-muted"
        />
      </FormField>

      <FormField id="contact-email" label="Email" error={fieldErrors.email}>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          className="w-full border border-border bg-bg p-3 text-base text-fg placeholder:text-muted"
        />
      </FormField>

      <FormField id="contact-message" label="Message" error={fieldErrors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          className="w-full resize-y border border-border bg-bg p-3 text-base leading-relaxed text-fg placeholder:text-muted"
        />
      </FormField>

      {/* Non-field error (e.g. malformed request body keyed under `_form`). */}
      {fieldErrors._form && (
        <p role="alert" className="text-sm leading-relaxed text-fg">
          {fieldErrors._form}
        </p>
      )}

      {/* Retry-on-failure messaging (Req 17.7) — never a success confirmation. */}
      {status === "retry" && (
        <p
          role="alert"
          className="border border-border bg-bg p-4 text-base leading-relaxed text-fg"
        >
          We couldn&rsquo;t send your message. Please try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
