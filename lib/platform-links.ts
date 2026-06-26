// lib/platform-links.ts
//
// The shared Platform link-out layer (design.md "Platform Handoff").
//
// The Portal is strictly front-of-house. It owns NO intake, consent, or auth
// route — every real action is an OUTBOUND link to the existing live Platform
// (`TWP-platform`). This module is the single source of truth for those
// outbound URLs/CTAs, reused by the landing page, the six audience journeys,
// the Gate simulator, the Inquisitor comparator, and the `/participate` page.
//
// Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
//
// Real Platform surfaces (confirmed against TWP-platform routes):
//   /gate            real Gate intake / witness submission   (Req 1.3)
//   /packet          reviewer / MHS packet                   (Req 1.4)
//   /api/intake      passwordless intake                     (Req 1.4)
//   /dashboard/consent  participation & consent surface      (Req 1.5)
//   /api/inquisitor  the real Inquisitor dialogue engine     (Req 1.6)

/**
 * Default Platform origin. Matches the Platform's `NEXT_PUBLIC_APP_URL`
 * (`https://thewprotocol.online`).
 *
 * ponytail: hardcoded production default so the Portal builds and renders
 * without any env set. Ceiling — a wrong origin ships if the env is unset in a
 * non-production environment (e.g. staging). Upgrade path: set
 * `NEXT_PUBLIC_PLATFORM_BASE_URL` per deployment (documented in `.env.example`).
 */
const DEFAULT_PLATFORM_BASE_URL = "https://thewprotocol.online";

/**
 * The Platform origin, sourced from env with a documented production fallback.
 * NEXT_PUBLIC_ prefix so the value is inlined client-side too — the Gate
 * simulator and Inquisitor comparator are client components that render these
 * links. Trailing slashes are trimmed so `platformUrl` can join cleanly.
 */
export const PLATFORM_BASE_URL = (
  process.env.NEXT_PUBLIC_PLATFORM_BASE_URL ?? DEFAULT_PLATFORM_BASE_URL
).replace(/\/+$/, "");

/**
 * Build an absolute Platform URL for a path. The leading slash on `path` is
 * optional; the result is always `${origin}/${path}` with exactly one slash
 * between origin and path.
 */
export function platformUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PLATFORM_BASE_URL}${normalized}`;
}

/** The set of Platform handoffs the Portal links out to, keyed by intent. */
export type PlatformIntent =
  | "gate"
  | "packet"
  | "intake"
  | "consent"
  | "inquisitor";

/** A single outbound link descriptor, rendered as a consistent CTA. */
export interface PlatformLink {
  /** The handoff intent this descriptor represents. */
  intent: PlatformIntent;
  /** Human-readable CTA label. */
  label: string;
  /** Absolute URL to the Platform surface. */
  href: string;
  /** The Platform path (relative), useful for tests and display. */
  path: string;
  /** Short explanation of where the link goes and why. */
  description: string;
}

/**
 * The canonical, typed map of Platform link-outs. This is the only place these
 * URLs are defined; consumers import from here so every CTA points at the same
 * surface and respects `PLATFORM_BASE_URL`.
 */
export const PLATFORM_LINKS: Record<PlatformIntent, PlatformLink> = {
  // Req 1.3 — real Gate intake (testimony submission) lives on the Platform.
  gate: {
    intent: "gate",
    label: "Submit on the Platform",
    href: platformUrl("/gate"),
    path: "/gate",
    description:
      "The real Gate intake on the Platform, where testimony is formally submitted. The Portal collects no testimony.",
  },
  // Req 1.4 — reviewer / MHS packet.
  packet: {
    intent: "packet",
    label: "Request the MHS Packet",
    href: platformUrl("/packet"),
    path: "/packet",
    description:
      "The reviewer / Minimum Honest Signal packet on the Platform for invited professionals.",
  },
  // Req 1.4 — passwordless intake that issues the magic-link sign-in.
  intake: {
    intent: "intake",
    label: "Begin passwordless intake",
    href: platformUrl("/api/intake"),
    path: "/api/intake",
    description:
      "The Platform's passwordless intake endpoint that begins the reviewer/witness sign-in flow.",
  },
  // Req 1.5 — participation & consent surface.
  consent: {
    intent: "consent",
    label: "Participate & manage consent",
    href: platformUrl("/dashboard/consent"),
    path: "/dashboard/consent",
    description:
      "The Platform's participation and consent surface, where consent records are created and revoked.",
  },
  // Req 1.6 — the real Inquisitor dialogue engine.
  inquisitor: {
    intent: "inquisitor",
    label: "Engage the real Inquisitor",
    href: platformUrl("/api/inquisitor"),
    path: "/api/inquisitor",
    description:
      "The real Inquisitor dialogue engine on the Platform. The Portal's comparator is a simulated demonstration only.",
  },
};

/** Convenience accessor for a single link-out descriptor by intent. */
export function platformLink(intent: PlatformIntent): PlatformLink {
  return PLATFORM_LINKS[intent];
}
