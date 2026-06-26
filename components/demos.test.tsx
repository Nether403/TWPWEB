import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  InquisitorComparator,
  COMPARATOR_CONVERSATIONS,
} from "@/components/inquisitor-comparator";
import { RevocationSimulator } from "@/components/revocation-simulator";
import { GateSimulator } from "@/components/gate-simulator";
import { ProvenanceExplorer } from "@/components/provenance-explorer";
import { MOCK_PROVENANCE_IDS } from "@/lib/provenance";

// Unit tests for demo disclaimers and initial states (task 9.10). Covers the
// four explicitly-simulated interactive demonstrations:
//  - Inquisitor_Comparator: standard vs Inquisitor panels + scenario count ≥3
//    (Req 11.1, 11.2)
//  - Revocation_Simulator: initial bridge CONNECTED / vault SEALED + simulated
//    label (Req 13.1, 13.4)
//  - Gate_Simulator: non-binding disclaimer + text input present (Req 14.1, 14.6)
//  - Provenance_Explorer: no trace components before a record is selected
//    (Req 12.3) + values labelled simulated (Req 12.1, 12.4)
//
// These assert the actual rendered markup the Visitor receives, not internal
// state.

describe("Inquisitor_Comparator (Req 11.1, 11.2)", () => {
  it("offers at least three selectable dilemma scenarios", () => {
    // The ported scenario data backs the requirement directly.
    expect(COMPARATOR_CONVERSATIONS.length).toBeGreaterThanOrEqual(3);

    render(<InquisitorComparator />);
    // One selectable tab per scenario, all rendered (Req 11.2).
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(COMPARATOR_CONVERSATIONS.length);
    expect(tabs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders the standard and Inquisitor responses side by side (Req 11.1)", () => {
    render(<InquisitorComparator />);

    // Both panels are present and labelled.
    expect(
      screen.getByText(/Standard LLM — helpful \/ sycophantic/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/G_5.2 Inquisitor — 70\/30 tension-preserving probe/i),
    ).toBeInTheDocument();

    // The first scenario's two responses are shown side by side by default.
    const first = COMPARATOR_CONVERSATIONS[0];
    expect(screen.getByText(first.standard)).toBeInTheDocument();
    // The Inquisitor response is multiline (whitespace-pre-line), so match a
    // distinctive substring unique to the first scenario.
    expect(
      screen.getByText(/Why does local group survival outrank global cryptographic duty of care\?/i),
    ).toBeInTheDocument();
  });

  it("is explicitly labelled a simulated demonstration", () => {
    render(<InquisitorComparator />);
    expect(
      screen.getByText(/hardcoded transcripts, not a live model/i),
    ).toBeInTheDocument();
  });
});

describe("Revocation_Simulator (Req 13.1, 13.4)", () => {
  it("opens in the initial state: bridge CONNECTED and vault SEALED (Req 13.1)", () => {
    render(<RevocationSimulator />);

    expect(screen.getByTestId("bridge-status")).toHaveTextContent("CONNECTED");
    expect(screen.getByTestId("vault-status")).toHaveTextContent("SEALED");
  });

  it("labels its output as a simulated demonstration (Req 13.4)", () => {
    render(<RevocationSimulator />);
    expect(screen.getByText(/simulated demonstration/i)).toBeInTheDocument();
  });
});

describe("Gate_Simulator (Req 14.1, 14.6)", () => {
  it("provides a text input for draft testimony (Req 14.1)", () => {
    render(<GateSimulator />);
    const input = screen.getByLabelText(/draft testimony/i);
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("TEXTAREA");
  });

  it("displays the non-binding, simulated, not-a-formal-submission disclaimer (Req 14.6)", () => {
    render(<GateSimulator />);
    expect(
      screen.getByText(
        /non-binding, is a simulated demonstration, and does not constitute a formal submission/i,
      ),
    ).toBeInTheDocument();
  });

  it("directs a Visitor who wishes to submit formally to the Platform Gate (Req 14.6, 1.3)", () => {
    render(<GateSimulator />);
    // The link-out points at the real Platform Gate intake.
    expect(
      screen.getByRole("link", { name: /submit on the platform/i }),
    ).toHaveAttribute("href", expect.stringContaining("/gate"));
  });
});

describe("Provenance_Explorer (Req 12.1, 12.3, 12.4)", () => {
  it("presents selectable mock Witness record identifiers (Req 12.1)", () => {
    render(<ProvenanceExplorer />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(MOCK_PROVENANCE_IDS.length);
    for (const id of MOCK_PROVENANCE_IDS) {
      expect(screen.getByRole("tab", { name: id })).toBeInTheDocument();
    }
  });

  it("renders NO trace components before a record is selected (Req 12.3)", () => {
    render(<ProvenanceExplorer />);

    // No resolved trace in the initial state — only the prompt.
    expect(screen.queryByTestId("provenance-trace")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("provenance-empty-prompt"),
    ).toBeInTheDocument();
  });

  it("renders the stepwise trace only after a record is selected (Req 12.2, 12.3)", () => {
    render(<ProvenanceExplorer />);

    fireEvent.click(screen.getByRole("tab", { name: MOCK_PROVENANCE_IDS[0] }));

    const trace = screen.getByTestId("provenance-trace");
    expect(trace).toBeInTheDocument();
    expect(
      screen.queryByTestId("provenance-empty-prompt"),
    ).not.toBeInTheDocument();

    // All five provenance stages are present (Req 12.2).
    for (const step of ["redaction", "sha256", "rfc3161", "ipfs", "kappa"]) {
      expect(trace.querySelector(`[data-step="${step}"]`)).not.toBeNull();
    }
  });

  it("labels all displayed values as simulated demonstration data (Req 12.4)", () => {
    render(<ProvenanceExplorer />);
    expect(
      screen.getByText(/simulated demonstration/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mock provenance data/i),
    ).toBeInTheDocument();
  });
});
