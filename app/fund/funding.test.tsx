// app/fund/funding.test.tsx
//
// Unit tests for the Funding_Module (task 11.3). These assert the actual
// rendered output a Visitor receives on /fund, plus the TokenFunding
// component's clipboard behavior and the build-time compliance guard:
//
//  - Bank/wire AND token content present with donation/grant framing
//    (Req 15.1, 15.2, 16.1, 16.2)
//  - The Curatorial_Neutrality_Statement renders adjacent to BOTH the cash and
//    the token options (Req 15.3, 16.6)
//  - The copy-to-clipboard control shows a confirmation (Clipboard API mocked)
//    and falls back to selectable text when the Clipboard API is unavailable
//    (Req 16.4)
//  - The on-chain / no-custody crypto disclaimer is present (Req 16.5)
//  - The compliance guard disables wallet addresses, QR codes, and copy
//    controls when prohibited investment language is present in the token
//    funding view (Req 16.7) — verified at both layers: buildTokenFundingView
//    (fails closed) and the TokenFunding component (renders no contribution
//    controls when `disabled`).

import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";

import FundPage from "./page";
import { TokenFunding } from "@/components/token-funding";
import type { TokenCardData } from "@/content/token-funding";
import {
  buildTokenFundingView,
  TOKEN_OPTIONS,
  TOKEN_FUNDING_COPY,
  CRYPTO_DISCLAIMER,
  COMPLIANCE_BLOCKED_MESSAGE,
} from "@/content/token-funding";

// A compliant token card fixture (the QR data URL is irrelevant to these
// behavioral assertions, so a short placeholder data URL stands in).
const CARD: TokenCardData = {
  name: "Bitcoin",
  symbol: "BTC",
  network: "Bitcoin mainnet",
  address: "bc1qexampledonationaddressplaceholder",
  qrDataUrl: "data:image/png;base64,QQ==",
};

function renderTokenFunding(overrides: Partial<React.ComponentProps<typeof TokenFunding>> = {}) {
  return render(
    <TokenFunding
      cards={[CARD]}
      disabled={false}
      heading={TOKEN_FUNDING_COPY.heading}
      intro={TOKEN_FUNDING_COPY.intro}
      disclaimer={CRYPTO_DISCLAIMER}
      blockedMessage={COMPLIANCE_BLOCKED_MESSAGE}
      {...overrides}
    />,
  );
}

