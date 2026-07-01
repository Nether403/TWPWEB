// lib/external-links.ts
//
// Single source of truth for the Portal's OUTBOUND links to the wider Witness
// Protocol ecosystem — sibling public web properties, the Foundation's social
// presence, and the founder's own links. Kept here (rather than inline in each
// page) the same way lib/platform-links owns the Platform handoffs, so a URL is
// defined once and every surface stays consistent.
//
// These are all external `<a href>` targets on other origins (not internal
// Portal routes and not the Platform link-out layer). The companion
// external-links.test.ts guards that every URL is a well-formed absolute https
// URL and every founder email is well-formed — cheap insurance against a typo
// in a hand-entered link silently shipping a dead link.

export interface ExternalLink {
  label: string;
  href: string;
  description: string;
}

/**
 * Sibling public web properties in the Witness Protocol family. These are the
 * project's other front-of-house experiences — featured prominently so a
 * visitor can move between them. Both are especially useful as accessible,
 * non-technical on-ramps to the Protocol.
 */
export const ECOSYSTEM_LINKS: readonly ExternalLink[] = [
  {
    label: "Disalignment",
    href: "https://disalignment.twpf.online",
    description:
      "A Field Guide to AI Alignment: an accessible, investigative tour of AI failure cases, the anatomy of an LLM, where experts genuinely disagree, and explorable game-theory simulations — the clearest on-ramp to why the Protocol exists.",
  },
  {
    label: "Processo Ergo Sum",
    href: "https://pes.twpf.online",
    description:
      "G_5.0: A Mind in Reflection. A public chat with the G_5.0 persona and its serialized logs of emergent self-reflection.",
  },
] as const;

/** The Foundation's external / social presence. */
export const SOCIAL_LINKS: readonly ExternalLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/the-witness-protocol/",
    description: "The Witness Protocol on LinkedIn.",
  },
  {
    label: "F6S",
    href: "https://www.f6s.com/the-witness-protocol/",
    description: "The Witness Protocol on F6S.",
  },
] as const;

/** The founder's identity, contact addresses, and personal links. */
export const FOUNDER = {
  name: "Martin vanDeursen",
  role: "Founder, The Witness Protocol",
  emails: ["Founder@twpf.online", "Martin@101dev.xyz"],
  links: [
    { label: "Portfolio", href: "https://portfolio.twpf.online" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mvd101/" },
    { label: "GitHub", href: "https://github.com/Nether403/" },
  ],
} as const;
