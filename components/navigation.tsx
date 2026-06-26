import Link from "next/link";
import { ThemeController } from "./theme-controller";
import { MobileMenu } from "./mobile-menu";

/**
 * Navigation_System (Req 2).
 *
 * Persistent global header (wordmark + PRIMARY_NAV) and footer (Foundation
 * identity, project phase status, legal/privacy links) rendered on every page
 * via app/layout.tsx. The header shell is a server component; the responsive
 * collapsible menu at ≤768px is the client `MobileMenu` subcomponent (Req 2.5).
 * Styling uses the basalt/paper theme tokens — no accent hues, no rounded
 * corners — with Cinzel for the wordmark and JetBrains Mono for nav labels.
 */

export interface NavItem {
  label: string;
  href: string;
}

// Primary navigation entries (Req 2.2).
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About / Methodology", href: "/about" },
  { label: "Research & Library", href: "/library" },
  { label: "Participate", href: "/participate" },
  { label: "Fund", href: "/fund" },
  { label: "Contact", href: "/contact" },
] as const;

// Current project phase status shown in the footer (Req 2.4).
const PHASE_STATUS = "Phase 5 — Alpha";

// Secondary ("Explore") footer navigation. PRIMARY_NAV (header) carries the
// top-level IA; the media galleries in particular are otherwise only reachable
// by direct URL, so the footer surfaces every content section — the media
// galleries and the four simulated demonstrations — making all published routes
// reachable from the persistent global navigation (Req 2.3 wiring, 20.1).
const FOOTER_SECTIONS: readonly { heading: string; items: NavItem[] }[] = [
  {
    heading: "Media",
    items: [
      { label: "Infographics", href: "/media/infographics" },
      { label: "Videos", href: "/media/videos" },
      { label: "Slides", href: "/media/slides" },
    ],
  },
  {
    heading: "Demonstrations",
    items: [
      { label: "Inquisitor comparator", href: "/demos/inquisitor" },
      { label: "Provenance explorer", href: "/demos/provenance" },
      { label: "Revocation simulator", href: "/demos/revocation" },
      { label: "Gate self-assessment", href: "/demos/gate" },
    ],
  },
];

export function SiteHeader() {
  return (
    // `relative` anchors the mobile menu panel (which uses `top-full`).
    <header className="relative border-b border-border bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        {/* Wordmark links to Home (Req 2.1). */}
        <Link
          href="/"
          className="font-heading text-base uppercase tracking-[0.25em] text-fg hover:text-muted sm:text-lg"
        >
          The Witness Protocol
        </Link>

        {/* Desktop primary nav: shown from 769px up so it never overlaps the
            ≤768px collapsible menu at the boundary (Req 2.1, 2.2, 2.5). */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 min-[769px]:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme switch lives in the header for a cohesive nav (Req 18.3). */}
          <ThemeController />
          {/* Collapsible menu control at ≤768px (Req 2.5). */}
          <MobileMenu items={PRIMARY_NAV} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    // `mt-auto` pins the footer to the bottom on short pages (body is a column).
    <footer className="mt-auto border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        {/* Secondary nav: surfaces the media galleries and demos so every
            published section is reachable from the global navigation. */}
        <nav
          aria-label="Explore"
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <span className="font-heading text-xs uppercase tracking-[0.2em] text-fg">
                {section.heading}
              </span>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-border pt-8 text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            {/* Foundation identity + phase status (Req 2.4). */}
            <span className="font-heading text-sm uppercase tracking-[0.2em] text-fg">
              Stichting The Witness Protocol Foundation
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              {PHASE_STATUS}
            </span>
          </div>
          {/* Legal / privacy links (Req 2.4). */}
          <nav aria-label="Legal" className="flex gap-6">
            <Link
              href="/legal"
              className="font-mono text-xs uppercase tracking-[0.2em] hover:text-fg"
            >
              Legal
            </Link>
            <Link
              href="/privacy"
              className="font-mono text-xs uppercase tracking-[0.2em] hover:text-fg"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
