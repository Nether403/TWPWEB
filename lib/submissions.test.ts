// lib/submissions.test.ts
//
// Integration test for the valid-submission wiring (task 10.5). With Supabase
// and Resend mocked, a valid submission for either Portal-owned form must:
//   - insert EXACTLY ONCE into the Platform Supabase `portal_submissions` table
//   - trigger EXACTLY ONE Resend email carrying the validated payload
//   - resolve to a 200 confirmation response
//
// Requirements: 17.5, 17.6

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Mocks for the Platform's Supabase + Resend stack ----------------------
const insert = vi.fn();
const from = vi.fn(() => ({ insert }));
const createClient = vi.fn((..._args: unknown[]) => ({ from }));
const send = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => createClient(...args),
}));

vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return { emails: { send } };
  }),
}));

describe("handleSubmission — valid submission wiring", () => {
  let handleSubmission: typeof import("./submissions").handleSubmission;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Server-only env required for the Supabase client + Resend notification.
    process.env.SUPABASE_URL = "https://project.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    process.env.RESEND_API_KEY = "resend-key";
    process.env.PORTAL_NOTIFICATION_EMAIL = "ops@example.org";
    process.env.PORTAL_NOTIFICATION_FROM = "portal@example.org";

    // Happy-path stubs: insert succeeds, email send succeeds.
    insert.mockResolvedValue({ error: null });
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });

    ({ handleSubmission } = await import("./submissions"));
  });

  afterEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.RESEND_API_KEY;
    delete process.env.PORTAL_NOTIFICATION_EMAIL;
    delete process.env.PORTAL_NOTIFICATION_FROM;
  });

  it("inserts once and emails once for a valid invoice submission, returns 200", async () => {
    const payload = {
      name: "Ada Lovelace",
      email: "ada@example.org",
      organization: "Analytical Engines Ltd",
      amount: 5000,
    };

    const result = await handleSubmission("invoice", payload);

    // 200 confirmation.
    expect(result).toEqual({ status: 200, ok: true, message: expect.any(String) });

    // Inserted exactly once into the dedicated Platform table with the payload.
    expect(from).toHaveBeenCalledTimes(1);
    expect(from).toHaveBeenCalledWith("portal_submissions");
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith({ type: "invoice", payload });

    // Exactly one Resend email carrying the validated payload values.
    expect(send).toHaveBeenCalledTimes(1);
    const sent = send.mock.calls[0][0];
    expect(sent.to).toBe("ops@example.org");
    expect(sent.from).toBe("portal@example.org");
    expect(sent.text).toContain("Ada Lovelace");
    expect(sent.text).toContain("ada@example.org");
    expect(sent.text).toContain("Analytical Engines Ltd");
    expect(sent.text).toContain("5000");
  });

  it("inserts once and emails once for a valid contact submission, returns 200", async () => {
    const payload = {
      name: "Grace Hopper",
      email: "grace@example.org",
      message: "I would like to learn more about contributing testimony.",
    };

    const result = await handleSubmission("contact", payload);

    expect(result).toEqual({ status: 200, ok: true, message: expect.any(String) });

    expect(from).toHaveBeenCalledTimes(1);
    expect(from).toHaveBeenCalledWith("portal_submissions");
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith({ type: "contact", payload });

    expect(send).toHaveBeenCalledTimes(1);
    const sent = send.mock.calls[0][0];
    expect(sent.to).toBe("ops@example.org");
    expect(sent.text).toContain("Grace Hopper");
    expect(sent.text).toContain("grace@example.org");
    expect(sent.text).toContain("learn more about contributing testimony");
  });
});
