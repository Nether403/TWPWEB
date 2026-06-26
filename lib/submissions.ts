// lib/submissions.ts
//
// Server-only persistence + notification for the TWO Portal-owned forms
// (funder/invoice and general contact). This is the ONLY part of the Portal
// that performs runtime I/O (design.md "Form_Handler" / "Form submission
// records"). It re-validates server-side, persists to the Platform's existing
// Supabase, and triggers a Resend notification email.
//
// SECURITY / BOUNDARY (design.md):
//   - All secrets are server-only. This module imports Supabase + Resend, so it
//     MUST never be imported from a client component. The shared schemas live
//     in lib/forms.ts (client+server safe); the secrets live here.
//   - Portal submissions are written to a single dedicated `portal_submissions`
//     table — never commingled with witness/consent/audit tables. The
//     credential is a server-only, least-privilege INSERT-only role (RLS
//     insert-only), keeping public writes from reaching control-plane data
//     (Req 1, Req 17.5).
//
// Requirements: 17.3, 17.4, 17.5, 17.6, 17.7, 17.8
//
// ponytail: no `server-only` import guard — that's an extra dependency we can
// avoid. This module is server-only by construction: only the API route handler
// imports it, and every secret it reads (SUPABASE_*, RESEND_*) lacks the
// NEXT_PUBLIC_ prefix, so Next never inlines them into client bundles. Ceiling:
// the boundary is convention, not a build-time guard. Upgrade path: add the
// `server-only` package if a client import is ever attempted by mistake.

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  FORM_SCHEMAS,
  validateForm,
  type FormType,
} from "@/lib/forms";

/** The dedicated, isolated table reserved for Portal forms (design.md). */
const SUBMISSIONS_TABLE = "portal_submissions";

/**
 * Discriminated outcome of a submission attempt. The route handler maps each
 * variant to an HTTP status. A failed validation carries ONLY field errors and
 * a failed persist NEVER reports success (Req 17.4, 17.7, 17.8).
 */
export type SubmissionResponse =
  | { status: 200; ok: true; message: string }
  | { status: 422; ok: false; fieldErrors: Record<string, string> }
  | { status: 500; ok: false; message: string };

const RETRY_MESSAGE =
  "We couldn't record your submission. Please try again in a moment.";
const SUCCESS_MESSAGE =
  "Thank you — your submission has been received.";

/**
 * Lazily construct the Supabase client from server-only env. Lazy (not
 * module-scope) so a missing env at import time doesn't crash unrelated routes,
 * and so tests can stub the env before first call.
 *
 * SUPABASE_SERVICE_ROLE_KEY is the server-only, least-privilege INSERT-only
 * credential for `portal_submissions` (design.md) — never exposed to the
 * client (no NEXT_PUBLIC_ prefix).
 */
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase server credentials are not configured.");
  }
  // persistSession off — this is a stateless server insert, not a user session.
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Human-readable subject + body for the notification email, per form type. */
function notification(type: FormType, payload: Record<string, unknown>) {
  const subject =
    type === "invoice"
      ? "New funder / invoice request"
      : "New contact message";
  const lines = Object.entries(payload).map(
    ([k, v]) => `${k}: ${String(v)}`,
  );
  return { subject, text: `${subject}\n\n${lines.join("\n")}` };
}

/**
 * Validate, persist, then notify. The control flow encodes the requirements:
 *   1. validate -> 422 + fieldErrors, no persist           (Req 17.3, 17.4)
 *   2. insert into Platform Supabase -> 500 + retry, no success on failure
 *                                                          (Req 17.5, 17.7)
 *   3. trigger Resend, return 200 + confirmation           (Req 17.6, 17.8)
 */
export async function handleSubmission(
  type: FormType,
  input: unknown,
): Promise<SubmissionResponse> {
  // 1. Server-side re-validation (never trust the client). (Req 17.3, 17.4)
  const validation = validateForm(FORM_SCHEMAS[type], input);
  if (!validation.ok) {
    return { status: 422, ok: false, fieldErrors: validation.fieldErrors };
  }
  const payload = validation.data as Record<string, unknown>;

  // 2. Persist FIRST — persistence is the source of truth. A failed insert
  //    returns an error and NO success confirmation. (Req 17.5, 17.7)
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .insert({ type, payload });
    if (error) {
      return { status: 500, ok: false, message: RETRY_MESSAGE };
    }
  } catch {
    // Misconfiguration or network failure — same retry path, no success.
    return { status: 500, ok: false, message: RETRY_MESSAGE };
  }

  // 3. Notify via Resend. (Req 17.6)
  // ponytail: email is best-effort AFTER a successful persist — persistence is
  // the source of truth, so a send failure does NOT fail the request (the data
  // is already saved and the Visitor must not be told to retry, which would
  // create a duplicate row). Ceiling: a dropped notification is silent.
  // Upgrade path: a retry queue / dead-letter on the email send.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.PORTAL_NOTIFICATION_EMAIL;
    const from = process.env.PORTAL_NOTIFICATION_FROM;
    if (apiKey && to && from) {
      const { subject, text } = notification(type, payload);
      await new Resend(apiKey).emails.send({ from, to, subject, text });
    }
  } catch {
    // Swallow — see ponytail note above. Persisted data is authoritative.
  }

  return { status: 200, ok: true, message: SUCCESS_MESSAGE };
}
