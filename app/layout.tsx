import type { Metadata } from "next";
import { EB_Garamond, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/components/theme-controller";
import { SiteHeader, SiteFooter } from "@/components/navigation";

// Body typeface (Req 18.1)
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

// Heading typeface (Req 18.1)
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Technical-label typeface (Req 18.1)
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://twpf.online"),
  title: "The Witness Protocol",
  description:
    "A first-party, consented corpus of high-signal human moral-reasoning testimony for AI alignment.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "The Witness Protocol",
    title: "The Witness Protocol",
    description:
      "A first-party, consented corpus of high-signal human moral-reasoning testimony for AI alignment.",
    images: [
      {
        url: "/twp-logo-white.png",
        width: 512,
        height: 512,
        alt: "The Witness Protocol logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "The Witness Protocol",
    description:
      "A first-party, consented corpus of high-signal human moral-reasoning testimony for AI alignment.",
    images: ["/twp-logo-white.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Default theme is set statically so the Portal renders and stays usable
    // even if the client Theme_Controller fails to load (Req 18.6).
    // suppressHydrationWarning: the pre-paint init script below may rewrite
    // data-theme on <html> for a returning Visitor, which is an intentional
    // server/client difference, not a bug.
    <html
      lang="en"
      data-theme="basalt"
      suppressHydrationWarning
      className={`${ebGaramond.variable} ${cinzel.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        {/* Apply the persisted theme before paint to avoid a basalt flash (Req 18.4, 18.6). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Skip-to-content link: first focusable element so keyboard/AT users can
            bypass the persistent header and reach main content (Req 19.2). */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Persistent header + footer on every page (Req 2.1, 2.4); the theme
            switch lives inside the header. {children} renders between them. */}
        <SiteHeader />
        {/* Skip-link target + programmatic focus point. tabIndex={-1} lets focus
            move here on activation. A plain block wrapper (not display:contents)
            is required so the browser can actually move focus to it on fragment
            navigation; each page's <main> carries its own min-h-screen + centering,
            so this neutral wrapper does not alter the layout. */}
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
