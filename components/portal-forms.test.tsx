import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "./contact-form";
import { InvoiceForm } from "./invoice-form";

// Component tests for the TWO Portal-owned form UIs (task 10.4). These cover the
// client-facing behavior — client-side validation + field-level errors
// (Req 17.4), the success confirmation (Req 17.8), and the retry-on-failure
// message (Req 17.7) — plus the invoice form's distinct amount parsing.
//
// The server route (/api/forms/[type]) is stubbed here via global.fetch; the
// real persistence + email wiring is exercised separately (task 10.5).

/** Build a Response-like object for a stubbed fetch result. */
function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe("ContactForm (Req 17.4, 17.7, 17.8)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders field-level errors and sends nothing when submitted empty (Req 17.4)", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // One error per invalid field; nothing was POSTed.
    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(3);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows a success confirmation on a 200 response (Req 17.8)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, { ok: true })));

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hello there." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
  });

  it("shows retry messaging and no success on a 500 response (Req 17.7)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(500, { ok: false })),
    );

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hi." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/please try again/i)).toBeInTheDocument();
    expect(screen.queryByText(/message received/i)).not.toBeInTheDocument();
  });
});

describe("InvoiceForm (Req 15.4, 17.4, 17.8)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all four funder fields", () => {
    render(<InvoiceForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/requested amount/i)).toBeInTheDocument();
  });

  it("rejects an empty amount as a field error and sends nothing (Req 17.4)", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    render(<InvoiceForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: "Analytical Engine Co." },
    });
    // amount left blank → invalid_type, not a silent coercion to 0.
    fireEvent.click(screen.getByRole("button", { name: /request an invoice/i }));

    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("parses the amount to a number and POSTs to /api/forms/invoice, then confirms (Req 15.4, 17.8)", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true }));
    vi.stubGlobal("fetch", fetchSpy);

    render(<InvoiceForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: "Analytical Engine Co." },
    });
    fireEvent.change(screen.getByLabelText(/requested amount/i), {
      target: { value: "5000" },
    });
    fireEvent.click(screen.getByRole("button", { name: /request an invoice/i }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/forms/invoice");
    const sent = JSON.parse((init as RequestInit).body as string);
    // amount must be a number, not the "5000" string.
    expect(sent.amount).toBe(5000);
    expect(typeof sent.amount).toBe("number");

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
  });
});
