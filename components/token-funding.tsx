"use client";

import { useRef, useState } from "react";
import type { TokenCardData } from "@/content/token-funding";

/**
 * TokenFunding (Req 16.1–16.7).
 *
 * Renders per-token donation cards (name, symbol, network, address, build-time
 * QR code) with a copy-to-clipboard control. Donation-only framing — no
 * investment, no financial return, no conferred rights (Req 16.1).
 *
 * Copy control (Req 16.4): uses the async Clipboard API when available and
 * shows a confirmation. When the Clipboard API is unavailable (insecure context
 * or older browser), it falls back to SELECTING the address text so the Visitor
 * can copy it manually, and tells them how.
 *
 * Compliance guard (Req 16.7): when `disabled` is true (prohibited investment
 * language was detected in the token funding view at build/render time), the
 * wallet addresses, QR codes, and copy controls are NOT rendered at all; a
 * compliance notice is shown in their place. The contribution path fails closed.
 */
export interface TokenFundingProps {
  /** Per-token cards with QR data URLs; empty when `disabled`. */
  cards: readonly TokenCardData[];
  /** True when the compliance guard tripped (Req 16.7). */
  disabled: boolean;
  /** Heading for the token section. */
  heading: string;
  /** Donation-only framing copy. */
  intro: string;
  /** Information-only crypto disclaimer (Req 16.5). */
  disclaimer: string;
  /** Message rendered in place of controls when `disabled` (Req 16.7). */
  blockedMessage: string;
}

export function TokenFunding({
  cards,
  disabled,
  heading,
  intro,
  disclaimer,
  blockedMessage,
}: TokenFundingProps) {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="token-funding-heading">
      <div className="flex flex-col gap-3">
        <h2
          id="token-funding-heading"
          className="font-heading text-2xl tracking-wide text-fg sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-fg">{intro}</p>
      </div>

      {disabled ? (
        // Req 16.7 — fail closed: no addresses, no QR codes, no copy controls.
        <p
          role="alert"
          className="border border-border p-5 text-base leading-relaxed text-fg"
        >
          {blockedMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <TokenCard key={`${card.symbol}-${card.network}`} card={card} />
          ))}
        </div>
      )}

      {/* Information-only crypto disclaimer (Req 16.5) — always shown. */}
      <p className="text-sm leading-relaxed text-muted">{disclaimer}</p>
    </section>
  );
}

type CopyState = "idle" | "copied" | "select";

function TokenCard({ card }: { card: TokenCardData }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const addressRef = useRef<HTMLElement>(null);

  /** Select the address text so a Visitor can copy it manually (fallback). */
  function selectAddressText() {
    const node = addressRef.current;
    if (!node) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function handleCopy() {
    // Prefer the async Clipboard API in a secure context (Req 16.4).
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(card.address);
        setCopyState("copied");
        window.setTimeout(() => setCopyState("idle"), 2000);
        return;
      } catch {
        // Fall through to the selectable-text fallback below.
      }
    }
    // Clipboard API unavailable or denied — select the text for manual copy.
    selectAddressText();
    setCopyState("select");
    window.setTimeout(() => setCopyState("idle"), 4000);
  }

  return (
    <article className="flex flex-col gap-4 bg-bg p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-xl tracking-wide text-fg">
          {card.name}
        </h3>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {card.symbol}
        </span>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {card.network}
      </p>

      {/* Build-time-generated QR code (Req 16.3). next/image is unnecessary for
          a small inline data URL; a plain img keeps this a pure data render. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.qrDataUrl}
        alt={`QR code for the ${card.name} (${card.symbol}) donation address on ${card.network}`}
        width={240}
        height={240}
        className="h-auto w-full max-w-[240px] border border-border bg-white p-2"
      />

      {/* Wallet address — selectable text (also the fallback copy target). */}
      <code
        ref={addressRef}
        className="block break-all border border-border bg-bg p-3 font-mono text-xs leading-relaxed text-fg"
      >
        {card.address}
      </code>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="border border-border bg-bg px-4 py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg hover:bg-border/30"
        >
          {copyState === "copied" ? "Copied ✓" : "Copy address"}
        </button>
        {/* Live region announces the copy confirmation / fallback (Req 16.4). */}
        <span role="status" aria-live="polite" className="min-h-[1rem] text-xs text-muted">
          {copyState === "copied"
            ? "Address copied to clipboard."
            : copyState === "select"
              ? "Clipboard unavailable — address selected. Press Ctrl/Cmd+C to copy."
              : ""}
        </span>
      </div>
    </article>
  );
}
