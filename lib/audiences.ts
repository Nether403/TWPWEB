// lib/audiences.ts
//
// Audience_Router config and tag-based content surfacing (design.md
// "Audience_Router"). The Portal routes each of the six audiences to relevant
// content and calls to action.
//
// This module is the single source of truth for the per-audience journey
// configuration (Req 4.1, 4.2, 4.4–4.7) and the pure `contentForAudience`
// surfacing function (Req 4.3). It is reused by the `/audience/[audience]`
// route (task 7.2) and the Property 9 test (task 7.3).
//
// CTAs that represent REAL actions (participate, request the MHS packet, engage
// the real Inquisitor) are OUTBOUND links to the Platform sourced from the
// shared link-out layer (lib/platform-links) — never Portal-owned forms (Req 1).
// Entry paths filter and surface content but do not gate it: the open `/library`
// index lets any Visitor reach Content_Items for any Audience regardless of the
// entry path selected (Req 4.8).

import { AUDIENCES, type Audience, type ContentItem } from "@/content/loader";
import { platformLink } from "@/lib/platform-links";

// ---------------------------------------------------------------------------
// Tag-based content surfacing (Req 4.3)
// ---------------------------------------------------------------------------

/**
 * Surface the Content_Items relevant to an audience: exactly the items whose
 * `audienceTags` include the given audience (Req 4.3). Pure, never mutates the
 * input. Because every item carries a non-empty tag set (explicit or the
 * loader's default), every audience journey can surface content (Property 9).
 */
export function contentForAudience(
  items: ContentItem[],
  audience: Audience,
): ContentItem[] {
  return items.filter((item) => item.audienceTags.includes(audience));
}

// ---------------------------------------------------------------------------
// Journey configuration types
// ---------------------------------------------------------------------------

/**
 * A call to action. `external: true` marks a real-action handoff that links OUT
 * to the Platform (rendered as an `<a href>`); `external: false` is an internal
 * Portal route (rendered via `next/link`). At least one CTA per audience (Req 4.2).
 */
export interface CTA {
  label: string;
  href: string;
  external: boolean;
  description: string;
}

/** A link to one of the Portal's simulated interactive demonstrations (internal). */
export interface DemoLink {
  label: string;
  href: string;
}

export interface AudienceConfig {
  id: Audience;
  /** Human-readable journey title. */
  title: string;
  /** Short intro copy framing the journey. */
  intro: string;
  /** At least one CTA relevant to the audience (Req 4.2); real actions link out. */
  ctas: CTA[];
  /** Links to relevant simulated demos (e.g. Gate, Inquisitor, Revocation). */
  demoLinks: DemoLink[];
}

/** Human-readable labels for each audience, reused by the route and nav copy. */
export const AUDIENCE_LABELS: Record<Audience, string> = {
  "potential-witness": "Potential Witness",
  "invited-professional": "Invited Professional",
  researcher: "Researcher",
  philosopher: "Philosopher",
  "legal-expert": "Legal Expert",
  investor: "Investor",
};

// Internal demo routes (the Portal's own simulated demonstrations).
const GATE_DEMO: DemoLink = { label: "Gate self-assessment", href: "/demos/gate" };
const INQUISITOR_DEMO: DemoLink = {
  label: "Inquisitor transcript comparator",
  href: "/demos/inquisitor",
};
const REVOCATION_DEMO: DemoLink = {
  label: "Consent revocation simulator",
  href: "/demos/revocation",
};
const PROVENANCE_DEMO: DemoLink = {
  label: "Cryptographic provenance explorer",
  href: "/demos/provenance",
};

/** Build an outbound-Platform CTA from a shared link-out descriptor (Req 1). */
function platformCta(
  intent: Parameters<typeof platformLink>[0],
  label?: string,
): CTA {
  const link = platformLink(intent);
  return {
    label: label ?? link.label,
    href: link.href,
    external: true,
    description: link.description,
  };
}

/** Internal CTA helper for Portal-owned routes (library, fund). */
function internalCta(label: string, href: string, description: string): CTA {
  return { label, href, external: false, description };
}

// ---------------------------------------------------------------------------
// The six audience journeys (Req 4.1, 4.4–4.7)
// ---------------------------------------------------------------------------

