// content/cash-funding.ts
//
// Cash (bank transfer / wire) donation details + framing copy for the
// Funding_Module (Req 15.1, 15.2). Static, information-only: the Portal does
// not process payments — a supporter transfers a donation/grant directly to the
// Foundation's account using these details, and may request an invoice via the
// form (Req 15.4).
//
// Framing is donation/grant ONLY: no contribution is described as an investment
// or as conferring a financial return (Req 15.1). The copy is written as single,
// clearly-negated sentences so the shared funding compliance guard reads it as
// compliant (see lib/funding-compliance.ts).

import { containsProhibitedInvestmentLanguage } from "@/lib/funding-compliance";

/** A single labelled bank-detail line shown to a supporter. */
export interface BankDetail {
  label: string;
  value: string;
}

/**
 * The Foundation's bank/wire donation details (Req 15.2).
 *
 * ponytail: placeholder details for the alpha — replace with the Foundation's
 * real published bank account before launch. Format is a valid EUR IBAN/BIC so
 * the layout and any copy controls render correctly in the meantime.
 */
export const BANK_DETAILS: readonly BankDetail[] = [
  { label: "Account holder", value: "The Witness Protocol Foundation" },
  { label: "Bank", value: "Example Bank (placeholder)" },
  { label: "IBAN", value: "DE00 0000 0000 0000 0000 00" },
  { label: "BIC / SWIFT", value: "EXAMPLEXXX" },
  { label: "Reference", value: "Donation — Witness Protocol" },
] as const;

/**
 * The donation/grant framing copy for the cash funding view (Req 15.1).
 * Worded as donations/grants exclusively; single negated sentences keep the
 * compliance guard exact (see lib/funding-compliance.ts).
 */
export const CASH_FUNDING_COPY = {
  heading: "Bank transfer & wire donations",
  intro:
    "Support the Foundation with a bank transfer or wire donation or grant. These contributions are gifts to a non-commercial research mission and are not an investment and confer no financial return and no rights of any kind.",
  note: "Transfer your donation directly to the account below using the reference shown. The Foundation does not process payments through this Portal. Request a formal invoice or grant receipt using the form, and the Foundation will follow up by email.",
} as const;

/** Every human-readable cash funding string the page renders, for the guard. */
const CASH_FUNDING_SCANNED: readonly string[] = [
  CASH_FUNDING_COPY.heading,
  CASH_FUNDING_COPY.intro,
  CASH_FUNDING_COPY.note,
  ...BANK_DETAILS.map((d) => d.value),
];

/**
 * Build-time/render-time assertion that the cash funding copy never frames a
 * donation as an investment or financial return (Req 15.1). Fails closed: a
 * non-compliant edit throws at render rather than shipping prohibited framing.
 */
export function assertCashFundingCompliant(): void {
  if (containsProhibitedInvestmentLanguage(CASH_FUNDING_SCANNED)) {
    throw new Error(
      "Cash funding copy contains prohibited investment/financial-return framing (Req 15.1).",
    );
  }
}
