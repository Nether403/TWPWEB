// lib/forms.ts
//
// Shared Zod schemas + validation for the TWO Portal-owned forms only
// (design.md "Form_Handler"): funder/invoice and general contact. Every other
// intent (testimony, MHS packet, participation, consent, research-corpus
// access) is a Platform link-out, never a Portal form (Req 17.1, 17.2).
//
// This module is the single source of truth for those schemas. It is imported
// by BOTH the client form components (task 10.4) and the server route handler
// (task 10.3), so it stays free of any client- or server-only imports.
//
// Requirements: 17.1, 17.3, 17.4

import { z } from "zod";

/** The two Portal-owned form types (design.md). */
export type FormType = "invoice" | "contact";

/**
 * Funder/invoice request (Req 15.4): name, email, organization, requested
 * amount. Shapes taken verbatim from design.md.
 */
export const InvoiceRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().min(1),
  amount: z.number().positive(),
});

/** General contact form: name, valid email, and a message body. */
export const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export type InvoiceRequest = z.infer<typeof InvoiceRequestSchema>;
export type ContactRequest = z.infer<typeof ContactSchema>;

/** Schema lookup by form type, so the route handler can pick by `[type]`. */
export const FORM_SCHEMAS: Record<FormType, z.ZodType> = {
  invoice: InvoiceRequestSchema,
  contact: ContactSchema,
};

/**
 * Discriminated validation result (Req 17.4). On success it carries the parsed,
 * typed data; on failure it carries ONLY field-level errors and NEVER the
 * parsed data, so a failed validation can never be mistaken for a persistable
 * payload.
 */
export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; fieldErrors: Record<string, string> };

/**
 * Validate `input` against `schema`. Reuses zod's `safeParse`; on failure it
 * flattens zod's structured issues into one message per invalid field
 * (Req 17.4). The first issue per field wins (forms surface one error per
 * field). Field-less issues (e.g. a non-object body) are keyed under `_form`.
 */
export function validateForm<T>(
  schema: z.ZodType<T>,
  input: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join(".") : "_form";
    // First message per field wins — one error per field in the UI.
    if (!(key in fieldErrors)) {
      fieldErrors[key] = issue.message;
    }
  }
  return { ok: false, fieldErrors };
}
