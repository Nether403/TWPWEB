// components/curatorial-neutrality-statement.tsx
//
// The Curatorial_Neutrality_Statement (glossary; Req 15.3, 16.6). The
// Foundation's published statement of curatorial independence and funder
// isolation: funding sources confer no influence over the corpus, methodology,
// or governance, and confer no programmatic rights or financial return.
//
// Rendered adjacent to BOTH the cash options (task 11.1) and the token options
// (task 11.2), so it is a shared component. The text is exported so the funding
// compliance guard can scan it as part of the token funding view (Req 16.7).
//
// The body is written as single, clearly-negated sentences so the compliance
// guard reads it as compliant (see lib/funding-compliance.ts).

/** The published statement text, as discrete paragraphs. Exported for the guard. */
export const CURATORIAL_NEUTRALITY_PARAGRAPHS: readonly string[] = [
  "The Witness Protocol Foundation maintains strict curatorial independence. Funding sources are isolated from the work and confer no influence over the corpus, the methodology, or the governance of the project.",
  "A contribution is a donation to a non-commercial research mission. It is not an investment and grants no programmatic rights, no governance rights, no financial return, and no other rights of any kind.",
] as const;

export function CuratorialNeutralityStatement() {
  return (
    <aside
      aria-label="Curatorial Neutrality Statement"
      className="flex flex-col gap-3 border border-border p-5"
    >
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Curatorial Neutrality Statement
      </h3>
      {CURATORIAL_NEUTRALITY_PARAGRAPHS.map((paragraph, i) => (
        <p key={i} className="text-base leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}
    </aside>
  );
}