// ---------------------------------------------------------------------------
// buildTokenFundingView — the build-time compliance guard (Req 16.7)
// ---------------------------------------------------------------------------
describe("buildTokenFundingView (Req 16.2, 16.7)", () => {
  it("returns one QR-coded card per token for compliant copy", async () => {
    const view = await buildTokenFundingView();
    expect(view.disabled).toBe(false);
    expect(view.cards).toHaveLength(TOKEN_OPTIONS.length);
    for (const card of view.cards) {
      expect(card.qrDataUrl).toMatch(/^data:image\/png;base64,/);
      expect(card.address.length).toBeGreaterThan(0);
    }
  });

  it("fails closed (no cards) when prohibited investment language is in the view (Req 16.7)", async () => {
    const view = await buildTokenFundingView(TOKEN_OPTIONS, [
      "Contribute now to receive a financial return on your investment.",
    ]);
    expect(view.disabled).toBe(true);
    expect(view.cards).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// TokenFunding component — copy control + disabled state (Req 16.4, 16.5, 16.7)
// ---------------------------------------------------------------------------
describe("TokenFunding component (Req 16.4, 16.5, 16.7)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // Remove any clipboard override so tests don't leak into each other.
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("renders the address, QR code, and disclaimer in the enabled state (Req 16.2, 16.5)", () => {
    renderTokenFunding();

    expect(screen.getByText(CARD.address)).toBeInTheDocument();
    const qr = screen.getByRole("img", { name: /QR code for the Bitcoin/i });
    expect(qr).toHaveAttribute("src", CARD.qrDataUrl);
    // On-chain / no-custody disclaimer is always shown.
    expect(screen.getByText(CRYPTO_DISCLAIMER)).toBeInTheDocument();
    expect(screen.getByText(/does not connect wallets/i)).toBeInTheDocument();
  });

  it("copies the address and shows a confirmation via the Clipboard API (Req 16.4)", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    renderTokenFunding();
    fireEvent.click(screen.getByRole("button", { name: /copy address/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(CARD.address));
    expect(await screen.findByText(/address copied to clipboard/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("falls back to selectable text when the Clipboard API is unavailable (Req 16.4)", async () => {
    // No navigator.clipboard in this (insecure-context) scenario.
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    renderTokenFunding();
    fireEvent.click(screen.getByRole("button", { name: /copy address/i }));

    expect(
      await screen.findByText(/clipboard unavailable — address selected/i),
    ).toBeInTheDocument();
  });

  it("disables addresses, QR codes, and copy controls when the guard trips (Req 16.7)", () => {
    renderTokenFunding({ cards: [], disabled: true });

    // The blocked notice replaces the contribution path.
    expect(screen.getByRole("alert")).toHaveTextContent(COMPLIANCE_BLOCKED_MESSAGE);
    // No address, no QR code, no copy control renders alongside non-compliant framing.
    expect(screen.queryByText(CARD.address)).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /QR code/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /copy address/i }),
    ).not.toBeInTheDocument();
    // The disclaimer remains visible even when contributions are disabled.
    expect(screen.getByText(CRYPTO_DISCLAIMER)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// /fund page composition (Req 15.1–15.3, 16.1, 16.2, 16.5, 16.6)
// ---------------------------------------------------------------------------
describe("/fund page (Req 15.1, 15.2, 15.3, 16.1, 16.2, 16.5, 16.6)", () => {
  it("presents bank/wire and token content with donation/grant framing", async () => {
    render(await FundPage());

    // Bank/wire cash details (Req 15.2).
    expect(screen.getByText("DE00 0000 0000 0000 0000 00")).toBeInTheDocument();
    expect(screen.getByText("EXAMPLEXXX")).toBeInTheDocument();
    expect(screen.getByText(/bank transfer & wire donations/i)).toBeInTheDocument();

    // Token content: each token name and its network is shown (Req 16.2).
    // (Networks may repeat across tokens, e.g. ETH and USDC both on ERC-20.)
    for (const token of TOKEN_OPTIONS) {
      expect(screen.getByText(token.name)).toBeInTheDocument();
      expect(screen.getAllByText(token.network).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("heading", { name: /^token donations$/i })).toBeInTheDocument();

    // Donation/grant framing, never investment framing (Req 15.1, 16.1).
    expect(screen.getByText(/donation or grant — never an investment/i)).toBeInTheDocument();
    expect(screen.getAllByText(/not an investment/i).length).toBeGreaterThan(0);

    // On-chain / no-custody crypto disclaimer (Req 16.5).
    expect(screen.getByText(/made directly on-chain/i)).toBeInTheDocument();
  });

  it("renders the Curatorial Neutrality Statement adjacent to BOTH cash and token options (Req 15.3, 16.6)", async () => {
    render(await FundPage());

    const statements = screen.getAllByRole("complementary", {
      name: /curatorial neutrality statement/i,
    });
    expect(statements).toHaveLength(2);

    // One statement sits within the cash section (adjacent to the bank details).
    const cashSection = screen.getByText("DE00 0000 0000 0000 0000 00").closest("section");
    expect(cashSection).not.toBeNull();
    expect(
      within(cashSection as HTMLElement).getByRole("complementary", {
        name: /curatorial neutrality statement/i,
      }),
    ).toBeInTheDocument();

    // The other sits within the token funding block (adjacent to the token options).
    const tokenSection = screen
      .getByRole("heading", { name: /^token donations$/i })
      .closest("section");
    expect(tokenSection).not.toBeNull();
    const tokenBlock = (tokenSection as HTMLElement).parentElement as HTMLElement;
    expect(
      within(tokenBlock).getByRole("complementary", {
        name: /curatorial neutrality statement/i,
      }),
    ).toBeInTheDocument();
  });
});
