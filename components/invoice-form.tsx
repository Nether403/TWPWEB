"use client";

// components/invoice-form.tsx
//
// Funder / invoice request form — one of the TWO Portal-owned forms (task 10.4,
// Req 15.4, 17.1). This is a REUSABLE component: it owns the form only, not a
// page shell or heading, so the Funding module (/fund, task 11.1) can mount it
// adjacent to the cash/bank details and the Curatorial_Neutrality_Statement.
//
// It validates client-side against the SHARED InvoiceRequestSchema (lib/forms),
// renders field-level errors, POSTs to /api/forms/invoice, and shows a success
// confirmation (200) or a retry-on-failure message (500) via the shared
// usePortalForm hook (Req 17.4, 17.7, 17.8).
//
// Framing note: this captures a funder/invoice REQUEST (name, email, org,
// requested amount). It is donation/grant intake — never investment or
// financial-return language (Req 15.1). The page that mounts it owns the
// neutrality statement; this component stays copy-light.
//
// Requirements: 15.4, 17.1, 17.4, 17.7, 17.8

import { useState } from "react";
import { InvoiceRequestSchema } from "@/lib/forms";
import { usePortalForm } from "@/components/use-portal-form";
import { FormField } from "@/components/form-field";

export function InvoiceForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [amount, setAmount] = useState("");
  const { status, fieldErrors, submit, reset } = usePortalForm(
    "invoice",
    InvoiceRequestSchema,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // The schema expects a positive number. An empty field becomes `undefined`
    // (a required-field error), and a non-numeric string becomes `NaN` (a
    // type error) — both surface as field-level errors rather than silently
    // coercing to 0.
    const parsedAmount = amount.trim() === "" ? undefined : Number(amount);
    void submit({ name, email, organization, amount: parsedAmount });
  }

  // Success confirmation (Req 15.6, 17.8).
  if (status === "success") {
    return (
      <section
        role="status"
        className="flex flex-col gap-4 border border-border p-6"
      >
        <h3 className="font-heading text-2xl tracking-wide text-fg">
          Request received
        </h3>
        <p className="text-base leading-relaxed text-fg">
          Thank you — your funding request has been received. The Foundation
          will follow up by email with the details you need.
        </p>
        <button
          type="button"
          onClick={() => {
            setName("");
            setEmail("");
            setOrganization("");
            setAmount("");
            reset();
          }}
          className="self-start border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg"
        >
          Submit another request
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <FormField id="invoice-name" label="Name" error={fieldErrors.name}>
        <input
          id="invoice-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          className="w-full border border-border bg-bg p-3 text-base text-fg placeholder:text-muted"
        />
      </FormField>

      <FormField id="invoice-email" label="Email" error={fieldErrors.email}>
        <input
          id="invoice-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          className="w-full border border-border bg-bg p-3 text-base text-fg placeholder:text-muted"
        />
      </FormField>

      <FormField
        id="invoice-organization"
        label="Organization"
        error={fieldErrors.organization}
      >
        <input
          id="invoice-organization"
          name="organization"
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          aria-invalid={Boolean(fieldErrors.organization)}
          className="w-full border border-border bg-bg p-3 text-base text-fg placeholder:text-muted"
        />
      </FormField>

      <FormField
        id="invoice-amount"
        label="Requested amount (EUR)"
        error={fieldErrors.amount}
      >
        <input
          id="invoice-amount"
          name="amount"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={Boolean(fieldErrors.amount)}
          className="w-full border border-border bg-bg p-3 text-base text-fg placeholder:text-muted"
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
          We couldn&rsquo;t record your request. Please try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-fg hover:text-bg disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Request an invoice"}
      </button>
    </form>
  );
}
