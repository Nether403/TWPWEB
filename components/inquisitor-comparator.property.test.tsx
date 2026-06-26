// components/inquisitor-comparator.property.test.tsx
//
// Property test for Inquisitor scenario selection fidelity (task 9.2).
//
// The Inquisitor_Comparator (components/inquisitor-comparator.tsx) ports the
// draft `COMPARATOR_CONVERSATIONS` (≥3 scenarios) and renders the standard vs.
// Inquisitor responses side by side for the selected scenario. Property 10
// guarantees the selector is faithful: selecting ANY scenario surfaces EXACTLY
// that scenario's standard response and Inquisitor response — never a different
// scenario's text (Req 11.3).
//
// We verify against the actual rendered output: for any scenario id, we click
// its tab and assert the rendered DOM contains that scenario's standard and
// inquisitor strings and contains NO other scenario's distinct response text.

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import fc from "fast-check";
import {
  InquisitorComparator,
  COMPARATOR_CONVERSATIONS,
} from "./inquisitor-comparator";

afterEach(cleanup);

// Arbitrary scenario id drawn from the actual ported scenario set.
const scenarioId = fc.constantFrom(
  ...COMPARATOR_CONVERSATIONS.map((s) => s.id),
);

describe("Property 10: Inquisitor scenario selection fidelity", () => {
  // Feature: witness-protocol-portal, Property 10: Inquisitor scenario selection fidelity
  it("selecting any scenario renders exactly that scenario's standard and Inquisitor responses", () => {
    fc.assert(
      fc.property(scenarioId, (id) => {
        const selected = COMPARATOR_CONVERSATIONS.find((s) => s.id === id)!;

        const { container } = render(<InquisitorComparator />);

        // Select the scenario by clicking its tab (verifies real interaction).
        fireEvent.click(screen.getByRole("tab", { name: selected.label }));

        const text = container.textContent ?? "";

        // The selected scenario's standard + Inquisitor responses are present.
        expect(text).toContain(selected.standard);
        expect(text).toContain(selected.inquisitor);

        // No OTHER scenario's distinct response text leaks into the view —
        // exactly the selected scenario's responses are surfaced (Req 11.3).
        for (const other of COMPARATOR_CONVERSATIONS) {
          if (other.id === selected.id) continue;
          expect(text).not.toContain(other.standard);
          expect(text).not.toContain(other.inquisitor);
        }

        cleanup();
      }),
      { numRuns: 100 },
    );
  });
});
