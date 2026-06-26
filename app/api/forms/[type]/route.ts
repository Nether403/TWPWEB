// app/api/forms/[type]/route.ts
//
// POST /api/forms/[type]  (type ∈ { invoice, contact })
//
// The runtime form-submission layer for the two Portal-owned forms. This route
// is intentionally THIN: it normalizes the request (validates the [type] param,
// parses the JSON body) and delegates all validation + persistence + email to
// `handleSubmission` (lib/submissions.ts), then maps the discriminated result
// to an HTTP status:
//   422 + fieldErrors  — server-side validation failed, nothing persisted
//   500 + retry        — persistence failed, no success confirmation
//   200 + confirmation — persisted (email is best-effort after persist)
//
// Requirements: 17.3, 17.4, 17.5, 17.6, 17.7, 17.8

import { NextResponse } from "next/server";
import { FORM_SCHEMAS, type FormType } from "@/lib/forms";
import { handleSubmission } from "@/lib/submissions";

/** Only the two Portal-owned form types are valid (Req 17.1). */
function isFormType(value: string): value is FormType {
  return value in FORM_SCHEMAS;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const { type } = await context.params;

  // Unknown form type -> 404. The Portal owns only `invoice` and `contact`;
  // every other intent is a Platform link-out, not a Portal form (Req 17.1).
  if (!isFormType(type)) {
    return NextResponse.json(
      { ok: false, message: "Unknown form type." },
      { status: 404 },
    );
  }

  // A non-JSON / malformed body is treated as a validation failure (422) rather
  // than a server error — the client sent something we can't validate.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, fieldErrors: { _form: "Invalid request body." } },
      { status: 422 },
    );
  }

  const result = await handleSubmission(type, body);

  // Map the discriminated outcome to its HTTP status. `status` is stripped from
  // the JSON body so the wire shape matches what the client form expects.
  const { status, ...payload } = result;
  return NextResponse.json(payload, { status });
}
