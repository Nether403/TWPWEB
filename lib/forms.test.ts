// lib/forms.test.ts
//
// Self-check for validateForm's field-error mapping (the non-trivial bit of
// lib/forms.ts). The property test (Property 15) lives in task 10.2; this is
// the minimal example-based check that the discriminated result and per-field
// error mapping behave (Req 17.3, 17.4).

import { describe, it, expect } from "vitest";
import {
  ContactSchema,
  InvoiceRequestSchema,
  validateForm,
} from "@/lib/forms";

describe("validateForm", () => {
  it("accepts a valid invoice payload and returns typed data", () => {
    const result = validateForm(InvoiceRequestSchema, {
      name: "Ada",
      email: "ada@example.com",
      organization: "Analytical Engines",
      amount: 5000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.amount).toBe(5000);
  });

  it("accepts a valid contact payload", () => {
    const result = validateForm(ContactSchema, {
      name: "Grace",
      email: "grace@example.com",
      message: "Hello.",
    });
    expect(result.ok).toBe(true);
  });

  it("reports one field-level error per invalid field and no data", () => {
    const result = validateForm(InvoiceRequestSchema, {
      name: "",
      email: "not-an-email",
      organization: "",
      amount: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // A field-level error for each invalid field.
      expect(Object.keys(result.fieldErrors).sort()).toEqual([
        "amount",
        "email",
        "name",
        "organization",
      ]);
      // Discriminated failure carries NO parsed data.
      expect("data" in result).toBe(false);
    }
  });

  it("flags only the invalid fields, leaving valid ones out", () => {
    const result = validateForm(ContactSchema, {
      name: "Grace",
      email: "bad",
      message: "Hi.",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
    }
  });
});
