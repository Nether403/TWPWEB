"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem } from "./navigation";

/**
 * Collapsible primary-nav menu for viewports ≤ 768px (Req 2.5).
 *
 * The header shell is a server component; only this open/close toggle is
 * client-side. The button exposes `aria-expanded`/`aria-controls`, the panel
 * lists every PRIMARY_NAV entry, and Escape / link-selection close it. Only
 * the toggle + panel render at ≤768px (`max-[768px]`); from 769px up the full
 * desktop nav is shown instead, so the two never overlap at the 768px boundary.
 *
 * Motion is fade-only (global token in globals.css); no transform-based effects.
 */
export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  // Escape closes the menu when open (keyboard operability, Req 2.5 / 19.2).
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="min-[769px]:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="border border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-fg hover:text-muted"
      >
        {open ? "Close" : "Menu"}
      </button>
      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-border bg-bg"
      >
        <nav aria-label="Primary (mobile)">
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href} className="border-t border-border">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 font-mono text-sm uppercase tracking-[0.2em] text-fg hover:text-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
