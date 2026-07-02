// content/token-funding.ts
//
// Token funding data + build-time QR generation for the Funding_Module
// (Req 16.1–16.7). This module is server-only: it imports `qrcode` to generate
// QR data URLs at build/render time (the page that consumes it is a server
// component). No wallet-connect, no on-chain transactions, no custody — the
// contribution rails remain disabled until verified addresses are approved.

import QRCode from "qrcode";
import { containsProhibitedInvestmentLanguage } from "@/lib/funding-compliance";

/** A supported donation token (design "TokenOption"). */
export interface TokenOption {
  /** Token name, e.g. "Bitcoin". */
  name: string;
  /** Ticker symbol, e.g. "BTC". */
  symbol: string;
  /** Network the address belongs to, e.g. "Bitcoin mainnet". */
  network: string;
  /** Static, information-only donation wallet address once verified. */
  address: string;
}

/**
 * Keep token transfer affordances disabled until the Foundation has approved
 * real contribution addresses. This prevents placeholder strings from becoming
 * accidental transfer instructions.
 */
export const TOKEN_ADDRESSES_VERIFIED = false;

/**
 * Supported donation tokens. Addresses are intentionally non-transfer strings
 * while TOKEN_ADDRESSES_VERIFIED is false.
 */
export const TOKEN_OPTIONS: readonly TokenOption[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin mainnet",
    address: "PENDING_VERIFIED_BTC_ADDRESS",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum mainnet (ERC-20)",
    address: "PENDING_VERIFIED_ETH_ADDRESS",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    network: "Ethereum mainnet (ERC-20)",
    address: "PENDING_VERIFIED_USDC_ADDRESS",
  },
] as const;

/**
 * The donation-only framing copy for the token funding view (Req 16.1).
 * Worded as donations exclusively; single negated sentences keep the compliance
 * guard exact (see lib/funding-compliance.ts).
 */
export const TOKEN_FUNDING_COPY = {
  heading: "Token donations",
  intro:
    "Token contribution rails are being prepared for the non-commercial research mission. Contributions will be donations only: not an investment, no financial return, and no programmatic, governance, or other rights.",
} as const;

/**
 * The information-only crypto disclaimer (Req 16.5): contributions happen
 * directly on-chain; the Portal connects no wallets, processes no transactions,
 * and custodies no funds.
 */
export const CRYPTO_DISCLAIMER =
  "Verified token contribution addresses are pending Foundation approval. Do not send funds until verified addresses are published through the official site. This Portal does not connect wallets, process transactions, or custody funds.";

/** The message shown in place of contribution controls when the guard trips. */
export const COMPLIANCE_BLOCKED_MESSAGE =
  "Token contribution options are unavailable while verified addresses are pending approval. Wallet addresses, QR codes, and copy controls are disabled so no visitor can send funds to a placeholder address.";

/** A token card enriched with its build-time-generated QR data URL. */
export interface TokenCardData extends TokenOption {
  /** Data URL (PNG) of the QR code encoding the wallet address. */
  qrDataUrl: string;
}

/** The fully-resolved token funding view model handed to the client component. */
export interface TokenFundingView {
  /** Per-token cards with QR codes, or `[]` when the compliance guard trips. */
  cards: TokenCardData[];
  /** True when prohibited investment language disabled the contribution path (Req 16.7). */
  disabled: boolean;
}

/**
 * Build the token funding view at build/render time.
 *
 * Runs the compliance guard (Req 16.7) over ALL human-readable copy that the
 * token funding view renders (framing, disclaimer, token names/networks, and
 * any supplied adjacent copy such as the Curatorial Neutrality Statement). If
 * prohibited investment language is detected, the contribution path fails
 * closed: no QR codes are generated and no addresses are returned.
 *
 * Otherwise it generates one QR data URL per token address via `qrcode`.
 */
export async function buildTokenFundingView(
  tokens: readonly TokenOption[] = TOKEN_OPTIONS,
  adjacentCopy: readonly string[] = [],
  addressesVerified: boolean = TOKEN_ADDRESSES_VERIFIED,
): Promise<TokenFundingView> {
  const scanned: string[] = [
    TOKEN_FUNDING_COPY.heading,
    TOKEN_FUNDING_COPY.intro,
    CRYPTO_DISCLAIMER,
    ...tokens.flatMap((t) => [t.name, t.network]),
    ...adjacentCopy,
  ];

  if (containsProhibitedInvestmentLanguage(scanned)) {
    // Fail closed (Req 16.7): no addresses, no QR codes, no copy controls.
    return { cards: [], disabled: true };
  }

  if (!addressesVerified) {
    // Fail closed until verified addresses are approved: no address text, no QR
    // codes, and no copy controls render on the public page.
    return { cards: [], disabled: true };
  }

  const cards = await Promise.all(
    tokens.map(async (token) => ({
      ...token,
      qrDataUrl: await QRCode.toDataURL(token.address, {
        margin: 1,
        width: 240,
        errorCorrectionLevel: "M",
      }),
    })),
  );

  return { cards, disabled: false };
}
