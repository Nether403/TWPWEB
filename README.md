# The Witness Protocol Portal (`witness-protocol-portal`)

The public **information hub** and main landing experience for the Witness
Protocol. The Portal is **front-of-house**: it tells the mission, routes six
audiences to relevant content, presents the content library and media galleries,
shows funding information, and hosts explicitly-simulated interactive demos.

It replaces the placeholder site previously hosted at TWPF.online.

> Part of the `Witnessprotocolmainproject` workspace. See the umbrella
> [`../README.md`](../README.md) for how the repos connect and
> [`../GATE-PORTAL-BOUNDARY.md`](../GATE-PORTAL-BOUNDARY.md) for the
> Portal ↔ Platform division of labor.

## The boundary (read before adding features)

The Portal owns **no Gate, consent, or auth action**. The **Platform**
(`TWP-platform`, the live control plane) is back-of-house and owns Gate intake,
the reviewer/MHS packet, participation and consent records, authentication, the
audit log, and the real Inquisitor dialogue engine. The only writes the Portal
performs are its own two forms (contact + funder/invoice), persisted to an
insert-only `portal_submissions` table — never the witness/consent/audit tables.

- The Portal **links out** to the Platform for participation/consent via the
  shared link-out layer (`lib/platform-links`). It never collects testimony or
  consent itself.
- The four interactive demos under `app/demos/` (Gate, Inquisitor, Provenance,
  Revocation) are **explicitly-simulated** illustrations, not the real
  instruments. Keep them labelled as simulations.

The new value the Portal adds — content library, media galleries, audience
journeys, funding info, simulated demos — does not exist on the Platform.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, static generation) |
| Runtime | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Content | Markdown via `unified`/`remark`/`rehype` + `gray-matter` front-matter |
| Forms email | Resend |
| Tests | Vitest + Testing Library + `jest-axe` + `fast-check` (property tests) |

Design language is inherited from the project PRD: austere "gravity over
gamification" minimalism — EB Garamond / Cinzel, near-black "basalt" palette,
no accent colors, slow transitions.

## Layout

```text
TWPWEB/
├─ app/
│  ├─ page.tsx            # landing: mission, six audiences, recent library items
│  ├─ audience/[audience] # per-audience journeys + CTAs
│  ├─ library/            # markdown articles/papers/reports + /pdf previews
│  ├─ media/              # infographics, slides, videos galleries
│  ├─ demos/              # gate · inquisitor · provenance · revocation (SIMULATED)
│  ├─ fund/ · participate/ · contact/
│  └─ api/forms/          # contact/intake form handler (Resend)
├─ content/               # content loader + manifest
├─ lib/                   # platform-links (link-out layer) and helpers
├─ components/
└─ .kiro/specs/witness-protocol-portal/   # requirements → design → tasks
```

Source content authored in `Articles and papers/`, `Blog posts/`, `reports/`,
`slides/`, `infographs/`, and `Video/` is surfaced through the content loader;
generated public assets are copied to `public/assets/` at build time (git-ignored).

## Getting started

Prerequisites: Node `>=20`, `pnpm`.

```bash
pnpm install
pnpm dev          # local dev server
pnpm typecheck
pnpm test         # vitest (unit, a11y, property, platform-boundary)
pnpm build
```

Environment: see `.env.example`. All public URLs default to production, so the
build works with no env set. Variables:
- `NEXT_PUBLIC_PLATFORM_BASE_URL` — Platform origin the link-out layer targets
- `NEXT_PUBLIC_SITE_URL` — the Portal's own origin (for the sitemap)
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — server-only, insert-only
  credential for the `portal_submissions` table (the two Portal forms)
- `RESEND_API_KEY`, `PORTAL_NOTIFICATION_EMAIL`, `PORTAL_NOTIFICATION_FROM` —
  best-effort notification email after a successful form persist

## Status

Phase 5 — Alpha. The spec at `.kiro/specs/witness-protocol-portal/`
(requirements → design → tasks) is the authoritative source for scope and
progress.
