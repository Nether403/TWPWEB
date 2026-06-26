"use client";

import { useEffect, useState } from "react";

/**
 * Infographics_Gallery (Req 8.1, 8.2, 8.3).
 *
 * Renders a grid of infographic PNGs — one tile per asset, each `<img>` carrying
 * the alt text derived from its file name (Req 8.1, 8.2). Selecting a tile opens
 * an enlarged lightbox view of that infographic (Req 8.3); the overlay closes on
 * its backdrop, a close control, or Escape.
 *
 * The asset list (title/alt/served path) is built at render time by the server
 * page from `copyAssets()`; this client component only owns the open/close
 * interaction. Styling stays within the basalt/paper tokens — no accent hues, no
 * rounded corners; the global fade token handles the only transition (Req 18).
 */

export interface GalleryInfographic {
  title: string;
  alt: string;
  assetPath: string;
}

export function InfographicsGallery({
  infographics,
}: {
  infographics: readonly GalleryInfographic[];
}) {
  // Index of the infographic shown enlarged, or null when the lightbox is closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Escape closes the lightbox (Req 19.4 keyboard reachability).
  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  if (infographics.length === 0) {
    return (
      <p className="text-base leading-relaxed text-muted">
        No infographics are available yet.
      </p>
    );
  }

  const open = openIndex === null ? null : infographics[openIndex];

  return (
    <>
      {/* Grid of PNGs — one tile per asset, each selectable to enlarge (Req 8.1, 8.3). */}
      <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {infographics.map((infographic, index) => (
          <li key={infographic.assetPath} className="bg-bg">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group flex w-full flex-col gap-3 p-4 text-left hover:bg-border/30"
              aria-label={`Enlarge infographic: ${infographic.title}`}
            >
              {/* ponytail: plain <img> over next/image — these are static, build-copied
                  PNGs served from /public, so the optimizer adds config and a server
                  hop for no real win on a statically rendered gallery. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={infographic.assetPath}
                alt={infographic.alt}
                loading="lazy"
                className="h-auto w-full border border-border bg-bg object-contain"
              />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-fg">
                {infographic.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Enlarged lightbox view of the selected infographic (Req 8.3). */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged infographic: ${open.title}`}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg/95 p-6"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close enlarged view"
            className="self-end font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg border border-border px-3 py-2"
          >
            Close ✕
          </button>
          {/* Stop propagation so clicking the image itself doesn't close the overlay. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={open.assetPath}
            alt={open.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[80vh] max-w-full border border-border bg-bg object-contain"
          />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {open.title}
          </p>
        </div>
      )}
    </>
  );
}