export const AUDIENCE_CONFIG: Record<Audience, AudienceConfig> = {
  // Req 4.4 — participation CTA (link out to the Platform) + Gate_Simulator link.
  "potential-witness": {
    id: "potential-witness",
    title: "For Potential Witnesses",
    intro:
      "Your moral struggles — the concrete actions, the paths not taken, the personal stakes — are the high-signal testimony the corpus is built from. Real submission happens on the Platform; here you can read, understand, and self-assess first.",
    ctas: [
      platformCta("consent", "Participate & manage consent"),
      platformCta("gate", "Submit testimony on the Platform"),
    ],
    demoLinks: [GATE_DEMO],
  },

  // Req 4.4 — invited professionals share the participation CTA + Gate link, and
  // are routed to the reviewer / MHS packet on the Platform.
  "invited-professional": {
    id: "invited-professional",
    title: "For Invited Professionals",
    intro:
      "You have been invited to contribute professional testimony or review. The reviewer packet, intake, and consent all live on the Platform. Use the Gate self-assessment to see what accepted testimony looks like before you submit.",
    ctas: [
      platformCta("consent", "Participate & manage consent"),
      platformCta("packet", "Request the reviewer / MHS packet"),
    ],
    demoLinks: [GATE_DEMO],
  },

  // Req 4.5 — links to papers, reports, and the Inquisitor_Comparator.
  researcher: {
    id: "researcher",
    title: "For Researchers & Scholars",
    intro:
      "The Witness Protocol is an evaluation substrate for AI alignment. Study the papers and reports, then see the methodology demonstrated rather than only described in the Inquisitor comparator.",
    ctas: [
      internalCta(
        "Read the papers and reports",
        "/library",
        "The full research library — papers, reports, and articles, filterable by type and audience.",
      ),
      platformCta("inquisitor", "Engage the real Inquisitor"),
    ],
    demoLinks: [INQUISITOR_DEMO],
  },

  // Req 4.5 — philosophers share the researcher journey: papers, reports, Inquisitor.
  philosopher: {
    id: "philosopher",
    title: "For Philosophers",
    intro:
      "The Protocol preserves moral friction rather than smoothing it into consensus. Read the papers and reports on pluralistic alignment, then probe the reasoning in the Inquisitor comparator.",
    ctas: [
      internalCta(
        "Read the papers and reports",
        "/library",
        "The full research library — papers, reports, and articles, filterable by type and audience.",
      ),
      platformCta("inquisitor", "Engage the real Inquisitor"),
    ],
    demoLinks: [INQUISITOR_DEMO],
  },

  // Req 4.6 — privacy architecture content, governance content, Revocation_Simulator.
  "legal-expert": {
    id: "legal-expert",
    title: "For Legal Experts",
    intro:
      "Consent revocation is a system invariant, not only a legal promise. Read the privacy architecture and governance material, then watch the revocation cascade and provenance trace as live demonstrations.",
    ctas: [
      internalCta(
        "Read the privacy & governance content",
        "/library",
        "Privacy architecture, governance, and the rest of the research library, filterable by audience.",
      ),
    ],
    demoLinks: [REVOCATION_DEMO, PROVENANCE_DEMO],
  },

  // Req 4.7 — funding CTA + links to strategic and funding-related content.
  investor: {
    id: "investor",
    title: "For Funders",
    intro:
      "The Foundation is a Dutch non-profit, legally isolated from commercial incentives. Contributions are donations or grants toward an auditable public good — never an investment or a financial return. Review the strategy and the integrity guarantees of the pipeline.",
    ctas: [
      internalCta(
        "Support the Foundation",
        "/fund",
        "Cash and token donation options, with the Foundation's curatorial-neutrality statement.",
      ),
      internalCta(
        "Read the strategic & funding content",
        "/library",
        "Strategic reports and funding-related material from the research library.",
      ),
    ],
    demoLinks: [PROVENANCE_DEMO],
  },
};

/** Type guard: is a string one of the six valid audience ids? */
export function isAudience(value: string): value is Audience {
  return (AUDIENCES as readonly string[]).includes(value);
}
