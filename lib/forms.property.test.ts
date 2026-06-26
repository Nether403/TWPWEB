// lib/forms.property.test.ts
//
// Property test for the two Portal-owned forms' shared validator (task 10.2).
// validateForm is the single gate that decides whether a funder/invoice or
// contact submission is persistable (Req 17.3, 17.4). This test exercises it
// across both form types with mixed valid/invalid fields.

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  ContactSchema,
  InvoiceRequestSchema,
  validateForm,
} from "@/lib/forms";

// --- Field generators -------------------------------------------------------
//
// Each generator yields { value, valid }: the value to place in the payload and
// whether that value satisfies its schema field. The oracle below is then just
// "accept iff every field is valid" — no reimplementation of zod's rules.

// A required non-empty string field (name / organization / message: min(1)).
const stringField = fc.oneof(
  // Valid: any string of length >= 1 satisfies z.string().min(1).
  fc.string({ minLength: 1 }).map((value) => ({ value, valid: true })),
  // Invalid: empty (too short), missing (undefined), or wrong type.
  fc
    .constantFrom<unknown>("", undefined, null, 42, true)
    .map((value) => ({ value, valid: false })),
);

// An alphanumeric token, used to assemble syntactically valid email addresses.
const alnum = fc
  .array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789".split("")), {
    minLength: 1,
    maxLength: 8,
  })
  .map((chars) => chars.join(""));

// A required, syntactically-valid email field (z.string().email()).
const emailField = fc.oneof(
  // Valid: local@domain.tld built from alphanumerics — accepted by zod.
  fc
    .tuple(alnum, alnum, fc.constantFrom("com", "org", "net", "io"))
    .map(([local, domain, tld]) => ({
      value: `${local}@${domain}.${tld}`,
      valid: true,
    })),
  // Invalid: any string with '@' stripped cannot be a valid address.
  fc
    .string()
    .map((s) => s.replace(/@/g, ""))
    .map((value) => ({ value, valid: false })),
  // Invalid: missing or wrong type.
  fc
    .constantFrom<unknown>(undefined, null, 123)
    .map((value) => ({ value, valid: false })),
);

// A required positive-number field (z.number().positive()).
const amountField = fc.oneof(
  // Valid: a finite number strictly greater than zero.
  fc
    .double({ min: 1e-6, max: 1e9, noNaN: true, noDefaultInfinity: true })
    .map((value) => ({ value, valid: true })),
  // Invalid: zero or negative (fails .positive()).
  fc
    .double({ min: -1e9, max: 0, noNaN: true, noDefaultInfinity: true })
    .map((value) => ({ value, valid: false })),
  // Invalid: missing, wrong type, or NaN (zod rejects NaN for z.number()).
  fc
    .constantFrom<unknown>(undefined, null, "5", NaN)
    .map((value) => ({ value, valid: false })),
);

type Field = { value: unknown; valid: boolean };

// Assemble a payload from named fields and record which keys are invalid.
function buildCase(fields: Record<string, Field>): {
  payload: Record<string, unknown>;
  invalidKeys: string[];
} {
  const payload: Record<string, unknown> = {};
  const invalidKeys: string[] = [];
  for (const [key, field] of Object.entries(fields)) {
    payload[key] = field.value;
    if (!field.valid) invalidKeys.push(key);
  }
  return { payload, invalidKeys };
}

const invoiceFields = fc.record({
  name: stringField,
  email: emailField,
  organization: stringField,
  amount: amountField,
});

const contactFields = fc.record({
  name: stringField,
  email: emailField,
  message: stringField,
});

// Shared assertion: validateForm accepts iff no field is invalid; on rejection
// it carries exactly one field-level error per invalid field and no data.
function checkProperty<T>(
  schema: Parameters<typeof validateForm<T>>[0],
  fields: Record<string, Field>,
) {
  const { payload, invalidKeys } = buildCase(fields);
  const result = validateForm(schema, payload);

  if (invalidKeys.length === 0) {
    // All required fields present and valid -> accepted with typed data.
    expect(result.ok).toBe(true);
  } else {
    // Any invalid field -> rejected, one error per invalid field, no data.
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(
        [...invalidKeys].sort(),
      );
      expect("data" in result).toBe(false);
    }
  }
}

describe("Property 15: Form validation correctness", () => {
  // Feature: witness-protocol-portal, Property 15: Form validation correctness
  it("funder/invoice form: accepts iff all required fields present and email valid", () => {
    fc.assert(
      fc.property(invoiceFields, (fields) =>
        checkProperty(InvoiceRequestSchema, fields),
      ),
      { numRuns: 200 },
    );
  });

  // Feature: witness-protocol-portal, Property 15: Form validation correctness
  it("contact form: accepts iff all required fields present and email valid", () => {
    fc.assert(
      fc.property(contactFields, (fields) =>
        checkProperty(ContactSchema, fields),
      ),
      { numRuns: 200 },
    );
  });
});
