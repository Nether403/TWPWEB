import type { Metadata } from "next";
import {
  buildTokenFundingView,
  TOKEN_FUNDING_COPY,
  CRYPTO_DISCLAIMER,
  COMPLIANCE_BLOCKED_MESSAGE,
} from "@/content/token-funding";
import {
  CuratorialNeutralityStatement,
  CURATORIAL_NEUTRALITY_PARAGRAPHS,
} from "@/components/curatorial-neutrality-statement";
import { TokenFunding } from "@/components/token-funding";
import { InvoiceForm } from "@/components/invoice-form";
import {
  BANK_DETAILS,
  CASH_FUNDING_COPY,
  assertCashFundingCompliant,
} from "@/content/cash-funding";

/**
 * /fund — Funding_Module (Req 15, 16).
 *
 * This server component renders two donation sections. The cash section
 * (task 11.1): bank/wire donation/grant details, the donation-only framing, the
 * funder/invoice request form (delegating to the Form_Handler), and the
 * Curatorial Neutrality Statement adjacent to the cash options (Req 15.1–15.4).
 * The token funding section (task 11.2): donation-only framing, a verified-
 * addresses-pending notice, the information-only crypto disclaimer, and the
 * Curatorial Neutrality Statement adjacent to the token options (Req 16.6).
 * `buildTokenFundingView` fails closed until addresses are verified, and also
 * scans adjacent copy for prohibited investment framing (Req 16.7).
 */

export const metadata: Metadata = {
  title: "Fund the Foundation — The Witness Protocol",
  description:
    "Support the Witness Protocol Foundation with a donation. Cash and token contributions are gifts to a non-commercial research mission — never an investment.",
};

export default async function FundPage() {
  // Fail closed on non-compliant cash framing before any contribution details
  // render (Req 15.1).
  assertCashFundingCompliant();

  // Run the build-time compliance guard over the full token funding view,
  // including the adjacent Curatorial Neutrality Statement copy (Req 16.7).
  const tokenView = await buildTokenFundingView(
    undefined,
    CURATORIAL_NEUTRALITY_PARAGRAPHS,
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Support the Foundation
        </p>
        <h1 className="text-4xl tracking-wide sm:text-5xl">Fund the work</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-fg">
          The Witness Protocol Foundation is a non-commercial research mission.
          Every contribution is a donation or grant — never an investment, and it
          confers no financial return and no rights of any kind.
        </p>
      </header>

      {/* Cash donations (task 11.1). Bank/wire donation details, the invoice
          request form, and the neutrality statement adjacent to the cash
          options (Req 15.1–15.4). */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl tracking-wide">{CASH_FUNDING_COPY.heading}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-fg">
            {CASH_FUNDING_COPY.intro}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            {CASH_FUNDING_COPY.note}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <dl className="flex flex-col gap-4 border border-border p-6">
            {BANK_DETAILS.map((detail) => (
              <div key={detail.label} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {detail.label}
                </dt>
                <dd className="break-words text-base text-fg">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-6 border border-border p-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-heading text-xl tracking-wide text-fg">
                Request an invoice or grant receipt
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                Share your details and the Foundation will follow up by email.
              </p>
            </div>
            <InvoiceForm />
          </div>
        </div>

        <CuratorialNeutralityStatement />
      </section>

      {/* Token donations (task 11.2). Transfer controls are disabled until
          verified addresses are approved; the neutrality statement remains
          adjacent to the informational token section (Req 16.6). */}
      <div className="flex flex-col gap-8">
        <TokenFunding
          cards={tokenView.cards}
          disabled={tokenView.disabled}
          heading={TOKEN_FUNDING_COPY.heading}
          intro={TOKEN_FUNDING_COPY.intro}
          disclaimer={CRYPTO_DISCLAIMER}
          blockedMessage={COMPLIANCE_BLOCKED_MESSAGE}
        />
        <CuratorialNeutralityStatement />
      </div>
    </main>
  );
}
