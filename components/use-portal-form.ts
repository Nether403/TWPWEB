"use client";

// components/use-portal-form.ts
//
// Shared client-side submission hook for the TWO Portal-owned forms (task 10.4:
// funder/invoice and general contact). The validate -> POST -> status-mapping
// flow is identical for both forms, so it lives here once; each form component
// owns only its own fields and layout.
//
// The flow encodes the form requirements from the Visitor's side:
//   1. client-side validate via the SHARED Zod schema (lib/forms) -> field-level
//      errors, nothing sent                                        (Req 17.4)
//   2. POST the validated payload to /api/forms/[type]            (Req 17.x)
//   3. map the response:
//        200 -> success confirmation                              (Req 17.8)
//        422 -> server-side field errors (re-validation)          (Req 17.4)
//        500 / network / other -> retry-on-failure message        (Req 17.7)
//
// ponytail: client validation is a UX fast-path only; the route handler
// re-validates server-side (lib/submissions) and is the real trust boundary.
//
// Requirements: 17.1, 17.4, 17.7, 17.8

import { useState } from "react";
import type { z } from "zod";
import { validateForm, type FormType } from "@/lib/forms";

/** The lifecycle of a single submission attempt. */
export type FormStatus = "idle" | "submitting" | "success" | "retry";

export interface PortalForm {
  status: FormStatus;
  /** One message per invalid field; `_form` keys a non-field error. */
  fieldErrors: Record<string, string>;
  /** Validate `input` client-side, then POST on success. */
  submit: (input: unknown) => Promise<void>;
  /** Clear errors and return to the editable idle state. */
  reset: () => void;
}

export function usePortalForm<T>(
  type: FormType,
  schema: z.ZodType<T>,
): PortalForm {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(input: unknown): Promise<void> {
    // 1. Client-side validation via the shared schema (Req 17.4). On failure we
    //    surface field errors and send nothing.
    const local = validateForm(schema, input);
    if (!local.ok) {
      setFieldErrors(local.fieldErrors);
      setStatus("idle");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const res = await fetch(`/api/forms/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(local.data),
      });

      if (res.ok) {
        // 200 — persisted; show the success confirmation (Req 17.8).
        setStatus("success");
        return;
      }

      const payload = (await res.json().catch(() => null)) as
        | { fieldErrors?: Record<string, string> }
        | null;

      // 422 — server-side re-validation rejected the payload; show field
      // errors and let the Visitor correct them (Req 17.4).
      if (res.status === 422 && payload?.fieldErrors) {
        setFieldErrors(payload.fieldErrors);
        setStatus("idle");
        return;
      }

      // 500 / anything else — persistence failed; invite a retry and never show
      // a success confirmation (Req 17.7).
      setStatus("retry");
    } catch {
      // Network failure is the same retry path — nothing was confirmed.
      setStatus("retry");
    }
  }

  function reset(): void {
    setStatus("idle");
    setFieldErrors({});
  }

  return { status, fieldErrors, submit, reset };
}
