// content/cash-funding.test.ts
//
// One runnable check that the shipped cash funding copy is donation/grant-only
// and never frames a contribution as an investment or financial return
// (Req 15.1). If a future edit reintroduces prohibited framing, this fails.

import { describe, expect, it } from "vitest";
import {
  BANK_DETAILS,
  CASH_FUNDING_COPY,
  assertCashFundingCompliant,
} from "./cash-funding";

describe("cash funding copy", () => {
  it("is compliant donation/grant framing (Req 15.1)", () => {
    expect(() => assertCashFundingCompliant()).not.toThrow();
  });

  it("displays bank/wire details for cash donations (Req 15.2)", () => {
    const labels = BANK_DETAILS.map((d) => d.label);
    expect(labels).toEqual(
      expect.arrayContaining(["IBAN", "BIC / SWIFT", "Account holder"]),
    );
    expect(CASH_FUNDING_COPY.heading.length).toBeGreaterThan(0);
  });
});
